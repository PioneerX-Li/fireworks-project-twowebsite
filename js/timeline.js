// 时间轴控制器类
class TimelineController {
    constructor() {
        this.tracks = [];
        this.currentTime = 0;
        this.initialDuration = 45; // 初始显示45秒
        this.duration = this.initialDuration; 
        this.maxDuration = 300; // 最大显示5分钟（300秒）
        this.pixelsPerSecond = 50; // 每秒对应的像素数，减少为50像素/秒
        this.isPlaying = false;
        this.selectedItem = null;
        this.dragItem = null;
        this.dragStartX = 0;
        this.dragStartTime = 0;
        this.isSnapping = true; // 启用吸附功能
        this.snapThreshold = 0.1; // 吸附阈值 (秒)
        this.isDraggingPlayhead = false; // 是否正在拖拽播放头
        this.scrollPosition = 0; // 滚动位置（秒）
        this.isScrolling = false; // 是否正在滚动时间轴
        this.scrollStartX = 0; // 滚动开始时的X坐标
        
        // 初始化DOM引用
        this.timelineContainer = document.querySelector('.timeline-container');
        this.tracksContainer = document.querySelector('.tracks-container');
        this.timelineRuler = document.querySelector('.timeline-ruler');
        this.playhead = document.querySelector('.timeline-playhead');
        this.timelinePosition = document.querySelector('.timeline-position');
        
        // 初始化控制器
        this.initTracks();
        this.initUI();
        this.initEvents();
        this.renderRuler();
        this.updatePlayhead();
    }
    
    // 初始化轨道
    initTracks() {
        // 创建3个默认轨道
        this.addTrack('特效 1');
        this.addTrack('特效 2');
        this.addTrack('音乐');
        
        // 添加几个示例元素
        this.addItem(0, 0.5, 2.0, '烟花爆炸');
        this.addItem(0, 3.0, 1.5, '流星');
        this.addItem(1, 1.0, 2.5, '光环');
        this.addItem(2, 0.2, 5.0, '背景音乐');
        
        // 更新时间轴显示范围
        this.updateTimelineRange();
    }
    
    // 更新时间轴显示范围
    updateTimelineRange() {
        // 找到最远的项目结束时间
        let maxEndTime = 0;
        
        for (const track of this.tracks) {
            for (const item of track.items) {
                const endTime = item.startTime + item.duration;
                if (endTime > maxEndTime) {
                    maxEndTime = endTime;
                }
            }
        }
        
        // 设置时间轴显示范围
        // 当前项目最远时间 + 30秒缓冲，但不超过最大限制
        const newDuration = Math.min(Math.max(maxEndTime + 30, this.initialDuration), this.maxDuration);
        
        // 只有在需要延长时才更新
        if (newDuration > this.duration) {
            this.duration = newDuration;
            this.renderRuler();
        }
    }
    
    // 初始化UI
    initUI() {
        // 更新标尺
        this.renderRuler();
        
        // 渲染所有轨道和项目
        this.renderTracks();
        
        // 初始化播放头
        this.createPlayhead();
    }
    
    // 创建播放头
    createPlayhead() {
        // 如果已存在播放头，先清空内容
        if (this.playhead) {
            // 如果播放头在DOM中但不是由代码创建的，需要先移除
            if (!this.playhead.querySelector('.playhead-triangle')) {
                this.playhead.innerHTML = '';
                
                // 创建播放头指示器，模仿图片中的样式
                const indicator = document.createElement('div');
                indicator.className = 'playhead-indicator';
                this.playhead.appendChild(indicator);
                
                // 添加播放头拖拽功能
                this.playhead.addEventListener('mousedown', this.handlePlayheadMouseDown.bind(this));
            }
        } else {
            // 创建新的播放头
            this.playhead = document.createElement('div');
            this.playhead.className = 'timeline-playhead';
            
            // 创建播放头指示器，模仿图片中的样式
            const indicator = document.createElement('div');
            indicator.className = 'playhead-indicator';
            this.playhead.appendChild(indicator);
            
            // 添加到DOM
            document.querySelector('.timeline-view').appendChild(this.playhead);
            
            // 添加播放头拖拽功能
            this.playhead.addEventListener('mousedown', this.handlePlayheadMouseDown.bind(this));
        }
    }
    
    // 初始化事件监听
    initEvents() {
        // 监听拖拽事件
        this.tracksContainer.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // 点击时间线定位播放头
        this.timelineRuler.addEventListener('click', this.handleRulerClick.bind(this));
        
        // 添加水平滑动事件
        this.timelineContainer.addEventListener('wheel', this.handleTimelineWheel.bind(this));
        
        // 轨道添加按钮点击事件
        const addTrackBtn = document.getElementById('add-track');
        if (addTrackBtn) {
            addTrackBtn.addEventListener('click', this.handleAddTrackClick.bind(this));
        }
        
        // 键盘快捷键
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // 吸附切换
        const snapToggle = document.getElementById('snap-toggle');
        if (snapToggle) {
            snapToggle.addEventListener('change', (e) => {
                this.isSnapping = e.target.checked;
            });
        }
    }
    
    // 新增: 处理时间轴滚轮滑动
    handleTimelineWheel(e) {
        // 阻止默认的垂直滚动
        e.preventDefault();
        
        // 检测是否按住Shift键(一些浏览器会将shift+滚轮识别为水平滚动)
        const isHorizontalScroll = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY);
        
        // 确定滚动方向和距离
        let delta = isHorizontalScroll ? e.deltaX : e.deltaY;
        
        // 计算新的滚动位置(向右滑动是负值，向左滑动是正值)
        // 按照惯例，将delta反向处理，使向右滑动时间轴向前移动
        const scrollAmount = delta * 0.05; // 调整滑动速度
        let newScrollPosition = this.scrollPosition + scrollAmount;
        
        // 限制滚动范围(不能小于0，不能大于duration - 可见部分)
        const rulerWidth = this.timelineRuler.clientWidth;
        const visibleTime = rulerWidth / this.pixelsPerSecond;
        
        newScrollPosition = Math.max(0, Math.min(this.duration - visibleTime, newScrollPosition));
        
        // 更新滚动位置
        if (newScrollPosition !== this.scrollPosition) {
            this.scrollPosition = newScrollPosition;
            this.renderRuler();
            this.updatePlayhead();
        }
    }
    
    // 处理鼠标按下事件
    handleMouseDown(e) {
        // 仅处理时间线项目的点击
        if (!e.target.classList.contains('timeline-item')) return;
        
        const itemId = e.target.dataset.itemId;
        const item = this.findItemById(itemId);
        
        if (!item) return;
        
        // 设置为选中项
        this.selectItem(item);
        
        // 准备拖拽
        this.dragItem = item;
        this.dragStartX = e.clientX;
        this.dragStartTime = item.startTime;
        
        e.preventDefault();
    }
    
    // 处理播放头鼠标按下事件
    handlePlayheadMouseDown(e) {
        this.isDraggingPlayhead = true;
        this.dragStartX = e.clientX;
        this.dragStartTime = this.currentTime;
        
        // 添加拖拽样式
        this.playhead.classList.add('dragging');
        e.preventDefault();
        e.stopPropagation();
    }
    
    // 处理鼠标移动事件
    handleMouseMove(e) {
        // 处理播放头拖拽
        if (this.isDraggingPlayhead) {
            const deltaX = e.clientX - this.dragStartX;
            const deltaTime = deltaX / this.pixelsPerSecond;
            let newTime = this.dragStartTime + deltaTime;
            
            // 限制范围
            newTime = Math.max(0, Math.min(this.duration, newTime));
            
            this.currentTime = newTime;
            
            // 如果拖动到视图边缘，自动滚动时间轴
            const rulerWidth = this.timelineRuler.clientWidth;
            const visibleEndTime = this.scrollPosition + (rulerWidth / this.pixelsPerSecond);
            
            if (newTime < this.scrollPosition + 5) {
                // 向左滚动
                this.scrollPosition = Math.max(0, newTime - 5);
                this.renderRuler();
            } else if (newTime > visibleEndTime - 5) {
                // 向右滚动
                this.scrollPosition = Math.min(this.duration - (rulerWidth / this.pixelsPerSecond), newTime - (rulerWidth / this.pixelsPerSecond) + 5);
                this.renderRuler();
            }
            
            this.updatePlayhead();
            e.preventDefault();
            return;
        }
        
        // 处理时间线项目拖拽
        if (!this.dragItem) return;
        
        // 计算拖拽距离与时间差
        const deltaX = e.clientX - this.dragStartX;
        let deltaTime = deltaX / this.pixelsPerSecond;
        
        // 新的开始时间
        let newStartTime = this.dragStartTime + deltaTime;
        
        // 如果启用吸附，检查是否需要吸附到其他项目
        if (this.isSnapping) {
            newStartTime = this.findSnapPosition(newStartTime, this.dragItem);
        }
        
        // 防止超出时间线边界
        newStartTime = Math.max(0, newStartTime);
        
        // 更新项目时间
        this.dragItem.startTime = newStartTime;
        
        // 重新渲染项目
        this.renderItem(this.dragItem);
        
        // 更新属性面板
        this.updatePropertiesPanel();
        
        // 检查是否需要延长时间轴
        const endTime = newStartTime + this.dragItem.duration;
        if (endTime > this.duration - 30) {
            this.updateTimelineRange();
        }
        
        e.preventDefault();
    }
    
    // 处理鼠标松开事件
    handleMouseUp(e) {
        // 结束播放头拖拽
        if (this.isDraggingPlayhead) {
            this.isDraggingPlayhead = false;
            this.playhead.classList.remove('dragging');
            e.preventDefault();
            return;
        }
        
        // 结束时间线项目拖拽
        if (this.dragItem) {
            this.dragItem = null;
            e.preventDefault();
        }
    }
    
    // 处理标尺点击事件
    handleRulerClick(e) {
        // 如果正在滚动，不处理点击
        if (this.isScrolling) return;
        
        const rulerRect = this.timelineRuler.getBoundingClientRect();
        const clickX = e.clientX - rulerRect.left;
        const clickTime = (clickX / this.pixelsPerSecond) + this.scrollPosition;
        
        this.currentTime = Math.max(0, Math.min(this.duration, clickTime));
        this.updatePlayhead();
    }
    
    // 处理键盘快捷键
    handleKeyDown(e) {
        // 如果没有选中项目，则不处理
        if (!this.selectedItem) return;
        
        switch (e.key) {
            case 'Delete':
                // 删除选中项目
                this.deleteItem(this.selectedItem);
                break;
                
            case 'ArrowLeft':
                // 左移选中项目
                this.selectedItem.startTime = Math.max(0, this.selectedItem.startTime - 0.1);
                this.renderItem(this.selectedItem);
                this.updatePropertiesPanel();
                break;
                
            case 'ArrowRight':
                // 右移选中项目
                this.selectedItem.startTime += 0.1;
                this.renderItem(this.selectedItem);
                this.updatePropertiesPanel();
                break;
        }
    }
    
    // 选中项目
    selectItem(item) {
        // 移除之前选中项的选中状态
        if (this.selectedItem) {
            const prevEl = document.getElementById(this.selectedItem.id);
            if (prevEl) prevEl.classList.remove('selected');
        }
        
        // 设置新的选中项
        this.selectedItem = item;
        
        // 给新选中项添加选中样式
        const el = document.getElementById(item.id);
        if (el) el.classList.add('selected');
        
        // 更新属性面板
        this.updatePropertiesPanel();
    }
    
    // 更新属性面板
    updatePropertiesPanel() {
        const nameInput = document.getElementById('item-name');
        const startInput = document.getElementById('item-start');
        const durationInput = document.getElementById('item-duration');
        const typeSelect = document.getElementById('item-type');
        
        if (!this.selectedItem) {
            // 没有选中项，清空属性面板
            if (nameInput) nameInput.value = '';
            if (startInput) startInput.value = '';
            if (durationInput) durationInput.value = '';
            if (typeSelect) typeSelect.value = 'firework';
            return;
        }
        
        // 更新属性面板值
        if (nameInput) nameInput.value = this.selectedItem.name;
        if (startInput) startInput.value = this.selectedItem.startTime.toFixed(1);
        if (durationInput) durationInput.value = this.selectedItem.duration.toFixed(1);
        
        // 根据项目名称推断类型
        let type = 'firework';
        if (this.selectedItem.name.includes('流星')) type = 'meteor';
        else if (this.selectedItem.name.includes('光环')) type = 'spiral';
        else if (this.selectedItem.name.includes('喷泉')) type = 'fountain';
        else if (this.selectedItem.name.includes('闪光')) type = 'sparkle';
        
        if (typeSelect) typeSelect.value = type;
    }
    
    // 删除项目
    deleteItem(item) {
        const track = this.tracks[item.trackId];
        if (!track) return;
        
        // 从数组中移除
        const index = track.items.findIndex(i => i.id === item.id);
        if (index !== -1) {
            track.items.splice(index, 1);
        }
        
        // 从DOM中移除
        const el = document.getElementById(item.id);
        if (el) el.remove();
        
        // 如果是当前选中项，取消选中
        if (this.selectedItem && this.selectedItem.id === item.id) {
            this.selectedItem = null;
            this.updatePropertiesPanel();
        }
    }
    
    // 查找项目
    findItemById(id) {
        for (const track of this.tracks) {
            const item = track.items.find(item => item.id === id);
            if (item) return item;
        }
        return null;
    }
    
    // 查找吸附位置
    findSnapPosition(time, currentItem) {
        // 定义吸附点
        const snapPoints = [];
        
        // 添加0作为吸附点
        snapPoints.push(0);
        
        // 收集所有其他项目的开始和结束时间作为吸附点
        for (const track of this.tracks) {
            for (const item of track.items) {
                // 跳过当前项目
                if (item === currentItem) continue;
                
                snapPoints.push(item.startTime);
                snapPoints.push(item.startTime + item.duration);
            }
        }
        
        // 查找最近的吸附点
        let closestSnap = time;
        let minDistance = this.snapThreshold;
        
        for (const snapPoint of snapPoints) {
            const distance = Math.abs(time - snapPoint);
            if (distance < minDistance) {
                minDistance = distance;
                closestSnap = snapPoint;
            }
        }
        
        return closestSnap;
    }
    
    // 处理添加轨道按钮点击
    handleAddTrackClick() {
        const trackName = `特效 ${this.tracks.length + 1}`;
        this.addTrack(trackName);
    }
    
    // 添加新轨道
    addTrack(name) {
        const trackId = this.tracks.length;
        const track = {
            id: trackId,
            name: name,
            items: []
        };
        this.tracks.push(track);
        this.renderTrack(track);
        return trackId;
    }
    
    // 添加新的时间线项目
    addItem(trackId, startTime, duration, name) {
        if (!this.tracks[trackId]) return null;
        
        const item = {
            id: `item-${trackId}-${Date.now()}`,
            trackId: trackId,
            startTime: startTime,
            duration: duration,
            name: name
        };
        
        this.tracks[trackId].items.push(item);
        this.renderItem(item);
        
        // 更新时间轴范围
        this.updateTimelineRange();
        
        return item;
    }
    
    // 渲染单个轨道
    renderTrack(track) {
        const trackEl = document.createElement('div');
        trackEl.className = 'track';
        trackEl.dataset.trackId = track.id;
        
        const labelEl = document.createElement('div');
        labelEl.className = 'track-label';
        labelEl.textContent = track.name;
        
        const contentEl = document.createElement('div');
        contentEl.className = 'track-content';
        
        trackEl.appendChild(labelEl);
        trackEl.appendChild(contentEl);
        this.tracksContainer.appendChild(trackEl);
    }
    
    // 渲染所有轨道
    renderTracks() {
        this.tracksContainer.innerHTML = '';
        this.tracks.forEach(track => {
            this.renderTrack(track);
            track.items.forEach(item => {
                this.renderItem(item);
            });
        });
    }
    
    // 渲染时间线项目
    renderItem(item) {
        const track = this.tracks[item.trackId];
        if (!track) return;
        
        const trackEl = this.tracksContainer.querySelector(`.track[data-track-id="${item.trackId}"]`);
        if (!trackEl) return;
        
        const trackContent = trackEl.querySelector('.track-content');
        
        // 检查是否已存在
        let itemEl = document.getElementById(item.id);
        
        if (!itemEl) {
            // 创建新元素
            itemEl = document.createElement('div');
            itemEl.id = item.id;
            itemEl.className = 'timeline-item';
            itemEl.dataset.itemId = item.id;
            trackContent.appendChild(itemEl);
        }
        
        // 更新位置和宽度
        const leftPos = (item.startTime - this.scrollPosition) * this.pixelsPerSecond;
        const width = item.duration * this.pixelsPerSecond;
        
        itemEl.style.left = `${leftPos}px`;
        itemEl.style.width = `${width}px`;
        itemEl.textContent = item.name;
        
        // 如果是选中项，添加选中样式
        if (this.selectedItem && this.selectedItem.id === item.id) {
            itemEl.classList.add('selected');
        } else {
            itemEl.classList.remove('selected');
        }
    }
    
    // 时间标尺渲染 - 修改为每格代表2秒
    renderRuler() {
        const rulerWidth = this.timelineRuler.clientWidth;
        this.timelineRuler.innerHTML = '';
        
        // 计算视窗内的时间范围
        const visibleTimeStart = this.scrollPosition;
        const visibleTimeEnd = visibleTimeStart + (rulerWidth / this.pixelsPerSecond);
        
        // 设置主刻度为10秒，次刻度为2秒
        const majorInterval = 10;  // 主刻度: 10秒
        const minorInterval = 2;   // 次刻度: 2秒，修改为2秒一个小刻度
        
        // 计算起始刻度位置
        const startTick = Math.floor(visibleTimeStart / majorInterval) * majorInterval;
        
        // 创建刻度标记
        for (let i = startTick; i <= visibleTimeEnd + majorInterval; i += minorInterval) {
            if (i < 0) continue;
            
            const isMajor = i % majorInterval === 0; // 是否为主刻度
            
            // 计算刻度的像素位置
            const tickPosition = ((i - visibleTimeStart) * this.pixelsPerSecond);
            
            if (tickPosition < 0 || tickPosition > rulerWidth) continue;
            
            const tickMark = document.createElement('div');
            tickMark.className = isMajor ? 'ruler-tick major' : 'ruler-tick minor';
            tickMark.style.left = `${tickPosition}px`;
            
            if (isMajor) {
                // 主刻度添加时间标签
                const tickLabel = document.createElement('span');
                tickLabel.className = 'ruler-label';
                
                // 格式化时间显示为 00:00 格式
                const minutes = Math.floor(i / 60);
                const seconds = Math.floor(i % 60);
                
                tickLabel.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                tickMark.appendChild(tickLabel);
            }
            
            this.timelineRuler.appendChild(tickMark);
        }
        
        // 更新所有项目的位置
        this.tracks.forEach(track => {
            track.items.forEach(item => {
                this.renderItem(item);
            });
        });
    }
    
    // 更新播放头位置
    updatePlayhead() {
        if (!this.playhead) return;
        
        // 计算播放头位置 - 考虑滚动位置
        const labelWidth = document.querySelector('.track-label')?.offsetWidth || 40;
        const playheadPosition = ((this.currentTime - this.scrollPosition) * this.pixelsPerSecond) + labelWidth;
        
        this.playhead.style.left = `${playheadPosition}px`;
        
        // 更新时间显示
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = Math.floor(this.currentTime % 60);
        const milliseconds = Math.floor((this.currentTime % 1) * 100);
        
        const timeText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        this.timelinePosition.textContent = timeText;
        
        // 同时更新预览窗口的时间显示
        const previewTime = document.getElementById('preview-time');
        if (previewTime) {
            previewTime.textContent = timeText;
        }
    }
}

// 初始化时间线
document.addEventListener('DOMContentLoaded', () => {
    window.timelineController = new TimelineController();
    
    // 设置属性面板输入事件
    const nameInput = document.getElementById('item-name');
    const startInput = document.getElementById('item-start');
    const durationInput = document.getElementById('item-duration');
    const typeSelect = document.getElementById('item-type');
    const colorInput = document.getElementById('item-color');
    const sizeInput = document.getElementById('item-size');
    
    // 名称更改
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            if (window.timelineController.selectedItem) {
                window.timelineController.selectedItem.name = e.target.value;
                window.timelineController.renderItem(window.timelineController.selectedItem);
            }
        });
    }
    
    // 开始时间更改
    if (startInput) {
        startInput.addEventListener('change', (e) => {
            if (window.timelineController.selectedItem) {
                window.timelineController.selectedItem.startTime = parseFloat(e.target.value) || 0;
                window.timelineController.renderItem(window.timelineController.selectedItem);
            }
        });
    }
    
    // 持续时间更改
    if (durationInput) {
        durationInput.addEventListener('change', (e) => {
            if (window.timelineController.selectedItem) {
                window.timelineController.selectedItem.duration = parseFloat(e.target.value) || 1;
                window.timelineController.renderItem(window.timelineController.selectedItem);
            }
        });
    }
    
    // 设置顶部工具栏按钮事件
    const addTrackBtn = document.getElementById('add-track-btn');
    if (addTrackBtn) {
        addTrackBtn.addEventListener('click', () => {
            window.timelineController.handleAddTrackClick();
        });
    }
}); 