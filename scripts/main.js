gsap.registerPlugin(ScrollTrigger);

        document.addEventListener('DOMContentLoaded', function () {


            // === Scroll reveal animations ===
            function initScrollAnimations() {
                const createSequence = (selector, container) => {
                    const elements = document.querySelectorAll(selector);

                    const sortedElements = Array.from(elements).sort((a, b) => {
                        const aRect = a.getBoundingClientRect();
                        const bRect = b.getBoundingClientRect();
                        if (Math.abs(aRect.top - bRect.top) < 50) {
                            return aRect.left - bRect.left;
                        }
                        return aRect.top - bRect.top;
                    });

                    sortedElements.forEach((element, index) => {
                        gsap.fromTo(element,
                            {
                                y: element.classList.contains('reveal-from-bottom') ? 30 : 0,
                                x: element.classList.contains('reveal-from-left') ? -30 : element.classList.contains('reveal-from-right') ? 30 : 0,
                                opacity: 0,
                                filter: "blur(8px)"
                            },
                            {
                                y: 0,
                                x: 0,
                                opacity: 1,
                                filter: "blur(0px)",
                                duration: 0.5,
                                delay: index * 0.05,
                                ease: "power3.out",
                                scrollTrigger: {
                                    trigger: container || element,
                                    start: "top 85%",
                                    toggleActions: "play none none none"
                                }
                            }
                        );
                    });
                };

                createSequence('.reveal-from-bottom, .reveal-from-left, .reveal-from-right');
                createSequence('#features-grid-2 .magic-card', '#features-grid-2');
                createSequence('#process-grid .magic-card', '#process-grid');
                createSequence('#features-grid .bento-card', '#features-grid');
            }

            initScrollAnimations();

            // === Dashboard frame neon effect ===
            function initDashboardAnimation() {
                const dashboardFrame = document.querySelector('.dashboard-frame');
                if (!dashboardFrame) return;

                setTimeout(() => {
                    dashboardFrame.classList.add('active');
                }, 1000);

                gsap.to(dashboardFrame, {
                    boxShadow: '0 0 20px rgba(0, 104, 255, 0.4)',
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }

            initDashboardAnimation();

            // === Magic card hover effect ===
            document.querySelectorAll('.magic-card').forEach(card => {
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--x', `${x}px`);
                    card.style.setProperty('--y', `${y}px`);
                });
            });

            // === Bento card hover effect ===
            document.querySelectorAll('.bento-card').forEach(card => {
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    card.style.setProperty('--x', `${x}px`);
                    card.style.setProperty('--y', `${y}px`);

                    const opacityBase = 0.75;
                    const opacityBoost = 0.25;
                    const opacityX = x / rect.width;
                    const opacityY = 1 - (y / rect.height);
                    const diagonalPosition = (opacityX + opacityY) / 2;
                    const newOpacity = opacityBase + (diagonalPosition * opacityBoost);

                    const background = card.querySelector('.bento-card-background');
                    if (background) {
                        background.style.opacity = newOpacity.toString();
                        if (card.classList.contains('small-card')) {
                            background.style.transform = `scale(${1.05 + diagonalPosition * 0.1})`;
                        } else {
                            background.style.transform = `translateX(0px)`;
                        }
                    }
                });

                card.addEventListener('mouseleave', e => {
                    const background = card.querySelector('.bento-card-background');
                    if (background) {
                        background.style.opacity = '0.75';
                        if (card.classList.contains('small-card')) {
                            background.style.transform = 'scale(1.05)';
                        } else if (card.classList.contains('large-card')) {
                            background.style.transform = 'translateX(0)';
                        }
                    }
                });
            });

            // === Fill background images into bento cards ===
            const cards = document.querySelectorAll('.bento-card');
            cards.forEach(card => {
                const background = card.getAttribute('data-background');
                if (background) {
                    const backgroundElement = card.querySelector('.bento-card-background');
                    if (backgroundElement) {
                        backgroundElement.style.backgroundImage = background;
                    }
                }
            });

        });

    
        document.addEventListener('DOMContentLoaded', function () {
            const sliderItems = document.querySelectorAll('.slider-item');
            const sliderDots = document.querySelectorAll('.slider-dot');
            const prevButton = document.querySelector('.prev-slide');
            const nextButton = document.querySelector('.next-slide');
            const autoplayButton = document.querySelector('.slider-autoplay');
            const pauseIcon = document.querySelector('.pause-icon');
            const playIcon = document.querySelector('.play-icon');
            const progressBar = document.getElementById('progress');

            let currentIndex = 0;
            let interval;
            let isPlaying = true;
            const slideDuration = 5000; // 5 seconds per slide
            let animationStartTime;

            // Function to update progress bar
            function updateProgressBar(timestamp) {
                if (!animationStartTime) animationStartTime = timestamp;
                if (!isPlaying) return;

                const elapsed = timestamp - animationStartTime;
                const progress = Math.min(elapsed / slideDuration * 100, 100);
                progressBar.style.width = `${progress}%`;

                if (elapsed < slideDuration) {
                    requestAnimationFrame(updateProgressBar);
                } else {
                    // Move to next slide when progress is complete
                    goToNextSlide();
                }
            }

            // Function to change slide
            function changeSlide(index) {
                // Handle previous slide class
                sliderItems[currentIndex].classList.remove('active');
                sliderItems[currentIndex].classList.add('prev');

                // Remove active class from all slides and dots
                setTimeout(() => {
                    sliderItems.forEach(item => item.classList.remove('prev'));
                }, 500);

                sliderDots.forEach(dot => dot.classList.remove('active'));

                // Add active class to current slide and dot
                sliderItems[index].classList.add('active');
                sliderDots[index].classList.add('active');

                currentIndex = index;

                // Reset and start progress bar
                progressBar.style.width = '0%';
                animationStartTime = null;
                if (isPlaying) {
                    requestAnimationFrame(updateProgressBar);
                }
            }

            // Function to go to next slide
            function goToNextSlide() {
                let nextIndex = (currentIndex + 1) % sliderItems.length;
                changeSlide(nextIndex);
            }

            // Function to go to previous slide
            function goToPrevSlide() {
                let prevIndex = (currentIndex - 1 + sliderItems.length) % sliderItems.length;
                changeSlide(prevIndex);
            }

            // Start automatic slideshow
            function startSlideshow() {
                isPlaying = true;
                pauseIcon.style.display = 'block';
                playIcon.style.display = 'none';
                requestAnimationFrame(updateProgressBar);
            }

            // Pause slideshow
            function pauseSlideshow() {
                isPlaying = false;
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'block';
            }

            // Add click event to dots
            sliderDots.forEach(dot => {
                dot.addEventListener('click', function () {
                    const index = parseInt(this.getAttribute('data-index'));
                    changeSlide(index);
                });
            });

            // Add click event to prev button
            prevButton.addEventListener('click', function () {
                goToPrevSlide();
            });

            // Add click event to next button
            nextButton.addEventListener('click', function () {
                goToNextSlide();
            });

            // Add click event to autoplay button
            autoplayButton.addEventListener('click', function () {
                if (isPlaying) {
                    pauseSlideshow();
                } else {
                    startSlideshow();
                }
            });

            // Add keyboard navigation
            document.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowLeft') {
                    goToPrevSlide();
                } else if (e.key === 'ArrowRight') {
                    goToNextSlide();
                } else if (e.key === ' ') {
                    // Space bar toggles play/pause
                    if (isPlaying) {
                        pauseSlideshow();
                    } else {
                        startSlideshow();
                    }
                    e.preventDefault(); // Prevent page scrolling on space
                }
            });

            // Add touch support
            let touchStartX = 0;
            let touchEndX = 0;

            const slider = document.querySelector('.feature-slider');

            slider.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            slider.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left, go to next slide
                    goToNextSlide();
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right, go to previous slide
                    goToPrevSlide();
                }
            }

            // Start the slideshow
            startSlideshow();

            // Pause slideshow when tab is not visible
            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    pauseSlideshow();
                } else if (!document.hidden && isPlaying) {
                    startSlideshow();
                }
            });
        });
    
        document.addEventListener('DOMContentLoaded', function () {
            const sliderItems = document.querySelectorAll('.slider-item');
            const sliderDots = document.querySelectorAll('.slider-dot');
            const prevButton = document.querySelector('.prev-slide');
            const nextButton = document.querySelector('.next-slide');
            const autoplayButton = document.querySelector('.slider-autoplay');
            const pauseIcon = document.querySelector('.pause-icon');
            const playIcon = document.querySelector('.play-icon');
            const progressBar = document.getElementById('progress');

            let currentIndex = 0;
            let isPlaying = true;
            const slideDuration = 5000;
            let animationStartTime;

            function updateProgressBar(timestamp) {
                if (!animationStartTime) animationStartTime = timestamp;
                if (!isPlaying) return;

                const elapsed = timestamp - animationStartTime;
                const progress = Math.min(elapsed / slideDuration * 100, 100);
                progressBar.style.width = `${progress}%`;

                if (elapsed < slideDuration) {
                    requestAnimationFrame(updateProgressBar);
                } else {
                    goToNextSlide();
                }
            }

            function changeSlide(index) {
                const isMobile = window.innerWidth <= 992;
                sliderItems[currentIndex].classList.remove('active');
                if (!isMobile) {
                    sliderItems[currentIndex].classList.add('prev');
                }
                setTimeout(() => {
                    sliderItems.forEach(item => item.classList.remove('prev'));
                }, 500);

                sliderDots.forEach(dot => dot.classList.remove('active'));
                sliderItems[index].classList.add('active');
                sliderDots[index].classList.add('active');

                currentIndex = index;
                progressBar.style.width = '0%';
                animationStartTime = null;
                if (isPlaying) requestAnimationFrame(updateProgressBar);
            }

            function goToNextSlide() {
                let nextIndex = (currentIndex + 1) % sliderItems.length;
                changeSlide(nextIndex);
            }

            function goToPrevSlide() {
                let prevIndex = (currentIndex - 1 + sliderItems.length) % sliderItems.length;
                changeSlide(prevIndex);
            }

            function startSlideshow() {
                isPlaying = true;
                pauseIcon.style.display = 'block';
                playIcon.style.display = 'none';
                requestAnimationFrame(updateProgressBar);
            }

            function pauseSlideshow() {
                isPlaying = false;
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'block';
            }

            sliderDots.forEach(dot => {
                dot.addEventListener('click', function () {
                    const index = parseInt(this.getAttribute('data-index'));
                    changeSlide(index);
                });
            });

            prevButton.addEventListener('click', goToPrevSlide);
            nextButton.addEventListener('click', goToNextSlide);

            autoplayButton.addEventListener('click', function () {
                if (isPlaying) {
                    pauseSlideshow();
                } else {
                    startSlideshow();
                }
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowLeft') goToPrevSlide();
                else if (e.key === 'ArrowRight') goToNextSlide();
                else if (e.key === ' ') {
                    if (isPlaying) pauseSlideshow();
                    else startSlideshow();
                    e.preventDefault();
                }
            });

            let touchStartX = 0;
            let touchEndX = 0;
            const slider = document.querySelector('.feature-slider');

            slider.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            slider.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold) goToNextSlide();
                else if (touchEndX > touchStartX + swipeThreshold) goToPrevSlide();
            }

            function handleResize() {
                if (window.innerWidth <= 992) {
                    document.querySelector('.slider-container').style.height = 'auto';
                }
            }

            window.addEventListener('resize', handleResize);
            handleResize();

            startSlideshow();

            document.addEventListener('visibilitychange', function () {
                if (document.hidden) pauseSlideshow();
                else if (!document.hidden && isPlaying) startSlideshow();
            });
        });
    
        document.addEventListener('DOMContentLoaded', function () {
            const modal = document.getElementById('signupModal');
            const openBtn = document.getElementById('openModalBtn');
            const closeBtn = modal.querySelector('.close-modal');

            openBtn?.addEventListener('click', () => {
                modal.classList.add('show');
            });

            closeBtn?.addEventListener('click', () => {
                modal.classList.remove('show');
            });

            // Optional: close when clicking outside modal content
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    
	// <![CDATA[  <-- For SVG support
	if ('WebSocket' in window) {
		(function () {
			function refreshCSS() {
				var sheets = [].slice.call(document.getElementsByTagName("link"));
				var head = document.getElementsByTagName("head")[0];
				for (var i = 0; i < sheets.length; ++i) {
					var elem = sheets[i];
					var parent = elem.parentElement || head;
					parent.removeChild(elem);
					var rel = elem.rel;
					if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
						var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
						elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
					}
					parent.appendChild(elem);
				}
			}
			var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
			var address = protocol + window.location.host + window.location.pathname + '/ws';
			var socket = new WebSocket(address);
			socket.onmessage = function (msg) {
				if (msg.data == 'reload') window.location.reload();
				else if (msg.data == 'refreshcss') refreshCSS();
			};
			if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
				console.log('Live reload enabled.');
				sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
			}
		})();
	}
	else {
		console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
	}
	// ]]>