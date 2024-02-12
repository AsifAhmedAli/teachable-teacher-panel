

const baseUrl = config.baseUrl;



async function getTeacherIdFromToken(token) {
    try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        return tokenData.teacherId;
    } catch (error) {
        console.error('Error decoding token:', error);
        throw error; // Propagate the error
    }
}

$(document).ready(async function () {
    const storedToken = localStorage.getItem('teachablesteacheraccesstoken');

    if (storedToken) {
        try {
            // Get student ID from the token
            const teacherId = await getTeacherIdFromToken(storedToken);

            if (teacherId) {
                // Fetch student data based on the student ID
                fetchTeacherData(teacherId, storedToken);
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

function fetchTeacherData(teacherId, storedToken) {
    // Get the URL parameter function
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Extract courseId from the URL
const courseId = getUrlParameter('courseId');

// console.log(courseId);
    $.ajax({
        url: `${baseUrl}/api/teachers/get-single-course-taught-by-teacher/${courseId}/${teacherId}`,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${storedToken}`,
        },
        success: function (data) {
            // console.log(data);

            // Clear existing content in case this is a subsequent call
            $('#course-container').empty();

            // Update HTML content for the single course
            const course = data.course;
            const title = course.title;
            const courseId = course.course_id;

            // Create HTML elements for the course and append to the container
            const courseElement = `
            <h2 class="jsx-4255369697 heading">${title}</h2>`;

            $('#course-title').append(courseElement);

            // Loop through videos and update HTML content
            const videos = course.videos;
            videos.forEach(video => {
                const videoTitle = video.video_title;
                const videoUrl = video.video_url;

                // Create HTML elements for each video and append to the container
                const videoElement = `
                <div class="jsx-2138578525 bar"><svg class="jsx-2138578525 status-icon">
                                <use xlink:href="#icon-circle-outline" class="jsx-2138578525"></use>
                            </svg><a
                                href="lecture-page.html?courseId=${courseId}"
                                class="jsx-2138578525 text">
                                <h3 class="jsx-2138578525 text-uppercase" >${videoTitle}</h3>
                                <div class="jsx-2138578525 info-wrapper">
                                    <div class="jsx-2138578525 info">
                                    <svg class="jsx-2138578525 icon">
                                            <use xlink:href="#icon-video" class="jsx-2138578525"></use>
                                        </svg>

                                    </div>
                                </div>
                            </a><a
                                href="lecture-page.html?courseId=${courseId}"
                                class="jsx-2138578525"><button type="button"
                                    class="jsx-2138578525 button secondaryButton">Start</button></a></div>`;

                $('#lectures').append(videoElement);
            });

            // console.log('Fetched data:', data);
        },
        error: function (error) {
            console.error('Error fetching student data:', error);
        }
        
    });

    // Logout call
    $('#logout-button').click(async function() {
        console.log("clicked")
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
  
}

  // Check authentication when the document is ready
  $(document).ready(function () {
    if (!isAuthenticated()) {
      redirectToLogin();
    }
  });