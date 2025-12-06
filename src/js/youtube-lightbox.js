/**
 * YouTube Lightbox Modal Player
 * Creates a modal lightbox that plays YouTube videos on click
 * Designed for hero sections with play button triggers
 */

export function initYouTubeLightbox() {
  let activeModal = null;
  let activePlayer = null;
  let apiReady = false;

  /**
   * Load YouTube IFrame API
   */
  function loadYouTubeAPI() {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      apiReady = true;
      return Promise.resolve();
    }

    return new Promise(resolve => {
      // Create callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        apiReady = true;
        resolve();
      };

      // Load the API script if not already present
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
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
    if (!videoId) {
      console.error('No video ID provided');
      return;
    }

    // Ensure API is loaded
    if (!apiReady) {
      await loadYouTubeAPI();
    }

    // Create modal if it doesn't exist
    if (!activeModal) {
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
    document.body.style.overflow = 'hidden';
    activeModal.classList.add('active');

    // Small delay to ensure modal is rendered before creating player
    setTimeout(() => {
      // Destroy existing player if any
      if (activePlayer) {
        activePlayer.destroy();
      }

      // Create new YouTube player
      activePlayer = new window.YT.Player('youtube-lightbox-player', {
        videoId,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin
        },
        events: {
          onError: event => {
            console.error('YouTube player error:', event.data);
          }
        }
      });
    }, 100);
  }

  /**
   * Close lightbox and stop video
   */
  function closeLightbox() {
    if (!activeModal) return;

    // Stop and destroy player
    if (activePlayer) {
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
    // Find all hero sections with lightbox functionality
    const heroSections = document.querySelectorAll('.section-hero-lightbox');

    heroSections.forEach(section => {
      // Get the hero lightbox component
      const heroLightbox = section.querySelector('.hero_lightbox');
      if (!heroLightbox) return;

      // Get the play icon trigger
      const playIcon = heroLightbox.querySelector('.lightbox-play-icon');
      if (!playIcon) return;

      // Get video ID from data attribute
      const videoId = extractVideoId(
        section.dataset.youtubeId ||
          heroLightbox.dataset.youtubeId ||
          playIcon.dataset.youtubeId
      );

      if (!videoId) {
        console.warn('No YouTube ID found for hero lightbox:', section);
        return;
      }

      // Add click handler
      const handleClick = e => {
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
          e.preventDefault();
          handleClick(e);
        }
      });
    });
  }

  // Initialize on load
  loadYouTubeAPI().then(() => {
    initTriggers();
  });

  // Re-initialize on Webflow interactions (if Webflow is present)
  if (window.Webflow) {
    window.Webflow.push(() => {
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
