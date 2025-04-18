import React from "react";

export default function SouthAfricanBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-white p-1 rounded-lg shadow-md flex items-center space-x-2">
        {/* South African Flag as SVG - corrected layout */}
        <svg 
          width="32" 
          height="20" 
          viewBox="0 0 600 400" 
          className="rounded-sm"
        >
          {/* Main green background */}
          <rect width="600" height="400" fill="#007A4D" />
          
          {/* White Y shape */}
          <path d="M0,400 L200,200 L0,0 L0,400" fill="white" />
          <path d="M600,400 L400,200 L600,0 L600,400" fill="white" />
          
          {/* Y shape black borders */}
          <path d="M0,0 L200,200 L0,400 M600,0 L400,200 L600,400" stroke="black" strokeWidth="66.67" fill="none" />
          
          {/* Yellow Y shape */}
          <path d="M0,0 L200,200 L0,400 M600,0 L400,200 L600,400" stroke="#FFB612" strokeWidth="44.44" fill="none" />
          
          {/* Red horizontal parts */}
          <path d="M300,200 L0,200 M300,200 L600,200" stroke="#DE3831" strokeWidth="66.67" fill="none" />
          
          {/* Blue triangle */}
          <path d="M0,0 L200,200 L400,200 L600,0 Z" fill="#002395" />
        </svg>
        
        <div className="text-xs font-semibold">
          <span className="block">Proudly</span>
          <span className="block text-sm">South African</span>
        </div>
      </div>
    </div>
  );
}