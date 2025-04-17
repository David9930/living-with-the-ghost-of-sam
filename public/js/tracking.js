// Function to track contact form submissions
window.trackContactRequest = function(email, category, sessionId) {
  // Skip if tracking is disabled
  if (localStorage.getItem('trackingDisabled') === 'true') {
    console.log("Contact request tracking skipped (admin mode)");
    return true; // Return true to indicate "success" even though we're skipping
  }
  
  try {
    // Validate inputs
    if (!email || !category) {
      console.error('Missing required parameters for tracking contact request');
      return false;
    }
    
    // Get the session data if sessionId is not provided or is 'Unknown'
    if (!sessionId || sessionId === 'Unknown') {
      try {
        const sessionData = JSON.parse(sessionStorage.getItem('sessionTracking') || '{}');
        sessionId = sessionData.sessionId || 'Unknown';
      } catch (error) {
        console.error('Error getting session data:', error);
        // Continue with Unknown sessionId
      }
    }
    
    // Make sure EmailJS is available before trying to use it
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS not available for tracking contact request');
      return false;
    }
    
    // Send notification for contact request
    sendTrackingEvent('Contact Request', {
      sessionId: sessionId,
      email: email,
      category: category,
      page: window.location.pathname,
      time: new Date().toISOString()
    });
    
    console.log(`Contact request tracked for category: ${category}`);
    return true;
  } catch (error) {
    console.error('Error tracking contact request:', error);
    return false;
  }
};
