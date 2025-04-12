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
  
  // Fetch IP information and track the page view
  fetchIPInfoAndTrackView();
  
  // Add listeners for downloads and PDF views
  setupDownloadTracking();
  
  // Setup tracking for when user leaves the page
  setupExitTracking();
});

// Fetch IP info and then track the page view
async function fetchIPInfoAndTrackView() {
  try {
    console.log("Fetching IP information...");
    const ipResponse = await fetch('https://ipinfo.io/json?token=898b193407ebcf');
    
    if (!ipResponse.ok) {
      throw new Error(`IP info fetch failed with status: ${ipResponse.status}`);
    }
    
    const ipData = await ipResponse.json();
    console.log("IP data retrieved:", ipData);
    
    // Now track the page view with the IP data
    trackPageView(ipData);
    
    // Send separate IP notification for debugging
    sendIPNotification(ipData);
    
  } catch (error) {
    console.error("Error fetching IP information:", error);
    // Still track the page view without IP data
    trackPageView({});
  }
}

// Send a dedicated IP notification for debugging
function sendIPNotification(ipData) {
  if (typeof emailjs === 'undefined') {
    console.error("EmailJS not available for IP notification");
    return;
  }
  
  const params = {
    to_email: 'dburnham9930@gmail.com',
    subject: 'IP Information - Living with the Ghost of Sam',
    message: `
      IP Information:
      -----------------------------
      IP: ${ipData.ip || 'Unknown'}
      City: ${ipData.city || 'Unknown'}
      Region: ${ipData.region || 'Unknown'}
      Country: ${ipData.country || 'Unknown'}
      Location: ${ipData.loc || 'Unknown'}
      ISP/Org: ${ipData.org || 'Unknown'}
      Postal Code: ${ipData.postal || 'Unknown'}
      Timezone: ${ipData.timezone || 'Unknown'}
      
      Page: ${window.location.pathname}
      Time: ${new Date().toISOString()}
      User Agent: ${navigator.userAgent}
    `
  };
  
  emailjs.send(
    'service_mglwuwe',
    'template_6cjvb36',
    params
  ).then(
    function(response) {
      console.log('IP notification sent successfully:', response);
    },
    function(error) {
      console.error('IP notification failed:', error);
    }
  );
}

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
function trackPageView(ipData = {}) {
  const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking'));
  const now = new Date();
  
  // If there's a current page, finalize its tracking before setting new page
  if (sessionData.currentPage) {
    finalizePageView(sessionData.currentPage, now);
  }
  
  // Set current page with IP data
  sessionData.currentPage = {
    url: window.location.pathname,
    title: document.title,
    entryTime: now.toISOString(),
    ipInfo: ipData
  };
  
  // Save updated session data
  sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
  
  // Format location string
  const location = `${ipData.city || ''}, ${ipData.region || ''}, ${ipData.country || ''}`.replace(/, ,/g, ',').replace(/^, /, '').replace(/, $/, '');
  
  // Send notification for new page view with IP info
  sendTrackingEvent('Page View', {
    sessionId: sessionData.sessionId,
    url: sessionData.currentPage.url,
    title: sessionData.currentPage.title,
    time: sessionData.currentPage.entryTime,
    ip: ipData.ip || 'Unknown',
    location: location || 'Unknown',
    isp: ipData.org || 'Unknown'
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
    durationSeconds: durationSeconds,
    ipInfo: pageData.ipInfo || {}
  };
  
  sessionData.pageVisits.push(completedVisit);
  sessionStorage.setItem('sessionTracking', JSON.stringify(sessionData));
  
  // Send notification for completed page view with duration
  sendTrackingEvent('Page Exit', {
    sessionId: sessionData.sessionId,
    url: completedVisit.url,
    title: completedVisit.title,
    duration: durationSeconds + ' seconds',
    ip: (completedVisit.ipInfo && completedVisit.ipInfo.ip) || 'Unknown'
  });
}

// Track downloads and PDF views
function setupDownloadTracking() {
  // Make the download function available globally
  window.trackDownload = function(url, filename) {
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
      
      // Track the download
      window.trackDownload(url, filename);
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
          window.trackDownload(this.href, filename);
        });
      }
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
    const ipInfo = visit.ipInfo || {};
    const location = `${ipInfo.city || ''}, ${ipInfo.region || ''}, ${ipInfo.country || ''}`.replace(/, ,/g, ',').replace(/^, /, '').replace(/, $/, '');
    
    summaryMessage += `
    ${index + 1}. ${visit.title} (${visit.url})
       Duration: ${visit.durationSeconds} seconds
       IP: ${ipInfo.ip || 'Unknown'}
       Location: ${location || 'Unknown'}
    `;
  });
  
  // Add downloads to summary if any
  if (sessionData.downloads && sessionData.downloads.length > 0) {
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
