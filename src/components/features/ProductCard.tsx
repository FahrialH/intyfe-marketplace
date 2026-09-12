import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { RatingStars } from '../common/RatingStars';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="product-card flex flex-col justify-between bg-[#151515] border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d81395]/40 hover:shadow-[0_12px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(216,19,149,0.15)]">
      <div>
        <Link
          to={`/product/${product.slug}`}
          className="product-thumb block relative aspect-square rounded-xl overflow-hidden bg-black/40 mb-3.5 group"
        >
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.tier && (
            <span className="absolute top-2.5 left-2.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[#f4bb28] border border-[#f4bb28]/30">
              {product.tier}
            </span>
          )}
        </Link>

        <div className="product-info flex flex-col gap-1 mb-4">
          <span className="product-category text-xs text-neutral-400 font-medium">
            {product.category}
          </span>
          <h3 className="product-name font-semibold text-sm text-white line-clamp-1 hover:text-[#d81395] transition-colors">
            <Link to={`/product/${product.slug}`}>{product.title}</Link>
          </h3>
          <div className="my-1">
            <RatingStars rating={product.rating} size={12} showScore={false} />
          </div>
          <div className="product-price flex items-baseline gap-2 mt-1">
            <span className="font-bold text-white text-base">
              {formattedPrice}
            </span>
            <span className="text-xs text-neutral-400">
              ({product.priceEth} ETH)
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => addToCart(product, 1)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold transition-all shadow-[0_0_12px_rgba(216,19,149,0.2)] active:scale-98"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        <span>Add to cart</span>
      </button>
    </div>
  );
};
