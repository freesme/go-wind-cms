<#
.SYNOPSIS
Exports Buf remote proto dependencies for local IDE use.

.DESCRIPTION
Reads dependency names and pinned commits from api/buf.lock, exports each
remote module with `buf export`, and writes the merged proto tree to
api/third_party/buf by default.

This is intended for IDEs such as GoLand/IntelliJ that cannot resolve Buf
remote dependencies directly from buf.lock.

.PARAMETER ApiDir
Path to the api directory. Defaults to <repo>/api.

.PARAMETER OutputDir
Path to the export directory. Defaults to <ApiDir>/third_party/buf.

.PARAMETER DryRun
Show what would be exported without downloading anything or modifying files.

.EXAMPLE
.\scripts\proto\export_buf_deps.ps1

.EXAMPLE
.\scripts\proto\export_buf_deps.ps1 -ApiDir .\api -OutputDir .\api\third_party\buf

.EXAMPLE
.\scripts\proto\export_buf_deps.ps1 -DryRun
#>
param(
    [string]$ApiDir = (Join-Path $PSScriptRoot "..\..\api"),
    [string]$OutputDir,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Resolve-NormalizedPath {
    param([Parameter(Mandatory = $true)][string]$Path)

    $resolved = Resolve-Path -LiteralPath $Path
    return [System.IO.Path]::GetFullPath($resolved.Path)
}

function Get-BufDepsFromLock {
    param([Parameter(Mandatory = $true)][string]$LockFile)

    $deps = New-Object System.Collections.Generic.List[object]
    $currentName = $null

    foreach ($line in Get-Content -LiteralPath $LockFile) {
        if ($line -match "^\s*-\s+name:\s+(.+?)\s*$") {
            $currentName = $Matches[1].Trim("'`"")
            continue
        }

        if ($line -match "^\s*commit:\s+([0-9a-f]+)\s*$") {
            if ([string]::IsNullOrWhiteSpace($currentName)) {
                throw "Found a commit entry without a matching dependency name in $LockFile."
            }

            $deps.Add([pscustomobject]@{
                Name   = $currentName
                Commit = $Matches[1]
            })
            $currentName = $null
        }
    }

    if ($deps.Count -eq 0) {
        throw "No Buf dependencies were found in $LockFile."
    }

    return $deps
}

if (-not (Get-Command buf -ErrorAction SilentlyContinue)) {
    throw "The 'buf' command was not found in PATH. Install it first, then rerun this script."
}

$ApiDir = Resolve-NormalizedPath -Path $ApiDir
$BufLock = Join-Path $ApiDir "buf.lock"

if (-not (Test-Path -LiteralPath $BufLock)) {
    throw "buf.lock was not found: $BufLock"
}

if ([string]::IsNullOrWhiteSpace($OutputDir)) {
    $OutputDir = Join-Path $ApiDir "third_party\buf"
}

$OutputParent = Split-Path -Parent $OutputDir
if ([string]::IsNullOrWhiteSpace($OutputParent)) {
    throw "OutputDir must not point to a filesystem root."
}

if (-not (Test-Path -LiteralPath $OutputParent)) {
    New-Item -ItemType Directory -Path $OutputParent -Force | Out-Null
}

$OutputDir = [System.IO.Path]::GetFullPath((Join-Path $OutputParent (Split-Path -Leaf $OutputDir)))
$StagingDir = Join-Path $OutputParent (".buf-export-" + [System.Guid]::NewGuid().ToString("N"))

$deps = Get-BufDepsFromLock -LockFile $BufLock

Write-Step "Using api directory: $ApiDir"
Write-Step "Using buf lock: $BufLock"
Write-Step "Target output directory: $OutputDir"

if ($DryRun) {
    Write-Step "Dry run mode enabled"
    foreach ($dep in $deps) {
        $ref = "$($dep.Name):$($dep.Commit)"
        Write-Host "  would export $ref"
    }
    exit 0
}

Write-Step "Exporting dependencies to staging directory: $StagingDir"
New-Item -ItemType Directory -Path $StagingDir -Force | Out-Null

try {
    foreach ($dep in $deps) {
        $ref = "$($dep.Name):$($dep.Commit)"
        Write-Step "Exporting $ref"
        & buf export $ref --output $StagingDir
        if ($LASTEXITCODE -ne 0) {
            throw "buf export failed for $ref."
        }
    }

    if (Test-Path -LiteralPath $OutputDir) {
        Write-Step "Removing previous export: $OutputDir"
        Remove-Item -LiteralPath $OutputDir -Recurse -Force
    }

    Move-Item -LiteralPath $StagingDir -Destination $OutputDir
    Write-Step "Export completed: $OutputDir"
    Write-Host ""
    Write-Host "GoLand Proto import roots:" -ForegroundColor Green
    Write-Host "  $ApiDir\protos"
    Write-Host "  $OutputDir"
}
finally {
    if (Test-Path -LiteralPath $StagingDir) {
        Remove-Item -LiteralPath $StagingDir -Recurse -Force
    }
}
