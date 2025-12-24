document.addEventListener('DOMContentLoaded', () => {
    const imagesContainer = document.querySelector('.images');
    const treeStarsContainer = document.querySelector('.stars'); // Renamed for clarity
    const backgroundStarsContainer = document.getElementById('background-stars-container'); // New container
    const music = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    
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

    // Music playback
    musicToggle.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicToggle.innerHTML = '♫';
        } else {
            music.pause();
            musicToggle.innerHTML = '♪';
        }
    });

    // Handle looping programmatically
    music.addEventListener('ended', () => {
        music.currentTime = 0;
        music.play();
    });

    // Attempt to autoplay, will likely require user interaction first
    async function playMusic() {
        try {
            await music.play();
            musicToggle.innerHTML = '♫';
        } catch(err) {
            console.log('Autoplay was prevented. Click the music button to start.');
            musicToggle.innerHTML = '♪'; // Show paused state
        }
    }

    playMusic();

    const stars = []; // Array to hold all star objects

    // 1. Generate the initial star positions from text
    function createInitialStarfield() {
        const text = "Zen & Zen's";
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const font_size = 120;
        const canvas_width = 1000;
        const canvas_height = 200;

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
        for (let y = 0; y < canvas_height; y += 2) { // Denser scan
            for (let x = 0; x < canvas_width; x += 2) {
                if (imageData.data[(y * canvas_width + x) * 4 + 3] > 128) {
                    textPoints.push({ x: x, y: y });
                }
            }
        }
        
        // Create star objects that will converge into the text shape
        const densityFactor = 2500;
        const totalStars = Math.floor((window.innerWidth * window.innerHeight) / densityFactor);

        for (let i = 0; i < totalStars; i++) {
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
                element: starEl,
                originalX: originalX,
                originalY: originalY,
                currentX: originalX,
                currentY: originalY,
                destinationX: destinationX,
                destinationY: destinationY,
                progress: 0 // 0 = random, 1 = on text
            });
        }
    }

    // 2. Animate the stars dispersing over time
    function animateStars() {
        stars.forEach(star => {
            // On a random chance, update a star's position
            if (Math.random() < 0.01 && star.progress < 1) {
                
                star.progress = Math.min(star.progress + 0.05, 1); // Increment progress slowly

                // Interpolate position based on progress
                const newX = star.originalX + (star.destinationX - star.originalX) * star.progress;
                const newY = star.originalY + (star.destinationY - star.originalY) * star.progress;

                // Add some wobble to the path
                const wobbleX = (Math.random() - 0.5) * 50 * star.progress;
                const wobbleY = (Math.random() - 0.5) * 50 * star.progress;

                star.currentX = newX + wobbleX;
                star.currentY = newY + wobbleY;

                // "Blink" effect by hiding, moving, and showing
                star.element.style.opacity = 0;
                setTimeout(() => {
                    star.element.style.left = `${star.currentX}px`;
                    star.element.style.top = `${star.currentY}px`;
                    star.element.style.opacity = 1;
                }, 400); // Wait for fade out before moving and fading in
            }
        });

        requestAnimationFrame(animateStars); // Loop
    }

    // Start the process
    createInitialStarfield();
    animateStars();

    // Generate stars on the tree (this remains static)
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star-sm';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        treeStarsContainer.appendChild(star);
    }

    // Image generation
    const photoPositions = [
        'photo-t1-right', 'photo-t1-left',
        'photo-t2-right', 'photo-t2-left',
        'photo-t3-right', 'photo-t3-left',
        'photo-t4-right', 'photo-t4-left',
        'photo-t5-right', 'photo-t5-left'
    ];

    const photoOverlay = document.getElementById('photo-overlay');

    imageUrls.forEach((url, index) => {
        // Ensure we don't go out of bounds for photoPositions
        if (index < photoPositions.length) {
            setTimeout(() => {
                const img = document.createElement('img');
                img.src = url;
                
                // Add the specific position class
                img.classList.add(photoPositions[index]);

                // Add click listener for zoom
                img.addEventListener('click', () => {
                    img.classList.toggle('zoomed');
                    document.body.classList.toggle('photo-zoomed');
                });
                
                imagesContainer.appendChild(img);

            }, (index + 1) * 800); // Stagger the appearance
        }
    });

    // Add click listener to overlay to close zoomed image
    photoOverlay.addEventListener('click', () => {
        const zoomedImg = document.querySelector('.images img.zoomed');
        if (zoomedImg) {
            zoomedImg.classList.remove('zoomed');
            document.body.classList.remove('photo-zoomed');
        }
    });
});