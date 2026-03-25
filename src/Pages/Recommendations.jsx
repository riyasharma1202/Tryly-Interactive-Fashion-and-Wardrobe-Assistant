import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WardrobeContext } from '../Context/WardrobeContext';
import { CartContext } from '../Context/CartContext';
import Navbar from '../Components/Navbar';
import Header from '../Components/Header';
import './Recommendations.css';

// Import your product data
import menProducts from '../data/Men.json';
import womenProducts from '../data/Women.json';

const Recommendations = () => {
  const { wardrobe } = useContext(WardrobeContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Analyze user's wardrobe and generate profile
  useEffect(() => {
    analyzeWardrobeAndRecommend();
  }, [wardrobe]);

  const analyzeWardrobeAndRecommend = () => {
    setLoading(true);

    // Step 1: Analyze wardrobe
    const profile = analyzeUserWardrobe();
    setUserProfile(profile);

    // Step 2: Generate recommendations based on analysis
    const recs = generateRecommendations(profile);
    setRecommendations(recs);

    setLoading(false);
  };

  // AI/ML Analysis Function with Gender Detection
  const analyzeUserWardrobe = () => {
    const allItems = [
      ...wardrobe.tops,
      ...wardrobe.bottoms,
      ...wardrobe.shoes,
      ...wardrobe.accessories
    ];

    if (allItems.length === 0) {
      return {
        dominantColors: [],
        preferredSeasons: [],
        stylePreference: 'casual',
        occasionFrequency: {},
        wardrobeGaps: ['tops', 'bottoms', 'shoes', 'accessories'],
        totalItems: 0,
        categoryCount: { tops: 0, bottoms: 0, shoes: 0, accessories: 0 },
        detectedGender: 'unisex'
      };
    }

    // Gender Detection based on item names/descriptions
    let maleScore = 0;
    let femaleScore = 0;

    const maleKeywords = ['shirt', 'blazer', 'suit', 'trouser', 'formal shirt', 'tie'];
    const femaleKeywords = ['dress', 'skirt', 'blouse', 'heels', 'handbag', 'kurta', 'saree', 'lehenga', 'palazzo'];

    allItems.forEach(item => {
      const text = `${item.name || ''} ${item.description || ''}`.toLowerCase();
      
      maleKeywords.forEach(keyword => {
        if (text.includes(keyword)) maleScore++;
      });
      
      femaleKeywords.forEach(keyword => {
        if (text.includes(keyword)) femaleScore++;
      });
    });

    // Determine gender preference
    let detectedGender = 'unisex';
    if (femaleScore > maleScore * 1.5) {
      detectedGender = 'female';
    } else if (maleScore > femaleScore * 1.5) {
      detectedGender = 'male';
    }

    // Color Analysis - Extract actual color values from wardrobe
    const colorCount = {};
    allItems.forEach(item => {
      if (item.color) {
        const colorName = getColorName(item.color);
        colorCount[colorName] = (colorCount[colorName] || 0) + 1;
      }
    });
    const dominantColors = Object.entries(colorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color]) => color);

    // Season Analysis
    const seasonCount = {};
    allItems.forEach(item => {
      if (item.season && item.season !== 'all') {
        seasonCount[item.season] = (seasonCount[item.season] || 0) + 1;
      }
    });
    const preferredSeasons = Object.entries(seasonCount)
      .sort((a, b) => b[1] - a[1])
      .map(([season]) => season);

    // Occasion Analysis
    const occasionCount = {};
    allItems.forEach(item => {
      item.occasions?.forEach(occ => {
        occasionCount[occ] = (occasionCount[occ] || 0) + 1;
      });
    });

    // Determine style preference based on occasions
    const totalOccasions = Object.values(occasionCount).reduce((a, b) => a + b, 0);
    let stylePreference = 'casual';
    if (occasionCount.formal && occasionCount.formal / totalOccasions > 0.4) {
      stylePreference = 'formal';
    } else if (occasionCount.party && occasionCount.party / totalOccasions > 0.3) {
      stylePreference = 'trendy';
    }

    // Find wardrobe gaps
    const wardrobeGaps = [];
    const categoryCount = {
      tops: wardrobe.tops.length,
      bottoms: wardrobe.bottoms.length,
      shoes: wardrobe.shoes.length,
      accessories: wardrobe.accessories.length
    };

    if (categoryCount.tops < 3) wardrobeGaps.push('tops');
    if (categoryCount.bottoms < 2) wardrobeGaps.push('bottoms');
    if (categoryCount.shoes < 2) wardrobeGaps.push('shoes');
    if (categoryCount.accessories < 2) wardrobeGaps.push('accessories');

    return {
      dominantColors,
      preferredSeasons,
      stylePreference,
      occasionFrequency: occasionCount,
      wardrobeGaps,
      totalItems: allItems.length,
      categoryCount,
      detectedGender
    };
  };

  // Convert hex color to color name
  const getColorName = (hexColor) => {
    const colors = {
      '#000000': 'black',
      '#ffffff': 'white',
      '#ff0000': 'red',
      '#0000ff': 'blue',
      '#00ff00': 'green',
      '#ffff00': 'yellow',
      '#ffc0cb': 'pink',
      '#800080': 'purple',
      '#a52a2a': 'brown',
      '#808080': 'gray',
      '#000080': 'navy',
      '#f5f5dc': 'beige'
    };

    // Find closest color
    const hex = hexColor.toLowerCase();
    if (colors[hex]) return colors[hex];

    // Simple color detection based on RGB values
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    if (r > 200 && g > 200 && b > 200) return 'white';
    if (r < 50 && g < 50 && b < 50) return 'black';
    if (r > g && r > b) return 'red';
    if (g > r && g > b) return 'green';
    if (b > r && b > g) return 'blue';
    return 'neutral';
  };

  // Generate Recommendations with Gender Filter
  const generateRecommendations = (profile) => {
    // Filter products based on detected gender
    let allProducts = [];
    
    if (profile.detectedGender === 'female') {
      allProducts = womenProducts;
    } else if (profile.detectedGender === 'male') {
      allProducts = menProducts;
    } else {
      // Unisex - show both
      allProducts = [...menProducts, ...womenProducts];
    }

    const scored = [];

    allProducts.forEach(product => {
      let score = 0;
      const reasons = [];

      // Bonus points for gender-matched products
      if (profile.detectedGender === 'female' && womenProducts.some(p => p.id === product.id)) {
        score += 10;
      } else if (profile.detectedGender === 'male' && menProducts.some(p => p.id === product.id)) {
        score += 10;
      }

      // 1. Fill wardrobe gaps (HIGHEST PRIORITY)
      const category = determineCategory(product);
      if (profile.wardrobeGaps.includes(category)) {
        score += 40;
        reasons.push(`You need more ${category}`);
      }

      // 2. Balance wardrobe categories
      const lowestCategory = Object.entries(profile.categoryCount)
        .sort((a, b) => a[1] - b[1])[0];
      if (category === lowestCategory[0]) {
        score += 25;
        reasons.push('Balances your wardrobe');
      }

      // 3. Match occasions
      if (profile.occasionFrequency && Object.keys(profile.occasionFrequency).length > 0) {
        const topOccasion = Object.entries(profile.occasionFrequency)
          .sort((a, b) => b[1] - a[1])[0][0];
        
        if (product.name && product.name.toLowerCase().includes(topOccasion)) {
          score += 20;
          reasons.push(`Perfect for ${topOccasion} occasions`);
        }
      }

      // 4. Match style preference
      if (product.name || product.description) {
        const text = `${product.name} ${product.description}`.toLowerCase();
        if (profile.stylePreference === 'formal' && 
            (text.includes('formal') || text.includes('suit') || text.includes('blazer'))) {
          score += 20;
          reasons.push('Matches your formal style');
        } else if (profile.stylePreference === 'casual' && 
                   (text.includes('casual') || text.includes('t-shirt') || text.includes('jeans'))) {
          score += 20;
          reasons.push('Fits your casual style');
        } else if (profile.stylePreference === 'trendy' && 
                   (text.includes('trendy') || text.includes('party') || text.includes('dress'))) {
          score += 20;
          reasons.push('Suits your trendy style');
        }
      }

      // 5. Color matching
      if (profile.dominantColors.length > 0) {
        const productColors = extractColorsFromProduct(product);
        const hasMatchingColor = productColors.some(pc => 
          profile.dominantColors.some(dc => isSimilarColor(pc, dc))
        );
        if (hasMatchingColor) {
          score += 15;
          reasons.push('Matches your color palette');
        }
      }

      // 6. Season matching
      if (profile.preferredSeasons.length > 0) {
        const currentSeason = profile.preferredSeasons[0];
        if (product.season === currentSeason || product.season === 'all') {
          score += 10;
          reasons.push(`Perfect for ${currentSeason}`);
        }
      }

      // 7. Discount bonus
      if (product.discount && product.discount > 15) {
        score += 10;
        reasons.push(`${product.discount}% off!`);
      }

      // Only add products with meaningful score
      if (score > 15) {
        scored.push({
          ...product,
          recommendationScore: score,
          reason: reasons.slice(0, 2).join(' • ') || 'Recommended for you'
        });
      }
    });

    // Sort by score and return top 12
    return scored
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 12);
  };

  // Helper Functions
  const determineCategory = (product) => {
    const name = (product.name || '').toLowerCase();
    
    // Tops
    if (name.includes('shirt') || name.includes('t-shirt') || name.includes('top') || 
        name.includes('jacket') || name.includes('hoodie') || name.includes('blazer') ||
        name.includes('sweater') || name.includes('coat') || name.includes('dress')) {
      return 'tops';
    }
    
    // Bottoms
    if (name.includes('jean') || name.includes('pant') || name.includes('trouser') ||
        name.includes('short') || name.includes('skirt') || name.includes('jogger')) {
      return 'bottoms';
    }
    
    // Shoes
    if (name.includes('shoe') || name.includes('sneaker') || name.includes('boot') ||
        name.includes('sandal') || name.includes('heel')) {
      return 'shoes';
    }
    
    // Accessories
    if (name.includes('bag') || name.includes('watch') || name.includes('glass') ||
        name.includes('hat') || name.includes('belt') || name.includes('scarf')) {
      return 'accessories';
    }
    
    return 'tops'; // default
  };

  const extractColorsFromProduct = (product) => {
    const colors = [];
    const text = `${product.name || ''} ${product.description || ''}`.toLowerCase();
    
    const colorKeywords = [
      'black', 'white', 'blue', 'red', 'green', 'yellow', 
      'pink', 'purple', 'brown', 'gray', 'grey', 'navy', 'beige', 'neutral'
    ];
    
    colorKeywords.forEach(color => {
      if (text.includes(color)) colors.push(color);
    });
    
    return colors.length > 0 ? colors : ['neutral'];
  };

  const isSimilarColor = (color1, color2) => {
    const c1 = color1.toLowerCase();
    const c2 = color2.toLowerCase();
    
    if (c1 === c2) return true;
    
    // Color families
    const neutrals = ['black', 'white', 'gray', 'grey', 'beige', 'brown', 'neutral'];
    const blues = ['blue', 'navy', 'cyan', 'teal'];
    const reds = ['red', 'pink', 'maroon', 'crimson'];
    const greens = ['green', 'lime', 'olive'];
    
    return (
      (neutrals.includes(c1) && neutrals.includes(c2)) ||
      (blues.includes(c1) && blues.includes(c2)) ||
      (reds.includes(c1) && reds.includes(c2)) ||
      (greens.includes(c1) && greens.includes(c2))
    );
  };

  const handleTryOn = (product) => {
    navigate('/virtual-tryon', { state: { product } });
  };

  if (loading) {
    return (
      <div className="recommendations-page">
        <Navbar />
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>🤖 AI is analyzing your wardrobe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <Navbar />
      <Header />

      <div className="recommendations-container">
        {/* User Profile Analysis */}
        <div className="profile-analysis">
          <h2>🎯 Your Style Profile</h2>
          
          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-icon">👔</span>
              <h3>{userProfile.totalItems}</h3>
              <p>Wardrobe Items</p>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">🎨</span>
              <h3>{userProfile.stylePreference}</h3>
              <p>Style Preference</p>
            </div>
            
            {/* NEW: Gender Detection Card */}
            <div className="stat-card">
              <span className="stat-icon">
                {userProfile.detectedGender === 'female' ? '👗' : 
                 userProfile.detectedGender === 'male' ? '👔' : '👕'}
              </span>
              <h3>{userProfile.detectedGender}</h3>
              <p>Detected Style</p>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">🌈</span>
              <h3>{userProfile.dominantColors.length}</h3>
              <p>Favorite Colors</p>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <h3>{recommendations.length}</h3>
              <p>Recommendations</p>
            </div>
          </div>

          {userProfile.dominantColors.length > 0 && (
            <div className="color-palette">
              <h4>Your Color Palette:</h4>
              <div className="colors">
                {userProfile.dominantColors.map((color, idx) => (
                  <div 
                    key={idx}
                    className="color-badge-text"
                    title={color}
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>
          )}

          {userProfile.wardrobeGaps.length > 0 && (
            <div className="wardrobe-gaps">
              <h4>⚠️ Wardrobe Gaps Detected:</h4>
              <div className="gaps">
                {userProfile.wardrobeGaps.map(gap => (
                  <span key={gap} className="gap-badge">
                    {gap} ({userProfile.categoryCount[gap]} items)
                  </span>
                ))}
              </div>
              <p className="gap-hint">
                We're prioritizing {userProfile.wardrobeGaps[0]} in your recommendations!
              </p>
            </div>
          )}
        </div>

        {/* Recommendations Grid */}
        <div className="recommendations-section">
          <h2> Personalized Recommendations for You</h2>
          
          {recommendations.length === 0 ? (
            <div className="empty-recommendations">
              <span className="empty-icon">🤔</span>
              <h3>Build Your Wardrobe First!</h3>
              <p>Add items to your wardrobe so our AI can learn your style and make personalized recommendations.</p>
              <button 
                className="cta-btn"
                onClick={() => navigate('/wardrobe')}
              >
                Go to My Wardrobe
              </button>
            </div>
          ) : (
            <div className="recommendations-grid">
              {recommendations.map((product, index) => (
                <div key={product.id || index} className="recommendation-card">
                  <div className="match-score">
                    <span className="score-badge">
                      {Math.round(product.recommendationScore)}% Match
                    </span>
                  </div>
                  
                  <img 
                    src={product.imgSrc} 
                    alt={product.name}
                    className="product-image"
                  />
                  
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                    
                    <div className="reason-tag">
                      💡 {product.reason}
                    </div>
                    
                    <div className="price-section">
                      <span className="price">₹{product.price}</span>
                      {product.discount > 0 && (
                        <span className="discount">{product.discount}% OFF</span>
                      )}
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="try-on-btn"
                        onClick={() => handleTryOn(product)}
                      >
                        👔 Try On
                      </button>
                      <button 
                        className="add-cart-btn"
                        onClick={() => {
                          addToCart(product);
                          alert('✅ Added to cart!');
                        }}
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
