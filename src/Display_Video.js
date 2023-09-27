import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const VideoPage = () => {
  const { thumbnailId } = useParams();
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const videoUrl = `http://localhost:3001/api/video/${thumbnailId}`;
    console.log('Video URL::', videoUrl); 
  
    axios.get(videoUrl)
      .then((response) => {
        setVideoUrl(response.data.videoUrl);
      })
      .catch((error) => {
        console.error('Error fetching video URL:', error);
      });
  }, [thumbnailId]);
  
  

  return (
    <div>
      <h2>Video Page</h2>
      <ReactPlayer url={videoUrl} controls playing width="100%" />
    </div>
  );
};

export default VideoPage;
