#!/bin/bash
echo "正在启动祝福视频生成器..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未安装Node.js，请先安装Node.js"
    exit 1
fi

# 检查Python
if ! command -v python3 &> /dev/null; then
    echo "错误: 未安装Python 3，请先安装Python 3"
    exit 1
fi

# 安装Node.js依赖
echo "正在安装Node.js依赖..."
npm install

# 检查Python依赖
echo "正在检查Python依赖..."
pip3 install -r requirements.txt

# 启动服务器
echo "启动服务器..."
npm start 