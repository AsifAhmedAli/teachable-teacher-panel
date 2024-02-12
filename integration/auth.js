
function isAuthenticated() {
    return localStorage.getItem('teachablesteacheraccesstoken') !== null;
  }
  
  function redirectToLogin() {
    window.location.href = 'login.html';
  }
  

  