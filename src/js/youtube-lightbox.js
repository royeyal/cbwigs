/**
 * YouTube Lightbox Modal Player
 * Creates a modal lightbox that plays YouTube videos on click
 * Designed for hero sections with play button triggers
 */

export function initYouTubeLightbox() {
  // console.log('[YouTube Lightbox] Initializing...');

  let activeModal = null;
  let activePlayer = null;
  let apiReady = false;

  /**
   * Load YouTube IFrame API (compatible with youtube-player.js)
   */
  function loadYouTubeAPI() {
    // console.log('[YouTube Lightbox] Loading YouTube API...');

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      // console.log('[YouTube Lightbox] YouTube API already loaded');
      apiReady = true;
      return Promise.resolve();
    }

    return new Promise(resolve => {
      // Store existing callback if present (from youtube-player.js)
      const existingCallback = window.onYouTubeIframeAPIReady;

      // Create combined callback
      window.onYouTubeIframeAPIReady = () => {
        // console.log('[YouTube Lightbox] YouTube API ready');
        apiReady = true;

        // Call existing callback if it exists
        if (existingCallback && typeof existingCallback === 'function') {
          existingCallback();
        }

        resolve();
      };

      // Load the API script if not already present
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        // console.log('[YouTube Lightbox] Loading YouTube IFrame API script');
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        // console.log(
        //   '[YouTube Lightbox] YouTube IFrame API script already exists'
        // );
        // API script exists but might not be ready yet, wait for it
        if (window.YT && window.YT.Player) {
          apiReady = true;
          resolve();
        }
      }
    });
  }

  /**
   * Extract YouTube video ID from various URL formats
   */
  function extractVideoId(input) {
    if (!input) return null;

    // If it's already just an ID (11 characters, alphanumeric with dash/underscore)
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
      return input.trim();
    }

    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  /**
   * Create modal HTML structure
   */
  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'youtube-lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Video player');

    modal.innerHTML = `
      <div class="youtube-lightbox-backdrop"></div>
      <div class="youtube-lightbox-container">
        <button class="youtube-lightbox-close" aria-label="Close video">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="youtube-lightbox-player" id="youtube-lightbox-player"></div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  /**
   * Open lightbox and play video
   */
  async function openLightbox(videoId) {
    // console.log('[YouTube Lightbox] Opening lightbox with video ID:', videoId);

    if (!videoId) {
      console.error('[YouTube Lightbox] No video ID provided');
      return;
    }

    // Ensure API is loaded
    if (!apiReady) {
      // console.log('[YouTube Lightbox] API not ready, loading...');
      await loadYouTubeAPI();
    }

    // Create modal if it doesn't exist
    if (!activeModal) {
      console.log('[YouTube Lightbox] Creating modal');
      activeModal = createModal();

      // Close button handler
      const closeBtn = activeModal.querySelector('.youtube-lightbox-close');
      closeBtn.addEventListener('click', closeLightbox);

      // Backdrop click handler
      const backdrop = activeModal.querySelector('.youtube-lightbox-backdrop');
      backdrop.addEventListener('click', closeLightbox);

      // ESC key handler
      const handleEscape = e => {
        if (e.key === 'Escape') {
          closeLightbox();
        }
      };
      activeModal.addEventListener('keydown', handleEscape);
    }

    // Show modal
    console.log('[YouTube Lightbox] Showing modal');
    document.body.style.overflow = 'hidden';
    activeModal.classList.add('active');

    // Small delay to ensure modal is rendered before creating player
    setTimeout(() => {
      console.log('[YouTube Lightbox] Creating YouTube player');

      // Destroy existing player if any
      if (activePlayer) {
        console.log('[YouTube Lightbox] Destroying existing player');
        activePlayer.destroy();
      }

      // Create new YouTube player
      // Note: origin parameter removed to prevent CORS issues
      activePlayer = new window.YT.Player('youtube-lightbox-player', {
        videoId,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1
        },
        events: {
          onReady: () => {
            console.log('[YouTube Lightbox] Player ready');
          },
          onStateChange: event => {
            console.log('[YouTube Lightbox] Player state changed:', event.data);
          },
          onError: event => {
            console.error('[YouTube Lightbox] Player error:', event.data);
            console.error(
              '[YouTube Lightbox] Error codes: 2=Invalid ID, 5=HTML5 error, 100=Not found, 101/150=Embed disabled'
            );
          }
        }
      });
    }, 100);
  }

  /**
   * Close lightbox and stop video
   */
  function closeLightbox() {
    console.log('[YouTube Lightbox] Closing lightbox');

    if (!activeModal) return;

    // Stop and destroy player
    if (activePlayer) {
      console.log('[YouTube Lightbox] Destroying player');
      activePlayer.destroy();
      activePlayer = null;
    }

    // Hide modal
    activeModal.classList.remove('active');
    document.body.style.overflow = '';

    // Clean up player container
    const playerContainer = document.getElementById('youtube-lightbox-player');
    if (playerContainer) {
      playerContainer.innerHTML = '';
    }
  }

  /**
   * Initialize lightbox triggers
   */
  function initTriggers() {
    // console.log('[YouTube Lightbox] Initializing triggers...');

    // Find all hero sections with lightbox functionality
    const heroSections = document.querySelectorAll('.section-hero-lightbox');
    // console.log(
    //   '[YouTube Lightbox] Found',
    //   heroSections.length,
    //   'hero sections'
    // );

    heroSections.forEach((section, index) => {
      console.log(
        `[YouTube Lightbox] Processing section ${index + 1}:`,
        section
      );

      // Get the hero lightbox component
      const heroLightbox = section.querySelector('.hero_lightbox');
      if (!heroLightbox) {
        console.warn(
          `[YouTube Lightbox] Section ${index + 1}: No .hero_lightbox found`
        );
        return;
      }
      console.log(
        `[YouTube Lightbox] Section ${index + 1}: Found hero_lightbox`,
        heroLightbox
      );

      // Get the play icon trigger
      const playIcon = heroLightbox.querySelector('.lightbox-play-icon');
      if (!playIcon) {
        console.warn(
          `[YouTube Lightbox] Section ${index + 1}: No .lightbox-play-icon found`
        );
        return;
      }
      console.log(
        `[YouTube Lightbox] Section ${index + 1}: Found play icon`,
        playIcon
      );

      // Get video ID from data attribute
      const rawVideoId =
        section.dataset.youtubeId ||
        heroLightbox.dataset.youtubeId ||
        playIcon.dataset.youtubeId;

      console.log(
        `[YouTube Lightbox] Section ${index + 1}: Raw video ID:`,
        rawVideoId
      );

      const videoId = extractVideoId(rawVideoId);
      console.log(
        `[YouTube Lightbox] Section ${index + 1}: Extracted video ID:`,
        videoId
      );

      if (!videoId) {
        console.warn(
          `[YouTube Lightbox] Section ${index + 1}: No YouTube ID found`
        );
        return;
      }

      // Add click handler
      const handleClick = e => {
        console.log('[YouTube Lightbox] Play icon clicked for video:', videoId);
        e.preventDefault();
        openLightbox(videoId);
      };

      playIcon.addEventListener('click', handleClick);
      playIcon.style.cursor = 'pointer';

      // Make it keyboard accessible
      playIcon.setAttribute('role', 'button');
      playIcon.setAttribute('tabindex', '0');
      playIcon.setAttribute('aria-label', 'Play video');

      playIcon.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          console.log(
            '[YouTube Lightbox] Play icon keyboard activated for video:',
            videoId
          );
          e.preventDefault();
          handleClick(e);
        }
      });

      // console.log(`[YouTube Lightbox] Section ${index + 1}: Setup complete`);
    });
  }

  // Initialize on load
  // console.log('[YouTube Lightbox] Starting initialization sequence');
  loadYouTubeAPI()
    .then(() => {
      // console.log('[YouTube Lightbox] API loaded, initializing triggers');
      initTriggers();
    })
    .catch(error => {
      console.error('[YouTube Lightbox] Error during initialization:', error);
    });

  // Re-initialize on Webflow interactions (if Webflow is present)
  if (window.Webflow) {
    // console.log(
    //   '[YouTube Lightbox] Webflow detected, setting up page transition handler'
    // );
    window.Webflow.push(() => {
      // console.log('[YouTube Lightbox] Webflow page transition, reinitializing');
      initTriggers();
    });
  }

  // Return public API
  return {
    open: openLightbox,
    close: closeLightbox,
    reinitialize: initTriggers
  };
}
