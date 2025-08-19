/**
 * مدير الصوت المحسن مع تجميع الأصوات وتحسين الأداء
 */
class SoundManager {
    constructor() {
        this.enabled = true;
        this.ctx = null;
        this.soundCache = new Map();
        this.volume = 0.08;
        this.stats = {
            totalSounds: 0,
            cachedSounds: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
        
        this.init();
    }
    
    /**
     * تهيئة مدير الصوت
     */
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio context initialized successfully');
        } catch (e) {
            console.warn('Audio context not supported, sound disabled');
            this.enabled = false;
        }
    }
    
    /**
     * إنشاء صوت مع التجميع
     */
    createSound(freq = 440, dur = 0.1, type = 'square', vol = null) {
        if (!this.enabled || !this.ctx) return;
        
        const volume = vol !== null ? vol : this.volume;
        const cacheKey = `${freq}_${dur}_${type}_${volume}`;
        
        // التحقق من التجميع
        if (this.soundCache.has(cacheKey)) {
            const cached = this.soundCache.get(cacheKey);
            this.stats.cacheHits++;
            
            // نسخ الصوت المخزن
            const oscillator = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(volume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
            
            oscillator.connect(gain);
            gain.connect(this.ctx.destination);
            
            oscillator.start();
            oscillator.stop(this.ctx.currentTime + dur);
            
            return;
        }
        
        // إنشاء صوت جديد
        this.stats.cacheMisses++;
        const oscillator = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
        
        oscillator.connect(gain);
        gain.connect(this.ctx.destination);
        
        oscillator.start();
        oscillator.stop(this.ctx.currentTime + dur);
        
        // تخزين في التجميع
        this.soundCache.set(cacheKey, { freq, dur, type, volume });
        this.stats.cachedSounds++;
        this.stats.totalSounds++;
        
        // تنظيف التجميع إذا كان كبيراً جداً
        if (this.soundCache.size > 50) {
            this.cleanupCache();
        }
    }
    
    /**
     * تنظيف التجميع
     */
    cleanupCache() {
        const entries = Array.from(this.soundCache.entries());
        // إزالة الأصوات الأقل استخداماً
        entries.sort((a, b) => a[1].lastUsed - b[1].lastUsed);
        const toRemove = entries.slice(0, 10);
        
        for (const [key] of toRemove) {
            this.soundCache.delete(key);
        }
    }
    
    /**
     * تشغيل صوت القفز
     */
    jump() {
        this.createSound(520, 0.09, 'sine', 0.06);
    }
    
    /**
     * تشغيل صوت العملة
     */
    coin() {
        this.createSound(900, 0.08, 'triangle', 0.07);
    }
    
    /**
     * تشغيل صوت الدوس
     */
    stomp() {
        this.createSound(200, 0.12, 'square', 0.09);
    }
    
    /**
     * تشغيل صوت الضرر
     */
    hit() {
        this.createSound(160, 0.25, 'sawtooth', 0.09);
    }
    
    /**
     * تشغيل صوت القوة
     */
    power() {
        this.createSound(660, 0.08);
        setTimeout(() => this.createSound(880, 0.12), 80);
    }
    
    /**
     * تشغيل صوت الفوز
     */
    win() {
        const frequencies = [523, 659, 783, 1046];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.createSound(freq, 0.12, 'square', 0.07), 150 * i);
        });
    }
    
    /**
     * تشغيل صوت الرصاص
     */
    shoot() {
        this.createSound(980, 0.08, 'triangle', 0.07);
    }
    
    /**
     * تشغيل صوت الكسر
     */
    break() {
        this.createSound(120, 0.06, 'square', 0.1);
    }
    
    /**
     * تشغيل صوت الحياة
     */
    life() {
        this.createSound(880, 0.08, 'square', 0.08);
        setTimeout(() => this.createSound(1175, 0.12, 'square', 0.08), 90);
    }
    
    /**
     * تشغيل صوت مخصص
     */
    playCustom(freq, duration, type = 'square', volume = null) {
        this.createSound(freq, duration, type, volume);
    }
    
    /**
     * تغيير مستوى الصوت
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * تفعيل/إلغاء تفعيل الصوت
     */
    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled && this.ctx) {
            this.ctx.suspend();
        } else if (this.enabled && this.ctx) {
            this.ctx.resume();
        }
    }
    
    /**
     * إيقاف جميع الأصوات
     */
    stopAll() {
        if (this.ctx) {
            this.ctx.close();
            this.init();
        }
    }
    
    /**
     * الحصول على إحصائيات الأداء
     */
    getStats() {
        return {
            ...this.stats,
            cacheSize: this.soundCache.size,
            cacheHitRate: this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses),
            enabled: this.enabled
        };
    }
    
    /**
     * إعادة تعيين الإحصائيات
     */
    resetStats() {
        this.stats = {
            totalSounds: 0,
            cachedSounds: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
    }
    
    /**
     * تنظيف الذاكرة
     */
    cleanup() {
        this.soundCache.clear();
        this.stats.cachedSounds = 0;
    }
}

/**
 * مدير الصوت المحسن للعبة
 */
class GameSoundManager extends SoundManager {
    constructor() {
        super();
        this.soundEffects = {
            jump: { freq: 520, dur: 0.09, type: 'sine', vol: 0.06 },
            coin: { freq: 900, dur: 0.08, type: 'triangle', vol: 0.07 },
            stomp: { freq: 200, dur: 0.12, type: 'square', vol: 0.09 },
            hit: { freq: 160, dur: 0.25, type: 'sawtooth', vol: 0.09 },
            power: { freq: 660, dur: 0.08, type: 'square', vol: 0.08 },
            shoot: { freq: 980, dur: 0.08, type: 'triangle', vol: 0.07 },
            break: { freq: 120, dur: 0.06, type: 'square', vol: 0.1 },
            life: { freq: 880, dur: 0.08, type: 'square', vol: 0.08 }
        };
        
        this.backgroundMusic = null;
        this.musicEnabled = true;
    }
    
    /**
     * تشغيل صوت مع إعدادات محددة مسبقاً
     */
    playSound(soundName) {
        const sound = this.soundEffects[soundName];
        if (sound) {
            this.createSound(sound.freq, sound.dur, sound.type, sound.vol);
        }
    }
    
    /**
     * تشغيل موسيقى خلفية
     */
    playBackgroundMusic(freq = 220, pattern = [0, 4, 7, 12]) {
        if (!this.musicEnabled) return;
        
        this.backgroundMusic = setInterval(() => {
            const randomNote = pattern[Math.floor(Math.random() * pattern.length)];
            const noteFreq = freq * Math.pow(2, randomNote / 12);
            this.createSound(noteFreq, 0.3, 'sine', 0.03);
        }, 200);
    }
    
    /**
     * إيقاف موسيقى الخلفية
     */
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            clearInterval(this.backgroundMusic);
            this.backgroundMusic = null;
        }
    }
    
    /**
     * تفعيل/إلغاء تفعيل الموسيقى
     */
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopBackgroundMusic();
        }
    }
}