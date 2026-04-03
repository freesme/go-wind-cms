#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR_DEFAULT="$(cd "${SCRIPT_DIR}/../../api" && pwd)"

API_DIR="${API_DIR_DEFAULT}"
OUTPUT_DIR=""
DRY_RUN=0

usage() {
  cat <<'EOF'
Usage:
  bash scripts/proto/export_buf_deps.sh [--api-dir <path>] [--output-dir <path>] [--dry-run]

Description:
  Export Buf remote proto dependencies pinned in api/buf.lock to a local
  directory for IDEs such as GoLand/IntelliJ.

Options:
  --api-dir <path>      Path to the api directory. Default: <repo>/api
  --output-dir <path>   Export directory. Default: <api-dir>/third_party/buf
  --dry-run             Show what would be exported without downloading files
  -h, --help            Show this help message.
EOF
}

log() {
  echo "==> $*"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --api-dir)
      API_DIR="$2"
      shift 2
      ;;
    --output-dir)
      OUTPUT_DIR="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! command -v buf >/dev/null 2>&1; then
  echo "The 'buf' command was not found in PATH. Install it first, then rerun this script." >&2
  exit 1
fi

API_DIR="$(cd "$API_DIR" && pwd)"
BUF_LOCK="${API_DIR}/buf.lock"

if [[ ! -f "$BUF_LOCK" ]]; then
  echo "buf.lock was not found: $BUF_LOCK" >&2
  exit 1
fi

if [[ -z "$OUTPUT_DIR" ]]; then
  OUTPUT_DIR="${API_DIR}/third_party/buf"
fi

OUTPUT_PARENT="$(dirname "$OUTPUT_DIR")"
mkdir -p "$OUTPUT_PARENT"

OUTPUT_DIR="$(cd "$OUTPUT_PARENT" && pwd)/$(basename "$OUTPUT_DIR")"
STAGING_DIR="${OUTPUT_PARENT}/.buf-export-$$"

cleanup() {
  if [[ -d "$STAGING_DIR" ]]; then
    rm -rf "$STAGING_DIR"
  fi
}
trap cleanup EXIT

DEPS=()
while IFS= read -r dep; do
  if [[ -n "$dep" ]]; then
    DEPS+=("$dep")
  fi
done < <(
  awk '
    $1 == "-" && $2 == "name:" {
      name = $3
      gsub(/\047/, "", name)
      next
    }
    $1 == "commit:" && name != "" {
      print name ":" $2
      name = ""
    }
  ' "$BUF_LOCK"
)

if [[ "${#DEPS[@]}" -eq 0 ]]; then
  echo "No Buf dependencies were found in $BUF_LOCK" >&2
  exit 1
fi

log "Using api directory: $API_DIR"
log "Using buf lock: $BUF_LOCK"
log "Target output directory: $OUTPUT_DIR"

if (( DRY_RUN )); then
  log "Dry run mode enabled"
  for dep in "${DEPS[@]}"; do
    echo "  would export $dep"
  done
  exit 0
fi

log "Exporting dependencies to staging directory: $STAGING_DIR"

mkdir -p "$STAGING_DIR"

for dep in "${DEPS[@]}"; do
  log "Exporting $dep"
  buf export "$dep" --output "$STAGING_DIR"
done

if [[ -d "$OUTPUT_DIR" ]]; then
  log "Removing previous export: $OUTPUT_DIR"
  rm -rf "$OUTPUT_DIR"
fi

mv "$STAGING_DIR" "$OUTPUT_DIR"
trap - EXIT

log "Export completed: $OUTPUT_DIR"
echo
echo "GoLand Proto import roots:"
echo "  ${API_DIR}/protos"
echo "  ${OUTPUT_DIR}"
