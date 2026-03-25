import React, { useState, useContext } from 'react';
import { WardrobeContext } from '../Context/WardrobeContext';
import Navbar from '../Components/Navbar';
import Header from '../Components/Header';
import './OutfitPlanner.css';

const OutfitPlanner = () => {
  const { wardrobe, createOutfit } = useContext(WardrobeContext);

  const [selectedItems, setSelectedItems] = useState({
    top: null,
    bottom: null,
    shoes: null,
    accessory: null
  });

  const [outfitName, setOutfitName] = useState('');
  const [savedOutfits, setSavedOutfits] = useState(
    JSON.parse(localStorage.getItem('savedOutfits')) || []
  );

  const handleSelectItem = (category, item) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: prev[category]?.id === item.id ? null : item
    }));
  };

  const handleSaveOutfit = () => {
    const outfit = {
      id: Date.now(),
      name: outfitName || `Outfit ${savedOutfits.length + 1}`,
      items: selectedItems,
      dateCreated: new Date().toISOString()
    };

    const updated = [...savedOutfits, outfit];
    setSavedOutfits(updated);
    localStorage.setItem('savedOutfits', JSON.stringify(updated));

    alert('✅ Outfit saved!');
    setOutfitName('');
    setSelectedItems({ top: null, bottom: null, shoes: null, accessory: null });
  };

  const handleDeleteOutfit = (outfitId) => {
    const updated = savedOutfits.filter(o => o.id !== outfitId);
    setSavedOutfits(updated);
    localStorage.setItem('savedOutfits', JSON.stringify(updated));
  };

  const isOutfitComplete = selectedItems.top && selectedItems.bottom;

  return (
    <div className="outfit-planner-page">
      <Navbar />
      <Header />

      <div className="outfit-planner-container">
        <div className="planner-header">
          <h1>👔 Outfit Planner</h1>
          <p>Mix and match your wardrobe items to create perfect outfits</p>
        </div>

        <div className="planner-content">
          {/* Left Side - Item Selection */}
          <div className="item-selection">
            <h2>Select Items from Your Wardrobe</h2>

            {/* Tops */}
            <div className="category-section">
              <h3>👕 Tops ({wardrobe.tops.length})</h3>
              <div className="items-grid">
                {wardrobe.tops.length === 0 ? (
                  <p className="empty-message">No tops in wardrobe</p>
                ) : (
                  wardrobe.tops.map(item => (
                    <div
                      key={item.id}
                      className={`selectable-item ${selectedItems.top?.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleSelectItem('top', item)}
                    >
                      <img src={item.imgSrc} alt={item.name} />
                      <p>{item.name}</p>
                      {selectedItems.top?.id === item.id && (
                        <div className="selected-badge">✓</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottoms */}
            <div className="category-section">
              <h3>👖 Bottoms ({wardrobe.bottoms.length})</h3>
              <div className="items-grid">
                {wardrobe.bottoms.length === 0 ? (
                  <p className="empty-message">No bottoms in wardrobe</p>
                ) : (
                  wardrobe.bottoms.map(item => (
                    <div
                      key={item.id}
                      className={`selectable-item ${selectedItems.bottom?.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleSelectItem('bottom', item)}
                    >
                      <img src={item.imgSrc} alt={item.name} />
                      <p>{item.name}</p>
                      {selectedItems.bottom?.id === item.id && (
                        <div className="selected-badge">✓</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Shoes */}
            <div className="category-section">
              <h3>👟 Shoes ({wardrobe.shoes.length})</h3>
              <div className="items-grid">
                {wardrobe.shoes.length === 0 ? (
                  <p className="empty-message">No shoes in wardrobe</p>
                ) : (
                  wardrobe.shoes.map(item => (
                    <div
                      key={item.id}
                      className={`selectable-item ${selectedItems.shoes?.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleSelectItem('shoes', item)}
                    >
                      <img src={item.imgSrc} alt={item.name} />
                      <p>{item.name}</p>
                      {selectedItems.shoes?.id === item.id && (
                        <div className="selected-badge">✓</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Accessories */}
            <div className="category-section">
              <h3>👜 Accessories ({wardrobe.accessories.length})</h3>
              <div className="items-grid">
                {wardrobe.accessories.length === 0 ? (
                  <p className="empty-message">No accessories in wardrobe</p>
                ) : (
                  wardrobe.accessories.map(item => (
                    <div
                      key={item.id}
                      className={`selectable-item ${selectedItems.accessory?.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleSelectItem('accessory', item)}
                    >
                      <img src={item.imgSrc} alt={item.name} />
                      <p>{item.name}</p>
                      {selectedItems.accessory?.id === item.id && (
                        <div className="selected-badge">✓</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Outfit Preview */}
          <div className="outfit-preview">
            <h2>Your Outfit</h2>

            <div className="preview-board">
              <div className="preview-item">
                <span className="preview-label">👕 Top</span>
                {selectedItems.top ? (
                  <div className="preview-card">
                    <img src={selectedItems.top.imgSrc} alt={selectedItems.top.name} />
                    <p>{selectedItems.top.name}</p>
                  </div>
                ) : (
                  <div className="empty-slot">Select a top</div>
                )}
              </div>

              <div className="preview-item">
                <span className="preview-label">👖 Bottom</span>
                {selectedItems.bottom ? (
                  <div className="preview-card">
                    <img src={selectedItems.bottom.imgSrc} alt={selectedItems.bottom.name} />
                    <p>{selectedItems.bottom.name}</p>
                  </div>
                ) : (
                  <div className="empty-slot">Select a bottom</div>
                )}
              </div>

              <div className="preview-item">
                <span className="preview-label">👟 Shoes</span>
                {selectedItems.shoes ? (
                  <div className="preview-card">
                    <img src={selectedItems.shoes.imgSrc} alt={selectedItems.shoes.name} />
                    <p>{selectedItems.shoes.name}</p>
                  </div>
                ) : (
                  <div className="empty-slot">Optional</div>
                )}
              </div>

              <div className="preview-item">
                <span className="preview-label">👜 Accessory</span>
                {selectedItems.accessory ? (
                  <div className="preview-card">
                    <img src={selectedItems.accessory.imgSrc} alt={selectedItems.accessory.name} />
                    <p>{selectedItems.accessory.name}</p>
                  </div>
                ) : (
                  <div className="empty-slot">Optional</div>
                )}
              </div>
            </div>

            <div className="save-outfit-section">
              <input
                type="text"
                placeholder="Outfit name (e.g., Office Look)"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                className="outfit-name-input"
              />
              <button
                className="save-outfit-btn"
                onClick={handleSaveOutfit}
                disabled={!isOutfitComplete}
              >
                💾 Save Outfit
              </button>
            </div>
          </div>
        </div>

        {/* Saved Outfits */}
        <div className="saved-outfits-section">
          <h2>📂 Saved Outfits ({savedOutfits.length})</h2>
          <div className="saved-outfits-grid">
            {savedOutfits.length === 0 ? (
              <p className="empty-message">No saved outfits yet. Create your first outfit above!</p>
            ) : (
              savedOutfits.map(outfit => (
                <div key={outfit.id} className="saved-outfit-card">
                  <div className="saved-outfit-header">
                    <h3>{outfit.name}</h3>
                    <button
                      className="delete-outfit-btn"
                      onClick={() => handleDeleteOutfit(outfit.id)}
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="saved-outfit-items">
                    {outfit.items.top && (
                      <img src={outfit.items.top.imgSrc} alt={outfit.items.top.name} />
                    )}
                    {outfit.items.bottom && (
                      <img src={outfit.items.bottom.imgSrc} alt={outfit.items.bottom.name} />
                    )}
                    {outfit.items.shoes && (
                      <img src={outfit.items.shoes.imgSrc} alt={outfit.items.shoes.name} />
                    )}
                    {outfit.items.accessory && (
                      <img src={outfit.items.accessory.imgSrc} alt={outfit.items.accessory.name} />
                    )}
                  </div>
                  <p className="outfit-date">
                    Created: {new Date(outfit.dateCreated).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitPlanner;
