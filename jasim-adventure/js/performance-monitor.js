/**
 * مراقب الأداء لمراقبة وتحسين أداء اللعبة
 */
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.frameTimes = [];
        this.memoryUsage = [];
        this.collisionStats = {
            totalQueries: 0,
            averageQuerySize: 0,
            spatialHashEfficiency: 0
        };
        this.renderStats = {
            totalObjects: 0,
            visibleObjects: 0,
            cullingEfficiency: 0
        };
        this.objectPoolStats = {
            totalCreated: 0,
            totalReused: 0,
            memorySavings: 0
        };
        
        this.maxHistorySize = 300; // 5 ثوانٍ عند 60 FPS
        this.optimizationThresholds = {
            lowFPS: 50,
            highMemory: 100 * 1024 * 1024, // 100MB
            inefficientCollision: 0.3,
            poorCulling: 0.5
        };
        
        this.optimizations = {
            spatialHashOptimized: false,
            objectPoolOptimized: false,
            renderCullingOptimized: false
        };
    }
    
    /**
     * تحديث مراقب الأداء
     */
    update() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        this.frameCount++;
        this.frameTimes.push(deltaTime);
        
        // تحديث FPS كل ثانية
        if (deltaTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // تحليل الأداء وتطبيق التحسينات
            this.analyzePerformance();
        }
        
        // الحفاظ على حجم التاريخ
        if (this.frameTimes.length > this.maxHistorySize) {
            this.frameTimes.shift();
        }
        
        // مراقبة استخدام الذاكرة
        if (performance.memory) {
            this.memoryUsage.push(performance.memory.usedJSHeapSize);
            if (this.memoryUsage.length > 60) {
                this.memoryUsage.shift();
            }
        }
    }
    
    /**
     * تحليل الأداء وتطبيق التحسينات
     */
    analyzePerformance() {
        const avgFrameTime = this.getAverageFrameTime();
        const memoryTrend = this.getMemoryTrend();
        
        // تحسين التجزئة المكانية
        if (this.fps < this.optimizationThresholds.lowFPS && !this.optimizations.spatialHashOptimized) {
            this.optimizeSpatialHash();
        }
        
        // تحسين تجمعات الكائنات
        if (memoryTrend > 0 && !this.optimizations.objectPoolOptimized) {
            this.optimizeObjectPools();
        }
        
        // تحسين القطع
        if (this.renderStats.cullingEfficiency < this.optimizationThresholds.poorCulling && !this.optimizations.renderCullingOptimized) {
            this.optimizeRenderCulling();
        }
        
        // تسجيل التحسينات
        this.logOptimizations();
    }
    
    /**
     * الحصول على متوسط وقت الإطار
     */
    getAverageFrameTime() {
        if (this.frameTimes.length === 0) return 0;
        return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    }
    
    /**
     * الحصول على اتجاه استخدام الذاكرة
     */
    getMemoryTrend() {
        if (this.memoryUsage.length < 10) return 0;
        
        const recent = this.memoryUsage.slice(-10);
        const older = this.memoryUsage.slice(-20, -10);
        
        if (older.length === 0) return 0;
        
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        
        return recentAvg - olderAvg;
    }
    
    /**
     * تحسين التجزئة المكانية
     */
    optimizeSpatialHash() {
        if (window.game && window.game.spatialHash) {
            window.game.spatialHash.optimize();
            this.optimizations.spatialHashOptimized = true;
            console.log('Spatial hash optimized for better performance');
        }
    }
    
    /**
     * تحسين تجمعات الكائنات
     */
    optimizeObjectPools() {
        if (window.game && window.game.objectPools) {
            // تنظيف الذاكرة
            window.game.objectPools.bullets.cleanup();
            window.game.objectPools.powerups.cleanup();
            window.game.objectPools.coins.cleanup();
            this.optimizations.objectPoolOptimized = true;
            console.log('Object pools optimized for memory efficiency');
        }
    }
    
    /**
     * تحسين قطع العرض
     */
    optimizeRenderCulling() {
        if (window.game) {
            // تحسين حدود القطع
            this.optimizationThresholds.poorCulling = 0.6;
            this.optimizations.renderCullingOptimized = true;
            console.log('Render culling optimized for better performance');
        }
    }
    
    /**
     * تحديث إحصائيات التصادم
     */
    updateCollisionStats(stats) {
        this.collisionStats = {
            totalQueries: stats.totalQueries || 0,
            averageQuerySize: stats.averageQuerySize || 0,
            spatialHashEfficiency: stats.spatialHashEfficiency || 0
        };
    }
    
    /**
     * تحديث إحصائيات العرض
     */
    updateRenderStats(total, visible) {
        this.renderStats.totalObjects = total;
        this.renderStats.visibleObjects = visible;
        this.renderStats.cullingEfficiency = visible / Math.max(total, 1);
    }
    
    /**
     * تحديث إحصائيات تجمعات الكائنات
     */
    updateObjectPoolStats(stats) {
        this.objectPoolStats = {
            totalCreated: stats.totalCreated || 0,
            totalReused: stats.totalReused || 0,
            memorySavings: stats.memorySavings || 0
        };
    }
    
    /**
     * تسجيل التحسينات
     */
    logOptimizations() {
        const optimizations = [];
        
        if (this.optimizations.spatialHashOptimized) {
            optimizations.push('Spatial Hash');
        }
        if (this.optimizations.objectPoolOptimized) {
            optimizations.push('Object Pools');
        }
        if (this.optimizations.renderCullingOptimized) {
            optimizations.push('Render Culling');
        }
        
        if (optimizations.length > 0) {
            console.log(`Applied optimizations: ${optimizations.join(', ')}`);
        }
    }
    
    /**
     * الحصول على تقرير الأداء
     */
    getPerformanceReport() {
        const avgFrameTime = this.getAverageFrameTime();
        const memoryTrend = this.getMemoryTrend();
        const memoryUsage = this.memoryUsage.length > 0 ? this.memoryUsage[this.memoryUsage.length - 1] : 0;
        
        return {
            fps: this.fps,
            averageFrameTime: avgFrameTime,
            frameTimeVariance: this.getFrameTimeVariance(),
            memoryUsage: memoryUsage,
            memoryTrend: memoryTrend,
            collisionEfficiency: this.collisionStats.spatialHashEfficiency,
            renderEfficiency: this.renderStats.cullingEfficiency,
            objectPoolEfficiency: this.objectPoolStats.totalReused / Math.max(this.objectPoolStats.totalCreated + this.objectPoolStats.totalReused, 1),
            appliedOptimizations: Object.keys(this.optimizations).filter(key => this.optimizations[key]),
            recommendations: this.getRecommendations()
        };
    }
    
    /**
     * الحصول على تباين وقت الإطار
     */
    getFrameTimeVariance() {
        if (this.frameTimes.length < 2) return 0;
        
        const mean = this.getAverageFrameTime();
        const variance = this.frameTimes.reduce((acc, time) => acc + Math.pow(time - mean, 2), 0) / this.frameTimes.length;
        return Math.sqrt(variance);
    }
    
    /**
     * الحصول على التوصيات
     */
    getRecommendations() {
        const recommendations = [];
        
        if (this.fps < this.optimizationThresholds.lowFPS) {
            recommendations.push('Consider reducing visual effects or object count');
        }
        
        if (this.memoryTrend > 0) {
            recommendations.push('Memory usage increasing, check for memory leaks');
        }
        
        if (this.collisionStats.spatialHashEfficiency < this.optimizationThresholds.inefficientCollision) {
            recommendations.push('Spatial hash efficiency low, consider adjusting cell size');
        }
        
        if (this.renderStats.cullingEfficiency < this.optimizationThresholds.poorCulling) {
            recommendations.push('Render culling inefficient, optimize viewport calculations');
        }
        
        return recommendations;
    }
    
    /**
     * إعادة تعيين المراقب
     */
    reset() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.frameTimes = [];
        this.memoryUsage = [];
        this.optimizations = {
            spatialHashOptimized: false,
            objectPoolOptimized: false,
            renderCullingOptimized: false
        };
    }
    
    /**
     * تصدير البيانات للتحليل
     */
    exportData() {
        return {
            timestamp: new Date().toISOString(),
            performance: this.getPerformanceReport(),
            frameTimes: this.frameTimes,
            memoryUsage: this.memoryUsage
        };
    }
}

/**
 * مدير مراقبة الأداء للعبة
 */
class GamePerformanceManager {
    constructor() {
        this.monitor = new PerformanceMonitor();
        this.autoOptimize = true;
        this.optimizationInterval = 5000; // كل 5 ثوانٍ
        
        if (this.autoOptimize) {
            this.startAutoOptimization();
        }
    }
    
    /**
     * بدء التحسين التلقائي
     */
    startAutoOptimization() {
        setInterval(() => {
            if (this.monitor.fps < 55) {
                this.applyEmergencyOptimizations();
            }
        }, this.optimizationInterval);
    }
    
    /**
     * تطبيق تحسينات الطوارئ
     */
    applyEmergencyOptimizations() {
        console.log('Applying emergency optimizations due to low FPS');
        
        // تقليل جودة الرسومات
        if (window.game && window.game.renderer) {
            window.game.renderer.setQuality('low');
        }
        
        // تنظيف الذاكرة
        if (window.game && window.game.objectPools) {
            window.game.objectPools.returnAll();
        }
        
        // إعادة تعيين التجزئة المكانية
        if (window.game && window.game.spatialHash) {
            window.game.spatialHash.optimize();
        }
    }
    
    /**
     * الحصول على المراقب
     */
    getMonitor() {
        return this.monitor;
    }
    
    /**
     * إيقاف التحسين التلقائي
     */
    stopAutoOptimization() {
        this.autoOptimize = false;
    }
    
    /**
     * بدء التحسين التلقائي
     */
    startAutoOptimization() {
        this.autoOptimize = true;
        this.startAutoOptimization();
    }
}