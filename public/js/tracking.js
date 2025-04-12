// Page and Download Tracking System
// Add this to your main script or create a separate tracking.js file to include on all pages

document.addEventListener('DOMContentLoaded', function() {
  // Only skip if authentication is required but not present
  // If we're on the login page or a page that doesn't require auth, still track
  if (document.getElementById('splash') && !sessionStorage.getItem('authenticated')) {
    console.log("Tracking disabled: authentication required but not present");
    return;
  }
  
  // Initialize session tracking
   initializeSessionTracking();
  
  // Track current page view
  trackPageView();
  
  // Add listeners for downloads and PDF views
  setupDownloadTracking();
  
  // Setup tracking for when user leaves the page
  setupExitTracking();
});

// Initialize or retrieve tracking data
function initializeSessionTracking() {
  if (!sessionStorage.getItem('sessionTracking')) {
    const sessionData = {
      sessionId: generateSessionId(),
      startTime: new Date().toISOString(),
      currentPage: null,
      pageVisits: [],
      downloads: []
    };
    sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
    
    // Send initial session notification
    sendTrackingEvent('Session Started', {
      sessionId: sessionData.sessionId,
      startTime: sessionData.startTime
    });
  }
}

// Generate a unique session ID
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Track a page view including entry time
function trackPageView() {
  const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking'));
  const now = new Date();
  
  // If there's a current page, finalize its tracking before setting new page
  if (sessionData.currentPage) {
    finalizePageView(sessionData.currentPage, now);
  }
  
  // Set current page
  sessionData.currentPage = {
    url: window.location.pathname,
    title: document.title,
    entryTime: now.toISOString()
  };
  
  // Save updated session data
  sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
  
  // Send notification for new page view
  sendTrackingEvent('Page View', {
    sessionId: sessionData.sessionId,
    url: sessionData.currentPage.url,
    title: sessionData.currentPage.title,
    time: sessionData.currentPage.entryTime
  });
}

// Finalize a page view by calculating time spent and recording it
function finalizePageView(pageData, exitTime) {
  const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking'));
  const entryTime = new Date(pageData.entryTime);
  const durationMs = exitTime - entryTime;
  const durationSeconds = Math.round(durationMs / 1000);
  
  // Add completed page visit to history
  const completedVisit = {
    url: pageData.url,
    title: pageData.title,
    entryTime: pageData.entryTime,
    exitTime: exitTime.toISOString(),
    durationSeconds: durationSeconds
  };
  
  sessionData.pageVisits.push(completedVisit);
  sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
  
  // Send notification for completed page view with duration
  sendTrackingEvent('Page Exit', {
    sessionId: sessionData.sessionId,
    url: completedVisit.url,
    title: completedVisit.title,
    duration: durationSeconds + ' seconds'
  });
}

// Track downloads and PDF views
function setupDownloadTracking() {
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
      link.addEventListener('click', function(e) {
        const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking'));
        const downloadInfo = {
          url: this.href,
          filename: this.getAttribute('download') || this.href.split('/').pop(),
          time: new Date().toISOString()
        };
        
        sessionData.downloads.push(downloadInfo);
        sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
        
        // Send notification for download
        sendTrackingEvent('Download', {
          sessionId: sessionData.sessionId,
          url: downloadInfo.url,
          filename: downloadInfo.filename
        });
      });
    }
  });
}

// Set up tracking for when user leaves the page
function setupExitTracking() {
  // Track when switching pages within the site
  window.addEventListener('beforeunload', function() {
    const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking'));
    if (sessionData && sessionData.currentPage) {
      finalizePageView(sessionData.currentPage, new Date());
    }
  });
  
  // Track when session ends completely
  window.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking'));
      if (sessionData && sessionData.currentPage) {
        finalizePageView(sessionData.currentPage, new Date());
      }
    }
  });
}

// Send tracking event via EmailJS
function sendTrackingEvent(eventType, eventData) {
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
  
  // Prepare email content
  const params = {
    to_email: 'dburnham9930@gmail.com',
    subject: `Visitor ${eventType} - Living with the Ghost of Sam`,
    message: `
      Event: ${eventType}
      Time: ${new Date().toISOString()}
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

// Generate a session summary report - can be called when needed
function generateSessionSummary() {
  const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking'));
  if (!sessionData) return;
  
  const now = new Date();
  const startTime = new Date(sessionData.startTime);
  const totalDurationMs = now - startTime;
  const totalMinutes = Math.round(totalDurationMs / 60000);
  
  // Prepare summary message
  let summaryMessage = `
    Session Summary
    ------------------------------
    Session ID: ${sessionData.sessionId}
    Start Time: ${sessionData.startTime}
    Duration: ${totalMinutes} minutes
    
    Pages Visited:
    ------------------------------
  `;
  
  // Add page visits to summary
  sessionData.pageVisits.forEach((visit, index) => {
    summaryMessage += `
    ${index + 1}. ${visit.title} (${visit.url})
       Duration: ${visit.durationSeconds} seconds
    `;
  });
  
  // Add downloads to summary if any
  if (sessionData.downloads.length > 0) {
    summaryMessage += `
    Downloads:
    ------------------------------
    `;
    
    sessionData.downloads.forEach((download, index) => {
      summaryMessage += `
    ${index + 1}. ${download.filename}
       URL: ${download.url}
       Time: ${download.time}
      `;
    });
  }
  
  // Send the summary
  sendTrackingEvent('Session Summary', {
    sessionId: sessionData.sessionId,
    summary: summaryMessage
  });
  
  return summaryMessage;
}
