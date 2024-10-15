'use client';  // 确保它是客户端组件

import { useState } from 'react';

const images = [
  'https://i.loli.net/2021/04/07/QgHvB7hlJyCnN8s.jpg',
  'https://ae01.alicdn.com/kf/U5ea62aa4565c42ea8f24f209deb7a3ebp.jpg',
];  // 示例图片路径

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-64">
      <img
        src={images[currentIndex]}
        alt="Slide"
        className="w-full h-full object-cover"
      />
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-700 px-3 py-1"
      >
        Previous
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-700 px-3 py-1"
      >
        Next
      </button>
    </div>
  );
}
