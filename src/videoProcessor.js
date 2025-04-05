const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * 视频处理器类
 * 负责调用Python脚本生成各种动画效果并合成最终视频
 */
class VideoProcessor {
    constructor() {
        this.outputDir = path.join(__dirname, '../output');
        this.tempDir = path.join(__dirname, '../temp');
        
        // 确保输出和临时目录存在
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
        
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }
    
    /**
     * 生成烟花动画
     * @param {Object} options - 配置参数
     * @returns {Promise<string>} - 返回生成的视频文件路径
     */
    generateFireworks(options = {}) {
        const defaultOptions = {
            duration: 5,
            fps: 30,
            width: 1280,
            height: 720,
            intensity: 5,
            output: path.join(this.tempDir, `fireworks-${Date.now()}.mp4`)
        };
        
        const settings = { ...defaultOptions, ...options };
        
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python3', [
                path.join(__dirname, 'animations/fireworks.py'),
                '--output', settings.output,
                '--duration', settings.duration.toString(),
                '--fps', settings.fps.toString(),
                '--width', settings.width.toString(),
                '--height', settings.height.toString(),
                '--intensity', settings.intensity.toString()
            ]);
            
            let errorData = '';
            
            pythonProcess.stderr.on('data', (data) => {
                errorData += data.toString();
                console.error(`Python错误: ${data}`);
            });
            
            pythonProcess.stdout.on('data', (data) => {
                console.log(`Python输出: ${data}`);
            });
            
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Python进程退出，代码: ${code}`);
                    reject(new Error(`烟花生成失败: ${errorData}`));
                } else {
                    resolve(settings.output);
                }
            });
        });
    }
    
    /**
     * 处理项目数据并生成最终视频
     * @param {Object} projectData - 项目数据
     * @returns {Promise<string>} - 返回生成的视频URL
     */
    async processProject(projectData) {
        try {
            const videoSegments = [];
            const finalOutputPath = path.join(this.outputDir, `video-${Date.now()}.mp4`);
            
            // 处理每个时间轴元素
            for (const trackItem of projectData.timeline) {
                if (trackItem.type === 'animation') {
                    if (trackItem.id === 'fireworks') {
                        // 生成烟花动画
                        const fireworksPath = await this.generateFireworks({
                            duration: trackItem.duration,
                            intensity: trackItem.intensity || 5
                        });
                        
                        videoSegments.push({
                            path: fireworksPath,
                            startTime: trackItem.position,
                            endTime: trackItem.position + trackItem.duration
                        });
                    }
                    // 其他动画类型在这里处理...
                }
                // 其他轨道类型在这里处理...
            }
            
            // 最终合成所有片段
            // 这里简化处理，实际中会使用ffmpeg等工具合成
            
            return `/output/${path.basename(finalOutputPath)}`;
        } catch (error) {
            console.error('处理视频错误:', error);
            throw error;
        }
    }
}

module.exports = new VideoProcessor(); 