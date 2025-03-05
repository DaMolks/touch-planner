import React, { useState } from 'react';
import './ImageWithFallback.css';

const ImageWithFallback = ({ src, alt, className }) => {
  const [hasError, setHasError] = useState(false);
  
  // Fonction pour générer une couleur basée sur le texte alt
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };
  
  // Si pas d'URL ou erreur, afficher un fallback
  if (!src || hasError) {
    const bgColor = stringToColor(alt || 'Item');
    const initial = (alt && alt.length > 0) ? alt.charAt(0).toUpperCase() : '?';
    
    return (
      <div 
        className={`image-fallback ${className || ''}`}
        style={{ 
          backgroundColor: bgColor,
          width: '100%',
          height: '100%'
        }}
        title={alt}
      >
        {initial}
      </div>
    );
  }
  
  // Essayer de charger l'image directement
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default ImageWithFallback;
