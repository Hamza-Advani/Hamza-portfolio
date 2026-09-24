/**
 * MUHAMMAD HAMZA - STUDENT PORTFOLIO CORE SCRIPTS
 * Features: Dark/Light Mode, Sticky Navbar, Scroll Spy, Mobile Drawer,
 * Dynamic Typewriter, Terminal Tabs, Interactive Project/Skills Filter,
 * Resume & Project Modals, Copy-to-Clipboard, and Toast Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons if available
    const refreshIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    };
    refreshIcons();

    /* ==========================================================================
       1. Dark / Light Mode Theme Engine
       ========================================================================== */
    const root = document.documentElement;
    const desktopThemeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const themeLabelText = document.getElementById('theme-label-text');

    // Retrieve saved preference or system preference
    const getPreferredTheme = () => {
        const saved = localStorage.getItem('mh_portfolio_theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const setTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('mh_portfolio_theme', theme);

        if (themeLabelText) {
            themeLabelText.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
        }

        refreshIcons();
    };

    // Initialize Theme
    const currentTheme = getPreferredTheme();
    setTheme(currentTheme);

    const toggleTheme = () => {
        const activeTheme = root.getAttribute('data-theme') || 'dark';
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    };

    if (desktopThemeToggle) desktopThemeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

    /* ==========================================================================
       2. Sticky Navigation Bar & Scroll Spy
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links .mobile-link');
    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.getElementById('back-to-top');

    const handleScroll = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar appearance
        if (scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Scroll Spy active navigation indicator
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });

            mobileLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       3. Mobile Navigation Drawer
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileClose = document.getElementById('mobile-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBackdrop = document.getElementById('mobile-menu-backdrop');

    const openMobileMenu = () => {
        mobileMenu.classList.add('open');
        mobileBackdrop.classList.add('open');
        mobileToggle.classList.add('is-active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        mobileMenu.classList.remove('open');
        mobileBackdrop.classList.remove('open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

    // Close mobile menu when clicking any nav link
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    /* ==========================================================================
       4. Hero Dynamic Typewriter Effect
       ========================================================================== */
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const phrases = [
            "BSCS Student @ GU Tech",
            "C++ & Python Developer",
            "Data Structures & OOP Explorer",
            "Algorithmic Problem Solver"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        const typeLoop = () => {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Pause at end of phrase
                isDeleting = true;
                typeSpeed = 1800;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(typeLoop, typeSpeed);
        };

        setTimeout(typeLoop, 600);
    }

    /* ==========================================================================
       5. Interactive Cyber Terminal Tabs
       ========================================================================== */
    const terminalTabs = document.querySelectorAll('.term-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');

    terminalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            terminalTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane-${targetTab}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    /* ==========================================================================
       6. Interactive Skills Catalog Filtering
       ========================================================================== */
    const skillFilters = document.querySelectorAll('.filter-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    skillFilters.forEach(button => {
        button.addEventListener('click', () => {
            skillFilters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    /* ==========================================================================
       7. Interactive Projects Filtering
       ========================================================================== */
    const projectFilters = document.querySelectorAll('.proj-tab');
    const projectCards = document.querySelectorAll('.project-card');

    projectFilters.forEach(button => {
        button.addEventListener('click', () => {
            projectFilters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    /* ==========================================================================
       8. Project Details Modal Content & Handling
       ========================================================================== */
    const projectModal = document.getElementById('project-modal');
    const projectModalTitle = document.getElementById('project-modal-title');
    const projectModalSubtitle = document.getElementById('project-modal-subtitle');
    const projectModalContent = document.getElementById('project-modal-content');
    const closeProjectModal = document.getElementById('close-project-modal');

    const projectData = {
        algoverse: {
            title: "Algoverse - Algorithm Visualizer & Benchmarker",
            subtitle: "C++20 & Data Structures Engine",
            content: `
                <div class="project-modal-details">
                    <p><strong>Overview:</strong> Algoverse is an analytical suite engineered in modern C++ to demonstrate the execution steps, memory allocations, and time complexities of fundamental algorithms.</p>
                    <h4 style="margin: 1rem 0 0.5rem; color: var(--accent-cyan);">Key Engineering Highlights:</h4>
                    <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
                        <li>Step-by-step state tracking for QuickSort, MergeSort, HeapSort, and Binary Search.</li>
                        <li>Graph traversal implementations (BFS, DFS, Dijkstra's shortest path) with dynamic adjacency lists.</li>
                        <li>High-resolution benchmarking utility measuring CPU cycles and memory cache overhead.</li>
                        <li>Demonstrates strict memory safety, pointer mechanics, and standard template library (STL) usage.</li>
                    </ul>
                    <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                        <a href="https://github.com/Hamza-Advani" target="_blank" class="btn btn-primary btn-sm"><i data-lucide="github"></i> View Repository</a>
                    </div>
                </div>
            `
        },
        pytrend: {
            title: "PyTrend - Automated Web Intelligence Scraper",
            subtitle: "Python 3 & Data Pipeline",
            content: `
                <div class="project-modal-details">
                    <p><strong>Overview:</strong> PyTrend is a resilient automation tool developed to crawl web sources, extract unstructured pricing or technology index metrics, and serialize structured records for downstream analysis.</p>
                    <h4 style="margin: 1rem 0 0.5rem; color: var(--accent-cyan);">Key Engineering Highlights:</h4>
                    <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
                        <li>Multi-threaded fetching using Python <code>requests</code> and HTML parsing with <code>BeautifulSoup4</code>.</li>
                        <li>Robust error handling, exponential backoff retries, and header rotation to avoid rate limits.</li>
                        <li>Automated data cleaning and serialization into structured CSV, JSON, and SQLite schemas.</li>
                        <li>Command-line interface with customizable query parameters and progress visualizers.</li>
                    </ul>
                    <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                        <a href="https://github.com/Hamza-Advani" target="_blank" class="btn btn-primary btn-sm"><i data-lucide="github"></i> View Repository</a>
                    </div>
                </div>
            `
        },
        omnibank: {
            title: "OmniBank - Core Banking Management System",
            subtitle: "C++ & Object-Oriented Architecture",
            content: `
                <div class="project-modal-details">
                    <p><strong>Overview:</strong> OmniBank simulates an enterprise-level banking application applying pure Object-Oriented Programming (OOP) paradigms in C++.</p>
                    <h4 style="margin: 1rem 0 0.5rem; color: var(--accent-cyan);">Key Engineering Highlights:</h4>
                    <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
                        <li>Polymorphic account hierarchy: Base <code>BankAccount</code> with derived <code>SavingsAccount</code>, <code>CheckingAccount</code>, and <code>LoanAccount</code>.</li>
                        <li>Encapsulated transaction ledger preventing unauthorized balance mutations.</li>
                        <li>Persistent file storage with XOR record obfuscation and checksum validation for data integrity.</li>
                        <li>Role-based authentication dividing client transactions from administrative auditing.</li>
                    </ul>
                    <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                        <a href="https://github.com/Hamza-Advani" target="_blank" class="btn btn-primary btn-sm"><i data-lucide="github"></i> View Repository</a>
                    </div>
                </div>
            `
        },
        nexus: {
            title: "Nexus Portfolio - Technology-Inspired Platform",
            subtitle: "HTML5, Vanilla CSS & Modern JavaScript",
            content: `
                <div class="project-modal-details">
                    <p><strong>Overview:</strong> Nexus Portfolio is the high-performance digital presence of Muhammad Hamza, crafted with semantic HTML5, Vanilla CSS custom properties, and modern modular JavaScript without external bloated frameworks.</p>
                    <h4 style="margin: 1rem 0 0.5rem; color: var(--accent-cyan);">Key Engineering Highlights:</h4>
                    <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
                        <li>Persistent dark & light theme system integrated with <code>localStorage</code>.</li>
                        <li>Hardware-accelerated glassmorphism UI with responsive sticky navigation and mobile drawer.</li>
                        <li>Interactive simulated code console with real-time tabs and custom syntax highlighting.</li>
                        <li>Accessible modal dialogs, copy-to-clipboard utilities, and live form validation.</li>
                    </ul>
                    <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                        <a href="https://github.com/Hamza-Advani" target="_blank" class="btn btn-primary btn-sm"><i data-lucide="github"></i> View Repository</a>
                    </div>
                </div>
            `
        }
    };

    const projectTriggers = document.querySelectorAll('.project-modal-trigger');
    projectTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            const data = projectData[projectId];
            if (data && projectModal) {
                projectModalTitle.textContent = data.title;
                projectModalSubtitle.textContent = data.subtitle;
                projectModalContent.innerHTML = data.content;
                projectModal.classList.add('open');
                projectModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                refreshIcons();
            }
        });
    });

    if (closeProjectModal) {
        closeProjectModal.addEventListener('click', () => {
            projectModal.classList.remove('open');
            projectModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('open');
                projectModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }

    /* ==========================================================================
       9. Resume Modal Handling
       ========================================================================== */
    const resumeModal = document.getElementById('resume-modal');
    const openResumeButtons = document.querySelectorAll('.open-resume-btn');
    const closeResumeModal = document.getElementById('close-resume-modal');
    const printResumeBtn = document.getElementById('print-resume-btn');

    const openResume = () => {
        if (resumeModal) {
            resumeModal.classList.add('open');
            resumeModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            }
            refreshIcons();
        }
    };

    const closeResume = () => {
        if (resumeModal) {
            resumeModal.classList.remove('open');
            resumeModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    openResumeButtons.forEach(btn => {
        btn.addEventListener('click', openResume);
    });

    if (closeResumeModal) closeResumeModal.addEventListener('click', closeResume);

    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                closeResume();
            }
        });
    }

    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', () => {
            window.print();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (resumeModal && resumeModal.classList.contains('open')) closeResume();
            if (projectModal && projectModal.classList.contains('open')) {
                projectModal.classList.remove('open');
                projectModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        }
    });

    /* ==========================================================================
       10. Copy-to-Clipboard Utility & Toast Notifications
       ========================================================================== */
    const copyEmailButtons = document.querySelectorAll('.copy-email-btn');

    copyEmailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = btn.getAttribute('data-email') || 'hamzaadvani2006@gmail.com';
            
            navigator.clipboard.writeText(email).then(() => {
                const textSpan = btn.querySelector('.copy-text');
                const origText = textSpan ? textSpan.textContent : '';
                if (textSpan) textSpan.textContent = 'Copied!';

                showToast(`Email copied: ${email}`, 'success');

                setTimeout(() => {
                    if (textSpan) textSpan.textContent = origText;
                }, 2500);
            }).catch(() => {
                showToast(`Email: ${email}`, 'info');
            });
        });
    });

    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const iconName = type === 'success' ? 'check-circle' : 'info';
        toast.innerHTML = `
            <i data-lucide="${iconName}" class="toast-icon"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);
        refreshIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3200);
    }

    /* ==========================================================================
       11. Interactive Contact Form with Validation & Feedback
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const messageField = document.getElementById('form-message');
    const charCounter = document.getElementById('char-counter');
    const submitBtn = document.getElementById('form-submit-btn');

    if (messageField && charCounter) {
        messageField.addEventListener('input', () => {
            const len = messageField.value.length;
            charCounter.textContent = `${len} / 500`;
            if (len >= 480) {
                charCounter.style.color = 'var(--accent-rose)';
            } else {
                charCounter.style.color = 'var(--text-muted)';
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');

            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const messageError = document.getElementById('message-error');

            let isValid = true;

            // Reset errors
            if (nameError) nameError.textContent = '';
            if (emailError) emailError.textContent = '';
            if (messageError) messageError.textContent = '';

            // Validate Name
            if (!nameInput.value.trim()) {
                if (nameError) nameError.textContent = 'Please enter your name.';
                isValid = false;
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                if (emailError) emailError.textContent = 'Please enter a valid email address.';
                isValid = false;
            }

            // Validate Message
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                if (messageError) messageError.textContent = 'Message must be at least 10 characters.';
                isValid = false;
            }

            if (!isValid) return;

            // Simulate form submission
            if (submitBtn) submitBtn.classList.add('loading');

            setTimeout(() => {
                if (submitBtn) submitBtn.classList.remove('loading');
                showToast(`Thank you, ${nameInput.value.trim()}! Your message has been received.`, 'success');
                contactForm.reset();
                if (charCounter) charCounter.textContent = '0 / 500';
            }, 1200);
        });
    }

    /* ==========================================================================
       12. IntersectionObserver Scroll Reveal Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }
});
