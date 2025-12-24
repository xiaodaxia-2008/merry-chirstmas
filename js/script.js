document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors & Constants ---
    const imagesContainer = document.querySelector('.images');
    const treeStarsContainer = document.querySelector('.stars');
    const backgroundStarsContainer = document.getElementById('background-stars-container');
    const music = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const photoOverlay = document.getElementById('photo-overlay');
    const imageUrls = [
        "imgs/20251007_223026.png",
        "imgs/20251008_143342.png",
        "imgs/20251008_162500.png",
        "imgs/20251122_135459.png",
        "imgs/20251122_135603.png",
        "imgs/20251122_135904.png",
        "imgs/20251126_233734.png",
        "imgs/20251126_233744.png",
        "imgs/grok_image_xm2cf9x.png",
        "imgs/JPEG_20251108_202933_5748594587902146437.png"
    ];
    const photoPositions = [
        'photo-t1-right', 'photo-t1-left', 'photo-t2-right', 'photo-t2-left',
        'photo-t3-right', 'photo-t3-left', 'photo-t4-right', 'photo-t4-left',
        'photo-t5-right', 'photo-t5-left'
    ];

    // --- Global State Variables ---
    const stars = []; // For dynamic background star animation
    let starAnimationAcceleration = 0.005;
    const baseAcceleration = 0.005;
    const clickBoost = 0.05;

    // --- Function Definitions ---

    async function playMusic() {
        try {
            await music.play();
            musicToggle.innerHTML = '♫';
        } catch (err) {
            console.log('Autoplay was prevented. Click the music button to start.');
            musicToggle.innerHTML = '♪';
        }
    }

    function createInitialStarfield() {
        const text = "Zen & Zen's";
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const font_size = 120, canvas_width = 1000, canvas_height = 200;

        canvas.width = canvas_width;
        canvas.height = canvas_height;
        ctx.font = `${font_size}px "Segoe Script", "Brush Script MT", cursive`;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 6;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(text, canvas_width / 2, canvas_height / 2);

        const imageData = ctx.getImageData(0, 0, canvas_width, canvas_height);
        const textPoints = [];
        for (let y = 0; y < canvas_height; y += 2) {
            for (let x = 0; x < canvas_width; x += 2) {
                if (imageData.data[(y * canvas_width + x) * 4 + 3] > 128) {
                    textPoints.push({ x: x, y: y });
                }
            }
        }

        const densityFactor = 2500;
        const totalStars = Math.floor((window.innerWidth * window.innerHeight) / densityFactor);
        const noiseStarCount = Math.floor(totalStars * 0.2);
        const textStarCount = totalStars - noiseStarCount;

        // Create text-converging stars
        for (let i = 0; i < textStarCount; i++) {
            const p = textPoints[Math.floor(Math.random() * textPoints.length)];
            if (!p) continue;

            const starEl = document.createElement('div');
            starEl.className = 'star-sm';
            const destinationX = (p.x / canvas_width) * window.innerWidth * 0.9 + window.innerWidth * 0.05 + (Math.random() - 0.5) * 5;
            const destinationY = (p.y / canvas_height) * window.innerHeight * 0.4 + window.innerHeight * 0.15 + (Math.random() - 0.5) * 5;
            const originalX = Math.random() * window.innerWidth;
            const originalY = Math.random() * window.innerHeight;

            starEl.style.left = `${originalX}px`;
            starEl.style.top = `${originalY}px`;
            backgroundStarsContainer.appendChild(starEl);

            stars.push({
                element: starEl, originalX, originalY,
                destinationX, destinationY, progress: 0
            });
        }

        // Create random noise stars
        for (let i = 0; i < noiseStarCount; i++) {
            const starEl = document.createElement('div');
            starEl.className = 'star-sm';
            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * window.innerHeight;

            starEl.style.left = `${randomX}px`;
            starEl.style.top = `${randomY}px`;
            backgroundStarsContainer.appendChild(starEl);

            stars.push({
                element: starEl,
                originalX: randomX, originalY: randomY,
                destinationX: randomX, destinationY: randomY, // Stays in place
                progress: 1 // Start in blinking mode
            });
        }
    }

    function animateStars() {
        stars.forEach(star => {
            // Handle converging stars
            if (star.progress < 1) {
                if (Math.random() < starAnimationAcceleration) {
                    star.progress = Math.min(star.progress + 0.05, 1);
                    const newX = star.originalX + (star.destinationX - star.originalX) * star.progress;
                    const newY = star.originalY + (star.destinationY - star.originalY) * star.progress;
                    const wobbleX = (Math.random() - 0.5) * 50 * (1 - star.progress);
                    const wobbleY = (Math.random() - 0.5) * 50 * (1 - star.progress);
                    star.currentX = newX + wobbleX;
                    star.currentY = newY + wobbleY;

                    star.element.style.opacity = 0;
                    setTimeout(() => {
                        star.element.style.left = `${star.currentX}px`;
                        star.element.style.top = `${star.currentY}px`;
                        star.element.style.opacity = 1;
                    }, 400);
                }
            }
            // Handle stationary, blinking stars
            else {
                if (Math.random() < 0.005) { // Small chance to twinkle
                    star.element.style.opacity = 0.2;
                    setTimeout(() => {
                        star.element.style.opacity = 1;
                    }, 300);
                }
            }
        });
        starAnimationAcceleration = Math.max(baseAcceleration, starAnimationAcceleration * 0.98);
        requestAnimationFrame(animateStars);
    }

    function createHeartFountain(x, y) {
        for (let i = 0; i < 30; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤';
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            const endX = (Math.random() - 0.5) * 200;
            const endY = -Math.random() * 200 - 50;
            heart.style.setProperty('--end-x', endX + 'px');
            heart.style.setProperty('--end-y', endY + 'px');
            heart.style.color = `hsl(${Math.random() * 20 + 340}, 100%, ${Math.random() * 25 + 50}%)`;
            heart.style.animationDuration = (Math.random() * 1 + 1) + 's';
            heart.style.fontSize = (Math.random() * 16 + 16) + 'px';
            document.body.appendChild(heart);
            heart.addEventListener('animationend', () => heart.remove());
        }
    }

    // --- Initial Calls & Event Listeners ---

    playMusic();
    createInitialStarfield();
    animateStars();

    musicToggle.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicToggle.innerHTML = '♫';
        } else {
            music.pause();
            musicToggle.innerHTML = '♪';
        }
    });

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star-sm';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        treeStarsContainer.appendChild(star);
    }

    imageUrls.forEach((url, index) => {
        if (index < photoPositions.length) {
            setTimeout(() => {
                const img = document.createElement('img');
                img.src = url;
                img.classList.add(photoPositions[index]);
                img.addEventListener('click', () => {
                    img.classList.toggle('zoomed');
                    document.body.classList.toggle('photo-zoomed');
                });
                imagesContainer.appendChild(img);
            }, (index + 1) * 800);
        }
    });

    photoOverlay.addEventListener('click', () => {
        const zoomedImg = document.querySelector('.images img.zoomed');
        if (zoomedImg) {
            zoomedImg.classList.remove('zoomed');
            document.body.classList.remove('photo-zoomed');
        }
    });

    document.addEventListener('click', (e) => {
        starAnimationAcceleration += clickBoost;
        if (document.body.classList.contains('photo-zoomed') || e.target.id === 'music-toggle' || e.target.tagName === 'IMG') return;
        createHeartFountain(e.clientX, e.clientY);
    });
});
