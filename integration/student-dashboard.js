

const baseUrl = config.baseUrl;

$(document).ready(async function () {
  const storedToken = localStorage.getItem('teachablesteacheraccesstoken');
  
  if (storedToken) {
    try {
      // Get student ID from the token
      const teacherId = await getTeacherIdFromToken(storedToken);

      if (teacherId) {
        // Fetch student data based on the student ID
        fetchStudentData(teacherId, storedToken);
      } else {
        console.log('Unable to extract student ID from token.');
      }
    } catch (error) {
      console.error('Error in token processing:', error);
    }
  } else {
    console.log('Token not found in local storage. User may not be authenticated.');
  }

  // Attach keyup event handler to search input
  $('#search-courses').keyup(async function(event) {
    const query = $(this).val();
    try {
      // Show loader
      $('#loader-container').removeClass('hidden');
      const response = await searchCourses(query);
      // Hide loader
      $('#loader-container').addClass('hidden');
      // Handle response
      // console.log('Search results:', response);
      // Update courses based on search results
      updateCourses(response.courses);
    } catch (error) {
      console.error('Error searching courses:', error);
      // Hide loader in case of error
      $('#loader-container').addClass('hidden');
    }
  });
});

async function getTeacherIdFromToken(token) {
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.teacherId; 
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error; // Propagate the error
  }
}

async function fetchStudentData(teacherId, token) {
  $.ajax({
    url: `${baseUrl}/api/teachers/get-courses-taught-by-teacher/${teacherId}`,
    type: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    success: function(data) {
      // Update HTML content for courses
      updateCourses(data.courses);
    },
    error: function(error) {
      console.error('Error fetching student data:', error);
    }
  });
}

async function searchCourses(query) {
   
  const token = localStorage.getItem('teachablesteacheraccesstoken');
  const tokenData = JSON.parse(atob(token.split('.')[1]));
  const teacherId = tokenData.teacherId;
  // console.log(teacherId)
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${baseUrl}/api/teachers/search-courses/search/${teacherId}?query=${query}`,
      type: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      success: function(data) {
        resolve(data);
      },
      error: function(error) {
        reject(error);
      }
    });
  });
}

function updateCourses(courses) {
  // Clear existing content
  $('#course-container').empty();
  // Update HTML content for each course
  courses.forEach(course => {
    const title = course.title;
    const courseId = course.course_id;
    // Create HTML elements for each course and append to the container
    const courseElement = `
      <div class="col-xs-12 col-sm-6 col-md-4">
        <div data-course-id="${courseId}" data-course-url="/courses/enrolled/${courseId}" class="course-listing">
          <div class="row">
            <a href="course-details.html?courseId=${courseId}" data-role="course-box-link">
              <div class="col-lg-12">
                <div class="course-box-image-container">
                  <img class="course-box-image" src="./student-dashboard_files/Thumbnail.png" role="presentation" alt="">
                </div>
                <div class="course-listing-title" id="course-title-${courseId}" role="heading" aria-level="2">
                  ${title}
                </div>
                <div class="col-xs-12 course-listing-enrolled" aria-hidden="false">
                  <p class="course-access-limit hidden">Available until <span></span></p>
                </div>
              </div>
            </a>
          </div>
          <div class="course-listing-extra-info" aria-hidden="false">
            <div>
              <img class="img-circle" src="./student-dashboard_files/JPG-05.jpg" alt="Chroma Tech Academy">
              <span class="small course-author-name">Chroma Tech Academy</span>
            </div>
            <div class="hidden" aria-hidden="true">
          </div>
        </div>
      </div>`;
    $('#course-container').append(courseElement);

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
    
  });
}

  // Check authentication when the document is ready
  $(document).ready(function () {
    if (!isAuthenticated()) {
      redirectToLogin();
    }
  });
