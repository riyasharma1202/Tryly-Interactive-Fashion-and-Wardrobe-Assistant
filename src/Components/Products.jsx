// React Component: Products.js

import './Products.css'; // Import the CSS file
import Arrow from '../assets/Arrow.png';
import { useState } from 'react';

const Products = () => {
  const [liked, setLiked] = useState({});

  const companies = [
    {
      name: 'Dresses',
      description: '',
      imgSrc: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      price: 100,
      discount: 10,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'packaging', color: '#70b3b1' },
      ],
      iconBg: '#d3b19a',
    },
    {
      name: 'T-Shirts',
      description: '',
      imgSrc: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      price: 100,
      discount: 10,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'marketing', color: '#d05fa2' },
      ],
      iconBg: '#70b3b1',
    },
    {
      name: 'Skirts',
      description: '',
      imgSrc: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
      price: 100,
      discount: 10,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'packaging', color: '#70b3b1' },
      ],
      iconBg: '#d3b19a',
    },
     {
      name: 'Overcoats',
      description: '',
      imgSrc: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      price: 100,
      discount: 10,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'packaging', color: '#70b3b1' },
      ],
      iconBg: '#d3b19a',
    },
    {
      name: 'Joggers',
      description: '',
      imgSrc: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
      price: 100,
      discount: 10,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'packaging', color: '#70b3b1' },
      ],
      iconBg: '#d3b19a',
    },
    {
      name: 'Crop Top',
      description: '',
      imgSrc: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80',
      price: 100,
      discount: 10,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'packaging', color: '#70b3b1' },
      ],
      iconBg: '#d3b19a',
    },
    {
      name: 'Formal Shirt',
      description: '',
      imgSrc: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
      price: 100,
      discount: 10,
      tags: [
        { name: 'branding', color: '#d3b19a' },
        { name: 'packaging', color: '#70b3b1' },
      ],
      iconBg: '#d3b19a',
    },
    {
      name: 'Suits',
      description: '',
      imgSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      price: 100,
      discount: 10,
      tags: [
        { name: 'branding', color: '#2FCC32FF' },
        { name: 'packaging', color: '#A146B1FF' },
      ],
      iconBg: '#d3b19a',
    },
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
                <button className="add-to-cart">Add to Cart</button>
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
