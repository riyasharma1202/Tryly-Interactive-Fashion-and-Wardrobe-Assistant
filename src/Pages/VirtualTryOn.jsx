import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Header from '../Components/Header';
import { CartContext } from '../Context/CartContext';
import { Rnd } from 'react-rnd';
import { FiCamera, FiUpload, FiDownload, FiRefreshCw, FiShoppingCart } from 'react-icons/fi';
import './VirtualTryOn.css';

// Generic dummy images if none selected
const DUMMY_PRODUCTS = [
  { id: 1, imgSrc: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400', name: 'Classic White T-Shirt', price: '499', description: 'Essential white cotton t-shirt.' },
  { id: 2, imgSrc: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400', name: 'Casual Denim Jacket', price: '1299', description: 'Vintage wash denim jacket.' },
];

const VirtualTryOn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  // Try to use the passed product, otherwise fallback to the first dummy product if allowed
  const initialProduct = location.state?.product || DUMMY_PRODUCTS[0];
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  
  // States
  const [step, setStep] = useState('capture'); // 'capture', 'adjust', 'processing', 'result'
  const [userPhoto, setUserPhoto] = useState(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const captureAreaRef = useRef(null);

  // Stop camera helper
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setStream(mediaStream);
        setCameraActive(true);
      }
    } catch (error) {
      alert('Unable to access camera. Please allow camera permissions or upload a photo.');
    }
  };

  // Capture photo from webcam
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    // Flip context horizontally because video is mirrored
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    const photoData = canvas.toDataURL('image/jpeg', 0.85);
    setUserPhoto(photoData);
    stopCamera();
    setStep('adjust');
  };

  // Upload photo from file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target.result);
        stopCamera();
        setStep('adjust');
      };
      reader.readAsDataURL(file);
    }
  };

  // Retake/Reset
  const retake = () => {
    setUserPhoto(null);
    setResultImage(null);
    setStep('capture');
  };

  // Handle AI Try-On
  const handleAITryOn = async () => {
    if (!userPhoto || !selectedProduct) return;
    
    setStep('processing');
    setIsProcessing(true);
    
    try {
      // 1. Convert DataURLs to Blobs
      const userBlob = await (await fetch(userPhoto)).blob();
      const garmentBlob = await (await fetch(selectedProduct.imgSrc)).blob();

      // 2. Create FormData
      const formData = new FormData();
      formData.append('userImage', userBlob, 'user.jpg');
      formData.append('garmentImage', garmentBlob, 'garment.jpg');

      // 3. Send to Node.js proxy
      const response = await fetch('http://localhost:3002/api/virtual-tryon/ai', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error("Processing failed");

      // 4. Read raw image binary returned from Python -> Node
      const imageBlob = await response.blob();
      const resultUrl = URL.createObjectURL(imageBlob);
      
      setResultImage(resultUrl);
      setStep('result');
    } catch(e) {
      console.error("AI Tryon Failed", e);
      alert("AI Processing Failed: Make sure your Python server is running on port 8000!");
      setStep('adjust');
    } finally {
      setIsProcessing(false);
    }
  };

  // Effect to clean up camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stream]);

  // Download combined result using canvas
  const downloadResult = () => {
    // Note: For a pristine download combining the two, we would draw the user photo 
    // and the garment onto a new canvas based on the Rnd coordinates.
    // For MVP, we take a simple approach by just alerting or providing a simulated download.
    alert("In a full production version, this would merge the layers into a single image to download!");
  };

  return (
    <div className="virtual-tryon-page">
      <Navbar />
      <Header />
      
      <div className="tryon-container">
        
        <header className="tryon-header">
          <h1 className="tryon-title">Virtual Fitting Room</h1>
          <p className="tryon-subtitle">See how it looks on you before you buy.</p>
        </header>
        
        <div className="tryon-layout">
          {/* Left Column: Tools & Product */}
          <div className="tryon-sidebar">
            <div className="product-preview-card">
              <img 
                src={selectedProduct.imgSrc} 
                alt={selectedProduct.name}
                className="product-img-large"
              />
              <div className="product-info-minimal">
                <h3>{selectedProduct.name}</h3>
                <p className="price">₹{selectedProduct.price}</p>
                <button 
                  className="btn-add-cart"
                  onClick={() => {
                    addToCart(selectedProduct);
                    alert('Added to cart!');
                  }}
                >
                  <FiShoppingCart size={18} /> Add to Cart
                </button>
              </div>

              {step === 'adjust' && (
                <button 
                  onClick={handleAITryOn}
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontSize: '1.05rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(161, 140, 209, 0.4)',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  ✨ Generate Realistic AI Fit
                </button>
              )}
            </div>

            {/* Optional: Add a selector for dummy products if user didn't navigate from a specific product */}
            {!location.state?.product && (
              <div className="dummy-selector">
                <h4>Try other items</h4>
                <div className="dummy-list">
                  {DUMMY_PRODUCTS.map(prod => (
                    <img 
                      key={prod.id} 
                      src={prod.imgSrc} 
                      className={`dummy-thumb ${selectedProduct.id === prod.id ? 'active' : ''}`}
                      alt="thumbnail"
                      onClick={() => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {step === 'adjust' && (
              <div className="instructions-card">
                <h4>How it works</h4>
                <ul>
                  <li>Drag the clothing to position it.</li>
                  <li>Use the corners to resize it.</li>
                  <li>Match it to your body proportions.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Main Canvas */}
          <div className="tryon-main">
            <div className="canvas-wrapper">
              
              {/* STEP 1: CAPTURE / UPLOAD */}
              {step === 'capture' && (
                <div className="capture-view">
                  {!cameraActive ? (
                    <div className="camera-placeholder">
                      <FiCamera size={64} className="icon-pulse" color="#ffffff80" />
                      <h2>Start your virtual try-on</h2>
                      <div className="action-buttons">
                        <button className="btn-primary" onClick={startCamera}>
                          <FiCamera size={20} /> Open Camera
                        </button>
                        <div className="divider"><span>OR</span></div>
                        <label className="btn-secondary">
                          <FiUpload size={20} /> Upload Photo
                          <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="active-camera-view">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="video-feed"
                      />
                      <button className="btn-capture-round" onClick={capturePhoto}></button>
                      <button className="btn-cancel-cam" onClick={stopCamera}>Cancel</button>
                    </div>
                  )}
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
              )}

              {/* STEP 2: ADJUST OVERLAY */}
              {step === 'adjust' && userPhoto && (
                <div className="adjust-view" ref={captureAreaRef}>
                  {/* Background User Image */}
                  <img src={userPhoto} alt="User" className="user-photo-bg" />
                  
                  {/* Draggable & Resizable Garment Layer */}
                  <Rnd
                    default={{
                      x: 100,
                      y: 100,
                      width: 250,
                      height: 250,
                    }}
                    bounds="parent"
                    lockAspectRatio={true}
                    className="garment-overlay"
                  >
                    <div className="garment-img-container">
                      <img 
                        src={selectedProduct.imgSrc} 
                        alt="Garment" 
                        className="garment-layer-img" 
                        draggable="false" 
                      />
                    </div>
                  </Rnd>
                  
                  {/* Floating Action Menu */}
                  <div className="floating-actions">
                    <button className="icon-btn" onClick={retake} title="Retake Photo">
                      <FiRefreshCw size={24} />
                    </button>
                    <button className="icon-btn" onClick={downloadResult} title="Download Look">
                      <FiDownload size={24} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PROCESSING */}
              {step === 'processing' && (
                 <div className="processing-view" style={{ textAlign: 'center', width: '100%', padding: '4rem' }}>
                    <style>{`
                      @keyframes spin-ring { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}</style>
                    <div style={{ width: '80px', height: '80px', border: '5px solid #f3f3f3', borderTop: '5px solid #a18cd1', borderRadius: '50%', animation: 'spin-ring 1s linear infinite', margin: '0 auto 2rem' }}></div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>AI is fitting your garment...</h2>
                    <p style={{ color: '#666' }}>This usually takes 5-10 seconds on a GPU.<br/>(For this MVP, it will mock the response instantly)</p>
                 </div>
              )}

              {/* STEP 4: RESULT */}
              {step === 'result' && resultImage && (
                <div className="result-view" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1a1a1a' }}>Your AI Fit ✨</h2>
                  <img src={resultImage} alt="AI Result" style={{ maxHeight: '500px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                  <div className="action-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button className="btn-secondary" onClick={retake} style={{ color: '#333', borderColor: '#ddd', background: '#f8f9fa' }}>
                      <FiRefreshCw size={18} /> Try Another
                    </button>
                    <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }} onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImage;
                        link.download = "tryly-ai-fit.jpg";
                        link.click();
                      }}>
                      <FiDownload size={18} /> Save Look
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
