/**
 * Credits Modal — single source of truth for all pages.
 * Injects the modal HTML into the DOM and wires up open/close behaviour.
 */
(function () {
    'use strict';

    /* ------------------------------------------------------------------ */
    /*  Modal HTML                                                         */
    /* ------------------------------------------------------------------ */
    const html = `
    <div class="modal-overlay" id="credits-modal">
        <div class="modal modal--credits">
            <div class="modal-header">
                <h3 data-i18n="credits.title">About & Credits</h3>
                <button class="modal-close" aria-label="Close" id="credits-modal-close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body">
                <!-- Author Section -->
                <div class="credits-section">
                    <h4 class="credits-section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span data-i18n="credits.author">Author</span>
                    </h4>
                    <div class="credits-author">
                        <div class="author-avatar">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div class="author-info">
                            <div class="author-name">Ricardo Montañana Gómez</div>
                            <div class="author-role" data-i18n="credits.role">Researcher & Developer</div>
                            <div class="author-links">
                                <a href="https://orcid.org/0000-0003-3242-5452" class="author-link" target="_blank" rel="noopener" aria-label="ORCID">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.422.947.947s-.422.947-.947.947a.946.946 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 2.941h1.444v10.041H6.647V7.319zm11.75 4.547c0 2.944-1.631 4.416-4.238 4.416H11.53V7.319h2.894c2.516 0 4.144 1.419 4.144 3.962l.001.585zm-1.222 0c0-1.928-.994-2.859-2.831-2.859h-1.656v5.825h1.569c1.884 0 2.919-.947 2.919-2.859l-.001-.107z"/>
                                    </svg>
                                </a>
                                <a href="https://github.com/rmontanana" class="author-link" target="_blank" rel="noopener" aria-label="GitHub">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tech Stack Section -->
                <div class="credits-section">
                    <h4 class="credits-section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                        <span data-i18n="credits.techStack">Tech Stack</span>
                    </h4>
                    <div class="tech-grid">
                        <div class="tech-item">
                            <div class="tech-icon tech-icon--html">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                            <div class="tech-info">
                                <span class="tech-name">HTML5</span>
                                <span class="tech-version">Semantic Markup</span>
                            </div>
                        </div>
                        <div class="tech-item">
                            <div class="tech-icon tech-icon--css">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                            <div class="tech-info">
                                <span class="tech-name">CSS3</span>
                                <span class="tech-version">Custom Properties</span>
                            </div>
                        </div>
                        <div class="tech-item">
                            <div class="tech-icon tech-icon--js">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                            <div class="tech-info">
                                <span class="tech-name">Vanilla JS</span>
                                <span class="tech-version">ES6+</span>
                            </div>
                        </div>
                        <div class="tech-item">
                            <div class="tech-icon tech-icon--chartjs">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                            </div>
                            <div class="tech-info">
                                <span class="tech-name">Chart.js</span>
                                <span class="tech-version">Data Visualization</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Libraries Section -->
                <div class="credits-section">
                    <h4 class="credits-section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        <span data-i18n="credits.libraries">Libraries</span>
                    </h4>
                    <div class="libraries-list">
                        <a href="https://pandas.pydata.org/" class="library-item" target="_blank" rel="noopener">
                            <span class="library-name">Pandas</span>
                            <span class="library-desc">Data processing</span>
                        </a>
                        <a href="https://numpy.org/" class="library-item" target="_blank" rel="noopener">
                            <span class="library-name">NumPy</span>
                            <span class="library-desc">Numerical computing</span>
                        </a>
                        <a href="https://scikit-learn.org/" class="library-item" target="_blank" rel="noopener">
                            <span class="library-name">scikit-learn</span>
                            <span class="library-desc">ML algorithms</span>
                        </a>
                    </div>
                </div>

                <!-- Contributors Section -->
                <div class="credits-section">
                    <h4 class="credits-section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span data-i18n="credits.contributors">Contributors</span>
                    </h4>
                    <div class="contributors-list">
                        <div class="contributor-item">
                            <div class="contributor-info">
                                <span class="contributor-name">Claude Code Opus</span>
                                <span class="contributor-desc" data-i18n="credits.contributorDesc">AI Assistant</span>
                            </div>
                        </div>
                        <div class="contributor-item">
                            <div class="contributor-info">
                                <span class="contributor-name">GLM 4.7</span>
                                <span class="contributor-desc" data-i18n="credits.contributorDesc">AI Assistant</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Design Credits Section -->
                <div class="credits-section">
                    <h4 class="credits-section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"/></svg>
                        <span data-i18n="credits.design">Design</span>
                    </h4>
                    <div class="design-credits">
                        <span class="design-text">Color theme inspired by</span>
                        <a href="https://tweakcn.com" class="design-link" target="_blank" rel="noopener">Cosmic Night</a>
                        <span class="design-text">by</span>
                        <a href="https://tweakcn.com" class="design-link" target="_blank" rel="noopener">tweakcn.com</a>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    /* ------------------------------------------------------------------ */
    /*  Inject HTML & wire events                                          */
    /* ------------------------------------------------------------------ */
    document.body.insertAdjacentHTML('beforeend', html);

    const modal = document.getElementById('credits-modal');
    const closeBtn = document.getElementById('credits-modal-close');
    const triggerBtns = document.querySelectorAll('.btn-credits');

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    triggerBtns.forEach(btn => btn.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Re-apply i18n translations to the injected modal if the function exists
    if (typeof applyTranslations === 'function') {
        applyTranslations();
    }
})();
