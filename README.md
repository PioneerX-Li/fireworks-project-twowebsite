# 个性化祝福视频生成器

这是一个网页应用，用户可以通过拖拽编辑方式生成个性化的祝福视频。项目结合了前端界面设计和Python动画生成能力，提供了类似视频编辑软件的用户体验。

## 功能特点

- 直观的拖拽式编辑界面
- 多种动画特效选择（烟花、蛋糕、爱心、彩带等）
- 支持添加个性化文字祝福
- 支持上传照片
- 时间轴编辑，调整元素播放时间和位置
- 属性面板，精细调整动画参数
- 视频导出功能

## 技术栈

- 前端：HTML5, CSS3, JavaScript, Bootstrap 5
- 后端：Node.js, Express
- 视频处理：Python (OpenCV, NumPy)

## 环境要求

- Node.js (v14+)
- Python 3.8+
- 包依赖:
  - Python: `opencv-python`, `numpy`
  - Node.js: 见 `package.json`

## 安装步骤

1. 克隆仓库到本地
   ```
   git clone <仓库URL>
   cd 祝福视频生成器
   ```

2. 安装Node.js依赖
   ```
   npm install
   ```

3. 安装Python依赖
   ```
   pip install opencv-python numpy
   ```

4. 启动服务器
   ```
   npm start
   ```

5. 访问应用
   在浏览器中访问 `http://localhost:3000`

## 使用指南

1. **选择素材**：从左侧素材库拖拽动画元素或上传照片
2. **编辑时间轴**：将元素拖放到适当的轨道上
3. **调整属性**：选中元素后在右侧属性面板调整参数
4. **预览效果**：点击预览区域的播放按钮查看效果
5. **保存项目**：点击顶部"保存项目"按钮保存当前编辑状态
6. **导出视频**：点击"导出视频"按钮生成最终视频

## 文件结构

```
/
├── css/                  # 样式文件
├── js/                   # 前端JavaScript
├── src/                  # 后端源代码
│   ├── animations/       # Python动画脚本
│   └── videoProcessor.js # 视频处理模块
├── projects/             # 保存的项目文件
├── output/               # 输出的视频文件
├── temp/                 # 临时文件
├── index.html            # 主页面
├── server.js             # 服务器入口
└── package.json          # 项目依赖
```

## 扩展动画效果

要添加新的动画效果，按照以下步骤操作：

1. 在 `src/animations/` 目录中创建新的Python脚本
2. 在 `src/videoProcessor.js` 中添加对应的处理方法
3. 在前端界面的素材库中添加新的动画选项

## 许可证

MIT 