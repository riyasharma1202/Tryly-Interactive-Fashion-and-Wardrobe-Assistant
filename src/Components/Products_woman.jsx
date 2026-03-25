import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';
import Arrow from '../assets/Arrow.png';
import { CartContext } from '../Context/CartContext';

const Products = () => {
  const { addToCart } = useContext(CartContext);
  const [liked, setLiked] = useState({});
   const navigate = useNavigate();

  
   const companies = [
  {
    name: "White Dress",
    description: "Elegant White Summer Dress",
    imgSrc: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    price: 1299,
    discount: 20,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "packaging", color: "#70b3b1" }
    ],
    iconBg: "#d3b19a"
  },
  {
    name: "Black Dress",
    description: "Classic Black Evening Dress",
    imgSrc: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
    price: 1499,
    discount: 15,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "marketing", color: "#d05fa2" }
    ],
    iconBg: "#70b3b1"
  },
  {
    name: "Floral Dress",
    description: "Beautiful Floral Summer Dress",
    imgSrc: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    price: 999,
    discount: 25,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "packaging", color: "#70b3b1" }
    ],
    iconBg: "#d05fa2"
  },
  {
    name: "White T-Shirt",
    description: "Basic White Cotton T-Shirt",
    imgSrc: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=800&q=80",
    price: 399,
    discount: 10,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "marketing", color: "#d05fa2" }
    ],
    iconBg: "#70b3b1"
  },
  {
    name: "Pink Top",
    description: "Casual Pink Summer Top",
    imgSrc: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80",
    price: 599,
    discount: 18,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "packaging", color: "#70b3b1" }
    ],
    iconBg: "#d3b19a"
  },
  {
    name: "Blue Jeans",
    description: "Classic Blue Denim Jeans",
    imgSrc: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&q=80",
    price: 1199,
    discount: 22,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "marketing", color: "#d05fa2" }
    ],
    iconBg: "#70b3b1"
  },
  {
    name: "Black Jeans",
    description: "Slim Fit Black Jeans",
    imgSrc: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    price: 1299,
    discount: 20,
    tags: [
      { name: "branding", color: "#d3b19a" },
      { name: "packaging", color: "#70b3b1" }
    ],
    iconBg: "#d05fa2"
  },
  {
    name: "Striped Shirt",
    description: "Casual Striped Shirt",
    imgSrc: "https://images.unsplash.com/photo-1624206112431-5740fbed7790?w=800&q=80",
    price: 699,
    discount: 15,
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

export default Products;