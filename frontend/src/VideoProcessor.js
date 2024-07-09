import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const VideoProcessor = () => {
  const [video, setVideo] = useState(null);
  const [resultVideoUrl, setResultVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", video);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const videoUrl = response.data.resultVideoUrl;
      setLoading(false);
      setResultVideoUrl(videoUrl);
    } catch (error) {
      console.error("Error uploading video:", error);
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    setVideo(file);
    setFileName(file.name);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setFileName(file.name);
  };

  return (
    <div className="processor-container">
      <h1 className="home-subtitle">
        Real Time Shoplifting Detection Using ML Model
      </h1>
      <h1 className="home-subtitle">Upload and Analyze Video</h1>
      <form className="upload-form" onSubmit={handleVideoUpload}>
        <div
          className={`drop-zone ${dragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <p>Drag & Drop your video here</p>
        </div>
        <label htmlFor="file-upload" className="file-upload-label">
          Select File
          <input
            id="file-upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
        <button type="submit" className="upload-button" disabled={!video}>
          {fileName ? `Upload ${fileName}` : "Upload Video"}
        </button>
      </form>
      {loading && <p>Processing video, please wait...</p>}
      {resultVideoUrl && (
        <div className="video-section">
          <div className="video-item">
            <h3>Uploaded Video:</h3>
            <video src={URL.createObjectURL(video)} controls width="100%" />
          </div>
          <div className="video-item">
            <h3>Processed Video:</h3>
            <video
              src={`http://localhost:5000${resultVideoUrl}`}
              controls
              width="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoProcessor;
