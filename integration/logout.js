window.logout = async function() {
    const baseUrl = config.baseUrl;
    const token = localStorage.getItem('teachablesteacheraccesstoken');
  
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${baseUrl}/api/teachers/teacher-logout`,
        type: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        success: function(data) {
          // Clear the JWT token from local storage
          localStorage.removeItem('teachablesteacheraccesstoken');
          resolve(data);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  };
  