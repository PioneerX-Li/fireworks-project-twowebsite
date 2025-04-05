import numpy as np
import cv2
import random
import argparse

class Particle:
    def __init__(self, x, y, color, velocity_x, velocity_y, size=2, life=100):
        self.x = x
        self.y = y
        self.color = color
        self.velocity_x = velocity_x
        self.velocity_y = velocity_y
        self.size = size
        self.life = life
        self.lifetime = life
        self.gravity = 0.1

    def update(self):
        self.velocity_y += self.gravity
        self.x += self.velocity_x
        self.y += self.velocity_y
        self.life -= 1
        return self.life > 0

    def draw(self, frame):
        alpha = self.life / self.lifetime
        color = tuple(int(c * alpha) for c in self.color)
        cv2.circle(frame, (int(self.x), int(self.y)), self.size, color, -1)

class Firework:
    def __init__(self, x, y, color=None, particles=100, size=2):
        self.x = x
        self.y = y
        self.color = color if color else (
            random.randint(150, 255),
            random.randint(150, 255),
            random.randint(150, 255)
        )
        self.particles_count = particles
        self.particles = []
        self.exploded = False
        self.size = size
        
    def update(self):
        if not self.exploded:
            self.explode()
            self.exploded = True
        
        active_particles = []
        for particle in self.particles:
            if particle.update():
                active_particles.append(particle)
        
        self.particles = active_particles
        return len(self.particles) > 0
    
    def explode(self):
        for _ in range(self.particles_count):
            angle = 2 * np.pi * random.random()
            speed = 2 + random.random() * 3
            velocity_x = speed * np.cos(angle)
            velocity_y = speed * np.sin(angle)
            
            self.particles.append(
                Particle(
                    self.x, self.y, self.color,
                    velocity_x, velocity_y, 
                    self.size, random.randint(50, 100)
                )
            )
    
    def draw(self, frame):
        for particle in self.particles:
            particle.draw(frame)

def generate_fireworks_animation(output_file, duration=5, fps=30, width=1280, height=720, intensity=5):
    """
    生成烟花动画
    
    参数:
        output_file: 输出视频文件路径
        duration: 视频持续时间（秒）
        fps: 帧率
        width: 视频宽度
        height: 视频高度
        intensity: 烟花数量强度 (1-10)
    """
    # 创建VideoWriter对象
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_file, fourcc, fps, (width, height))
    
    fireworks = []
    total_frames = duration * fps
    
    for frame_idx in range(total_frames):
        # 创建黑色背景帧
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        
        # 随机添加新烟花
        if random.random() < 0.05 * intensity:
            x = random.randint(width // 4, width * 3 // 4)
            y = random.randint(height // 4, height // 2)
            fireworks.append(Firework(x, y, particles=random.randint(50, 150) * intensity // 5))
        
        # 更新所有烟花
        active_fireworks = []
        for firework in fireworks:
            if firework.update():
                firework.draw(frame)
                active_fireworks.append(firework)
        
        fireworks = active_fireworks
        
        # 写入帧
        out.write(frame)
    
    # 释放资源
    out.release()
    
    return output_file

def main():
    parser = argparse.ArgumentParser(description='生成烟花动画')
    parser.add_argument('--output', type=str, default='fireworks.mp4', help='输出文件路径')
    parser.add_argument('--duration', type=int, default=5, help='动画持续时间（秒）')
    parser.add_argument('--fps', type=int, default=30, help='帧率')
    parser.add_argument('--width', type=int, default=1280, help='视频宽度')
    parser.add_argument('--height', type=int, default=720, help='视频高度')
    parser.add_argument('--intensity', type=int, default=5, help='烟花强度 (1-10)')
    
    args = parser.parse_args()
    
    print(f"正在生成烟花动画，输出到: {args.output}")
    generate_fireworks_animation(
        args.output, args.duration, args.fps, 
        args.width, args.height, args.intensity
    )
    print("动画生成完成！")

if __name__ == "__main__":
    main() 