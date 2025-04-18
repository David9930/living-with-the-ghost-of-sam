// Complete tracking system with authentication-based security
// Tracks: failed passwords, page views, downloads, and form submissions

// Set a global flag to avoid loading the script twice
if (typeof window.trackingScriptLoaded !== 'undefined') {
  console.log("Tracking script already loaded, skipping initialization");
} else {
  window.trackingScriptLoaded = true;
  
  // Tracking state flags
  window.lastPageTracked = null;
  window.lastTrackingTime = 0;
  
  // Basic tracking initialization - happens for all visitors
  // This sets up password tracking and allows failed password tracking
  function initializeBasicTracking() {
    console.log("Initializing basic tracking...");
    
    // Check if tracking is explicitly disabled via admin mode
    const isTrackingDisabled = localStorage.getItem('trackingDisabled') === 'true';
    
    // Get password feedback element if it exists
    const passwordFeedbackElement = document.getElementById('password-feedback');
    
    if (isTrackingDisabled && passwordFeedbackElement) {
      console.log("Tracking disabled via admin mode");
      passwordFeedbackElement.textContent = 'Admin mode active - tracking disabled';
      passwordFeedbackElement.style.color = '#FFD700'; // Gold color
    }
    
    // Set up password listeners regardless of tracking state
    setupPasswordListeners();
    
    // If already authenticated, initialize full tracking
    if (sessionStorage.getItem('authenticated') === 'true' && !isTrackingDisabled) {
      console.log("Already authenticated, setting up full tracking...");
      initializeFullTracking();
    }
  }
  
  // Full tracking initialization - only happens after successful password
  function initializeFullTracking() {
    // Skip if already initialized or explicitly disabled
    if (window.fullTrackingInitialized || localStorage.getItem('trackingDisabled') === 'true') {
      return;
    }
    
    console.log("Initializing full tracking system...");
    window.fullTrackingInitialized = true;
    
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
      console.warn("EmailJS not available yet, will retry full tracking initialization in 1s");
      return setTimeout(initializeFullTracking, 1000);
    }
    
    // Initialize session tracking if not already done
    initializeSessionTracking();
    
    // Track the current page view
    setTimeout(trackPageView, 500);
    
    // Add listeners for downloads
    setupDownloadTracking();
    
    // Setup inactivity tracking
    setupInactivityTracking();
    
    // Track navigation between pages
    setupNavigationTracking();
    
    // Set up form tracking
    setupContactForms();
    
    console.log("Full tracking system initialized");
  }
  
  // Begin tracking initialization when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBasicTracking);
  } else {
    // DOM already loaded, initialize immediately
    initializeBasicTracking();
  }
}

// Set up password listeners for both normal and admin modes
function setupPasswordListeners() {
  // Find password elements
  const passwordInput = document.getElementById('password-input');
  const submitButton = document.getElementById('submit-password');
  
  if (submitButton && passwordInput) {
    console.log("Password field found, setting up listeners");
    
    // Function to handle password input
    const handlePasswordInput = async function() {
      const enteredPassword = passwordInput.value.trim();
      
      // Skip empty passwords
      if (!enteredPassword) {
        return;
      }
      
      console.log("Password submitted:", enteredPassword === 'Terguson' ? 'Correct password' : 'Incorrect password');
      
      // Check for admin mode toggle password
      if (enteredPassword === "TergusonOFF") {
        // Disable tracking
        localStorage.setItem('trackingDisabled', 'true');
        console.log("Admin mode activated - tracking disabled");
        
        // Provide visual feedback that admin mode is activated
        const passwordFeedbackElement = document.getElementById('password-feedback');
        if (passwordFeedbackElement) {
          passwordFeedbackElement.textContent = 'Admin mode activated - tracking disabled';
          passwordFeedbackElement.style.color = '#FFD700'; // Gold color
        }
        
        // Still allow access to the site
        sessionStorage.setItem('authenticated', 'true');
        
        // Animate transition
        const passwordContainer = document.querySelector('.password-container');
        const contentElement = document.getElementById('content');
        
        if (passwordContainer && contentElement) {
          setTimeout(() => {
            passwordContainer.style.opacity = '0';
            setTimeout(() => {
              passwordContainer.style.display = 'none';
              contentElement.classList.remove('hidden');
              if (typeof window.initializeTiltEffect === 'function') {
                window.initializeTiltEffect();
              }
            }, 500);
          }, 1000);
        }
        
        return;
      }
      
      // Check for re-enabling tracking with special command
      if (enteredPassword === "TergusonON" && localStorage.getItem('trackingDisabled') === 'true') {
        // Re-enable tracking
        localStorage.removeItem('trackingDisabled');
        console.log("Admin mode deactivated - tracking re-enabled");
        
        const passwordFeedbackElement = document.getElementById('password-feedback');
        if (passwordFeedbackElement) {
          passwordFeedbackElement.textContent = 'Tracking re-enabled';
          passwordFeedbackElement.style.color = '#51cf66'; // Green success color
        }
        
        // Still allow access with regular password handling
        sessionStorage.setItem('authenticated', 'true');
        
        // Initialize full tracking now that tracking is enabled
        initializeFullTracking();
        
        // Animate transition
        const passwordContainer = document.querySelector('.password-container');
        const contentElement = document.getElementById('content');
        
        if (passwordContainer && contentElement) {
          setTimeout(() => {
            passwordContainer.style.opacity = '0';
            setTimeout(() => {
              passwordContainer.style.display = 'none';
              contentElement.classList.remove('hidden');
              if (typeof window.initializeTiltEffect === 'function') {
                window.initializeTiltEffect();
              }
            }, 500);
          }, 1000);
        }
        
        return;
      }
      
      // Check if the password is correct
      if (enteredPassword === 'Terguson') {
        // Try to get IP info for successful login
        try {
          const ipResponse = await fetch('https://ipinfo.io/json?token=898b193407ebcf');
          
          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            // Track the successful authentication with IP data
            sendTrackingEvent('Authentication Success', {
              location: formatLocation(ipData),
              ip: ipData.ip || 'Unknown',
              time: new Date().toISOString()
            });
          } else {
            // Track without IP data if fetch failed
            sendTrackingEvent('Authentication Success', {
              time: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching IP information:", error);
          // Still track the authentication success without IP data
          sendTrackingEvent('Authentication Success', {
            time: new Date().toISOString()
          });
        }
        
        // Set authenticated flag regardless of tracking status
        sessionStorage.setItem('authenticated', 'true');
        
        // Initialize full tracking unless in admin mode
        if (localStorage.getItem('trackingDisabled') !== 'true') {
          initializeFullTracking();
        }
      } else if (enteredPassword !== "TergusonOFF" && enteredPassword !== "TergusonON") {
        // Track failed password attempt
        console.log("Tracking failed password attempt");
        
        // Try to get IP info for the failed attempt
        try {
          const ipResponse = await fetch('https://ipinfo.io/json?token=898b193407ebcf');
          
          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            // Track the failed attempt with IP data
            sendTrackingEvent('Failed Authentication', {
              password: enteredPassword,
              location: formatLocation(ipData),
              ip: ipData.ip || 'Unknown',
              time: new Date().toISOString()
            });
          } else {
            // Track without IP data if fetch failed
            sendTrackingEvent('Failed Authentication', {
              password: enteredPassword,
              time: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching IP information for failed attempt:", error);
          // Still track the failed attempt without IP data
          sendTrackingEvent('Failed Authentication', {
            password: enteredPassword,
            time: new Date().toISOString()
          });
        }
      }
    };
    
    // Track on button click
    submitButton.addEventListener('click', handlePasswordInput);
    
    // Track on Enter key
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handlePasswordInput();
      }
    });
  } else {
    console.log("Password field not found, may be on an internal page");
  }
}

// Initialize or retrieve tracking data
function initializeSessionTracking() {
  if (!sessionStorage.getItem('sessionTracking')) {
    const sessionData = {
      sessionId: generateSessionId(),
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      pageVisits: [],
      downloads: []
    };
    sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
    
    // Send initial session notification
    sendTrackingEvent('Session Started', {
      sessionId: sessionData.sessionId,
      startTime: sessionData.startTime,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    });
  }
}

// Generate a unique session ID
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Format location string from IP data
function formatLocation(ipData) {
  if (!ipData) return 'Unknown';
  return `${ipData.city || ''}, ${ipData.region || ''}, ${ipData.country || ''}`.replace(/, ,/g, ',').replace(/^, /, '').replace(/, $/, '') || 'Unknown';
}

// Track a page view - with built-in debounce
async function trackPageView() {
  // Exit if tracking is disabled
  if (localStorage.getItem('trackingDisabled') === 'true') {
    console.log("Page view tracking skipped (admin mode)");
    return;
  }
  
  // Get current page information for debounce checking
  const currentPath = window.location.pathname;
  const currentTime = Date.now();
  
  // Don't track the same page too frequently (60 second cooldown)
  if (window.lastPageTracked === currentPath && (currentTime - window.lastTrackingTime) < 60000) {
    console.log("Skipping repeated page view tracking for", currentPath, "- tracked", 
                Math.round((currentTime - window.lastTrackingTime)/1000), "seconds ago");
    return;
  }
  
  // Update tracking state
  window.lastPageTracked = currentPath;
  window.lastTrackingTime = currentTime;
  
  console.log("Starting page view tracking for:", currentPath);
  
  try {
    // Get the current session data
    const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking') || '{}');
    
    if (!sessionData.sessionId) {
      console.warn("No session ID found, reinitializing session tracking");
      initializeSessionTracking();
      return setTimeout(trackPageView, 500); // Try again after reinitialization
    }
    
    // Update last activity time
    sessionData.lastActivity = new Date().toISOString();
    sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
    
    // Get the full URL and document title for accurate tracking
    const fullPath = window.location.pathname;
    const pageTitle = document.title;
    
    // Log current page info for debugging
    console.log("Current page for tracking:", {
      path: fullPath,
      title: pageTitle,
      session: sessionData.sessionId
    });
    
    // Always include user agent info for better tracking
    const userAgent = navigator.userAgent;
    
    // Try to get IP data
    console.log("Fetching IP information...");
    try {
      const ipResponse = await fetch('https://ipinfo.io/json?token=898b193407ebcf');
      
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        console.log("IP data received:", ipData);
        
        // Record page visit with IP data
        const pageVisit = {
          url: fullPath, // Use full path instead of just pathname
          title: pageTitle, // Use document title
          time: new Date().toISOString(),
          ip: ipData.ip || 'Unknown',
          location: formatLocation(ipData),
          userAgent: userAgent
        };
        
        // Add to history if pageVisits array exists
        if (Array.isArray(sessionData.pageVisits)) {
          sessionData.pageVisits.push(pageVisit);
          sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
        } else {
          // Create pageVisits array if it doesn't exist
          sessionData.pageVisits = [pageVisit];
          sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
        }
        
        // Send notification
        console.log("Sending page view event with IP data");
        sendTrackingEvent('Page View', {
          url: pageVisit.url,
          title: pageVisit.title,
          ip: pageVisit.ip,
          location: pageVisit.location,
          userAgent: userAgent,
          time: new Date().toISOString()
        });
      } else {
        // IP fetch failed but we'll still track the page view
        console.warn("IP fetch response not OK:", ipResponse.status);
        throw new Error("IP fetch failed with status: " + ipResponse.status);
      }
    } catch (ipError) {
      console.warn("Error fetching IP, will track page view without IP data:", ipError);
      
      // Record page visit without IP data
      const pageVisit = {
        url: fullPath, // Use full path instead of just pathname
        title: pageTitle, // Use document title
        time: new Date().toISOString(),
        userAgent: userAgent
      };
      
      // Add to history
      if (Array.isArray(sessionData.pageVisits)) {
        sessionData.pageVisits.push(pageVisit);
      } else {
        sessionData.pageVisits = [pageVisit];
      }
      sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
      
      // Send notification
      console.log("Sending page view event without IP data");
      sendTrackingEvent('Page View', {
        url: pageVisit.url,
        title: pageVisit.title,
        userAgent: userAgent,
        time: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error in trackPageView:", error);
    
    // Still track the page view without session data
    try {
      // Create basic page visit data
      const pageVisit = {
        url: window.location.pathname,
        title: document.title,
        time: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      // Send notification as fallback
      console.log("Sending fallback page view event");
      sendTrackingEvent('Page View', {
        url: pageVisit.url,
        title: pageVisit.title,
        userAgent: pageVisit.userAgent,
        time: new Date().toISOString()
      });
    } catch (innerError) {
      console.error("Failed to track page view in fallback mode:", innerError);
    }
  }
}

// Track navigation between pages
function setupNavigationTracking() {
  console.log("Setting up navigation tracking");
  
  // Track all link clicks
  document.addEventListener('click', function(e) {
    // Find if the click was on a link or inside a link
    let target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }
    
    // If we found a link and it's an internal link
    if (target && target.tagName === 'A') {
      const href = target.getAttribute('href') || '';
      
      // Only track internal links that aren't downloads
      const isInternalLink = href && !href.startsWith('http') && 
                            !href.startsWith('//') && 
                            !href.startsWith('javascript:') &&
                            !target.hasAttribute('download');
      
      if (isInternalLink) {
        console.log("Internal navigation link clicked:", href);
        // Track the page view on the next load
        const navigationTracked = sessionStorage.getItem('navigationTracked');
        if (!navigationTracked) {
          sessionStorage.setItem('navigationTracked', 'true');
          
          // This will be cleared when the page loads, but ensures we only set it once
          window.addEventListener('beforeunload', function() {
            sessionStorage.setItem('pendingNavigation', 'true');
          });
        }
      }
    }
  });
  
  // Check for a pending navigation when the page loads
  if (sessionStorage.getItem('pendingNavigation') === 'true') {
    console.log("Detected navigation from internal link, tracking page view");
    sessionStorage.removeItem('pendingNavigation');
    sessionStorage.removeItem('navigationTracked');
    
    // If we're authenticated, track the page view
    if (sessionStorage.getItem('authenticated') === 'true' && 
        localStorage.getItem('trackingDisabled') !== 'true') {
      // Track the page view after a short delay to ensure everything is loaded
      setTimeout(trackPageView, 1000);
    }
  }
  
  // Also track on page visibility changes (like returning to the tab)
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      // If we're authenticated, check if we need to track this page view
      if (sessionStorage.getItem('authenticated') === 'true' && 
          localStorage.getItem('trackingDisabled') !== 'true') {
        console.log("Page became visible, checking if tracking needed");
        
        // Only track if we haven't recently tracked this page
        const lastTrackedURL = sessionStorage.getItem('lastTrackedURL');
        const currentURL = window.location.pathname;
        
        if (lastTrackedURL !== currentURL) {
          console.log("New page detected, tracking view");
          trackPageView();
          sessionStorage.setItem('lastTrackedURL', currentURL);
        }
      }
    }
  });
}

// Track downloads
function setupDownloadTracking() {
  // Make the download function available globally
  window.trackDownload = function(url, filename) {
    // Skip if tracking is disabled
    if (localStorage.getItem('trackingDisabled') === 'true') {
      console.log("Download tracking skipped (admin mode)");
      return;
    }
    
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking') || '{}');
      if (!sessionData.downloads) {
        sessionData.downloads = [];
      }
      
      const downloadInfo = {
        url: url,
        filename: filename,
        time: new Date().toISOString()
      };
      
      sessionData.downloads.push(downloadInfo);
      sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
      
      // Send notification for download
      sendTrackingEvent('Download', {
        sessionId: sessionData.sessionId || 'Unknown',
        url: downloadInfo.url,
        filename: downloadInfo.filename,
        time: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };
  
  // Add force download function
  window.forceDownload = function(url, filename) {
    try {
      // Create a temporary link element to force download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Track the download (if not in admin mode)
      if (sessionStorage.getItem('authenticated') === 'true' && localStorage.getItem('trackingDisabled') !== 'true') {
        window.trackDownload(url, filename);
      }
    } catch (error) {
      console.error('Error forcing download:', error);
    }
  };
  
  // Find all download links and PDF links
  document.querySelectorAll('a').forEach(link => {
    // Check if the link is a download or points to a PDF
    const href = link.getAttribute('href') || '';
    const isDownload = link.hasAttribute('download') || 
                       href.endsWith('.pdf') || 
                       href.endsWith('.doc') || 
                       href.endsWith('.docx') ||
                       href.includes('/scripts/') ||
                       href.includes('/documents/');
    
    if (isDownload) {
      console.log("Found download link:", href);
      
      // For links with download attribute, modify to use forceDownload
      if (link.hasAttribute('download')) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const filename = this.getAttribute('download') || this.href.split('/').pop();
          window.forceDownload(this.href, filename);
        });
      } else {
        // For other "viewable" links, just track them
        link.addEventListener('click', function(e) {
          const filename = this.href.split('/').pop();
          // Only track if authenticated and not in admin mode
          if (sessionStorage.getItem('authenticated') === 'true' && localStorage.getItem('trackingDisabled') !== 'true') {
            window.trackDownload(this.href, filename);
          }
        });
      }
    }
  });
}

// Setup inactivity tracking (15 minutes = 900000 ms)
function setupInactivityTracking() {
  // Skip if tracking is disabled
  if (localStorage.getItem('trackingDisabled') === 'true') {
    console.log("Inactivity tracking skipped (admin mode)");
    return;
  }
  
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
  let inactivityTimer;
  
  // Function to reset the timer
  function resetInactivityTimer() {
    // Skip if tracking is disabled
    if (localStorage.getItem('trackingDisabled') === 'true') {
      return;
    }
    
    // Clear existing timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    // Update last activity time
    const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking') || '{}');
    if (sessionData) {
      sessionData.lastActivity = new Date().toISOString();
      sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
    }
    
    // Set new timer
    inactivityTimer = setTimeout(endSessionDueToInactivity, INACTIVITY_TIMEOUT);
  }
  
  // Function to end the session due to inactivity
  function endSessionDueToInactivity() {
    // Skip if tracking is disabled
    if (localStorage.getItem('trackingDisabled') === 'true') {
      return;
    }
    
    const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking') || '{}');
    
    // Send session ended notification
    sendTrackingEvent('Session Ended', {
      sessionId: sessionData.sessionId || 'Unknown',
      reason: 'Inactivity timeout (15 minutes)',
      startTime: sessionData.startTime || 'Unknown',
      lastActivity: sessionData.lastActivity || 'Unknown',
      pageCount: sessionData.pageVisits ? sessionData.pageVisits.length : 0,
      downloadCount: sessionData.downloads ? sessionData.downloads.length : 0,
      time: new Date().toISOString()
    });
    
    // Clear session tracking data
    sessionStorage.removeItem('sessionTracking');
    
    // Restart tracking for new session if user becomes active again
    initializeSessionTracking();
  }
  
  // Set initial timer
  resetInactivityTimer();
  
  // Track user activity to reset inactivity timer, but DON'T trigger page view tracking on scroll!
  const events = ['mousedown', 'keypress', 'touchstart'];
  events.forEach(event => {
    document.addEventListener(event, resetInactivityTimer, false);
  });
  
  // Special handler for scroll - ONLY reset inactivity timer, don't track page views
  document.addEventListener('scroll', function() {
    // Only update the activity timestamp, don't trigger tracking
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking') || '{}');
      if (sessionData) {
        sessionData.lastActivity = new Date().toISOString();
        sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
      }
      
      // Reset inactivity timer
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      inactivityTimer = setTimeout(endSessionDueToInactivity, INACTIVITY_TIMEOUT);
    } catch (e) {
      console.error("Error updating activity time on scroll:", e);
    }
  }, false);
}

// Send tracking event via EmailJS with retry logic
function sendTrackingEvent(eventType, eventData) {
  // Special case: Always track authentication events regardless of status
  const isAuthEvent = eventType === 'Authentication Success' || eventType === 'Failed Authentication';
  
  // Skip if tracking is disabled and this isn't an auth event
  if (!isAuthEvent && localStorage.getItem('trackingDisabled') === 'true') {
    console.log(`Tracking event '${eventType}' skipped (admin mode)`);
    return;
  }
  
  // Check if EmailJS is properly initialized before sending
  if (typeof emailjs === 'undefined') {
    console.warn("EmailJS not available for tracking yet, will retry in 1s");
    // Try again in 1 second if EmailJS isn't loaded yet
    setTimeout(() => {
      if (typeof emailjs !== 'undefined') {
        sendTrackingEventImpl(eventType, eventData);
      } else {
        console.error("EmailJS still not available after retry, tracking event not sent");
      }
    }, 1000);
    return;
  }
  
  // EmailJS is available, proceed with sending
  sendTrackingEventImpl(eventType, eventData);
}

// Implementation of sending tracking event
function sendTrackingEventImpl(eventType, eventData) {
  // Verify we have the needed information
  if (!eventType || !eventData) {
    console.error("Missing tracking event data");
    return;
  }
  
  // Add timestamp if not provided
  if (!eventData.time) {
    eventData.time = new Date().toISOString();
  }
  
  // Create a formatted message with proper sections
  const formattedMessage = formatTrackingEventMessage(eventType, eventData);
  
  // Send with the right parameters needed for the template
  const params = {
    to_email: 'dburnham9930@gmail.com',
    from_name: `Ghost of Sam - ${eventType}`, 
    from_email: 'system@livingwiththeghost.com',
    subject: `Site Activity: ${eventType} - Living with the Ghost of Sam`,
    message: formattedMessage
  };
  
  console.log(`Sending ${eventType} tracking event with data:`, eventData);
  
  // Send the email using EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.send(
      'service_mglwuwe',
      'template_6cjvb36',
      params
    ).then(
      function(response) {
        console.log(`Tracking event '${eventType}' sent successfully:`, response);
      },
      function(error) {
        console.error(`Failed to send tracking event '${eventType}':`, error);
      }
    );
  } else {
    console.error("EmailJS not available for sending tracking event");
  }
}

// Format the message consistently for all tracking events
function formatTrackingEventMessage(eventType, eventData) {
  let formattedMessage = `Event Type: ${eventType}\n`;
  formattedMessage += `Time: ${eventData.time}\n`;
  
  if (eventData.sessionId) {
    formattedMessage += `Session ID: ${eventData.sessionId}\n`;
  }
  
  // Add a section header for the specific event type
  formattedMessage += `\n${eventType} Information: -----------------------------\n`;
  
  // Add all event data except sessionId and time (already included above)
  Object.entries(eventData)
    .filter(([key]) => key !== 'sessionId' && key !== 'time') // exclude already included fields
    .forEach(([key, value]) => {
      // Format the key with first letter capitalized
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
      formattedMessage += `${formattedKey}: ${value}\n`;
    });
    
  return formattedMessage;
}

// Function to track contact form submissions
window.trackContactRequest = function(email, category, sessionId) {
  // Skip if tracking is disabled
  if (localStorage.getItem('trackingDisabled') === 'true') {
    console.log("Contact request tracking skipped (admin mode)");
    return true; // Return true so UI feedback still works
  }
  
  // Skip if not authenticated
  if (sessionStorage.getItem('authenticated') !== 'true') {
    console.log("Contact request tracking skipped (not authenticated)");
    return true; // Still return true so forms work
  }
  
  try {
    // Get the session data if sessionId is not provided
    if (!sessionId || sessionId === 'Unknown') {
      try {
        const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking') || '{}');
        sessionId = sessionData.sessionId || 'Unknown';
      } catch (error) {
        console.error('Error getting session data:', error);
        sessionId = 'Unknown';
      }
    }
    
    console.log(`Contact request being tracked for email: ${email}, category: ${category}`);
    
    // Using the same tracking event system for contact requests
    sendTrackingEvent('Contact Request', {
      email: email,
      category: category,
      page: window.location.pathname,
      sessionId: sessionId,
      time: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking contact request:', error);
    return false;
  }
};

// Set up form tracking for contact forms
function setupContactForms() {
  console.log("Setting up contact form tracking");
  
  // Find all contact forms
  document.querySelectorAll('.contact-form').forEach(form => {
    console.log("Found contact form:", form.id);
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      if (!emailInput) {
        console.error("Email input not found in form:", this.id);
        return;
      }
      
      const email = emailInput.value;
      const categoryElement = this.querySelector('button[data-category]');
      const category = categoryElement ? categoryElement.getAttribute('data-category') : 'Unknown';
      const message = this.querySelector('.form-message');
      
      console.log(`Contact form submitted: ${email}, ${category}`);
      
      // Track the contact request
      if (window.trackContactRequest(email, category)) {
        if (message) {
          message.textContent = "Your information has been submitted!";
          message.style.color = "#4CAF50";
        }
        this.reset();
        
        setTimeout(() => {
          if (message) message.textContent = "";
        }, 5000);
      } else {
        if (message) {
          message.textContent = "There was a problem submitting your request. Please try again.";
          message.style.color = "#FF5252";
        }
      }
    });
  });
  
  // Also check for newsletter form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    console.log("Found newsletter form");
    
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (!emailInput) {
        console.error("Email input not found in newsletter form");
        return;
      }
      
      const email = emailInput.value;
      const message = this.querySelector('.form-message');
      
      console.log(`Newsletter form submitted: ${email}`);
      
      // Track the newsletter subscription
      if (window.trackContactRequest(email, "Newsletter Subscription")) {
        if (message) {
          message.textContent = "Thanks for subscribing! We'll be in touch.";
          message.style.color = "#4CAF50";
        }
        this.reset();
        
        setTimeout(() => {
          if (message) message.textContent = "";
        }, 5000);
      } else {
        if (message) {
          message.textContent = "There was a problem with your subscription. Please try again.";
          message.style.color = "#FF5252";
        }
      }
    });
  }
}
