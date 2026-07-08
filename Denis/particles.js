class CinematicParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationFrameId = null;
        this.isRunning = false;

        // הגדרות האפקט - חלקיקי זהב חמימים ועמומים
        this.config = {
            maxParticles: 45,       // כמות מעטה ומעודנת כדי שלא יהיה עמוס
            minRadius: 1,           // חלקיקים קטנים וחדים
            maxRadius: 12,          // חלקיקי בוקה גדולים ומטושטשים
            minSpeedX: -0.15,       // תנועה אטית מאוד שמאלה/ימינה
            maxSpeedX: 0.15,
            minSpeedY: -0.2,        // תנועה אטית מאוד למעלה/למטה
            maxSpeedY: -0.05,       // נטייה קלה לצוף כלפי מעלה כמו אבק באור שמש
            color: '245, 212, 164'  // גוון זהב חם (RGB) בהתאמה לקו העיצובי
        };

        this.init();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.maxParticles; i++) {
            this.particles.push(this.generateParticle(true));
        }
    }

    generateParticle(randomY = false) {
        const radius = Math.random() * (this.config.maxRadius - this.config.minRadius) + this.config.minRadius;
        
        return {
            x: Math.random() * this.canvas.width,
            // בזמן האתחול מפזרים בכל המסך, ביצירה שוטפת הם יתחילו מלמטה
            y: randomY ? Math.random() * this.canvas.height : this.canvas.height + radius * 2,
            radius: radius,
            // מהירות אטית
            speedX: Math.random() * (this.config.maxSpeedX - this.config.minSpeedX) + this.config.minSpeedX,
            speedY: Math.random() * (this.config.maxSpeedY - this.config.minSpeedY) + this.config.minSpeedY,
            // שינויי שקיפות (Flicker קולנועי עדין)
            opacity: Math.random() * 0.4 + 0.1, // שקיפות מקסימלית נמוכה (עמום)
            fadeSpeed: Math.random() * 0.003 + 0.001,
            fadeDirection: Math.random() > 0.5 ? 1 : -1
        };
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // עדכון מיקום
            p.x += p.speedX;
            p.y += p.speedY;

            // עדכון שקיפות (נשימה עדינה של האור)
            p.opacity += p.fadeSpeed * p.fadeDirection;
            if (p.opacity >= 0.5 || p.opacity <= 0.1) {
                p.fadeDirection *= -1;
            }

            // ציור החלקיק
            this.ctx.beginPath();
            
            // אפקט בוקה - ככל שהחלקיק גדול יותר, הוא מטושטש ועמום יותר
            let gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            gradient.addColorStop(0, `rgba(${this.config.color}, ${p.opacity})`);
            gradient.addColorStop(0.6, `rgba(${this.config.color}, ${p.opacity * 0.4})`);
            gradient.addColorStop(1, `rgba(${this.config.color}, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
            this.ctx.fill();

            // אם החלקיק יצא מגבולות המסך (עלה למעלה או יצא מהצדדים), נולד חלקיק חדש
            if (p.y < -p.radius || p.x < -p.radius || p.x > this.canvas.width + p.radius) {
                this.particles[i] = this.generateParticle(false);
            }
        }

        if (this.isRunning) {
            this.animationFrameId = requestAnimationFrame(() => this.draw());
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.resizeCanvas();
        this.draw();
    }

    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// יצירת מופע גלובלי שנוכל לגשת אליו מקובץ ה-script.js הראשי
let movieParticles = null;
window.addEventListener('DOMContentLoaded', () => {
    movieParticles = new CinematicParticles('particles-canvas');
});