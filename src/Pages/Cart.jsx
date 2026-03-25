import React, { useContext } from 'react';
import Navbar from '../Components/Navbar';
import Header from '../Components/Header';
import { CartContext } from '../Context/CartContext';
import './Cart.css';

function Cart() {
  const { cartItems, updateQuantity, buyItem, buyAllItems } = useContext(CartContext);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.price - (item.price * (item.discount || 0) / 100);
      return total + (discountedPrice * item.quantity);
    }, 0).toFixed(2);
  };

  const taxes = (parseFloat(calculateSubtotal()) * 0.1).toFixed(2); // 10% tax
  const deliveryCharges = 10.00; // Fixed delivery charge
  const total = (parseFloat(calculateSubtotal()) + parseFloat(taxes) + deliveryCharges).toFixed(2);

  return (
    <div className="cart-container">
      <Navbar />
      <Header />
      <div className="cart-content">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.imgSrc} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    <p>Discount: {item.discount || 0}%</p>
                    <p>Price after Discount: ${(item.price - (item.price * (item.discount || 0) / 100)).toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total for Item: ${((item.price - (item.price * (item.discount || 0) / 100)) * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.name, -1)}
                        className="quantity-button"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.name, 1)}
                        className="quantity-button"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="buy-now-button"
                      onClick={() => buyItem(item.name)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <p>Subtotal: ${calculateSubtotal()}</p>
              <p>Taxes (10%): ${taxes}</p>
              <p>Delivery Charges: ${deliveryCharges.toFixed(2)}</p>
              <p><strong>Total: ${total}</strong></p>
              <button className="buy-all-button" onClick={buyAllItems}>
                Buy All Items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;