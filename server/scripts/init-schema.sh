#!/bin/bash
#
# 脚本说明：初始化 src/main/resources/db/schema.sql 中定义的数据库结构

set -euo pipefail

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMA_FILE="$SCRIPT_DIR/../src/main/resources/db/schema.sql"
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD=""

print_info() {
  printf '[INFO] %s\n' "$1"
}

print_error() {
  printf '[ERROR] %s\n' "$1" >&2
}

usage() {
  cat <<'EOF'
初始化 schema.sql 的脚本

可选参数：
  --host        MySQL 地址，默认 127.0.0.1
  --port        MySQL 端口，默认 3306
  --user        MySQL 用户名，默认 root
  --password    MySQL 密码，默认为空
  --file        schema 文件路径，默认 src/main/resources/db/schema.sql
  --help        显示本帮助
EOF
}

# 解析命令行参数，保证脚本以不可变方式更新配置
parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --host)
        MYSQL_HOST="$2"
        shift 2
        ;;
      --port)
        MYSQL_PORT="$2"
        shift 2
        ;;
      --user)
        MYSQL_USER="$2"
        shift 2
        ;;
      --password)
        MYSQL_PASSWORD="$2"
        shift 2
        ;;
      --file)
        SCHEMA_FILE="$2"
        shift 2
        ;;
      --help)
        usage
        exit 0
        ;;
      *)
        print_error "未知参数：$1"
        usage
        exit 1
        ;;
    esac
  done
}

# 校验 mysql 客户端是否可用
ensure_mysql_cli() {
  if ! command -v mysql >/dev/null 2>&1; then
    print_error "未找到 mysql 命令，请先安装并配置 MySQL 客户端"
    exit 1
  fi
}

# 校验 schema 文件存在
ensure_schema_file() {
  if [[ ! -f "$SCHEMA_FILE" ]]; then
    print_error "schema 文件不存在：$SCHEMA_FILE"
    exit 1
  fi
}

# 执行初始化命令，将 schema 导入 MySQL
run_init() {
  print_info "即将使用 $SCHEMA_FILE 初始化数据库"
  local cmd=(mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" --default-character-set=utf8mb4)

  if [[ -n "$MYSQL_PASSWORD" ]]; then
    MYSQL_PWD="$MYSQL_PASSWORD" "${cmd[@]}" <"$SCHEMA_FILE"
  else
    "${cmd[@]}" <"$SCHEMA_FILE"
  fi

  print_info "数据库初始化完成"
}

main() {
  parse_args "$@"
  ensure_mysql_cli
  ensure_schema_file
  run_init
}

main "$@"


