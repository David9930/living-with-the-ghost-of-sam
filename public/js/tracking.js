// Simplified Page Tracking System with Admin Mode Toggle (Fixed Version)
// Includes password-based tracking disable/enable

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("Admin mode tracking script loaded");
  
  // Check if tracking is explicitly disabled via admin mode
  const isTrackingDisabled = localStorage.getItem('trackingDisabled') === 'true';
  
  if (isTrackingDisabled) {
    console.log("Tracking disabled via admin mode");
    document.getElementById('password-feedback').textContent = 'Admin mode active - tracking disabled';
    document.getElementById('password-feedback').style.color = '#FFD700'; // Gold color
  }
  
  // Set up password listeners regardless of tracking state
  setupPasswordListeners();
  
  // Skip further tracking if disabled
  if (isTrackingDisabled) {
    return;
  }
  
  // Normal tracking code begins here
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
  console.log("Tracking page view");
  
  // Initialize session tracking if not already done
  initializeSessionTracking();
  
  // Track the current page view
  trackPageView();
  
  // Add listeners for downloads
  setupDownloadTracking();
  
  // Setup inactivity tracking
  setupInactivityTracking();
  
  // Setup exit tracking metrics
  setupExitTrackingMetrics();
});

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
        if (document.getElementById('password-feedback')) {
          document.getElementById('password-feedback').textContent = 'Admin mode activated - tracking disabled';
          document.getElementById('password-feedback').style.color = '#FFD700'; // Gold color
        }
        
        // Still allow access to the site
        sessionStorage.setItem('authenticated', 'true');
        
        // Animate transition
        const passwordContainer = document.querySelector('.password-container');
        const contentElement = document.getElementById('content');
        
        setTimeout(() => {
          passwordContainer.style.opacity = '0';
          setTimeout(() => {
            passwordContainer.style.display = 'none';
            contentElement.classList.remove('hidden');
            if (typeof initializeTiltEffect === 'function') {
              initializeTiltEffect();
            }
          }, 500);
        }, 1000);
        
        return;
      }
      
      // Check for re-enabling tracking with special command
      if (enteredPassword === "TergusonON" && localStorage.getItem('trackingDisabled') === 'true') {
        // Re-enable tracking
        localStorage.removeItem('trackingDisabled');
        console.log("Admin mode deactivated - tracking re-enabled");
        
        if (document.getElementById('password-feedback')) {
          document.getElementById('password-feedback').textContent = 'Tracking re-enabled';
          document.getElementById('password-feedback').style.color = '#51cf66'; // Green success color
        }
        
        // Still allow access with regular password handling
        sessionStorage.setItem('authenticated', 'true');
        
        // Animate transition
        const passwordContainer = document.querySelector('.password-container');
        const contentElement = document.getElementById('content');
        
        setTimeout(() => {
          passwordContainer.style.opacity = '0';
          setTimeout(() => {
            passwordContainer.style.display = 'none';
            contentElement.classList.remove('hidden');
            if (typeof initializeTiltEffect === 'function') {
              initializeTiltEffect();
            }
          }, 500);
        }, 1000);
        
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
  return `${ipData.city || ''}, ${ipData.region || ''}, ${ipData.country || ''}`.replace(/, ,/g, ',').replace(/^, /, '').replace(/, $/, '') || 'Unknown';
}

// Track a page view
async function trackPageView() {
  // Exit if tracking is disabled
  if (localStorage.getItem('trackingDisabled') === 'true') {
    console.log("Page view tracking skipped (admin mode)");
    return;
  }
  
  try {
    // Get the current session data
    const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking'));
    
    // Update last activity time
    sessionData.lastActivity = new Date().toISOString();
    sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
    
    // Try to get IP data
    const ipResponse = await fetch('https://ipinfo.io/json?token=898b193407ebcf');
    
    if (ipResponse.ok) {
      const ipData = await ipResponse.json();
      
      // Record page visit with IP data
      const pageVisit = {
        url: window.location.pathname,
        title: document.title,
        time: new Date().toISOString(),
        ip: ipData.ip || 'Unknown',
        location: formatLocation(ipData)
      };
      
      // Add to history
      sessionData.pageVisits.push(pageVisit);
      sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
      
      // Send notification
      sendTrackingEvent('Page View', {
        sessionId: sessionData.sessionId,
        url: pageVisit.url,
        title: pageVisit.title,
        ip: pageVisit.ip,
        location: pageVisit.location
      });
    } else {
      // Record page visit without IP data
      const pageVisit = {
        url: window.location.pathname,
        title: document.title,
        time: new Date().toISOString()
      };
      
      // Add to history
      sessionData.pageVisits.push(pageVisit);
      sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
      
      // Send notification
      sendTrackingEvent('Page View', {
        sessionId: sessionData.sessionId,
        url: pageVisit.url,
        title: pageVisit.title
      });
    }
  } catch (error) {
    console.error("Error in trackPageView:", error);
    
    // Still track the page view without IP data
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking'));
      
      // Record basic page visit
      const pageVisit = {
        url: window.location.pathname,
        title: document.title,
        time: new Date().toISOString()
      };
      
      // Add to history
      sessionData.pageVisits.push(pageVisit);
      sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
      
      // Send notification
      sendTrackingEvent('Page View', {
        sessionId: sessionData.sessionId,
        url: pageVisit.url,
        title: pageVisit.title
      });
    } catch (innerError) {
      console.error("Failed to track page view:", innerError);
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
        sessionId: sessionData.sessionId || 'Unknown',
        url: downloadInfo.url,
        filename: downloadInfo.filename
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
    sessionData.lastActivity = new Date().toISOString();
    sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
    
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
      downloadCount: sessionData.downloads ? sessionData.downloads.length : 0
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
    const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);
    
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

// Send tracking event via EmailJS
function sendTrackingEvent(eventType, eventData) {
  // Skip if tracking is disabled
  if (localStorage.getItem('trackingDisabled') === 'true') {
    console.log(`Tracking event '${eventType}' skipped (admin mode)`);
    return;
  }
  
  // Only proceed if EmailJS is available
  if (typeof emailjs === 'undefined') {
    console.error("EmailJS not available for tracking");
    return;
  }
  
  // Verify we have the needed information
  if (!eventType || !eventData) {
    console.error("Missing tracking event data");
    return;
  }
  
  // Add timestamp if not provided
  if (!eventData.time) {
    eventData.time = new Date().toISOString();
  }
  
  // Prepare email content
  const params = {
    to_email: 'dburnham9930@gmail.com',
    subject: `Visitor ${eventType} - Living with the Ghost of Sam`,
    message: `
      Event: ${eventType}
      Time: ${eventData.time || new Date().toISOString()}
      Session ID: ${eventData.sessionId || 'Unknown'}
      
      ${Object.entries(eventData).filter(([key]) => key !== 'sessionId')
        .map(([key, value]) => `${key}: ${value}`).join('\n')}
    `
  };
  
  // Send the email asynchronously
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
}
