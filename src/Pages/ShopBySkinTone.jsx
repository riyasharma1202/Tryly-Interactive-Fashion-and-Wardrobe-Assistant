import React, { useState, useRef, useEffect, useContext } from 'react';
import Navbar from '../Components/Navbar';
import Header from '../Components/Header';
import './ShopBySkinTone.css';
import { CartContext } from '../Context/CartContext';

const ShopBySkinTone = () => {
  const { addToCart } = useContext(CartContext);
  const [cameraActive, setCameraActive] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stream, setStream] = useState(null);
  const [skinTone, setSkinTone] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const clothes = [
    {
      name: 'StyleCast',
      description: 'Men Checked without Longline Tailored Jacket',
      imgSrc: 'https://encrypted-tbn0.gstatic.com/shopping?q9GcTU1F4fajwjb44vG7ES-BF-7DcnUAzxDmvrogdhfZsOFDMe7BLafilknH5T21Rs4nA7Ytxmk30QMgbfSO5C_JpKsGt-JU6L1feLScvxvL8f86JS1XnCwbwraA&usqp=CAc',
      price: 2000,
      discount: 20,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'packaging', color: '#70b3b1' },
      ],
      iconBg: '#d3b19a',
      productType: 'Jacket',
      color: '112,79,59',
      occasion: 'Casual',
    },
    {
      name: 'Roadster',
      description: 'Men Charcoal Grey Solid Corduroy Jacket',
      imgSrc: 'https://encrypted-tbn2.gstatic.com/shopping?q9GcQQcBsjLwovu78-VRchPe0Exy5pxJUo0oP1AJl0mqAdyyLHk0_8ZsD5uXJwncrJeu3ypPDw1cx9tQFOn2YD_HFQqtiro70IvDh1bRJFVk0&usqp=CAE',
      price: 1299,
      discount: 15,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'marketing', color: '#d05fa2' },
      ],
      iconBg: '#70b3b1',
      productType: 'Jacket',
      color: '59,49,50',
      occasion: 'Casual',
    },
    {
      name: 'Mast & Harbour',
      description: 'Regular Fit Denim Jacket',
      imgSrc: 'https://encrypted-tbn0.gstatic.com/shopping?q9GcTwoY5NKSHPrShLzeB1FYR7BozFTlM6RevNL8sqzGRklUf2QB7d6j52VpHBe8_MSf7vJpwwJ9Hr-Q9h8_7liBdXlcc6GPUSCwYr6M4TH-t5&usqp=CAE',
      price: 670,
      discount: 10,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'packaging', color: '#70b3b1' },
        { name: 'marketing', color: '#d05fa2' },
      ],
      iconBg: '#d05fa2',
      productType: 'jacket',
      color: '237,227,218',
      occasion: 'Casual',
    },
    {
      name: 'Urbano Fasion',
      description: 'men Light Blue Solid Regular Fit Washed Full Sleeve Denim Jacket',
      imgSrc: 'https://encrypted-tbn2.gstatic.com/shopping?q9GcTyKryvoioT2uUHbhBHtOGs5huwLgLBsmaEmFUicBXnKucbmPAJ7Lg4wRlEPolamyoNdBmCe1RLhc0tSq4aoYS9n2q2LfHwjx_HdnGeCPw&usqp=CAE',
      price: 1649,
      discount: 15,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'marketing', color: '#d05fa2' },
      ],
      iconBg: '#70b3b1',
      productType: 'Jacket',
      color: '101,137,182',
      occasion: 'Casual',
    },
    {
      name: 'Washed Jacket',
      description: 'Locomotive Men Full Sleeve Washed Jacket',
      imgSrc: 'https://encrypted-tbn3.gstatic.com/shopping?q9GcTvAYuPpPWfbviQawQ4-Go7lLXRVZlTRhXQKJ2v3H2t6AO1B4joDJZzy5upbJdrwyeyof9fmux9gtkgBIOvXrsGHedvNmwXuKFHjlDEOQscJG3PgokolPM0&usqp=CAc',
      price: 1399,
      discount: 10,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'packaging', color: '#70b3b1' },
        { name: 'marketing', color: '#d05fa2' },
      ],
      iconBg: '#d05fa2',
      productType: 'Jacket',
      color: '193,200,212',
      occasion: 'Casual',
    }
  ];

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Media stream obtained:", mediaStream);

      const assignStream = () => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          console.log("Video srcObject set:", videoRef.current.srcObject);
          videoRef.current.play()
            .then(() => console.log("Video playback started"))
            .catch((err) => console.error("Error playing video:", err));
        } else {
          console.warn("videoRef.current is null, retrying...");
          setTimeout(assignStream, 100);
        }
      };

      assignStream();
      setStream(mediaStream);
      setCameraActive(true);
      setCurrentStep(1);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    console.log("Attempting to capture image...");
    console.log("videoRef.current:", videoRef.current);
    console.log("canvasRef.current:", canvasRef.current);

    if (videoRef.current && canvasRef.current) {
      if (videoRef.current.readyState >= 2) {
        const context = canvasRef.current.getContext('2d');
        const { videoWidth, videoHeight } = videoRef.current;
        console.log("Video dimensions:", videoWidth, videoHeight);
        if (videoWidth && videoHeight) {
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
          context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
          setImageCaptured(true);
          setCurrentStep(3);
          setTimeout(stopCamera, 200);
        } else {
          console.error("Invalid video dimensions:", videoWidth, videoHeight);
          alert("Failed to capture image. Please try again.");
        }
      } else {
        console.error("Video not ready, readyState:", videoRef.current.readyState);
        alert("Camera not ready. Please try again.");
      }
    } else {
      console.error("Video or canvas ref not available", {
        videoRef: videoRef.current,
        canvasRef: canvasRef.current,
      });
      alert("Capture failed. Please ensure camera is active and try again.");
    }
  };

  const retakePhoto = () => {
    setImageCaptured(false);
    setSkinTone(null);
    setCurrentStep(1);
    startCamera();
  };

  const proceedToUpload = () => {
    if (canvasRef.current) {
      setSkinTone('#82614e');
      setCurrentStep(4);
    } else {
      alert("No image captured.");
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="shop-by-skin-container">
      <Navbar />
      <Header />
      <div className="image-container">
        <img
          src="https://i.postimg.cc/s2CPFZh7/Add-a-heading-2.jpg"
          alt="Shop By Skin Tone"
          className="shop-by-skin-image"
        />
        <div className="text-overlay">
          <h3 className="highlight-title">Shop By Skin Tone</h3>
          <p className="section-description">Find the color made for you.</p>
        </div>
      </div>

      <div className="content-container">
        <div className="steps-section">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Click a photo of your face</h3>
              <p>Make sure the face is completely in frame and proper lighting is there</p>
            </div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Upload the image</h3>
              <p>Select the captured image for analysis</p>
            </div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get your skin tone</h3>
              <p>Our system will analyze your skin tone</p>
              {skinTone && (
                <div className="prediction-result">
                  <p><strong>This is your skin tone:</strong></p>
                  <div
                    className="skin-tone-box"
                    style={{ backgroundColor: skinTone }}
                  ></div>
                  <p>Color code: {skinTone}</p>
                </div>
              )}
            </div>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Shop by your skin tone</h3>
              <p>Discover products that match your skin tone</p>
            </div>
          </div>
        </div>

        <div className="camera-section">
          <div className="camera-placeholder">
            <button onClick={startCamera} className="action-button">
              Turn On Camera
            </button>
            <canvas ref={canvasRef} className="captured-image" style={{ display: imageCaptured ? 'block' : 'none' }}></canvas>
            {cameraActive && !imageCaptured ? (
              <div className="camera-active">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-feed"
                  muted
                ></video>
                <div className="camera-controls">
                  <button onClick={captureImage} className="capture-button">
                    Capture Photo
                  </button>
                  <button onClick={stopCamera} className="stop-button">
                    Turn Off Camera
                  </button>
                </div>
              </div>
            ) : imageCaptured ? (
              <div className="image-preview">
                <div className="preview-controls">
                  <button onClick={proceedToUpload} className="action-button">
                    Use This Photo
                  </button>
                  <button onClick={retakePhoto} className="retake-button">
                    Retake Photo
                  </button>
                </div>
              </div>
            ) : (
              <img src="https://i.postimg.cc/qq0Qz6F7/2.png" alt="Camera placeholder" />
            )}
          </div>
        </div>
      </div>

      {skinTone && (
        <div className="trusted-companies">
          <div className="container">
            {clothes.map((item, index) => (
              <div key={index} className="card">
                <div className="card-inner">
                  <div className="imgBox">
                    <img src={item.imgSrc} alt={item.name} />
                  </div>
                  <div className="icon" style={{ backgroundColor: item.iconBg }}>
                    <div className="iconBox">
                      <img
                        src="https://i.postimg.cc/8cL7vswB/Arrow-Icon.png"
                        alt="Arrow"
                        className="arrimg"
                      />
                    </div>
                  </div>
                </div>
                <div className="content">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <ul>
                    {item.tags.map((tag, tagIndex) => (
                      <li key={tagIndex} style={{ '--clr-tag': tag.color }}>
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                  <div className="price-details">
                    <span className="price">${(item.price - (item.price * item.discount) / 100).toFixed(2)}</span>
                    <span className="discount">{item.discount}% off</span>
                  </div>
                  <div className="actions">
                    <button
                      className="add-to-cart"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                    <button className="like-button">♡</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopBySkinTone;