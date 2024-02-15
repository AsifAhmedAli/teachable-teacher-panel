const baseUrl = config.baseUrl;

function submitLoginForm() {
  // Show loader
  $('#loader-container').removeClass('hidden');

  const email = $('#email').val();
  const password = $('#password').val();

  const requestData = {
    email: email,
    password: password,
  };

  $.ajax({
    url: `${baseUrl}/api/teachers/login`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(requestData),
    success: function(data) {
      // Hide loader
      $('#loader-container').addClass('hidden');

      if (data.token) {
        // Save the token in localStorage or sessionStorage
        localStorage.setItem('teachablesteacheraccesstoken', data.token);
        
        // Redirect to student dashboard
        window.location.href = 'student-dashboard.html'; // it is actually techer dashboard
        
        // Show success message from API response
        $('#success-message').text(data.successMessage || 'Login successful!');
      } else {
        // Show error message from API response
        $('#error-message').text(data.errorMessage || 'Login failed. Please check your credentials.');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // Hide loader
      $('#loader-container').addClass('hidden');

      // Show error message from API response
      const errorMessage = jqXHR.responseJSON ? jqXHR.responseJSON.message || jqXHR.responseJSON.error : 'An error occurred during login. Please try again later.';
      $('#error-message').text(errorMessage);
      
      console.error('Error during login:', errorThrown);
    }
  });
}
