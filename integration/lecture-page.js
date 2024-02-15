


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
                // Fetch teacher data based on the teacher ID
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

function fetchTeacherData(teacherId, token) {
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
            'Authorization': `Bearer ${token}`,
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
            <sp>${title}</sp`;

            $('#course-title').append(courseElement);
           

            // Loop through videos and update HTML content
            const videos = course.videos;
            videos.forEach(video => {
              const videoId = video.video_id
                const videoTitle = video.video_title;
                const videoUrl = video.video_url;

                // Create HTML elements for each video and append to the container
                const videoElement = `
                <li data-lecture-id="${videoId}" data-lecture-url="/courses/justiceleague/lectures/${videoId}"
      class="section-item incomplete">
      <a class="item" data-no-turbolink="true" data-ss-course-id="${courseId}"
        data-ss-event-name="Lecture: Navigation Sidebar"
        data-ss-event-href="/courses/justiceleague/lectures/${videoId}" data-ss-event-type="link"
        data-ss-lecture-id="${videoId}" data-ss-position="5" data-ss-school-id="1368024"
        data-ss-user-id="99517343" data-video-url="${video.video_url}"  
        href="https://chromatechacademy.teachable.com/courses/justiceleague/lectures/${videoId}"
        id="sidebar_link_${videoId}">
        <span class="status-container">
          <span class="status-icon">
            &nbsp;
          </span>
        </span>
        <div class="title-container">
          <span class="lecture-icon v-middle">
            <svg width="24" height="24">
              <use xlink:href="#icon__Video"></use>
            </svg>
          </span>
          <span class="lecture-name text-uppercase">
            ${videoTitle}
            
          </span>
        </div>
      </a>
    </li>
                `;

                $('#lectures').append(videoElement);
            });
            

            // console.log('Fetched data:', data);
        },
        error: function (error) {
            console.error('Error fetching student data:', error);
        }
        
    });
    
    $('#lectures').on('click', 'a.item', function (event) {
event.preventDefault();

const videoId = $(this).data('ss-lecture-id');
const videoUrl = $(this).data('video-url'); 
const videoTitle = $(this).find('.lecture-name').text(); // Get the video title


// Update the iframe source with the fetched video URL
$('iframe[data-testid="embed-player"]').attr('src', videoUrl);
// Update the video title
$('#lecture_heading').text(videoTitle);
 // Show the video player container
 $('.lecture-attachment-type-video').show();
});

}


  // Check authentication when the document is ready
  $(document).ready(function () {
    if (!isAuthenticated()) {
      redirectToLogin();
    }
  });

