function updateDateTime() {
    const now = new Date();
  
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
  
    const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
  
    document.getElementById('date').textContent = dateString;
    document.getElementById('time').textContent = timeString;
  }
  
  setInterval(updateDateTime, 1000);