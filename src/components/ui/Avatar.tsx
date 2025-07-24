import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '',
  fallback 
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError || !src) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center ring-2 ring-purple-500/30 ${className}`}>
        {fallback ? (
          <span className="text-white font-semibold text-xs">
            {fallback.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <User className="w-1/2 h-1/2 text-white" />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleImageError}
      className={`${sizeClasses[size]} rounded-full ring-2 ring-purple-500/30 object-cover ${className}`}
    />
  );
};

export default Avatar; 