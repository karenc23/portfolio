document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       THEME TOGGLE
       ========================================================================== */
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;

    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    themeBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* ==========================================================================
       MOBILE NAVIGATION MENU
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-active');
        // Toggle icon between menu and close
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('mobile-active')) {
            icon.setAttribute('data-lucide', 'x');
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '80px';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.background = 'var(--bg-secondary)';
            navMenu.style.padding = '20px';
            navMenu.style.borderBottom = '1px solid var(--border-color)';
        } else {
            icon.setAttribute('data-lucide', 'menu');
            navMenu.removeAttribute('style');
        }
        lucide.createIcons();
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('mobile-active')) {
                navMenu.classList.remove('mobile-active');
                mobileToggle.querySelector('i').setAttribute('data-lucide', 'menu');
                navMenu.removeAttribute('style');
                lucide.createIcons();
            }
        });
    });

    /* ==========================================================================
       SCROLL NAV HIGHLIGHTER (INTERSECTION OBSERVER)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    /* ==========================================================================
       HERO TYPING ANIMATION
       ========================================================================== */
    const typingSpan = document.getElementById('typing-text');
    const professions = [
        "Cybersecurity Intern",
        "ML/AI Developer",
        "Penn State CS Major",
        "UI/UX Designer"
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = professions[wordIdx];
        
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50;
        } else {
            typingSpan.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % professions.length;
            typingSpeed = 500; // Pause before typing new word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    if (typingSpan) {
        typeEffect();
    }

    /* ==========================================================================
       BENTO GRID: PREPPR WEBCAM SIMULATION & PERSONA TOGGLE
       ========================================================================== */
    const webcamSim = document.getElementById('bento-webcam-sim');
    const bbox = document.getElementById('bbox');
    const viewport = document.querySelector('.webcam-viewport');
    
    // Telemetry Progress Bars
    const eyeBar = document.getElementById('tele-eye');
    const confBar = document.getElementById('tele-conf');
    const happyBar = document.getElementById('tele-happy');
    const eyeVal = document.getElementById('tele-eye-val');
    const confVal = document.getElementById('tele-conf-val');
    const happyVal = document.getElementById('tele-happy-val');

    // Default target metrics
    let targetMetrics = { eye: 94, conf: 88, happy: 76 };
    let currentMetrics = { eye: 94, conf: 88, happy: 76 };

    // Interactive Face Bounding Box mouse tracking
    if (viewport && bbox) {
        viewport.addEventListener('mousemove', (e) => {
            const rect = viewport.getBoundingClientRect();
            // Calculate cursor relative position in percentage
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // Map and limit translation bounds so box stays in webcam
            const targetX = Math.max(10, Math.min(x - 20, 70));
            const targetY = Math.max(10, Math.min(y - 35, 50));

            bbox.style.left = `${targetX}%`;
            bbox.style.top = `${targetY}%`;
            
            // Slightly fluctuate values on movement
            targetMetrics.eye = Math.min(100, Math.max(80, targetMetrics.eye + Math.floor(Math.random() * 3) - 1));
            targetMetrics.conf = Math.min(100, Math.max(75, targetMetrics.conf + Math.floor(Math.random() * 3) - 1));
        });

        viewport.addEventListener('mouseleave', () => {
            // Recenter bounding box
            bbox.style.left = 'calc(50% - 70px)';
            bbox.style.top = 'calc(50% - 100px)';
        });
    }

    // Smoothly animate metrics telemetry
    setInterval(() => {
        // Add tiny random fluctuation for active feedback
        const eyeOffset = Math.floor(Math.random() * 5) - 2;
        const confOffset = Math.floor(Math.random() * 5) - 2;
        const happyOffset = Math.floor(Math.random() * 5) - 2;

        const currentTargetEye = Math.max(10, Math.min(100, targetMetrics.eye + eyeOffset));
        const currentTargetConf = Math.max(10, Math.min(100, targetMetrics.conf + confOffset));
        const currentTargetHappy = Math.max(10, Math.min(100, targetMetrics.happy + happyOffset));

        // Smooth linear interpolation (lerp)
        currentMetrics.eye += (currentTargetEye - currentMetrics.eye) * 0.15;
        currentMetrics.conf += (currentTargetConf - currentMetrics.conf) * 0.15;
        currentMetrics.happy += (currentTargetHappy - currentMetrics.happy) * 0.15;

        // Render bars
        if (eyeBar) {
            eyeBar.style.width = `${currentMetrics.eye}%`;
            eyeVal.textContent = `${Math.round(currentMetrics.eye)}%`;
        }
        if (confBar) {
            confBar.style.width = `${currentMetrics.conf}%`;
            confVal.textContent = `${Math.round(currentMetrics.conf)}%`;
        }
        if (happyBar) {
            happyBar.style.width = `${currentMetrics.happy}%`;
            happyVal.textContent = `${Math.round(currentMetrics.happy)}%`;
        }
    }, 100);

    // Persona Toggle logic
    const personaBtns = document.querySelectorAll('.persona-btn');
    const personaQuote = document.getElementById('persona-quote');

    const personaData = {
        friendly: {
            quote: '"Tell me about a time you solved a complex teamwork issue."',
            metrics: { eye: 95, conf: 85, happy: 92 }
        },
        tough: {
            quote: '"Why should we hire you over candidates with double your experience?"',
            metrics: { eye: 98, conf: 72, happy: 25 }
        },
        architect: {
            quote: '"How would you design a distributed rate limiter for a multi-tenant API?"',
            metrics: { eye: 90, conf: 95, happy: 60 }
        }
    };

    personaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            personaBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedPersona = btn.getAttribute('data-persona');
            const data = personaData[selectedPersona];

            if (personaQuote && data) {
                // Animate quote switch
                personaQuote.style.opacity = '0';
                setTimeout(() => {
                    personaQuote.textContent = data.quote;
                    personaQuote.style.opacity = '1';
                }, 150);

                // Update targets
                targetMetrics.eye = data.metrics.eye;
                targetMetrics.conf = data.metrics.conf;
                targetMetrics.happy = data.metrics.happy;
            }
        });
    });

    /* ==========================================================================
       COUNTDOWN WIDGET
       ========================================================================== */
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');

    // Target a mock countdown: 2 days, 14 hours, 45 mins from session start
    let targetCountdownTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (45 * 60 * 1000);

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetCountdownTime - now;

        if (difference < 0) {
            // Reset to maintain dynamic look if completed
            targetCountdownTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    }

    if (daysEl) {
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    /* ==========================================================================
       CONTACT FORM VALIDATION & SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('contact-success');
    const resetSuccessBtn = document.getElementById('success-reset');

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const msgInput = document.getElementById('form-message');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function checkField(input, validationFn, errorElId) {
        const isValid = validationFn(input.value.trim());
        const group = input.parentElement;
        if (!isValid) {
            group.classList.add('invalid');
            return false;
        } else {
            group.classList.remove('invalid');
            return true;
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = checkField(nameInput, val => val.length > 0, 'name-error');
            const isEmailValid = checkField(emailInput, validateEmail, 'email-error');
            const isMsgValid = checkField(msgInput, val => val.length > 0, 'message-error');

            if (isNameValid && isEmailValid && isMsgValid) {
                // Simulate successful form submit
                contactForm.style.opacity = '0';
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    successMsg.style.display = 'flex';
                    setTimeout(() => {
                        successMsg.classList.add('active');
                    }, 50);
                }, 300);
            }
        });

        // Input listeners to clear errors on typing
        nameInput.addEventListener('input', () => nameInput.parentElement.classList.remove('invalid'));
        emailInput.addEventListener('input', () => emailInput.parentElement.classList.remove('invalid'));
        msgInput.addEventListener('input', () => msgInput.parentElement.classList.remove('invalid'));

        // Reset success state
        resetSuccessBtn.addEventListener('click', () => {
            successMsg.classList.remove('active');
            setTimeout(() => {
                successMsg.style.display = 'none';
                contactForm.style.display = 'flex';
                setTimeout(() => {
                    contactForm.style.opacity = '1';
                    contactForm.reset();
                }, 50);
            }, 300);
        });
    }

    /* ==========================================================================
       INTERACTIVE PORTFOLIO CLI / TERMINAL
       ========================================================================== */
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    // Terminal Commands Dataset
    const commands = {
        help: 'Available commands:\n' +
              '  <span class="term-highlight">about</span>      - Quick introduction bio\n' +
              '  <span class="term-highlight">skills</span>     - Technical capabilities table\n' +
              '  <span class="term-highlight">experience</span> - Professional history & roles\n' +
              '  <span class="term-highlight">hackpsu</span>    - Spotlight on Preppr project details\n' +
              '  <span class="term-highlight">contact</span>    - Available touchpoints and socials\n' +
              '  <span class="term-highlight">secret</span>     - Access classified information\n' +
              '  <span class="term-highlight">clear</span>      - Clean console window',
        
        about: 'Bio:\n' +
               '  Name: Karen Chhangani\n' +
               '  Education: Bachelor of Science in Computer Science\n' +
               '  Institution: The Pennsylvania State University (Class of 2028)\n' +
               '  GPA: 3.76 (Dean\'s List)\n' +
               '  Focus: Systems, Cybersecurity engineering, and AI interfaces.',
        
        skills: 'Technical Skills Matrix:\n' +
                '  =======================================================\n' +
                '  Languages  :: Java, Python, C++, TypeScript, SQL, HTML/CSS\n' +
                '  Security   :: Crowdstrike, SIEM, Wireshark, Metasploit, Mimecast\n' +
                '  Frameworks :: React, SolidJS, Bootstrap, PyTorch, NumPy\n' +
                '  Platforms  :: Docker, Git, RESTful APIs, Flutter, H2 database\n' +
                '  =======================================================',

        experience: 'Professional Timeline:\n' +
                    '  1. Cybersecurity Intern @ Amsys IT Solutions (Jun 2025 - Present)\n' +
                    '     - Investigated phishing header routes and anomalies with Mimecast.\n' +
                    '     - Monitored SOC logs via SIEM/EDR, responding to threat events.\n' +
                    '  2. Research Assistant @ Penn State Computer Science (Nov 2025 - Present)\n' +
                    '     - Analyzing student metacognitive strategies in pair-programming with LLMs.\n' +
                    '  3. Volunteer Assistant @ Nanhi Pari Foundation (India, Summer 2024)\n' +
                    '     - Coordinated orphan education and wellness camps.',

        hackpsu: 'Project "Preppr" at HackPSU:\n' +
                 '  - Concept: Real-time candidate evaluation simulator powered by AI.\n' +
                 '  - Backend: Gemini API and ElevenLabs synthetic presence engines.\n' +
                 '  - Function: Webcam face coordinate analysis for eye-contact and mood ratings.\n' +
                 '  - Contribution: Sketched wireframes, designed CSS layouts, project scheduler.',

        contact: 'Contact Info:\n' +
                 '  - Email    :: karen.chhangani@psu.edu\n' +
                 '  - LinkedIn :: linkedin.com/in/karenchhangani\n' +
                 '  - GitHub   :: github.com/karenchhangani\n' +
                 '  - Location :: State College, PA (Open to Relocation)',

        secret: 'Accessing classified sub-routing... \n' +
                '====================================================\n' +
                '🦁 [WE ARE PENN STATE] 🦁 \n' +
                'Nittany Lions authentication verified. Keep coding and secure the core!\n' +
                '===================================================='
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawInput = terminalInput.value;
                const cmd = rawInput.trim().toLowerCase();
                
                // Append command line typed
                const cmdLine = document.createElement('div');
                cmdLine.className = 'terminal-line command-line';
                cmdLine.innerHTML = `<span class="terminal-prompt">karen@shell:~$</span> ${rawInput}`;
                terminalOutput.appendChild(cmdLine);

                // Add response
                if (cmd.length > 0) {
                    if (cmd === 'clear') {
                        terminalOutput.innerHTML = '';
                    } else if (commands.hasOwnProperty(cmd)) {
                        const responseLine = document.createElement('div');
                        responseLine.className = 'terminal-line response-line';
                        responseLine.innerHTML = commands[cmd];
                        terminalOutput.appendChild(responseLine);
                    } else {
                        const errorLine = document.createElement('div');
                        errorLine.className = 'terminal-line error-line';
                        errorLine.textContent = `Command not found: ${cmd}. Type 'help' for suggestions.`;
                        terminalOutput.appendChild(errorLine);
                    }
                }

                // Reset input and scroll to bottom
                terminalInput.value = '';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        });

        // Ensure clicking the terminal body focuses the input
        const termContainer = document.getElementById('terminal-main');
        if (termContainer) {
            termContainer.addEventListener('click', () => {
                terminalInput.focus();
            });
        }
    }
});
