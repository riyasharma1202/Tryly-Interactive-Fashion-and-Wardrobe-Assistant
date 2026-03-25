import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "./Slider.css";

const SliderComponent = () => {
  const navigate = useNavigate();

  const images = [
    { 
      src: "https://i.postimg.cc/DzYXWZpV/Untitled-design-9.png", 
      name: "Shop by Skin Tone", 
      route: "/shop-by-skintone" 
    },
    { 
      src: "https://i.postimg.cc/FR1vCFxx/you-2.png", 
      name: "My Wardrobe", 
      route: "/wardrobe"  // ✅ Added route
    },
    { 
      src: "https://i.postimg.cc/8Pp2ZzPf/Untitled-design-10.png", 
      name: "Shop for Occasion" 
    },
    { 
      src: "https://i.postimg.cc/jSb4HZ6s/you-3.png", 
      name: "Match Your Outfit" 
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    cssEase: "ease",
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const handleClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="slider-wrapper">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div
            key={index}
            className="slider-item"
            onClick={() => handleClick(image.route)}
            style={{ cursor: image.route ? "pointer" : "default" }}
          >
            <img src={image.src} alt={image.name} className="slider-image" />
            <div className="slider-name">{image.name}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
