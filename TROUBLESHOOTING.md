# Spark.js Demo Troubleshooting Guide

## 🔍 **发现的问题**

### 1. **资源管理问题**
- **问题**: 切换demo时出现黑屏，资源没有正确清理
- **原因**: SplatMesh没有正确调用dispose()方法
- **解决方案**: 
  - 添加了splatMeshes数组来跟踪所有创建的SplatMesh
  - 在切换demo前正确dispose所有现有资源
  - 确保scene.remove()调用

### 2. **初始化问题**
- **问题**: 第一次加载正常，后续加载失败
- **原因**: 没有等待SplatMesh.initialized Promise
- **解决方案**:
  - 在所有SplatMesh创建后添加`await splatMesh.initialized`
  - 确保资源完全加载后再进行场景设置

### 3. **渲染器管理**
- **问题**: 缺少SparkRenderer导致渲染异常
- **原因**: 没有正确初始化SparkRenderer
- **解决方案**:
  - 添加SparkRenderer到场景中
  - 确保渲染器正确配置

### 4. **模态框关闭问题**
- **问题**: 右上角X按钮点击无反应
- **原因**: HTML中按钮ID不匹配
- **解决方案**:
  - 修复按钮ID从`closeModal`到`modalClose`
  - 确保事件监听器正确绑定

### 5. **进度显示问题**
- **问题**: 加载过程没有进度指示
- **原因**: 缺少加载状态UI
- **解决方案**:
  - 添加加载动画和进度提示
  - 显示详细的错误信息

## 🛠️ **技术细节**

### **SplatMesh生命周期管理**
```javascript
// 创建SplatMesh
const splatMesh = new SplatMesh({ url: splatURL });

// 等待初始化完成
await splatMesh.initialized;

// 添加到场景
scene.add(splatMesh);

// 跟踪资源
this.splatMeshes.push(splatMesh);

// 清理资源
splatMesh.dispose();
scene.remove(splatMesh);
```

### **SparkRenderer集成**
```javascript
// 创建SparkRenderer
this.sparkRenderer = new SparkRenderer({ renderer: this.renderer });
this.scene.add(this.sparkRenderer);
```

### **资源清理流程**
```javascript
cleanupDemo() {
    // 1. 停止动画循环
    if (this.animationId) {
        cancelAnimationFrame(this.animationId);
    }
    
    // 2. 清理SplatMesh资源
    this.splatMeshes.forEach(mesh => {
        mesh.dispose();
        this.scene.remove(mesh);
    });
    
    // 3. 清理渲染器
    this.renderer.dispose();
    
    // 4. 重置状态
    this.scene = null;
    this.camera = null;
    this.renderer = null;
}
```

## 🎯 **最佳实践**

### **1. 资源管理**
- 始终跟踪创建的SplatMesh实例
- 在切换demo前调用dispose()
- 使用数组管理多个资源

### **2. 异步初始化**
- 等待SplatMesh.initialized Promise
- 在资源加载完成后再设置场景
- 处理加载错误

### **3. 渲染器配置**
- 使用SparkRenderer进行splat渲染
- 正确配置WebGL渲染器
- 处理窗口大小变化

### **4. 用户体验**
- 显示加载进度
- 提供错误信息
- 确保模态框正确关闭

## 🔧 **调试技巧**

### **检查资源状态**
```javascript
console.log('SplatMesh initialized:', splatMesh.isInitialized);
console.log('SplatMesh count:', this.splatMeshes.length);
```

### **监控内存使用**
```javascript
// 在切换demo前后检查内存
console.log('Memory before cleanup:', performance.memory);
```

### **错误处理**
```javascript
try {
    await this.initializeDemo(demoId, container);
} catch (error) {
    console.error('Demo initialization failed:', error);
    // 显示用户友好的错误信息
}
```

## 📊 **性能优化**

### **1. 资源复用**
- 考虑复用PackedSplats对象
- 避免重复加载相同资源

### **2. 内存管理**
- 及时dispose不需要的资源
- 监控内存使用情况

### **3. 渲染优化**
- 使用适当的maxStdDev值
- 配置合适的clipXY参数

## 🚀 **未来改进**

1. **资源预加载**: 预加载常用模型
2. **缓存机制**: 实现资源缓存
3. **错误恢复**: 自动重试机制
4. **性能监控**: 实时性能指标
5. **用户反馈**: 更详细的加载状态 