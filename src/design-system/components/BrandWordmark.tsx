/**
 * Official Brand Wordmarks for Uday Kiran and KiranForge
 * Never invent or distort an official logo. Uses clean typographic hierarchy and signature gradient.
 */

import React from 'react';

interface BrandWordmarkProps {
  brand?: 'personal' | 'business';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withTagline?: boolean;
  className?: string;
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  brand = 'personal',
  size = 'md',
  withTagline = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: { title: 'text-base', sub: 'text-xs', gap: 'gap-1.5' },
    md: { title: 'text-lg', sub: 'text-xs', gap: 'gap-2' },
    lg: { title: 'text-2xl', sub: 'text-sm', gap: 'gap-3' },
    xl: { title: 'text-3xl md:text-4xl', sub: 'text-base', gap: 'gap-4' },
  }[size];

  if (brand === 'business') {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className={`flex items-center ${sizeClasses.gap}`}>
          {/* Geometric Prismatic Insignia */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              className={size === 'xl' ? 'w-10 h-10' : size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="kf-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA726" />
                  <stop offset="35%" stopColor="#FB6A21" />
                  <stop offset="70%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="32" height="32" rx="8" fill="url(#kf-logo-grad)" fillOpacity="0.15" stroke="url(#kf-logo-grad)" strokeWidth="1.5" />
              <path d="M12 28V12L22 20L12 28Z" fill="url(#kf-logo-grad)" />
              <path d="M22 12V28L28 20L22 12Z" fill="#FFA726" fillOpacity="0.85" />
            </svg>
          </div>
          <span className={`font-display font-bold tracking-tight text-white ${sizeClasses.title}`}>
            Kiran<span className="bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] bg-clip-text text-transparent">Forge</span>
          </span>
        </div>
        {withTagline && (
          <span className={`text-slate-400 font-jakarta font-medium mt-0.5 ${sizeClasses.sub}`}>
            Enterprise AI Systems & Cognitive Pipelines
          </span>
        )}
      </div>
    );
  }

  // Personal Brand: Uday Kiran | Practical AI
  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`flex items-center ${sizeClasses.gap}`}>
        <span className={`font-display font-bold tracking-tight text-white ${sizeClasses.title}`}>
          Uday Kiran
        </span>
        <span className="text-slate-500 font-light select-none">|</span>
        <span className={`font-display font-semibold bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] bg-clip-text text-transparent ${sizeClasses.title}`}>
          Practical AI
        </span>
      </div>
      {withTagline && (
        <span className={`text-slate-400 font-jakarta font-medium mt-0.5 ${sizeClasses.sub}`}>
          Make AI Simple. Practical. Useful.
        </span>
      )}
    </div>
  );
};
