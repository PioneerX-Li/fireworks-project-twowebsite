#!/bin/bash

# 为文件设置仅所有者可读写的权限 (600)
# 为目录设置仅所有者可读写执行的权限 (700)

echo "正在将所有文件和目录设置为仅私人可用..."

# 递归更改文件权限为600（仅所有者可读写）
find . -type f -not -path "*/\.*" -exec chmod 600 {} \;

# 递归更改目录权限为700（仅所有者可读写执行）
find . -type d -not -path "*/\.*" -exec chmod 700 {} \;

# 确保脚本和可执行文件保持可执行权限
chmod +x *.sh
chmod +x start.sh
chmod +x server.js

echo "完成！现在所有文件和目录都设置为仅私人可用。"
echo "文件权限: 仅所有者可读写"
echo "目录权限: 仅所有者可读写执行"