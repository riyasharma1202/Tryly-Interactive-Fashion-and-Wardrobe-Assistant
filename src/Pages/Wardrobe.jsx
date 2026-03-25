import React, { useState, useContext } from 'react';
import { WardrobeContext } from '../Context/WardrobeContext';
import Navbar from '../Components/Navbar';
import Header from '../Components/Header';
import './Wardrobe.css';

const Wardrobe = () => {
  const { wardrobe, addToWardrobe, removeFromWardrobe } = useContext(WardrobeContext);
  
  const [activeTab, setActiveTab] = useState('tops');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filterSeason, setFilterSeason] = useState('all');
  const [filterOccasion, setFilterOccasion] = useState('all');

  const categories = [
    { key: 'tops', label: '👕 Tops', icon: '👕' },
    { key: 'bottoms', label: '👖 Bottoms', icon: '👖' },
    { key: 'shoes', label: '👟 Shoes', icon: '👟' },
    { key: 'accessories', label: '👜 Accessories', icon: '👜' }
  ];

  const seasons = ['all', 'spring', 'summer', 'fall', 'winter'];
  const occasions = ['all', 'casual', 'formal', 'party', 'work', 'sports'];

  // Filter items
  const getFilteredItems = () => {
    let items = wardrobe[activeTab] || [];

    if (filterSeason !== 'all') {
      items = items.filter(item => 
        item.season === filterSeason || item.season === 'all'
      );
    }

    if (filterOccasion !== 'all') {
      items = items.filter(item => 
        item.occasions?.includes(filterOccasion)
      );
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="wardrobe-page">
      <Navbar />
      <Header />

      <div className="wardrobe-container">
        <div className="wardrobe-header">
          <h1>👗 My Digital Wardrobe</h1>
          <p>Organize, manage, and plan your outfits</p>
          <button 
            className="add-item-btn"
            onClick={() => setShowUploadModal(true)}
          >
            ➕ Add New Item
          </button>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`tab ${activeTab === cat.key ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.key)}
            >
              <span className="tab-icon">{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="count">({wardrobe[cat.key]?.length || 0})</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label>🌤️ Season:</label>
            <select 
              value={filterSeason} 
              onChange={(e) => setFilterSeason(e.target.value)}
            >
              {seasons.map(s => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>🎉 Occasion:</label>
            <select 
              value={filterOccasion} 
              onChange={(e) => setFilterOccasion(e.target.value)}
            >
              {occasions.map(o => (
                <option key={o} value={o}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="wardrobe-grid">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>No items yet</h3>
              <p>Start building your digital wardrobe by adding items!</p>
              <button 
                className="empty-add-btn"
                onClick={() => setShowUploadModal(true)}
              >
                Add Your First Item
              </button>
            </div>
          ) : (
            filteredItems.map(item => (
              <WardrobeItem 
                key={item.id}
                item={item}
                category={activeTab}
                onRemove={removeFromWardrobe}
              />
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          category={activeTab}
          onClose={() => setShowUploadModal(false)}
          onUpload={addToWardrobe}
        />
      )}
    </div>
  );
};

// Wardrobe Item Component
const WardrobeItem = ({ item, category, onRemove }) => {
  return (
    <div className="wardrobe-item">
      <div className="item-image-container">
        <img src={item.imgSrc || item.image} alt={item.name} />
        <button 
          className="remove-btn"
          onClick={() => onRemove(item.id, category)}
        >
          🗑️
        </button>
      </div>
      <div className="item-details">
        <h4>{item.name}</h4>
        {item.brand && <p className="brand">{item.brand}</p>}
        <div className="item-tags">
          {item.season && item.season !== 'all' && (
            <span className="tag season">{item.season}</span>
          )}
          {item.occasions?.map(occ => (
            <span key={occ} className="tag occasion">{occ}</span>
          ))}
        </div>
        {item.color && (
          <div className="color-indicator" style={{ backgroundColor: item.color }}></div>
        )}
      </div>
    </div>
  );
};

// Upload Modal Component
const UploadModal = ({ category, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    color: '#000000',
    season: 'all',
    occasions: [],
    image: null,
    imgSrc: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imgSrc: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOccasionToggle = (occasion) => {
    setFormData(prev => ({
      ...prev,
      occasions: prev.occasions.includes(occasion)
        ? prev.occasions.filter(o => o !== occasion)
        : [...prev.occasions, occasion]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.imgSrc) {
      onUpload(formData, category);
      onClose();
    } else {
      alert('Please fill in name and upload an image!');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <h2>Add Item to Wardrobe</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📸 Upload Image *</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
            {formData.imgSrc && (
              <img src={formData.imgSrc} alt="Preview" className="image-preview" />
            )}
          </div>

          <div className="form-group">
            <label>👕 Item Name *</label>
            <input
              type="text"
              placeholder="e.g., Blue Denim Jacket"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>🏷️ Brand</label>
            <input
              type="text"
              placeholder="e.g., Levi's"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>🎨 Color</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>🌤️ Season</label>
            <select 
              value={formData.season}
              onChange={(e) => setFormData({...formData, season: e.target.value})}
            >
              <option value="all">All Seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
          </div>

          <div className="form-group">
            <label>🎉 Occasions</label>
            <div className="occasions-grid">
              {['casual', 'formal', 'party', 'work', 'sports'].map(occ => (
                <button
                  key={occ}
                  type="button"
                  className={`occasion-btn ${formData.occasions.includes(occ) ? 'active' : ''}`}
                  onClick={() => handleOccasionToggle(occ)}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            ✅ Add to Wardrobe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Wardrobe;
