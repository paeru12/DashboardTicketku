import React from 'react';

export function Avatar({ children, className }) {
  return (
    <div className={`relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted text-sm font-semibold ${className || ''}`}>
      {children}
    </div>
  );
}

export function AvatarFallback({ children }) {
  return <span>{children}</span>;
}

export function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />;
}
