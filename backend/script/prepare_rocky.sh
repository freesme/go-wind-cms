#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

SUDO=${SUDO:-}
if [ "$EUID" -ne 0 ]; then
  SUDO='sudo'
fi

TARGET_USER=${SUDO_USER:-$(whoami)}
TARGET_HOME=$(eval echo "~${TARGET_USER}")
export LC_ALL=C

log() { echo "==> $*"; }
err_trap() { echo "错误：第 $1 行发生错误"; exit 1; }
trap 'err_trap $LINENO' ERR

log "检查并更新系统"
${SUDO} dnf check-update || true
${SUDO} dnf -y upgrade --refresh

log "启用 CRB 仓库"
${SUDO} dnf config-manager --set-enabled crb || true

log "安装基础工具与 EPEL"
# 使用 URL 安装 EPEL（如果需要）
${SUDO} dnf -y install \
  https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm \
  https://dl.fedoraproject.org/pub/epel/epel-next-release-latest-9.noarch.rpm || true

${SUDO} dnf -y install epel-release htop wget unzip git jq curl gnupg2 dnf-plugins-core make gcc

log "安装 Node.js (NodeSource) 并安装 pm2"
# 使用 Node.js 18.x；如需 20.x 可改为 setup_20.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | ${SUDO} bash -
${SUDO} dnf -y install nodejs

# 全局安装 pm2（以 root 安装以保证 system-wide 可用）
${SUDO} npm install -g pm2@latest || true

# 确认版本（非必要）
${SUDO} node -v || true
${SUDO} npm -v || true
${SUDO} pm2 --version || true

# 为目标用户生成 pm2 systemd 单元（保证 PM2_HOME 指向目标用户目录）
log "为用户 ${TARGET_USER} 生成 pm2 systemd 单元并启用"
${SUDO} env HOME="${TARGET_HOME}" USER="${TARGET_USER}" PM2_HOME="${TARGET_HOME}/.pm2" PATH="/usr/bin:${PATH}" pm2 startup systemd -u "${TARGET_USER}" --hp "${TARGET_HOME}" || true
${SUDO} systemctl daemon-reload || true
${SUDO} systemctl enable --now "pm2-${TARGET_USER}.service" || true

# 为目标用户安装 pm2 bash 补全（尝试）
${SUDO} env HOME="${TARGET_HOME}" USER="${TARGET_USER}" PATH="/usr/bin:${PATH}" bash -lc 'pm2 completion install >/dev/null 2>&1 || true'

if command -v docker >/dev/null 2>&1; then
  log "检测到 Docker 已安装，跳过安装步骤"
else
  ${SUDO} dnf -y install dnf-plugins-core
  ${SUDO} dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo || true

  ${SUDO} dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin || true

  log "启用并启动 Docker，添加用户到 docker 组"
  ${SUDO} systemctl enable --now docker || true
  ${SUDO} groupadd -f docker || true
  ${SUDO} usermod -aG docker "${TARGET_USER}" || true
fi

log "运行项目内的 Golang 安装脚本（如果存在且可执行）"
# 获取当前脚本所在目录的绝对路径
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GOLANG_INSTALL_SCRIPT="${SCRIPT_DIR}/install_golang.sh"

if [ -f "${GOLANG_INSTALL_SCRIPT}" ]; then
  log "找到 Golang 安装脚本: ${GOLANG_INSTALL_SCRIPT}"
  if [ -x "${GOLANG_INSTALL_SCRIPT}" ]; then
    log "执行 Golang 安装脚本..."
    "${GOLANG_INSTALL_SCRIPT}"
  else
    log "脚本存在但不可执行，尝试用 bash 执行..."
    bash "${GOLANG_INSTALL_SCRIPT}"
  fi
else
  log "未找到 Golang 安装脚本: ${GOLANG_INSTALL_SCRIPT}，跳过"
fi

log "清理无用包与缓存"
${SUDO} dnf -y autoremove || true
${SUDO} dnf clean all || true

log "完成。注意：如果将用户加入 docker 组，需要重新登录以生效；pm2 的 systemd 单元已尝试为用户 ${TARGET_USER} 启用。"
