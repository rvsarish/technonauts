import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [resultVideoUrl, setResultVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', video);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const videoUrl = response.data.resultVideoUrl;
      setLoading(false);
      setResultVideoUrl(videoUrl);
    } catch (error) {
      console.error('Error uploading video:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container" >
      <form className="upload-form" onSubmit={handleVideoUpload}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <button type="submit">Upload Video</button>
      </form>
      {loading && <p>Processing video, please wait...</p>}
      {resultVideoUrl && (
        <div className="video-container">
          <h3>Processed Video:</h3>
          <video src={`http://localhost:5000${resultVideoUrl}`} controls width="600" />
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
