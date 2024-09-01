import React from 'react';
import './ProductCard.css';
import defaultImage from '../../assets/default-image.jpeg';

const ProductCard = ({ image, name, price }) => {
  return (
    <div className="product-card">
      <img src={image || defaultImage} alt={name} className="product-image" />
      <div className="product-info">
        <h2 className="product-name">{name}</h2>
        <p className="product-price">${price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
