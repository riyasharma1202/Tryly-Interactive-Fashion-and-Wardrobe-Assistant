import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';
import Arrow from '../assets/Arrow.png';
import { CartContext } from '../Context/CartContext';

const MenProd = () => {
  const { addToCart } = useContext(CartContext);
  const [liked, setLiked] = useState({});
   const navigate = useNavigate();

const companies = [
  {
    name: "White T-Shirt",
    description: "Classic White Cotton T-Shirt",
    imgSrc: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    price: 499,
    discount: 15,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "packaging", color: "#70b3b1" }
    ],
    iconBg: "#d3b19a"
  },
  {
    name: "Black T-Shirt",
    description: "Premium Black Cotton T-Shirt",
    imgSrc: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    price: 599,
    discount: 20,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "marketing", color: "#d05fa2" }
    ],
    iconBg: "#70b3b1"
  },
  {
    name: "Blue Denim Jacket",
    description: "Classic Denim Jacket",
    imgSrc: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    price: 1299,
    discount: 15,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "packaging", color: "#70b3b1" }
    ],
    iconBg: "#d05fa2"
  },
  {
    name: "Grey Hoodie",
    description: "Comfortable Grey Hoodie",
    imgSrc: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    price: 899,
    discount: 10,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "marketing", color: "#d05fa2" }
    ],
    iconBg: "#70b3b1"
  },
  {
    name: "Black Hoodie",
    description: "Premium Black Hoodie",
    imgSrc: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    price: 999,
    discount: 12,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "packaging", color: "#70b3b1" }
    ],
    iconBg: "#d05fa2"
  },
  {
    name: "Navy Polo Shirt",
    description: "Classic Navy Polo",
    imgSrc: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80",
    price: 749,
    discount: 18,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "marketing", color: "#d05fa2" }
    ],
    iconBg: "#70b3b1"
  },
  {
    name: "White Shirt",
    description: "Formal White Shirt",
    imgSrc: "https://images.unsplash.com/photo-1602810318660-d9c33abf9310?w=800&q=80",
    price: 899,
    discount: 15,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "packaging", color: "#70b3b1" }
    ],
    iconBg: "#d3b19a"
  },
  {
    name: "Checkered Shirt",
    description: "Casual Checkered Shirt",
    imgSrc: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    price: 799,
    discount: 20,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "marketing", color: "#d05fa2" }
    ],
    iconBg: "#70b3b1"
  }
];


  const toggleLike = (index) => {
    setLiked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className="trusted-companies">
      <div className="container">
        {companies.map((company, index) => (
          <div className="card" key={index}>
            <div className="card-inner" style={{ '--clr': '#fff' }}>
              <div className="box">
                <div className="imgBox">
                  <img src={company.imgSrc} alt={company.name} />
                </div>
                <div className="icon">
                  <a href="#" className="iconBox" style={{ background: company.iconBg }}>
                    <img src={Arrow} className="arrimg" alt="Arrow" />
                  </a>
                </div>
              </div>
            </div>
            <div className="content">
              <h3>{company.name}</h3>
              <p>{company.description}</p>
              <div className="price-details">
                <span className="price">${(company.price - (company.price * company.discount) / 100).toFixed(2)}</span>
                <span className="discount">{company.discount}% OFF</span>
              </div>
               

              <div className="actions">
  <button
    className="add-to-cart"
    onClick={() => addToCart(company)}
  >
    Add to Cart
  </button>
  
  {/* ADD THIS NEW BUTTON */}
  <button
    className="tryon-button"
    onClick={() => navigate('/virtual-tryon', { state: { product: company } })}
  >
    👔 Try On
  </button>
  
  <button
    className={`like-button ${liked[index] ? 'liked' : ''}`}
    onClick={() => toggleLike(index)}
  >
    {liked[index] ? '❤️' : '♡'}
  </button>
</div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenProd;