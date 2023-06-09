document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    let videoWidth, videoHeight;
  
    // Check if the browser supports getUserMedia
    const hasUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  
    // Initialize camera stream
    if (hasUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          const video = document.createElement('video');
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            videoWidth = video.videoWidth;
            videoHeight = video.videoHeight;
            adjustCanvasSize();
            requestAnimationFrame(captureFrame);
          };
          canvas.parentNode.insertBefore(video, canvas);
        })
        .catch((error) => {
          console.log('Error accessing camera:', error);
        });
    } else {
      console.log('getUserMedia is not supported in this browser.');
    }
  
    // Adjust canvas size to match video dimensions
    function adjustCanvasSize() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const windowAspectRatio = windowWidth / windowHeight;
      const videoAspectRatio = videoWidth / videoHeight;
  
      if (windowAspectRatio < videoAspectRatio) {
        canvas.width = videoAspectRatio * windowHeight;
        canvas.height = windowHeight;
      } else {
        canvas.width = windowWidth;
        canvas.height = windowWidth / videoAspectRatio;
      }
    }
  
    // Capture video frame and draw on canvas
    function captureFrame() {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(captureFrame);
    }
  
    // Adjust canvas size when the window is resized
    window.addEventListener('resize', adjustCanvasSize);
  });
  