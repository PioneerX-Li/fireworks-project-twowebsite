const express = require('express');
const path = require('path');
const fs = require('fs');
const videoProcessor = require('./src/videoProcessor');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件设置
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API端点 - 保存项目
app.post('/api/save-project', (req, res) => {
    const { projectData } = req.body;
    
    // 这里会保存项目数据，实际应用中可能会存储到数据库
    const filename = `project-${Date.now()}.json`;
    
    fs.writeFile(path.join(__dirname, 'projects', filename), JSON.stringify(projectData), (err) => {
        if (err) {
            console.error('保存项目失败:', err);
            return res.status(500).json({ success: false, message: '保存项目失败' });
        }
        
        res.json({ success: true, projectId: filename, message: '项目保存成功' });
    });
});

// API端点 - 导出视频
app.post('/api/render-video', async (req, res) => {
    const { projectData } = req.body;
    
    try {
        console.log('开始处理视频渲染请求...');
        
        // 使用视频处理器处理项目数据
        const videoUrl = await videoProcessor.processProject(projectData);
        
        // 返回视频URL
        res.json({
            success: true,
            videoUrl: videoUrl,
            message: '视频渲染完成'
        });
    } catch (error) {
        console.error('视频渲染失败:', error);
        res.status(500).json({
            success: false,
            message: '视频渲染失败: ' + error.message
        });
    }
});

// 创建必要的目录
const dirs = ['projects', 'output', 'temp'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }
});

// 404处理
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}/`);
}); 