/**
 * نظام التجزئة المكانية لتحسين اكتشاف التصادم
 * يحسن الأداء من O(n²) إلى O(1) للتصادمات
 */
class SpatialHash {
    constructor(cellSize = 100) {
        this.cellSize = cellSize;
        this.grid = new Map();
        this.stats = {
            totalQueries: 0,
            totalObjects: 0,
            averageQuerySize: 0
        };
    }
    
    /**
     * مسح الشبكة
     */
    clear() {
        this.grid.clear();
        this.stats.totalObjects = 0;
    }
    
    /**
     * إدراج كائن في الشبكة
     */
    insert(x, y, object) {
        const key = this.getKey(x, y);
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key).push(object);
        this.stats.totalObjects++;
    }
    
    /**
     * الحصول على مفتاح الخلية
     */
    getKey(x, y) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }
    
    /**
     * البحث عن الكائنات القريبة
     */
    query(x, y, radius) {
        this.stats.totalQueries++;
        
        const nearby = [];
        const minKeyX = Math.floor((x - radius) / this.cellSize);
        const maxKeyX = Math.floor((x + radius) / this.cellSize);
        const minKeyY = Math.floor((y - radius) / this.cellSize);
        const maxKeyY = Math.floor((y + radius) / this.cellSize);
        
        for (let kx = minKeyX; kx <= maxKeyX; kx++) {
            for (let ky = minKeyY; ky <= maxKeyY; ky++) {
                const key = `${kx},${ky}`;
                const objects = this.grid.get(key);
                if (objects) {
                    nearby.push(...objects);
                }
            }
        }
        
        // تحديث الإحصائيات
        this.stats.averageQuerySize = 
            (this.stats.averageQuerySize * (this.stats.totalQueries - 1) + nearby.length) / this.stats.totalQueries;
        
        return nearby;
    }
    
    /**
     * البحث عن الكائنات في نطاق مستطيل
     */
    queryRect(x, y, w, h) {
        const nearby = [];
        const minKeyX = Math.floor(x / this.cellSize);
        const maxKeyX = Math.floor((x + w) / this.cellSize);
        const minKeyY = Math.floor(y / this.cellSize);
        const maxKeyY = Math.floor((y + h) / this.cellSize);
        
        for (let kx = minKeyX; kx <= maxKeyX; kx++) {
            for (let ky = minKeyY; ky <= maxKeyY; ky++) {
                const key = `${kx},${ky}`;
                const objects = this.grid.get(key);
                if (objects) {
                    nearby.push(...objects);
                }
            }
        }
        
        return nearby;
    }
    
    /**
     * الحصول على إحصائيات الأداء
     */
    getStats() {
        return {
            ...this.stats,
            gridSize: this.grid.size,
            cellSize: this.cellSize
        };
    }
    
    /**
     * تحسين حجم الخلية بناءً على الإحصائيات
     */
    optimizeCellSize() {
        if (this.stats.averageQuerySize > 20) {
            this.cellSize = Math.min(200, this.cellSize * 1.5);
        } else if (this.stats.averageQuerySize < 5) {
            this.cellSize = Math.max(50, this.cellSize * 0.8);
        }
    }
}

/**
 * مدير التجزئة المكانية للعبة
 */
class GameSpatialHash {
    constructor() {
        this.platformsHash = new SpatialHash(80);  // منصات
        this.enemiesHash = new SpatialHash(120);    // أعداء
        this.itemsHash = new SpatialHash(60);       // عملات وقوى
        this.bulletsHash = new SpatialHash(40);     // رصاص
    }
    
    /**
     * تحديث جميع الشبكات
     */
    updateAll(platforms, enemies, coins, powerups, bullets, eBullets) {
        this.platformsHash.clear();
        this.enemiesHash.clear();
        this.itemsHash.clear();
        this.bulletsHash.clear();
        
        // إدراج المنصات
        for (const platform of platforms) {
            this.platformsHash.insert(platform.x, platform.y, platform);
        }
        
        // إدراج الأعداء
        for (const enemy of enemies) {
            if (enemy.alive) {
                this.enemiesHash.insert(enemy.x, enemy.y, enemy);
            }
        }
        
        // إدراج العناصر
        for (const coin of coins) {
            if (!coin.taken) {
                this.itemsHash.insert(coin.x, coin.y, coin);
            }
        }
        for (const powerup of powerups) {
            this.itemsHash.insert(powerup.x, powerup.y, powerup);
        }
        
        // إدراج الرصاص
        for (const bullet of bullets) {
            if (bullet.active !== false) {
                this.bulletsHash.insert(bullet.x, bullet.y, bullet);
            }
        }
        for (const bullet of eBullets) {
            this.bulletsHash.insert(bullet.x, bullet.y, bullet);
        }
    }
    
    /**
     * البحث عن المنصات القريبة
     */
    getNearbyPlatforms(x, y, radius = 80) {
        return this.platformsHash.query(x, y, radius);
    }
    
    /**
     * البحث عن الأعداء القريبين
     */
    getNearbyEnemies(x, y, radius = 120) {
        return this.enemiesHash.query(x, y, radius);
    }
    
    /**
     * البحث عن العناصر القريبة
     */
    getNearbyItems(x, y, radius = 60) {
        return this.itemsHash.query(x, y, radius);
    }
    
    /**
     * البحث عن الرصاص القريب
     */
    getNearbyBullets(x, y, radius = 40) {
        return this.bulletsHash.query(x, y, radius);
    }
    
    /**
     * الحصول على إحصائيات الأداء
     */
    getPerformanceStats() {
        return {
            platforms: this.platformsHash.getStats(),
            enemies: this.enemiesHash.getStats(),
            items: this.itemsHash.getStats(),
            bullets: this.bulletsHash.getStats()
        };
    }
    
    /**
     * تحسين أحجام الخلايا
     */
    optimize() {
        this.platformsHash.optimizeCellSize();
        this.enemiesHash.optimizeCellSize();
        this.itemsHash.optimizeCellSize();
        this.bulletsHash.optimizeCellSize();
    }
}