// Stopping every track tells the browser to release the camera and microphone. 🎥
function stopMediaStream(stream?: MediaStream) {
  stream?.getTracks().forEach((track) => {
    track.stop();
  });
}

export default stopMediaStream;
