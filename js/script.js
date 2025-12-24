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

    // Generate background stars
    for (let i = 0; i < 300; i++) { // More stars for full screen
        const star = document.createElement('div');
        star.className = 'star-sm';
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        backgroundStarsContainer.appendChild(star);
    }

    // Generate stars on the tree
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star-sm';
        const x = Math.random() * 100; // Position as a percentage
        const y = Math.random() * 100; // Position as a percentage
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