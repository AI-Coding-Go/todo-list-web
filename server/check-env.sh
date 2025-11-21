#!/bin/bash
echo "=== 环境检查 ==="
echo ""
echo "1. Java环境:"
if command -v java &> /dev/null; then
    java -version 2>&1 | head -1
else
    echo "   ❌ 未安装Java，请安装Java 17+"
    echo "   安装命令: brew install openjdk@17"
fi
echo ""
echo "2. Maven环境:"
if command -v mvn &> /dev/null; then
    mvn -version | head -1
else
    echo "   ❌ 未安装Maven，请安装Maven"
    echo "   安装命令: brew install maven"
fi
echo ""
echo "3. MySQL服务:"
if mysql -u root -e "SELECT 1;" &> /dev/null; then
    echo "   ✅ MySQL运行正常"
    mysql -u root -e "SHOW DATABASES LIKE 'todo_db';" &> /dev/null && echo "   ✅ 数据库todo_db已创建"
else
    echo "   ❌ MySQL未运行，请启动: brew services start mysql"
fi
echo ""
echo "4. Redis服务:"
if redis-cli ping &> /dev/null; then
    echo "   ✅ Redis运行正常"
else
    echo "   ❌ Redis未运行，请启动: brew services start redis"
fi
echo ""
echo "=== 检查完成 ==="
