


  // const baseUrl = config.baseUrl;

  // async function getTeacherIdFromToken(token) {
  //   try {
  //     const tokenData = JSON.parse(atob(token.split('.')[1]));
  //     return tokenData.teacherId;
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //     throw error;
  //   }
  // }

  // $(document).ready(async function () {
  //   const storedToken = localStorage.getItem('teachablesteacheraccesstoken');

  //   if (storedToken) {
  //     try {
  //       const teacherId = await getTeacherIdFromToken(storedToken);

  //       if (teacherId) {
  //         getTeacherCourses(teacherId); 
  //       } else {
  //         console.log('Unable to extract student ID from token.');
  //       }
  //     } catch (error) {
  //       console.error('Error in token processing:', error);
  //     }
  //   } else {
  //     console.log('Token not found in local storage. User may not be authenticated.');
  //   }
  // });

  // // Function to fetch student courses
  // const getTeacherCourses = (teacherId) => {
  //   const token = localStorage.getItem('teachablesteacheraccesstoken');
  //   // Show loader
  //   $('#loader-container').removeClass('hidden');

  //   $.ajax({
  //     url: `${baseUrl}/api/teachers/get-courses-taught-by-teacher/${teacherId}`,
  //     type: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //     },
  //     success: function(data) {
        
  //       const courses = data.courses;

  //       // Populate table with courses
  //       const tableBody = $('#course-table-body');
  //       tableBody.empty();

  //       courses.forEach(course => {
  //         const row = `
  //           <tr>
  //             <td>${course.title}</td>
              
              
  //             <td>${moment(course.created_at).format('DD-MM-YYYY HH:mm')}</td>

  //             <td>
  //               <a href="course-details.html?courseId=${course.course_id}" class="edit-course-link" data-course-id="${course.course_id}">
  //             <button type="button" class="btn btn-primary edit-course-btn">View Details</button>
  //           </a>

  //             </td>
  //           </tr>
  //         `;
  //         tableBody.append(row);
  //       });

  //       // Hide loader
  //       $('#loader-container').addClass('hidden');
  //     },
  //     error: function(error) {
  //       console.error('Error fetching student courses:', error.responseJSON.message || error.responseJSON.error);
  //       if(error.responseJSON.message === "Access token has expired"){
  //         // console.log("expired")
  //         window.location.href = "login.html"
  //       }
  //       // Hide loader in case of error
  //       $('#loader-container').addClass('hidden');
  //     }
  //   });
  // };

  // // Example event listener for edit button click
  // $(document).on('click', '.edit-course-btn', function() {
  //   const courseId = $(this).data('course-id');
  //   // Perform actions for editing the course
  //   // console.log('Editing course:', courseId);
  // });

  //   // Check authentication when the document is ready
  //   $(document).ready(function () {
  //     if (!isAuthenticated()) {
  //       redirectToLogin();
  //     }
  //   });




  

  
  

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

$(document).ready(async function () {
  const storedToken = localStorage.getItem('teachablesteacheraccesstoken');

  if (storedToken) {
    try {
      const teacherId = await getTeacherIdFromToken(storedToken);

      if (teacherId) {
        getTeacherCourses(teacherId);
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

// Function to fetch teacher courses
const getTeacherCourses = (teacherId) => {
  const token = localStorage.getItem('teachablesteacheraccesstoken');
  // Show loader
  $('#loader-container').removeClass('hidden');

  $.ajax({
    url: `${baseUrl}/api/teachers/get-courses-taught-by-teacher/${teacherId}`,
    type: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    success: function (data) {
      const courses = data.courses;

      // Populate table with courses
      const tableBody = $('#course-table-body');
      tableBody.empty();

      courses.forEach(course => {
        const row = `
          <tr>
            <td>${course.title}</td>
            <td>${moment(course.created_at).format('DD-MM-YYYY HH:mm')}</td>
            <td>
              <button type="button" class="btn btn-primary upload-video-btn" data-course-id="${course.course_id}">
                Upload Video
              </button>
              <a href="course-details.html?courseId=${course.course_id}" class="edit-course-link" data-course-id="${course.course_id}">
              <button type="button" class="btn btn-primary edit-course-btn">View Details</button>
            </a>
            </td>
          </tr>
        `;
        tableBody.append(row);
      });

      // Hide loader
      $('#loader-container').addClass('hidden');
    },
    error: function (error) {
      console.error('Error fetching teacher courses:', error.responseJSON.message || error.responseJSON.error);
      if (error.responseJSON.message === "Access token has expired") {
        window.location.href = "login.html";
      }
      // Hide loader in case of error
      $('#loader-container').addClass('hidden');
    }
  });
};

// Event listener for upload video button click
$(document).on('click', '.upload-video-btn', function () {
  const courseId = $(this).data('course-id');
  $('#uploadVideoModal').modal('show');
 
  $('#courseIdInput').val(courseId);

});



// Event listener for video upload form submission
$('#videoUploadForm').submit(function (event) {
  event.preventDefault();
  const formData = new FormData(this);
// Show loader
$('#loader-container').removeClass('hidden');

  $.ajax({
    url: `${baseUrl}/api/teachers/upload-video-to-course`,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('teachablesteacheraccesstoken')}`,
    },
    success: function (data) {
     
      // Show loader
  $('#loader-container').addClass('hidden');
   // Use SweetAlert2 for success message
   Swal.fire({
    icon: 'success',
    title: 'Success',
    text: data.message,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK'
  }).then((result) => {
    if (result.isConfirmed) {
      $('#uploadVideoModal').modal('hide');
      // Refresh the course list or perform any necessary actions
      getTeacherCourses($('#courseIdInput').val());
      // Redirect to enrolled-courses.html
      window.location.href = "enrolled-courses.html";
    }
  });
  
},

    error: function (error) {
      $('#loader-container').addClass('hidden');
      console.error('Error uploading video:', error.responseJSON.message || error.responseJSON.error);
       // Use SweetAlert2 for error message
       Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.message || error.responseJSON.error,
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  });
});

// Check authentication when the document is ready
$(document).ready(function () {
  if (!isAuthenticated()) {
    redirectToLogin();
  }
});

 
