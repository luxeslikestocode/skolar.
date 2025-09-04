
import React from 'react';

interface VideoPlayerProps {
  url: string;
  type: 'youtube' | 'local';
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, type }) => {
  if (type === 'youtube') {
    return (
      <iframe
        width="100%"
        height="100%"
        src={url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
      ></iframe>
    );
  }

  return (
    <video controls width="100%" height="100%" src={url} className="rounded-lg">
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
