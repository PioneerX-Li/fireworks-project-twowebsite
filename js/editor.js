document.addEventListener('DOMContentLoaded', function() {
    initializeMaterialsTabs();
    initializeTimeRuler();
    initializeDragAndDrop();
    initializeTimelineInteraction();
    initializePropertyPanel();
    initializeProjectActions();
    
    // 计算容器尺寸
    updateTimelineContainerDimensions();
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        updateTimelineContainerDimensions();
    });
    
    // 向原来的初始化函数中添加新的事件监听
    initializeMaterialClick();
    
    // 初始化时间轴
    initializeTimeline();
    
    // 设置初始播放头位置
    updatePlayhead(0);
});

// 设置时间轴相关全局变量
const TIMELINE_CONFIG = {
    totalDuration: 180, // 总时长3分钟 = 180秒
    pixelsPerSecond: 10, // 默认每秒10像素
    minPixelsPerSecond: 5, // 最小缩放级别
    maxPixelsPerSecond: 30, // 最大缩放级别
    zoomStep: 1.2, // 缩放步长
    currentZoom: 100, // 当前缩放百分比
    containerWidth: 0, // 容器宽度（将在初始化时设置）
    secondsVisible: 0, // 可见秒数（将在初始化时设置）
    zoomLevel: 1, // 当前缩放级别
    maxZoomLevel: 3, // 最大缩放级别
    minZoomLevel: 0.5, // 最小缩放级别
    majorInterval: 15, // 主标记间隔（秒）
    minorInterval: 5, // 次标记间隔（秒）
    currentTime: 0, // 当前时间位置（秒）
};

// 初始化素材标签页切换
function initializeMaterialsTabs() {
    const tabButtons = document.querySelectorAll('.materials-tabs button');
    const tabContents = document.querySelectorAll('.materials-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有标签的活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 隐藏所有内容面板
            tabContents.forEach(content => content.style.display = 'none');
            
            // 设置当前标签为活动状态
            this.classList.add('active');
            
            // 显示对应的内容面板
            const targetTab = this.getAttribute('data-tab');
            document.getElementById(`${targetTab}-content`).style.display = 'block';
        });
    });
}

// 初始化时间刻度
function initializeTimeRuler() {
    generateFixedTimeMarks(); // 生成固定的时间标记
    
    // 添加缩放控制按钮
    addZoomControls();
}

// 生成固定的时间标记（删除滑动标记）
function generateFixedTimeMarks() {
    const rulerMarks = document.querySelector('.ruler-marks');
    if (!rulerMarks) return;
    
    // 清空现有标记
    rulerMarks.innerHTML = '';
    
    // 生成固定标记 - 每15秒一个标记
    const timeMarks = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
    
    timeMarks.forEach(seconds => {
        const mark = document.createElement('div');
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        mark.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        rulerMarks.appendChild(mark);
    });
}

// 添加缩放控制按钮
function addZoomControls() {
    // 创建缩放控制区域
    const zoomControls = document.createElement('div');
    zoomControls.className = 'timeline-zoom-controls';
    
    // 创建缩小按钮
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.innerHTML = '<i class="fas fa-minus"></i> 缩小';
    zoomOutBtn.addEventListener('click', () => changeTimelineZoom(0.8));
    
    // 创建放大按钮
    const zoomInBtn = document.createElement('button');
    zoomInBtn.innerHTML = '<i class="fas fa-plus"></i> 放大';
    zoomInBtn.addEventListener('click', () => changeTimelineZoom(1.2));
    
    // 添加按钮到控制区
    zoomControls.appendChild(zoomOutBtn);
    zoomControls.appendChild(zoomInBtn);
    
    // 添加控制区到时间轴
    const timelineSection = document.querySelector('.timeline-section');
    if (timelineSection) {
        timelineSection.appendChild(zoomControls);
    }
}

// 改变时间轴缩放级别
function changeTimelineZoom(scale) {
    // 获取所有时间轴元素
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // 为每个元素应用缩放
    timelineItems.forEach(item => {
        // 获取当前宽度并应用缩放
        const currentWidth = parseFloat(item.style.width || '10');
        const newWidth = Math.max(5, currentWidth * scale);
        item.style.width = `${newWidth}%`;
        
        // 如果是放大，还需要调整位置防止重叠
        if (scale > 1) {
            const currentLeft = parseFloat(item.style.left || '0');
            item.style.left = `${currentLeft * scale}%`;
        } else {
            // 缩小时调整位置
            const currentLeft = parseFloat(item.style.left || '0');
            item.style.left = `${currentLeft * scale}%`;
        }
    });
}

// 更新时间轴容器尺寸
function updateTimelineContainerDimensions() {
    const tracksContainer = document.querySelector('.timeline-tracks');
    TIMELINE_CONFIG.containerWidth = tracksContainer.clientWidth;
    
    // 计算在当前容器中可见的秒数
    TIMELINE_CONFIG.secondsVisible = Math.floor(TIMELINE_CONFIG.containerWidth / TIMELINE_CONFIG.pixelsPerSecond);
    
    // 更新时间刻度
    generateFixedTimeMarks();
}

// 素材拖拽功能 - 修改为支持选择空闲轨道
function initializeDragAndDrop() {
    const materialItems = document.querySelectorAll('.material-item');
    const trackContents = document.querySelectorAll('.track-content');
    
    // 设置素材项为可拖拽
    materialItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                id: this.dataset.id,
                type: this.dataset.type
            }));
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // 允许轨道接收拖放
    trackContents.forEach(track => {
        track.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        track.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        track.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const trackId = this.id;
            
            // 检查是否将素材放在正确的轨道上
            if (isValidTrackForType(data.type, trackId)) {
                const timePosition = calculateTimePosition(e.clientX, this);
                addItemToTimeline(data, trackId, timePosition);
            }
        });
    });
}

// 检查素材类型是否匹配轨道
function isValidTrackForType(type, trackId) {
    // 所有animationTrack开头的轨道都可以接收动画类型
    if (type === 'animation' && trackId.startsWith('animationTrack')) return true;
    if (type === 'audio' && trackId === 'audioTrack') return true;
    
    return false;
}

// 添加元素到时间轴
function addItemToTimeline(data, trackId, timePosition) {
    const track = document.getElementById(trackId);
    const timelineItem = document.createElement('div');
    timelineItem.classList.add('timeline-item');
    
    // 设置元素初始属性
    let itemName = '未知元素';
    let duration = 5; // 默认持续5秒
    
    // 根据素材类型设置相应的属性
    switch (data.type) {
        case 'animation':
            if (data.id === 'fireworks') {
                itemName = '烟花';
            } else if (data.id === 'cake') {
                itemName = '蛋糕';
            } else if (data.id === 'heart') {
                itemName = '爱心';
            } else if (data.id === 'confetti') {
                itemName = '彩带';
            } else if (data.id === 'stars') {
                itemName = '星光';
            } else if (data.id === 'snow') {
                itemName = '雪花';
            } else if (data.id === 'balloon') {
                itemName = '气球';
            } else if (data.id === 'flower') {
                itemName = '花朵';
            } else if (data.id === 'fireball') {
                itemName = '火焰';
            } else if (data.id === 'ribbon') {
                itemName = '丝带';
            } else if (data.id === 'bubble') {
                itemName = '气泡';
            } else if (data.id === 'light') {
                itemName = '闪光';
            }
            break;
        case 'audio':
            itemName = '音频';
            break;
    }
    
    // 存储元素数据
    timelineItem.dataset.id = data.id;
    timelineItem.dataset.type = data.type;
    timelineItem.dataset.duration = duration;
    timelineItem.dataset.position = timePosition;
    
    // 计算位置
    const percentage = (timePosition / TIMELINE_CONFIG.totalDuration) * 100;
    const durationPercentage = (duration / TIMELINE_CONFIG.totalDuration) * 100;
    
    // 设置元素样式 - 直接从轨道起始点对齐
    timelineItem.style.width = `${durationPercentage}%`;
    timelineItem.style.left = `${percentage}%`;
    timelineItem.textContent = itemName;
    
    // 添加元素到轨道
    track.appendChild(timelineItem);
    
    // 添加点击事件，选中元素时显示属性面板
    timelineItem.addEventListener('click', function(e) {
        selectTimelineItem(this);
        e.stopPropagation();
    });
    
    // 使新添加的元素可拖动
    makeItemDraggable(timelineItem);
    
    // 自动选中新添加的元素
    selectTimelineItem(timelineItem);
    
    return timelineItem;
}

// 使元素可拖动 - 调整为从轨道起始点计算位置
function makeItemDraggable(item) {
    let isDragging = false;
    let startX, startLeft;
    
    item.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startLeft = parseFloat(item.style.left) || 0;
        
        // 添加拖动时的样式
        item.classList.add('dragging');
        
        document.addEventListener('mousemove', moveItem);
        document.addEventListener('mouseup', stopDraggingItem);
        
        e.preventDefault();
    });
    
    function moveItem(e) {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const track = item.parentElement;
        const trackRect = track.getBoundingClientRect();
        const scale = trackRect.width / 100; // 百分比到像素的转换比例
        
        let newLeft = startLeft + (dx / scale);
        
        // 防止拖出轨道的左边界
        newLeft = Math.max(0, newLeft);
        // 防止拖出轨道的右边界
        const itemWidth = parseFloat(item.style.width) || 5;
        newLeft = Math.min(100 - itemWidth, newLeft);
        
        item.style.left = `${newLeft}%`;
        
        // 更新元素的时间位置
        const percentage = newLeft / 100;
        const newPosition = percentage * TIMELINE_CONFIG.totalDuration;
        
        item.dataset.position = newPosition;
    }
    
    function stopDraggingItem() {
        if (!isDragging) return;
        
        isDragging = false;
        item.classList.remove('dragging');
        
        document.removeEventListener('mousemove', moveItem);
        document.removeEventListener('mouseup', stopDraggingItem);
    }
}

// 计算在时间轴上的位置
function calculateTimePosition(clientX, trackElement) {
    const trackRect = trackElement.getBoundingClientRect();
    const relativeX = clientX - trackRect.left;
    
    // 计算相对位置（百分比）
    const positionPercentage = relativeX / trackRect.width;
    
    // 转换为时间位置
    const timePosition = Math.floor(positionPercentage * TIMELINE_CONFIG.totalDuration);
    
    return Math.max(0, Math.min(timePosition, TIMELINE_CONFIG.totalDuration));
}

// 选中时间轴上的元素
function selectTimelineItem(item) {
    // 移除所有元素的选中状态
    document.querySelectorAll('.timeline-item').forEach(el => {
        el.classList.remove('selected');
    });
    
    // 给当前元素添加选中状态
    item.classList.add('selected');
    
    // 显示属性面板
    const propertiesPanel = document.getElementById('propertiesPanel');
    propertiesPanel.style.display = 'flex';
    
    // 显示对应的属性面板
    showPropertiesForItem(item);
}

// 显示元素的属性面板
function showPropertiesForItem(item) {
    const type = item.dataset.type;
    
    // 隐藏所有属性面板
    document.getElementById('noSelectionProperties').style.display = 'none';
    document.getElementById('animationProperties').style.display = 'none';
    document.getElementById('textProperties').style.display = 'none';
    
    // 显示对应类型的属性面板
    if (type === 'animation') {
        document.getElementById('animationProperties').style.display = 'block';
        
        // 设置滑块初始值
        document.getElementById('animationDuration').value = item.dataset.duration || 5;
        document.getElementById('animationSize').value = item.dataset.size || 50;
        document.getElementById('positionX').value = item.dataset.x || 50;
        document.getElementById('positionY').value = item.dataset.y || 50;
        
        // 更新显示的值
        document.getElementById('durationValue').textContent = (item.dataset.duration || 5) + '秒';
    } else if (type === 'text') {
        document.getElementById('textProperties').style.display = 'block';
        
        // 设置文本属性
        document.getElementById('textContent').value = item.dataset.text || '';
        document.getElementById('textColor').value = item.dataset.color || '#ffffff';
        document.getElementById('fontSize').value = item.dataset.fontSize || '24';
    }
}

// 属性面板交互
function initializePropertyPanel() {
    // 监听动画属性变化
    document.getElementById('animationDuration').addEventListener('input', updateSelectedAnimation);
    document.getElementById('animationSize').addEventListener('input', updateSelectedAnimation);
    document.getElementById('positionX').addEventListener('input', updateSelectedAnimation);
    document.getElementById('positionY').addEventListener('input', updateSelectedAnimation);
    
    // 监听文字属性变化
    document.getElementById('textContent').addEventListener('input', updateSelectedText);
    document.getElementById('textColor').addEventListener('change', updateSelectedText);
    document.getElementById('fontSize').addEventListener('change', updateSelectedText);
    
    // 添加文字到时间轴
    document.getElementById('addTextBtn').addEventListener('click', function() {
        const textContent = document.getElementById('greetingText').value;
        if (textContent.trim() !== '') {
            const textTrack = document.getElementById('textTrack');
            
            // 创建文字元素数据
            const data = {
                id: 'text-' + Date.now(),
                type: 'text'
            };
            
            // 默认添加到时间轴起始位置
            addItemToTimeline(data, 'textTrack', 0);
        }
    });
    
    // 点击空白处关闭属性面板
    document.querySelector('.timeline-tracks').addEventListener('click', function(e) {
        if (e.target.classList.contains('track-content')) {
            // 取消选中所有元素
            document.querySelectorAll('.timeline-item').forEach(el => {
                el.classList.remove('selected');
            });
            
            // 隐藏属性面板
            document.getElementById('propertiesPanel').style.display = 'none';
        }
    });
}

// 更新选中的动画元素属性
function updateSelectedAnimation() {
    const selectedItem = document.querySelector('.timeline-item.selected');
    if (!selectedItem || selectedItem.dataset.type !== 'animation') return;
    
    // 更新数据属性
    const newDuration = document.getElementById('animationDuration').value;
    selectedItem.dataset.duration = newDuration;
    selectedItem.dataset.size = document.getElementById('animationSize').value;
    selectedItem.dataset.x = document.getElementById('positionX').value;
    selectedItem.dataset.y = document.getElementById('positionY').value;
    
    // 更新显示的值
    document.getElementById('durationValue').textContent = newDuration + '秒';
    
    // 更新元素视觉样式 - 使用百分比宽度
    const durationPercentage = (newDuration / TIMELINE_CONFIG.totalDuration) * 100;
    selectedItem.style.width = `${durationPercentage}%`;
}

// 更新选中的文字元素属性
function updateSelectedText() {
    const selectedItem = document.querySelector('.timeline-item.selected');
    if (!selectedItem || selectedItem.dataset.type !== 'text') return;
    
    // 更新数据属性
    const textContent = document.getElementById('textContent').value;
    selectedItem.dataset.text = textContent;
    selectedItem.dataset.color = document.getElementById('textColor').value;
    selectedItem.dataset.fontSize = document.getElementById('fontSize').value;
    
    // 更新显示的文本
    selectedItem.textContent = textContent || '文字';
}

// 时间轴交互功能
function initializeTimelineInteraction() {
    // 预览控制
    const playButton = document.querySelector('.preview-controls button:nth-child(2)');
    playButton.addEventListener('click', togglePlayback);
}

// 切换播放/暂停
function togglePlayback() {
    const button = document.querySelector('.preview-controls button:nth-child(2) i');
    if (button.classList.contains('fa-play')) {
        button.classList.remove('fa-play');
        button.classList.add('fa-pause');
        // 这里添加实际的视频预览逻辑
    } else {
        button.classList.remove('fa-pause');
        button.classList.add('fa-play');
        // 暂停预览
    }
}

// 初始化项目操作 (保存和导出)
function initializeProjectActions() {
    // 保存项目按钮
    const saveButton = document.querySelector('header .btn-outline-light');
    saveButton.addEventListener('click', saveProject);
    
    // 导出视频按钮
    const exportButton = document.querySelector('header .btn-primary');
    exportButton.addEventListener('click', exportVideo);
}

// 收集项目数据
function collectProjectData() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineData = [];
    
    timelineItems.forEach(item => {
        const trackId = item.parentElement.id;
        
        const itemData = {
            id: item.dataset.id,
            type: item.dataset.type,
            duration: parseInt(item.dataset.duration) || 5,
            position: parseInt(item.dataset.position) || 0,
            track: trackId
        };
        
        // 附加特定类型的属性
        if (itemData.type === 'animation') {
            itemData.size = parseInt(item.dataset.size) || 50;
            itemData.x = parseInt(item.dataset.x) || 50;
            itemData.y = parseInt(item.dataset.y) || 50;
        } else if (itemData.type === 'text') {
            itemData.text = item.dataset.text || '';
            itemData.color = item.dataset.color || '#ffffff';
            itemData.fontSize = item.dataset.fontSize || '24';
        }
        
        timelineData.push(itemData);
    });
    
    return {
        name: "祝福视频项目",
        createdAt: new Date().toISOString(),
        timeline: timelineData
    };
}

// 保存项目
async function saveProject() {
    try {
        const projectData = collectProjectData();
        
        // 显示保存中状态
        const saveButton = document.querySelector('header .btn-outline-light');
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
        saveButton.disabled = true;
        
        // 模拟API请求
        setTimeout(() => {
            saveButton.innerHTML = '<i class="fas fa-check"></i> 已保存';
            setTimeout(() => {
                saveButton.innerHTML = originalText;
                saveButton.disabled = false;
            }, 2000);
        }, 1000);
    } catch (error) {
        console.error('保存项目错误:', error);
        
        // 恢复按钮状态并显示错误
        const saveButton = document.querySelector('header .btn-outline-light');
        saveButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 保存失败';
        saveButton.disabled = false;
        
        // 显示错误提示
        alert('保存项目失败: ' + error.message);
        
        setTimeout(() => {
            saveButton.innerHTML = '<i class="fas fa-save"></i> 保存';
        }, 3000);
    }
}

// 导出视频
async function exportVideo() {
    try {
        const projectData = collectProjectData();
        
        if (projectData.timeline.length === 0) {
            alert('请先添加内容到时间轴再导出视频');
            return;
        }
        
        // 显示导出中状态
        const exportButton = document.querySelector('header .btn-primary');
        const originalText = exportButton.innerHTML;
        exportButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
        exportButton.disabled = true;
        
        // 创建模态框显示进度
        showProcessingModal('视频正在生成中，请稍候...');
        
        // 模拟API请求
        setTimeout(() => {
            // 关闭进度模态框
            closeProcessingModal();
            
            // 显示成功模态框并提供下载链接
            showSuccessModal('视频生成成功!', '#');
            
            // 恢复按钮状态
            exportButton.innerHTML = originalText;
            exportButton.disabled = false;
        }, 3000);
    } catch (error) {
        console.error('导出视频错误:', error);
        
        // 关闭进度模态框
        closeProcessingModal();
        
        // 恢复按钮状态并显示错误
        const exportButton = document.querySelector('header .btn-primary');
        exportButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 导出失败';
        exportButton.disabled = false;
        
        // 显示错误提示
        alert('导出视频失败: ' + error.message);
        
        setTimeout(() => {
            exportButton.innerHTML = '<i class="fas fa-download"></i> 导出';
        }, 3000);
    }
}

// 显示处理中模态框
function showProcessingModal(message) {
    const modal = document.createElement('div');
    modal.id = 'processingModal';
    modal.className = 'modal-backdrop';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 10, 27, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1050;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content p-4 rounded';
    modalContent.style.cssText = `
        max-width: 500px;
        text-align: center;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        color: #F8FAFC;
    `;
    
    modalContent.innerHTML = `
        <div class="my-4">
            <i class="fas fa-cog fa-spin fa-3x mb-4" style="color: #2D7FF9;"></i>
            <p class="mb-0" style="font-size: 16px; font-weight: 500;">${message}</p>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// 关闭处理中模态框
function closeProcessingModal() {
    const modal = document.getElementById('processingModal');
    if (modal) {
        modal.remove();
    }
}

// 显示成功模态框
function showSuccessModal(message, videoUrl) {
    const modal = document.createElement('div');
    modal.id = 'successModal';
    modal.className = 'modal-backdrop';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 10, 27, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1050;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content p-4 rounded';
    modalContent.style.cssText = `
        max-width: 500px;
        text-align: center;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        color: #F8FAFC;
    `;
    
    modalContent.innerHTML = `
        <div class="my-4">
            <i class="fas fa-check-circle fa-3x mb-4" style="color: #10B981;"></i>
            <p style="font-size: 16px; font-weight: 500;">${message}</p>
            <div class="mt-4">
                <a href="${videoUrl}" class="btn btn-primary px-4 py-2 me-2" style="
                    background: linear-gradient(135deg, #2D7FF9, #8B5CF6);
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(45, 127, 249, 0.25);
                    transition: all 0.3s ease;
                " download>
                    <i class="fas fa-download me-2"></i>下载视频
                </a>
                <button class="btn px-4 py-2" id="closeSuccessModal" style="
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    color: #F8FAFC;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">
                    关闭
                </button>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // 添加关闭按钮事件
    document.getElementById('closeSuccessModal').addEventListener('click', function() {
        modal.remove();
    });
}

// 初始化素材点击事件
function initializeMaterialClick() {
    const materialItems = document.querySelectorAll('.material-item');
    
    materialItems.forEach(item => {
        item.addEventListener('click', function() {
            const data = {
                id: this.dataset.id,
                type: this.dataset.type
            };
            
            // 如果是动画类型，寻找一个空闲的轨道
            if (data.type === 'animation') {
                const trackId = findEmptyAnimationTrack();
                if (trackId) {
                    // 添加到轨道的开始位置
                    addItemToTimeline(data, trackId, 0);
                }
            } else if (data.type === 'audio') {
                // 音频直接添加到音频轨道
                addItemToTimeline(data, 'audioTrack', 0);
            }
        });
    });
}

// 查找一个空闲的动画轨道
function findEmptyAnimationTrack() {
    for (let i = 1; i <= 15; i++) {
        const trackId = `animationTrack${i}`;
        const track = document.getElementById(trackId);
        if (track && track.childNodes.length === 0) {
            return trackId;
        }
    }
    
    // 如果所有轨道都有内容，使用动画轨道1
    return 'animationTrack1';
}

// 初始化时间轴
function initializeTimeline() {
    // 生成时间标记
    generateTimeMarks();
    
    // 设置缩放控制
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            if (TIMELINE_CONFIG.zoomLevel < TIMELINE_CONFIG.maxZoomLevel) {
                TIMELINE_CONFIG.zoomLevel += 0.25;
                updateTimelineZoom();
            }
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            if (TIMELINE_CONFIG.zoomLevel > TIMELINE_CONFIG.minZoomLevel) {
                TIMELINE_CONFIG.zoomLevel -= 0.25;
                updateTimelineZoom();
            }
        });
    }
    
    // 初始化播放头拖动
    initializePlayhead();
    
    // 初始化底部控制栏
    initializeTransportControls();
}

// 生成时间标记 - 修改为对齐轨道起始点
function generateTimeMarks() {
    const rulerMarks = document.querySelector('.ruler-marks');
    if (!rulerMarks) return;
    
    rulerMarks.innerHTML = '';
    
    const totalSeconds = TIMELINE_CONFIG.totalDuration;
    const majorInterval = TIMELINE_CONFIG.majorInterval; // 主要时间标记间隔（秒）
    const minorInterval = TIMELINE_CONFIG.minorInterval; // 次要时间标记间隔（秒）
    
    // 创建0秒标记
    const zeroMark = document.createElement('div');
    zeroMark.textContent = formatTime(0);
    zeroMark.style.position = 'absolute';
    zeroMark.style.left = '0';
    rulerMarks.appendChild(zeroMark);
    
    // 创建主要时间标记
    for (let i = majorInterval; i <= totalSeconds; i += majorInterval) {
        const markElement = document.createElement('div');
        markElement.textContent = formatTime(i);
        markElement.style.position = 'absolute';
        markElement.style.left = `${(i / totalSeconds) * 100}%`;
        rulerMarks.appendChild(markElement);
        
        // 如果需要，可以添加次要标记
        if (minorInterval > 0 && i + minorInterval < totalSeconds) {
            for (let j = i + minorInterval; j < i + majorInterval && j <= totalSeconds; j += minorInterval) {
                const minorMark = document.createElement('div');
                minorMark.classList.add('minor-mark');
                minorMark.style.position = 'absolute';
                minorMark.style.left = `${(j / totalSeconds) * 100}%`;
                minorMark.style.fontSize = '8px';
                minorMark.style.color = '#5a6679';
                rulerMarks.appendChild(minorMark);
            }
        }
    }
    
    // 为时间标尺添加点击事件来移动播放头
    rulerMarks.addEventListener('click', function(e) {
        const rect = rulerMarks.getBoundingClientRect();
        const clickPos = e.clientX - rect.left;
        const percentage = clickPos / rect.width;
        const newTime = percentage * TIMELINE_CONFIG.totalDuration;
        updatePlayhead(newTime);
    });
}

// 初始化播放头拖动
function initializePlayhead() {
    const playhead = document.querySelector('.timeline-playhead');
    if (!playhead) return;
    
    // 设置初始位置
    updatePlayhead(0);
    
    // 添加拖动功能
    let isDragging = false;
    
    playhead.addEventListener('mousedown', function(e) {
        isDragging = true;
        document.addEventListener('mousemove', movePlayhead);
        document.addEventListener('mouseup', stopDraggingPlayhead);
        e.preventDefault();
    });
    
    function movePlayhead(e) {
        if (!isDragging) return;
        
        const tracksContainer = document.querySelector('.timeline-tracks');
        const rect = tracksContainer.getBoundingClientRect();
        const trackLabelWidth = 100; // 轨道标签宽度
        
        // 计算相对于轨道内容区的位置
        let relativeX = e.clientX - rect.left - trackLabelWidth;
        
        // 限制范围
        relativeX = Math.max(0, relativeX);
        relativeX = Math.min(rect.width - trackLabelWidth, relativeX);
        
        // 计算时间位置
        const percentage = relativeX / (rect.width - trackLabelWidth);
        const newTime = percentage * TIMELINE_CONFIG.totalDuration;
        
        updatePlayhead(newTime);
    }
    
    function stopDraggingPlayhead() {
        isDragging = false;
        document.removeEventListener('mousemove', movePlayhead);
        document.removeEventListener('mouseup', stopDraggingPlayhead);
    }
}

// 更新播放头位置 - 确保对齐轨道起始点
function updatePlayhead(timeInSeconds) {
    const playhead = document.querySelector('.timeline-playhead');
    const timePositionDisplay = document.querySelector('.timeline-position');
    if (!playhead || !timePositionDisplay) return;
    
    TIMELINE_CONFIG.currentTime = timeInSeconds;
    
    // 计算播放头位置 - 直接从轨道标签宽度处开始
    const percentage = timeInSeconds / TIMELINE_CONFIG.totalDuration;
    const tracksContainer = document.querySelector('.timeline-tracks');
    const trackWidth = tracksContainer ? tracksContainer.getBoundingClientRect().width - 100 : 0;
    
    // 设置播放头位置 - 固定100px为起始点，然后按百分比计算
    playhead.style.left = `${100 + percentage * trackWidth}px`;
    
    // 更新时间显示
    timePositionDisplay.textContent = formatTime(timeInSeconds, true);
}

// 初始化底部控制栏
function initializeTransportControls() {
    const transportBtns = document.querySelectorAll('.transport-btn');
    if (transportBtns.length === 0) return;
    
    // 播放/暂停按钮
    const playPauseBtn = transportBtns[1];
    let isPlaying = false;
    let playbackInterval;
    
    playPauseBtn.addEventListener('click', function() {
        if (isPlaying) {
            // 暂停
            clearInterval(playbackInterval);
            this.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        } else {
            // 播放
            playbackInterval = setInterval(function() {
                let newTime = TIMELINE_CONFIG.currentTime + 0.1;
                if (newTime >= TIMELINE_CONFIG.totalDuration) {
                    newTime = 0;
                    clearInterval(playbackInterval);
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    isPlaying = false;
                }
                updatePlayhead(newTime);
            }, 100);
            
            this.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }
    });
    
    // 跳到开头按钮
    const jumpToStartBtn = transportBtns[0];
    jumpToStartBtn.addEventListener('click', function() {
        updatePlayhead(0);
    });
    
    // 跳到结尾按钮
    const jumpToEndBtn = transportBtns[2];
    jumpToEndBtn.addEventListener('click', function() {
        updatePlayhead(TIMELINE_CONFIG.totalDuration);
    });
}

// 更新时间轴缩放
function updateTimelineZoom() {
    const tracksContainer = document.querySelector('.timeline-tracks-inner');
    if (!tracksContainer) return;
    
    // 设置缩放级别
    const zoomPercentage = TIMELINE_CONFIG.zoomLevel * 100;
    tracksContainer.style.width = `${zoomPercentage}%`;
    
    // 重新生成时间标记
    generateTimeMarks();
    
    // 更新播放头位置
    updatePlayhead(TIMELINE_CONFIG.currentTime);
}

// 格式化时间显示
function formatTime(seconds, includeMillis = false) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    if (includeMillis) {
        const millis = Math.floor((seconds % 1) * 100);
        return `${padZero(mins)}:${padZero(secs)}:${padZero(millis)}`;
    }
    
    return `${padZero(mins)}:${padZero(secs)}`;
}

// 数字补零
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// 使元素可调整大小
function makeItemResizable(item, handle) {
    let isResizing = false;
    let startX, startWidth;
    
    handle.addEventListener('mousedown', function(e) {
        isResizing = true;
        startX = e.clientX;
        startWidth = parseInt(item.style.width) || 5;
        
        document.addEventListener('mousemove', resizeItem);
        document.addEventListener('mouseup', stopResizingItem);
        
        e.preventDefault();
        e.stopPropagation();
    });
    
    function resizeItem(e) {
        if (!isResizing) return;
        
        const dx = e.clientX - startX;
        let newWidth = startWidth + dx;
        
        // 防止宽度太小
        newWidth = Math.max(1, newWidth);
        
        item.style.width = `${newWidth}%`;
        
        // 更新元素的持续时间
        const track = item.parentElement;
        const rect = track.getBoundingClientRect();
        const percentage = newWidth / 100;
        const newDuration = percentage * TIMELINE_CONFIG.totalDuration;
        
        item.dataset.duration = newDuration;
    }
    
    function stopResizingItem() {
        if (!isResizing) return;
        
        isResizing = false;
        
        document.removeEventListener('mousemove', resizeItem);
        document.removeEventListener('mouseup', stopResizingItem);
    }
} 