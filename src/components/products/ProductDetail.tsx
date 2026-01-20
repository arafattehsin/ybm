'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import type { Product, Size, Addon } from '@/types';
import { formatPrice } from '@/lib/constants';
import { useCartStore } from '@/stores/cartStore';
import { Button, Badge } from '@/components/ui';
import { Minus, Plus, Check, Share2 } from 'lucide-react';
import addonsData from '@/data/addons.json';

interface ProductDetailProps {
  product: Product;
  addons?: Addon[];
}

export function ProductDetail({ product, addons: propsAddons }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Get available addons for this product (use props if provided, otherwise fetch from data)
  const availableAddons = useMemo(() => {
    if (propsAddons) return propsAddons;
    return addonsData.addons.filter((addon) =>
      product.addons.includes(addon.id)
    ) as Addon[];
  }, [product.addons, propsAddons]);

  // Calculate total price
  const unitPrice = useMemo(() => {
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return selectedSize.price + addonTotal;
  }, [selectedSize, selectedAddons]);

  const totalPrice = unitPrice * quantity;

  const handleAddonToggle = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      image: product.images[0],
      size: selectedSize,
      addons: selectedAddons,
      quantity,
      unitPrice,
    });

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                aria-label={`View ${product.name} image ${index + 1}`}
                className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-[#C9A86C]'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Category */}
        <Badge>{product.category}</Badge>

        {/* Name */}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          {product.name}
        </h1>

        {/* Price */}
        <p className="text-2xl font-semibold text-gray-900">
          {formatPrice(selectedSize.price)}
          {product.sizes.length > 1 && (
            <span className="text-base font-normal text-gray-500">
              {' '}– {formatPrice(product.sizes[product.sizes.length - 1].price)}
            </span>
          )}
        </p>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">{product.description}</p>

        {/* Size Selector */}
        {product.sizes.length > 1 && (
          <div>
            <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <select
              id="size-select"
              value={selectedSize.id}
              onChange={(e) => {
                const size = product.sizes.find((s) => s.id === e.target.value);
                if (size) setSelectedSize(size);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A86C] focus:border-transparent"
            >
              {product.sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name} - {formatPrice(size.price)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add-ons */}
        {availableAddons.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add-ons
            </label>
            <div className="space-y-2">
              {availableAddons.map((addon) => (
                <label
                  key={addon.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedAddons.some((a) => a.id === addon.id)}
                    onChange={() => handleAddonToggle(addon as Addon)}
                    className="w-5 h-5 text-[#C9A86C] rounded focus:ring-[#C9A86C]"
                  />
                  <span className="flex-1">{addon.name}</span>
                  <span className="text-gray-500">+{formatPrice(addon.price)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {quantity}x {product.name}
            </span>
            <span>{formatPrice(selectedSize.price * quantity)}</span>
          </div>
          {selectedAddons.map((addon) => (
            <div key={addon.id} className="flex justify-between text-sm text-gray-500">
              <span>+ {addon.name}</span>
              <span>{formatPrice(addon.price * quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 py-3 font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          size="lg"
          className="w-full"
        >
          {showAddedMessage ? (
            <>
              <Check size={20} className="mr-2" />
              Added to Cart!
            </>
          ) : product.inStock ? (
            'ADD TO CART'
          ) : (
            'OUT OF STOCK'
          )}
        </Button>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 space-y-1">
          {product.sku && <p>SKU: {product.sku}</p>}
          <p>Category: <span className="capitalize">{product.category}</span></p>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

