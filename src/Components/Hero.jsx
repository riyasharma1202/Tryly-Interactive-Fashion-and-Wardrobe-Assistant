import React from 'react';
import './Hero.css';
import img1 from '../assets/1.jpg';
import Try from '../assets/Try.mp4';
import SliderComponent from './SliderWrapper';

const Hero = () => {
  return (
    <>
      <div className="tara-section">
        <video src={Try} autoPlay loop muted playsInline></video>
        <div className="video-overlay">
          <h1 className="clipped-text">TRYLY</h1>
          <h3 className="clipped-text">WEAR YOUR SKIN</h3>
        </div>
      </div>

      <div className="main-container">
        <div className="tara-content">
          <p className="section-title">Trial Essentials</p>
          <p className="highlight-text">YOUR FASHION, YOUR FIT, YOUR WAY</p>
          <p className="section-description">
          It’s not just about trying outfits—it’s about truly finding what feels right for you.
          </p>
          <div className="content-buttons">
            <button>Shop Trial Essentials</button>
            <button>Read More</button>
          </div>
        </div>

        <div className="alex-section">
          <div className="alex-image">
            <img src={img1} alt="Nike Logo" />
          </div>
          <div className="alex-content">
            <p className="content-title">Our Partnership<br></br>
            LOOK GOOD, DO GOOD
            </p>
            
            <div className="content-buttons">
              <button>Read Now</button>
              <button>Shop Tryly</button>
            </div>
          </div>
        </div>

        <SliderComponent />

        <div className="ekiden-section">
          <div className="ekiden-header">
            <h1 className="highlight-title">RISE TOGETHER</h1>
            <p className="section-description">
            "Our website uses Virtual Intelligence to make user interactions smarter and more personalized. With advanced technology and easy-to-use design, we create a smooth and enjoyable experience for everyone."
            </p>
            <button>Shop Now At Discounted Price</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
