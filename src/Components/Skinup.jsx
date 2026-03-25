import React, { useState, useRef } from 'react';
import './Skinup.css';
import skin from '../assets/skin.gif';
import border from '../assets/border.png';

function Skinup() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null); // For displaying uploaded photo path
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Start the webcam when button is clicked
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error accessing webcam: ', err);
    }
  };

  // Stop the webcam stream
  const stopCamera = () => {
    let stream = videoRef.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  // Capture the photo from the webcam stream
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
  };

  // Upload the captured photo to the server
  const uploadPhoto = async () => {
    const formData = new FormData();
    // Convert the photo to Blob format for upload
    const blob = dataURLToBlob(photo);
    formData.append('image', blob, 'captured-image.png');

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUploadedPhoto(data.filePath); // Display the uploaded file path
        alert('File uploaded successfully!');
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error uploading the photo:', error);
      alert('Upload failed');
    }
  };

  // Convert DataURL to Blob
  const dataURLToBlob = (dataUrl) => {
    const [header, base64Data] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(base64Data);
    const length = binary.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mime });
  };

  return (
    <div className="skinup-container">
      <img src={skin} alt="Skin" className="skinup-image" />

      <div className="upload">
        <h1 className='up-h1'>Upload your Photo or Take your photo</h1>
        {/* Photo Upload */}
        <div className="upload-wrapper">
          <button className="upload-button" onClick={startCamera}>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" className="svg-icon">
              <g strokeWidth={2} strokeLinecap="round" stroke="#fff" fillRule="evenodd" clipRule="evenodd">
                <path d="M4 9c0-1.10457.89543-2 2-2h2l.44721-.89443c.33879-.67757 1.03131-1.10557 1.78889-1.10557h3.5278c.7576 0 1.4501.428 1.7889 1.10557L16 7h2c1.1046 0 2 .89543 2 2v8c0 1.1046-.8954 2-2 2H6c-1.10457 0-2-.8954-2-2z" />
                <path d="M15 13c0 1.6569-1.3431 3-3 3s-3-1.3431-3-3 1.3431-3 3-3 3 1.3431 3 3z" />
              </g>
            </svg>
            <span className="button-label">Take a Photo</span>
          </button>
        </div>

        <div className="upload-wrapper">
          <label htmlFor="file" className="custom-file-upload">
            <div className="icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <g>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.5523 19.4477 10 20 10C20.5523 10 21 9.5523 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                    fill="#e8e8e8"
                  />
                </g>
              </svg>
            </div>
            <div className="text">
              <span>Click to upload image</span>
            </div>
            <input id="file" type="file" />
          </label>
        </div>

        {/* Display the webcam feed */}
        {isCameraActive && (
          <div className="video-container">
            <video ref={videoRef} autoPlay></video>
            <button className="capture-button" onClick={capturePhoto}>Capture Photo</button>
            <button className="stop-button" onClick={stopCamera}>Stop Webcam</button>
          </div>
        )}

        {/* Display captured photo */}
        {photo && <img ref={imageRef} src={photo} alt="Captured" />}
        <div>
          {photo && (
            <button onClick={uploadPhoto}>Upload Photo</button>
          )}
        </div>

        {/* Display uploaded photo path */}
        {uploadedPhoto && (
          <div>
            <h3>Uploaded Image:</h3>
            <img src={`http://localhost:5000${uploadedPhoto}`} alt="Uploaded" />
          </div>
        )}
      </div>

      {/* Hidden canvas to draw the photo */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      <img src={border} className='Borderimg' alt="Border" />
    </div>
  );
}

export default Skinup;