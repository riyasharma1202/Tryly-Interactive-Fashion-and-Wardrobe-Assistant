import React, { createContext, useState, useEffect } from 'react';

export const WardrobeContext = createContext();

export const WardrobeProvider = ({ children }) => {
  const [wardrobe, setWardrobe] = useState(() => {
    const saved = localStorage.getItem('userWardrobe');
    return saved ? JSON.parse(saved) : {
      tops: [],
      bottoms: [],
      shoes: [],
      accessories: [],
      outfits: []
    };
  });

  // Save to localStorage whenever wardrobe changes
  useEffect(() => {
    localStorage.setItem('userWardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  // Add item to wardrobe
  const addToWardrobe = (item, category) => {
    const newItem = {
      id: Date.now(),
      ...item,
      dateAdded: new Date().toISOString(),
      category: category,
      occasions: item.occasions || [],
      season: item.season || 'all'
    };

    setWardrobe(prev => ({
      ...prev,
      [category]: [...prev[category], newItem]
    }));
  };

  // Remove item from wardrobe
  const removeFromWardrobe = (itemId, category) => {
    setWardrobe(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== itemId)
    }));
  };

  // Create outfit combination
  const createOutfit = (outfit) => {
    const newOutfit = {
      id: Date.now(),
      ...outfit,
      dateCreated: new Date().toISOString()
    };

    setWardrobe(prev => ({
      ...prev,
      outfits: [...prev.outfits, newOutfit]
    }));
  };

  // Get items by filter
  const getFilteredItems = (category, filters) => {
    let items = wardrobe[category] || [];

    if (filters?.season && filters.season !== 'all') {
      items = items.filter(item => 
        item.season === filters.season || item.season === 'all'
      );
    }

    if (filters?.occasion) {
      items = items.filter(item => 
        item.occasions?.includes(filters.occasion)
      );
    }

    return items;
  };

  const value = {
    wardrobe,
    addToWardrobe,
    removeFromWardrobe,
    createOutfit,
    getFilteredItems
  };

  return (
    <WardrobeContext.Provider value={value}>
      {children}
    </WardrobeContext.Provider>
  );
};
