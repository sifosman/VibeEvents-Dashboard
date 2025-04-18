import React from "react";

export default function SouthAfricanBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-white p-1 rounded-lg shadow-md flex items-center space-x-2">
        {/* Corrected South African Flag as SVG */}
        <svg 
          width="32" 
          height="20" 
          viewBox="0 0 600 400" 
          className="rounded-sm"
        >
          {/* Background */}
          <rect width="600" height="400" fill="#002395" />
          
          {/* Top/Bottom "Y" shape */}
          <path d="M0,133.33 L200,200 L0,266.67 L0,133.33 Z M600,133.33 L400,200 L600,266.67 L600,133.33 Z" fill="white" />
          
          {/* Central white "Y" */}
          <path d="M300,200 L0,200 L0,200 M300,200 L600,200 L600,200" stroke="white" strokeWidth="66.67" fill="none" />
          
          {/* Red triangles */}
          <path d="M0,400 L300,200 L600,400 Z" fill="#E03C31" />
          <path d="M0,0 L300,200 L600,0 Z" fill="#E03C31" />
          
          {/* Green triangles */}
          <path d="M0,66.67 L150,200 L0,333.33 Z M600,66.67 L450,200 L600,333.33 Z" fill="#007749" />
          
          {/* Yellow borders */}
          <path d="M0,66.67 L150,200 L0,333.33 M600,66.67 L450,200 L600,333.33" stroke="#FDB913" strokeWidth="44.44" fill="none" />
          <path d="M300,200 L0,200 M300,200 L600,200" stroke="#FDB913" strokeWidth="44.44" fill="none" />
          
          {/* Black borders */}
          <path d="M0,66.67 L150,200 L0,333.33 M600,66.67 L450,200 L600,333.33" stroke="black" strokeWidth="22.22" fill="none" />
          <path d="M300,200 L0,200 M300,200 L600,200" stroke="black" strokeWidth="22.22" fill="none" />
        </svg>
        
        <div className="text-xs font-semibold">
          <span className="block">Proudly</span>
          <span className="block text-sm">South African</span>
        </div>
      </div>
    </div>
  );
}