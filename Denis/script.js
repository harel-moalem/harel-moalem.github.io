const playlist = [
    // פרק א
    { type: 'image', url: 'img/img44.jpeg', caption: 'איפה הכל התחיל... השנים המוקדמות' },
    { type: 'image', url: 'img/img45.jpeg', caption: 'ילדות מתוקה ומלאת שקט' },
    { type: 'image', url: 'img/img46.jpeg', caption: 'החיוך שתמיד נשאר קסום' },
    { type: 'image', url: 'img/img49.jpeg', caption: 'תקופת הנעורים והרפתקאות יפות' },
    { type: 'image', url: 'img/img51.jpeg', caption: 'הבית והמשפחה שממנה צמחת' },
    // פרק ב
    { type: 'image', url: 'img/img9.jpeg', caption: 'הרגע המרגש... חותמים על הכתובה' },
    { type: 'image', url: 'img/img8.jpeg', caption: 'החלפת טבעות ותחילת הדרך המשותפת' },
    { type: 'image', url: 'img/img6.jpeg', caption: 'הכלה הכי יפה שיש' },
    { type: 'image', url: 'img/img7.jpeg', caption: 'בונים יחד עתיד וקן משפחתי' },
    // פרק ג
    { type: 'image', url: 'img/img10.jpeg', caption: 'תקופה של חגיגות, שמחות ואירועים' },
    { type: 'image', url: 'img/img11.jpeg', caption: 'תמיד יודעת לרקוד ולשמוח מכל הלב' },
    { type: 'image', url: 'img/img14.jpeg', caption: 'השטויות שרק אנחנו יודעים לעשות..' },
    { type: 'image', url: 'img/img3.jpeg', caption: 'חוגגים ביחד ברגעים שמחים ומלאי אנרגיה' },
    { type: 'image', url: 'img/img27.jpeg', caption: 'יוצרים זיכרונות מאושרים יחד' },
    // פרק ד
    { type: 'image', url: 'img/img19.jpeg', caption: 'התפקיד הכי ממיס - סבתא קשובה ואוהבת' },
    { type: 'image', url: 'img/img23.jpeg', caption: 'רגעים שלא נשכח' },
    { type: 'image', url: 'img/img37.jpeg', caption: 'רגע מרגש של דור חדש שמצטרף למשפחה' },
    { type: 'image', url: 'img/img38.jpeg', caption: 'חוגגים את התרחבות המשפחה באהבה גדולה' },
    { type: 'image', url: 'img/img39.jpeg', caption: 'הדורות הבאים שנולדו מתוך האהבה שלך' },
    { type: 'image', url: 'img/img1.jpeg', caption: 'רגעים קרובים עם הילדים – חיוך שאומר הכל' },
    { type: 'image', url: 'img/img2.jpeg', caption: 'סביב שולחן אחד, מוקפת באהבה של כולם' },
    { type: 'image', url: 'img/img4.jpeg', caption: 'המשפחה המדהימה שבנית – הכוח והאושר שלך' },
    { type: 'image', url: 'img/img29.jpeg', caption: 'הגאווה הגדולה של החיים שלך - המשפחה שלך' },
    { type: 'image', url: 'img/img31.jpeg', caption: 'מאוחדים, שמחים ותמיד איתך' },
    // פרק ה: סרטוני ברכה
    { type: 'text', title: 'ועכשיו...', caption: 'קצת ברכות חמות ומרגשות מרחוק... 🌍❤️' },
    { type: 'video', url: 'img/vm_jeniffer_1.MP4', caption: 'ברכה חמה מג׳ניפר' },
    { type: 'video', url: 'img/vm_lisa_1.MP4', caption: 'ברכה אוהבת מליזה' },
    { type: 'video', url: 'img/vm_yehil_1.mp4', caption: 'יחיאל עם חלק ראשון של הברכות' },
    { type: 'video', url: 'img/vm_yehil_2.mp4', caption: 'יחיאל ממשיך ומאחל מכל הלב' },
    // סיום
    { type: 'image', url: 'img/img36.jpeg', caption: 'מזל טוב דניס! יום הולדת 70 שמח לעד 120! ❤️' }
];
let currentItemIndex = 0;
let activeImageToggle = 1;
let isPlaying = true;

let progressInterval = null;
let currentProgress = 0;
const IMAGE_DURATION = 6000; 
const PROGRESS_STEP = 100;    

function startMovieMode() {
    document.getElementById('movie-overlay').style.display = 'flex';
    currentItemIndex = 0;
    isPlaying = true;
    updatePlayPauseButton();
    // ---- הוספה: הפעלת אפקט החלקיקים ----
     if (typeof movieParticles !== 'undefined') {
        movieParticles.start();
    }
    // הפעלת מוזיקת הרקע מהתחלה
    const bgMusic = document.getElementById('movie-bg-music');
    if (bgMusic) {
        bgMusic.currentTime = 0;
        bgMusic.volume = 0.4; // ווליום נעים שלא ירעיש מדי
        bgMusic.play().catch(err => console.log("הדפדפן חסם ניגון אוטומטי זמנית עד לאינטראקציה", err));
    }
    
    playNextItem();
}

function stopMovieMode() {
    document.getElementById('movie-overlay').style.display = 'none';
    resetTimers();
    // ---- הוספה: עצירת אפקט החלקיקים וניקוי המסך ----
    if (typeof movieParticles !== 'undefined') {
        movieParticles.stop();
    }
    // עצירת הוידאו
    const videoElement = document.getElementById('movie-video');
    videoElement.pause();
    videoElement.src = "";
    
    // עצירת מוזיקת הרקע
    const bgMusic = document.getElementById('movie-bg-music');
    if (bgMusic) {
        bgMusic.pause();
    }
    
    document.getElementById('movie-img-1').className = 'movie-frame';
    document.getElementById('movie-img-2').className = 'movie-frame';
    document.getElementById('movie-bg-blur-1').className = 'bg-blur';
    document.getElementById('movie-bg-blur-2').className = 'bg-blur';
}

function resetTimers() {
    clearInterval(progressInterval);
    currentProgress = 0;
    document.getElementById('movie-progress').style.width = '0%';
}

function playNextItem() {
    resetTimers();

    if (currentItemIndex >= playlist.length) {
        document.getElementById('movie-caption').innerText = "תודה שצפיתם! מזל טוב דניס! 🎉";
        document.getElementById('movie-img-1').className = 'movie-frame';
        document.getElementById('movie-img-2').className = 'movie-frame';
        document.getElementById('movie-bg-blur-1').className = 'bg-blur';
        document.getElementById('movie-bg-blur-2').className = 'bg-blur';
        document.getElementById('movie-video').style.display = 'none';
        document.getElementById('progress-container').classList.add('hide-progress');
        
        // החלשת המוזיקה בסיום
        const bgMusic = document.getElementById('movie-bg-music');
        if (bgMusic) bgMusic.pause();
        
        return;
    }

    const item = playlist[currentItemIndex];
    const videoElement = document.getElementById('movie-video');
    const captionElement = document.getElementById('movie-caption');
    const progressContainer = document.getElementById('progress-container');
    const bgMusic = document.getElementById('movie-bg-music');

    captionElement.classList.remove('active');
    setTimeout(() => {
        if (item.type === 'text') {
            captionElement.innerHTML = `<span class="text-slide-title" style="font-size: 3.5rem; display: block; margin-bottom: 20px; color: var(--accent-gold); font-family: 'Secular One', sans-serif;">${item.title}</span><span style="font-size: 2.2rem; font-weight: 300;">${item.caption}</span>`;
        } else {
            captionElement.innerText = item.caption;
        }
        captionElement.classList.add('active');
    }, 400);

    if (item.type === 'image' || item.type === 'text') {
        videoElement.style.display = 'none';
        videoElement.pause();
        progressContainer.classList.remove('hide-progress');

        // אם חזרנו מוידאו לתמונות/טקסט - נחזיר את מוזיקת הרקע לווליום הרגיל
        if (bgMusic && isPlaying && bgMusic.paused) {
            bgMusic.volume = 0.4;
            bgMusic.play();
        } else if (bgMusic && isPlaying) {
            bgMusic.volume = 0.4;
        }

        const currentImg = document.getElementById(`movie-img-${activeImageToggle}`);
        const currentBg = document.getElementById(`movie-bg-blur-${activeImageToggle}`);
        
        activeImageToggle = activeImageToggle === 1 ? 2 : 1;
        
        const nextImg = document.getElementById(`movie-img-${activeImageToggle}`);
        const nextBg = document.getElementById(`movie-bg-blur-${activeImageToggle}`);

        nextImg.classList.remove('zooming', 'visible');
        nextBg.classList.remove('visible');
        
        if (item.type === 'image') {
            nextImg.src = item.url;
            nextBg.src = item.url;
            
            void nextImg.offsetWidth; 
            
            nextImg.classList.add('zooming', 'visible');
            nextBg.classList.add('visible');
        } else {
            // עבור שקופית טקסט - מציגים רק רקע מטושטש מתמונת הסיום או תמונה קודמת
            nextBg.src = playlist[currentItemIndex - 1]?.url || 'img/img36.jpeg';
            nextBg.classList.add('visible');
        }

        currentImg.classList.remove('visible');
        if (item.type === 'image') {
            currentBg.classList.remove('visible');
        }

        setTimeout(() => {
            if (!currentImg.classList.contains('visible')) {
                currentImg.classList.remove('zooming');
            }
        }, 1500);

        if (isPlaying) {
            startProgressBar();
        }

    } else if (item.type === 'video') {
        document.getElementById('movie-img-1').className = 'movie-frame';
        document.getElementById('movie-img-2').className = 'movie-frame';
        document.getElementById('movie-bg-blur-1').className = 'bg-blur';
        document.getElementById('movie-bg-blur-2').className = 'bg-blur';
        progressContainer.classList.add('hide-progress'); 

        // ברכות וידאו: עוצרים או מנמיכים את מוזיקת הרקע לחלוטין כדי לשמוע את המברך
        if (bgMusic) {
            bgMusic.pause(); 
        }

        videoElement.src = item.url;
        videoElement.style.display = 'block';
        videoElement.style.opacity = 0;
        
        if (isPlaying) {
            videoElement.play();
        } else {
            videoElement.pause();
        }

        setTimeout(() => { 
            videoElement.style.transition = "opacity 0.5s"; 
            videoElement.style.opacity = 1; 
        }, 100);

        videoElement.onended = function() {
            videoElement.style.opacity = 0;
            currentItemIndex++;
            setTimeout(playNextItem, 500);
        };
    }
}

function startProgressBar() {
    const progressBar = document.getElementById('movie-progress');
    progressInterval = setInterval(() => {
        if (isPlaying) {
            currentProgress += PROGRESS_STEP;
            const percentage = (currentProgress / IMAGE_DURATION) * 100;
            progressBar.style.width = `${percentage}%`;

            if (currentProgress >= IMAGE_DURATION) {
                clearInterval(progressInterval);
                currentItemIndex++;
                playNextItem();
            }
        }
    }, PROGRESS_STEP);
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    updatePlayPauseButton();
    
    const currentVideo = document.getElementById('movie-video');
    const bgMusic = document.getElementById('movie-bg-music');
    const currentItem = playlist[currentItemIndex];

    if (currentItem && currentItem.type === 'video') {
        if (isPlaying) currentVideo.play();
        else currentVideo.pause();
    } else {
        // במידה ועצרנו תמונה, נעצור גם את מוזיקת הרקע
        if (bgMusic) {
            if (isPlaying) bgMusic.play();
            else bgMusic.pause();
        }
    }
}

function updatePlayPauseButton() {
    const btn = document.getElementById('play-pause-btn');
    btn.innerText = isPlaying ? "⏸️" : "▶️";
}

function nextSlide() {
    if (currentItemIndex < playlist.length - 1) {
        currentItemIndex++;
        playNextItem();
    } else {
        stopMovieMode();
    }
}

function prevSlide() {
    if (currentItemIndex > 0) {
        currentItemIndex--;
        playNextItem();
    }
}