/**
 * Elegant YouTube Player for Webflow
 * Supports both regular YouTube videos (16:9) and YouTube Shorts (9:16)
 * Uses YouTube IFrame API for optimal performance and UX
 */

class ElegantYouTubePlayer {
  constructor() {
    this.players = new Map();
    this.apiReady = false;
    this.apiLoadCallbacks = [];
    this.loadYouTubeAPI();
  }

  /**
   * Load YouTube IFrame API
   */
  loadYouTubeAPI() {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      this.apiReady = true;
      this.onYouTubeAPIReady();
      return;
    }

    // Create callback for when API is ready
    window.onYouTubeIframeAPIReady = () => {
      this.apiReady = true;
      this.onYouTubeAPIReady();
    };

    // Load the API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  /**
   * Called when YouTube API is ready
   */
  onYouTubeAPIReady() {
    this.apiLoadCallbacks.forEach(callback => callback());
    this.apiLoadCallbacks = [];
    this.initializePlayers();
  }

  /**
   * Extract YouTube video ID from various URL formats
   */
  extractVideoId(input) {
    // If it's already just an ID (no slashes or special chars), return it
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
      return input;
    }

    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  /**
   * Detect if video is a YouTube Short based on aspect ratio preference
   */
  isShortFormat(container) {
    return (
      container.hasAttribute('data-youtube-short') ||
      container.classList.contains('youtube-short')
    );
  }

  /**
   * Get high-quality thumbnail URL
   */
  getThumbnailUrl(videoId, quality = 'maxres') {
    // Try maxresdefault first, fallback to hqdefault if not available
    return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
  }

  /**
   * Create elegant placeholder with thumbnail
   */
  createPlaceholder(container, videoId) {
    const placeholder = document.createElement('div');
    placeholder.className = 'youtube-placeholder';
    placeholder.setAttribute('role', 'button');
    placeholder.setAttribute('aria-label', 'Play YouTube video');
    placeholder.setAttribute('tabindex', '0');

    // Create thumbnail image
    const thumbnail = document.createElement('img');
    thumbnail.className = 'youtube-thumbnail';
    thumbnail.src = this.getThumbnailUrl(videoId, 'maxres');
    thumbnail.alt = 'Video thumbnail';
    thumbnail.loading = 'lazy';

    // Fallback to hqdefault if maxres fails
    thumbnail.onerror = () => {
      if (thumbnail.src.includes('maxres')) {
        thumbnail.src = this.getThumbnailUrl(videoId, 'hq');
      }
    };

    // Create play button
    const playButton = document.createElement('button');
    playButton.className = 'youtube-play-button';
    playButton.setAttribute('aria-label', 'Play video');
    playButton.setAttribute('tabindex', '-1');
    playButton.innerHTML = `
      <svg class="youtube-play-icon" viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="currentColor"/>
        <path d="M 45,24 27,14 27,34" fill="#fff"/>
      </svg>
    `;

    // Click handler for entire placeholder
    const handleClick = e => {
      e.preventDefault();
      this.loadVideo(container, videoId);
    };

    // Click handler for placeholder
    placeholder.addEventListener('click', handleClick);

    // Keyboard handler for placeholder (Enter and Space)
    placeholder.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.loadVideo(container, videoId);
      }
    });

    // Prevent button click from bubbling (to avoid double trigger)
    playButton.addEventListener('click', e => {
      e.stopPropagation();
      handleClick(e);
    });

    placeholder.appendChild(thumbnail);
    placeholder.appendChild(playButton);

    return placeholder;
  }

  /**
   * Load and play the video
   */
  loadVideo(container, videoId) {
    const placeholder = container.querySelector('.youtube-placeholder');
    if (placeholder) {
      placeholder.classList.add('youtube-loading');
    }

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'youtube-iframe-container';
    iframeContainer.id = `youtube-player-${videoId}-${Date.now()}`;

    container.appendChild(iframeContainer);

    // Initialize YouTube player
    const player = new YT.Player(iframeContainer.id, {
      videoId,
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        origin: window.location.origin
      },
      events: {
        onReady: event => {
          // Remove placeholder when video is ready
          if (placeholder) {
            placeholder.remove();
          }
          container.classList.add('youtube-active');
          event.target.playVideo();
        },
        onError: event => {
          console.error('YouTube player error:', event.data);
          container.classList.add('youtube-error');
          if (placeholder) {
            placeholder.classList.remove('youtube-loading');
          }
        }
      }
    });

    this.players.set(container, player);
  }

  /**
   * Initialize all YouTube players on the page
   */
  initializePlayers() {
    const containers = document.querySelectorAll('[data-youtube-id]');

    containers.forEach(container => {
      // Skip if already initialized
      if (container.hasAttribute('data-youtube-initialized')) {
        return;
      }

      const videoInput = container.getAttribute('data-youtube-id');
      const videoId = this.extractVideoId(videoInput);

      if (!videoId) {
        console.warn('Invalid YouTube video ID or URL:', videoInput);
        return;
      }

      // Set aspect ratio class
      const isShort = this.isShortFormat(container);
      container.classList.add(isShort ? 'youtube-short' : 'youtube-video');

      // Add base class if not present
      if (!container.classList.contains('youtube-player')) {
        container.classList.add('youtube-player');
      }

      // Create and add placeholder
      const placeholder = this.createPlaceholder(container, videoId);
      container.appendChild(placeholder);

      // Mark as initialized
      container.setAttribute('data-youtube-initialized', 'true');
      container.setAttribute('data-youtube-video-id', videoId);
    });
  }

  /**
   * Destroy a specific player
   */
  destroyPlayer(container) {
    const player = this.players.get(container);
    if (player && typeof player.destroy === 'function') {
      player.destroy();
      this.players.delete(container);
    }
  }

  /**
   * Destroy all players
   */
  destroyAllPlayers() {
    this.players.forEach(player => {
      if (typeof player.destroy === 'function') {
        player.destroy();
      }
    });
    this.players.clear();
  }

  /**
   * Reinitialize players (useful for dynamic content)
   */
  reinitialize() {
    if (this.apiReady) {
      this.initializePlayers();
    } else {
      this.apiLoadCallbacks.push(() => this.initializePlayers());
    }
  }
}

// Initialize when DOM is ready
let youtubePlayerInstance;

function initElegantYouTubePlayer() {
  if (!youtubePlayerInstance) {
    youtubePlayerInstance = new ElegantYouTubePlayer();
  }
  return youtubePlayerInstance;
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initElegantYouTubePlayer);
} else {
  initElegantYouTubePlayer();
}

// Expose for manual control if needed
window.ElegantYouTubePlayer = ElegantYouTubePlayer;
window.youtubePlayer = () =>
  youtubePlayerInstance || initElegantYouTubePlayer();

// For Webflow: Reinitialize on page transitions
if (window.Webflow) {
  window.Webflow.push(() => {
    initElegantYouTubePlayer();
  });
}
