// Simplified Page Tracking System with Admin Mode Toggle (Fixed Version)
// Includes password-based tracking disable/enable

// Set a global flag to avoid loading the script twice
if (typeof window.trackingScriptLoaded !== 'undefined') {
  console.log("Tracking script already loaded, skipping initialization");
} else {
  window.trackingScriptLoaded = true;
  
  // Ensure we wait for DOM and EmailJS to be fully loaded
  function initializeTracking() {
    console.log("Initializing tracking system...");
    
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
    
    // Skip further tracking if disabled
    if (isTrackingDisabled) {
      console.log("Tracking fully disabled, skipping all tracking functions");
      return;
    }
    
    // Check if EmailJS is available and wait for it to be fully initialized
    ensureEmailJSInitialized(function() {
      // Normal tracking code begins here after EmailJS is confirmed available
      console.log("EmailJS confirmed available, proceeding with tracking setup");
      
      // Check if we're on the password screen or authenticated
      const isPasswordScreen = document.querySelector('.password-container') && 
                              !document.querySelector('.password-container.hidden') && 
                              !sessionStorage.getItem('authenticated');
      
      // If we're on the password screen, only set up password tracking
      if (isPasswordScreen) {
        console.log("On password screen, setting up password tracking");
        // Initialize session tracking
        initializeSessionTracking();
        return;
      }
      
      // For authenticated pages or pages without password protection
      console.log("Setting up full page tracking");
      
      // Initialize session tracking if not already done
      initializeSessionTracking();
      
      // Track the current page view (with slight delay to ensure everything is initialized)
      setTimeout(trackPageView, 500);
      
      // Add listeners for downloads
      setupDownloadTracking();
      
      // Setup inactivity tracking
      setupInactivityTracking();
      
      // Setup exit tracking metrics
      setupExitTrackingMetrics();
      
      // Setup contact form tracking
      setupContactFormTracking();
      
      console.log("Tracking system fully initialized");
    });
  }
  
  // Begin tracking initialization when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTracking);
  } else {
    // DOM already loaded, initialize immediately
    initializeTracking();
  }
}

// Makes sure EmailJS is fully initialized before proceeding
function ensureEmailJSInitialized(callback, maxAttempts = 10, currentAttempt = 0) {
  // If EmailJS is available and the send method exists
  if (typeof emailjs !== 'undefined' && typeof emailjs.send === 'function') {
    console.log("EmailJS confirmed available");
    
    // If we detect the initialization ping has already been sent, continue right away
    if (window.emailjsInitialized === true) {
      console.log("EmailJS already initialized, proceeding");
      callback();
      return;
    }
    
    // Wait a bit more to make sure initialization ping has been sent
    console.log("EmailJS detected, waiting for initialization to complete...");
    setTimeout(callback, 1000);
    return;
  }
  
  // If we've tried too many times, give up
  if (currentAttempt >= maxAttempts) {
    console.error("EmailJS not available after multiple attempts");
    return;
  }
  
  // Wait and try again with exponential backoff
  const waitTime = Math.min(1000 * Math.pow(1.5, currentAttempt), 5000);
  console.log(`EmailJS not available yet, will retry in ${waitTime/1000}s (attempt ${currentAttempt + 1}/${maxAttempts})`);
  
  setTimeout(function() {
    ensureEmailJSInitialized(callback, maxAttempts, currentAttempt + 1);
  }, waitTime);
}

// Set up password listeners for both normal and admin modes
function setupPasswordListeners() {
  // Find password elements
  const passwordInput = document.getElementById('password-input');
  const submitButton = document.getElementById('submit-password');
  
  if (submitButton && passwordInput) {
    // Function to handle password input
    const handlePasswordInput = async function() {
      const enteredPassword = passwordInput.value;
      
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
      
      // Only track if password is correct and tracking is not disabled
      if (enteredPassword === 'Terguson' && localStorage.getItem('trackingDisabled') !== 'true') {
        try {
          // Get IP info for successful login
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

// Track a page view
async function trackPageView() {
  // Exit if tracking is disabled
  if (localStorage.getItem('trackingDisabled') === 'true') {
    console.log("Page view tracking skipped (admin mode)");
    return;
  }
  
  console.log("Starting page view tracking...");
  
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
    
    // Log current page info for debugging
    console.log("Current page:", {
      path: window.location.pathname,
      title: document.title,
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
          url: window.location.pathname,
          title: document.title,
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
        url: window.location.pathname,
        title: document.title,
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
      if (localStorage.getItem('trackingDisabled') !== 'true') {
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
          // Only track if not in admin mode
          if (localStorage.getItem('trackingDisabled') !== 'true') {
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
  
  // Reset timer on user activity
  const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
  events.forEach(event => {
    document.addEventListener(event, resetInactivityTimer, false);
  });
}

// Setup consolidated exit tracking metrics
function setupExitTrackingMetrics() {
  // Skip if in admin mode
  if (localStorage.getItem('trackingDisabled') === 'true') {
    return;
  }
  
  // Track page entry time
  const entryTime = new Date();
  
  // Track deepest scroll position
  let deepestScroll = 0;
  
  // Track scroll depth but don't send events yet
  window.addEventListener('scroll', function() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollPercentage = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
    
    // Update deepest scroll if needed
    if (scrollPercentage > deepestScroll) {
      deepestScroll = scrollPercentage;
    }
  });
  
  // Send consolidated data only when user leaves
  window.addEventListener('beforeunload', function() {
    // Calculate time on page
    const exitTime = new Date();
    const timeOnPage = Math.round((exitTime - entryTime) / 1000); // in seconds
    
    // Send single event with all metrics
    sendTrackingEvent('Enhanced Page Exit', {
      url: window.location.pathname,
      timeOnPage: timeOnPage + ' seconds',
      deepestScroll: deepestScroll + '%',
      referrer: document.referrer || 'Direct',
      time: new Date().toISOString()
    });
  });
}

// Setup contact form tracking
function setupContactFormTracking() {
  console.log("Setting up contact form tracking");
  
  // Initialize all contact forms with our tracking function
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
      if (trackContactRequest(email, category)) {
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
      if (trackContactRequest(email, "Newsletter Subscription")) {
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

// Send tracking event via EmailJS with retry logic
function sendTrackingEvent(eventType, eventData) {
  // Skip if tracking is disabled
  if (localStorage.getItem('trackingDisabled') === 'true') {
    console.log(`Tracking event '${eventType}' skipped (admin mode)`);
    return;
  }
  
  // Check if EmailJS is properly initialized before sending
  if (typeof emailjs === 'undefined' || typeof emailjs.send !== 'function') {
    console.warn(`EmailJS not available for tracking '${eventType}', will retry in 1s`);
    // Try again in 1 second if EmailJS isn't loaded yet
    setTimeout(() => {
      if (typeof emailjs !== 'undefined' && typeof emailjs.send === 'function') {
        sendTrackingEventImpl(eventType, eventData);
      } else {
        console.error(`EmailJS still not available after retry, '${eventType}' event not sent`);
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
  
  // Add session ID if available
  if (!eventData.sessionId && typeof sessionStorage !== 'undefined') {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking') || '{}');
      if (sessionData && sessionData.sessionId) {
        eventData.sessionId = sessionData.sessionId;
      }
    } catch (e) {
      console.error("Error getting session ID:", e);
    }
  }
  
  // Create a formatted message with proper sections
  const formattedMessage = formatTrackingEventMessage(eventType, eventData);
  
  // Create the email parameters for EmailJS
  const params = {
    to_email: 'dburnham9930@gmail.com',
    from_name: `Ghost of Sam - ${eventType}`,
    from_email: 'system@livingwiththeghost.com',
    subject: `Site Activity: ${eventType} - Living with the Ghost of Sam`,
    message: formattedMessage
  };
  
  console.log(`Sending ${eventType} tracking event:`, eventData);
  
  // Send the email using EmailJS
  if (typeof emailjs !== 'undefined' && typeof emailjs.send === 'function') {
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
    console.error(`EmailJS not available for sending '${eventType}' tracking event`);
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
window.trackContactRequest = function(email, category) {
  // Skip if tracking is disabled
  if (localStorage.getItem('trackingDisabled') === 'true') {
    console.log("Contact request tracking skipped (admin mode)");
    return true; // Return true so UI feedback still works
  }
  
  // Validate inputs
  if (!email) {
    console.error("Email is required for contact tracking");
    return false;
  }
  
  if (!category) {
    category = "General Contact";
    console.warn("No category provided for contact tracking, using 'General Contact'");
  }
  
  try {
    // Get session data if available
    let sessionId = 'Unknown';
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking') || '{}');
      sessionId = sessionData.sessionId || 'Unknown';
    } catch (error) {
      console.error('Error getting session data:', error);
    }
    
    console.log(`Contact request being tracked - Email: ${email}, Category: ${category}`);
    
    // Send tracking event for contact request
    sendTrackingEvent('Contact Request', {
      email: email,
      category: category,
      page: window.location.pathname,
      time: new Date().toISOString(),
      sessionId: sessionId
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking contact request:', error);
    return false;
  }
};

// After the DOM is fully loaded, make sure EmailJS is initialized and set up contact forms
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, ensuring EmailJS is initialized for contact forms");
  
  // Make sure EmailJS is initialized for contact forms
  if (typeof emailjs === 'undefined' || typeof emailjs.send !== 'function') {
    console.log("EmailJS not yet available, will set up contact forms when tracking system initializes");
    // This will be handled by initializeTracking() when EmailJS becomes available
  } else {
    // EmailJS is already available, set up forms immediately
    setupContactFormTracking();
  }
});
