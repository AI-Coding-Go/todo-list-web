#!/bin/bash

# 个人待办清单后端服务启动脚本

echo "=========================================="
echo "个人待办清单后端服务启动脚本"
echo "=========================================="

# 检查Java环境
if ! command -v java &> /dev/null; then
    echo "错误: 未找到Java，请先安装Java 17或更高版本"
    echo "可以通过以下方式安装:"
    echo "  brew install openjdk@17"
    echo "  或者从 https://www.oracle.com/java/technologies/downloads/ 下载安装"
    exit 1
fi

# 检查Maven
if ! command -v mvn &> /dev/null; then
    echo "错误: 未找到Maven，请先安装Maven"
    echo "可以通过以下方式安装:"
    echo "  brew install maven"
    exit 1
fi

# 检查MySQL连接
echo "检查MySQL连接..."
if ! mysql -u root -e "SELECT 1;" &> /dev/null; then
    echo "警告: 无法连接到MySQL，请确保MySQL服务已启动"
    echo "可以通过以下命令启动:"
    echo "  brew services start mysql"
    read -p "是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查Redis连接
echo "检查Redis连接..."
if ! redis-cli ping &> /dev/null; then
    echo "警告: 无法连接到Redis，请确保Redis服务已启动"
    echo "可以通过以下命令启动:"
    echo "  brew services start redis"
    read -p "是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 显示Java和Maven版本
echo ""
echo "Java版本:"
java -version
echo ""
echo "Maven版本:"
mvn -version | head -1
echo ""

# 启动服务
echo "开始启动服务..."
echo "服务将在 http://localhost:8080 启动"
echo "Swagger文档地址: http://localhost:8080/swagger-ui.html"
echo ""
echo "按 Ctrl+C 停止服务"
echo "=========================================="
echo ""

mvn spring-boot:run

