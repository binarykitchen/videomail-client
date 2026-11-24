function getFirstVideoTrack(localMediaStream: MediaStream) {
  const videoTracks = localMediaStream.getVideoTracks();

  let videoTrack: MediaStreamTrack | undefined;

  if (videoTracks[0]) {
    videoTrack = videoTracks[0];
  }

  return videoTrack;
}

export default getFirstVideoTrack;
