


const baseUrl = config.baseUrl;

async function getTeacherIdFromToken(token) {
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.teacherId;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

$(document).ready(async function () {
  const storedToken = localStorage.getItem('teachablesteacheraccesstoken');

  if (storedToken) {
    try {
      const teacherId = await getTeacherIdFromToken(storedToken);

      if (teacherId) {
        fetchTeacherProfile(teacherId);
      } else {
        console.log('Unable to extract teacher ID from token.');
      }
    } catch (error) {
      console.error('Error in token processing:', error);
    }
  } else {
    console.log('Token not found in local storage. User may not be authenticated.');
  }
});

const fetchTeacherProfile = async (teacherId) => {
  try {
    const token = localStorage.getItem('teachablesteacheraccesstoken');
    const response = await $.ajax({
      url: `${baseUrl}/api/teachers/get-single-teacher/${teacherId}`,
      type: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.error) {
      console.error('Error in API response:', response.error);
      return;
    }

    const profileContainer = $('#profile-info-container');
    profileContainer.empty();

    const fullName = response.teacher.name;
    const email = response.teacher.email;
    const password = '**********'; 

    const fullNameElement = `
      <div class="list-group-item">
        <div class="new-form-group">
          <div>
            <label for="edit-user-name" class="form-label bodyMain">Full Name</label>
          </div>
          <div>
            <label id="edit-user-name" required="required" class="form-label-info bodyMain" autocomplete="name"
              disabled="disabled" for="name">${fullName}</label>
            <a class="bodySmall edit-btn btn" data-toggle="modal" data-target="#edit-profile-modal"
              id="edit-profile-btn">
              Edit
            </a>
          </div>
        </div>
      </div>
    `;

    const emailElement = `
      <div class="list-group-item">
        <div class="new-form-group">
          <div>
            <label for="edit-user-email" class="form-label bodyMain">Email</label>
          </div>
          <div>
            <label id="edit-user-email" required="required" class="form-label-info bodyMain"
              autocomplete="email" disabled="disabled" for="email">${email}</label>
            <a class="bodySmall edit-btn btn" data-toggle="modal" data-target="#edit-email-modal"
              id="edit-email-btn">
              Edit
            </a>
          </div>
        </div>
      </div>
    `;

    const passwordElement = `
      <div class="row list-group-item">
        <div class="new-form-group">
          <div>
            <label class="form-label bodyMain" for="new_password">Password</label>
          </div>
          <div>
          </div>
          <label id="password" required="required" type="password" autocomplete="current-password"
            class="form-label-info bodyMain" disabled="disabled" for="current_password">${password}</label>
          <a class="bodySmall edit-btn btn" data-toggle="modal" data-target="#edit-password-modal"
            id="edit-password-btn">
            Change
          </a>
        </div>
      </div>
    `;

    profileContainer.append(fullNameElement);
    profileContainer.append(emailElement);
    profileContainer.append(passwordElement);

 

    $('#edit-profile-btn').click(function () {
      // Open the edit profile modal
      // console.log("clicked")
      $('#edit-profile-name').val(fullName);
      $('#edit-profile-modal').modal('show');
    });

    $('#edit-email-btn').click(function () {
      // Open the edit email modal
      $('#edit-email').val(email);
      $('#edit-email-modal').modal('show');
    });

    $('#edit-password-btn').click(function () {
      // Open the edit password modal
      $('#edit-password-modal').modal('show');
    });

    $('#save-profile-changes-btn').click(function () {
      // Handle saving profile changes
      saveProfileChanges();
    });

    $('#save-email-changes-btn').click(function () {
      // Handle saving email changes
      saveEmailChanges();
    });

    $('#save-password-changes-btn').click(function () {
      // Handle saving password changes
      savePasswordChanges();
    });

  } catch (error) {
    console.error('Error fetching teacher profile:', error);
  }

      // Logout call
      $('#logout-button').click(async function() {
      
        // console.log("clicked")
        try {
          
          // Show loader
          $('#loader-container').removeClass('hidden');
          const response = await logout();
          // Hide loader
          $('#loader-container').addClass('hidden');
          // Handle logout success
          console.log('Logout successful:', response.message);
          // Redirect to login page
          window.location.href = 'login.html';
        } catch (error) {
          console.error('Error during logout:', error);
          // Hide loader in case of error
          $('#loader-container').addClass('hidden');
        }
      });
};

const saveProfileChanges = async () => {
  try {
    const token = localStorage.getItem('teachablesteacheraccesstoken');
    const teacherId = await getTeacherIdFromToken(token);

    const newName = $('#edit-profile-name').val();

    const response = await $.ajax({
      url: `${baseUrl}/api/teachers/edit-profile`,
      type: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: {
        teacher_id: teacherId,
        name: newName,
      },
    });

    if (response.message) {
      // Show success message using SweetAlert 2
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.message,
      });

      // Update the displayed name
      $('#edit-user-name').text(newName);

      // Close the modal
      $('#edit-profile-modal').modal('hide');
      
    } else {
      // Show error message using SweetAlert 2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.error || 'Failed to update profile.',
      });
    }
  } catch (error) {
    console.error('Error saving profile changes:', error);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.error || 'Failed to update profile',
      });
  }
};

const saveEmailChanges = async () => {
  try {
    const token = localStorage.getItem('teachablesteacheraccesstoken');
    const teacherId = await getTeacherIdFromToken(token);

    const newEmail = $('#edit-email').val();

    const response = await $.ajax({
      url: `${baseUrl}/api/teachers/edit-profile`,
      type: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: {
        teacher_id: teacherId,
        email: newEmail,
      },
    });

    if (response.message) {
      // Show success message using SweetAlert 2
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.message,
      });

      // Update the displayed email
      $('#edit-user-email').text(newEmail);

      // Close the modal
      $('#edit-email-modal').modal('hide');
    } else {
      // Show error message using SweetAlert 2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.error || 'Failed to update email.',
      });
    }
  } catch (error) {
    console.error('Error saving email changes:', error);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.error || 'Failed to update email',
      });
  }
};

const savePasswordChanges = async () => {
  try {
    const token = localStorage.getItem('teachablesteacheraccesstoken');
    const teacherId = await getTeacherIdFromToken(token);

    const newPassword = $('#edit-new-password').val();
    const confirmNewPassword = $('#edit-confirm-password').val();

    const response = await $.ajax({
      url: `${baseUrl}/api/teachers/change-password`,
      type: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: {
        teacher_id: teacherId,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      },
    });

    if (response.message) {
      // Show success message using SweetAlert 2
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.message,
      });

      // Close the modal
      $('#edit-password-modal').modal('hide');
    } else {
      // Show error message using SweetAlert 2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.error || 'Failed to change password.',
      });
    }
  } catch (error) {
    console.error('Error saving password changes:', error.responseJSON.error);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.error || 'Error saving password changes',
      });
  }
};


  // Check authentication when the document is ready
  $(document).ready(function () {
    if (!isAuthenticated()) {
      redirectToLogin();
    }
  });