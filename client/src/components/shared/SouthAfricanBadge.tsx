import React from "react";

export default function SouthAfricanBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-white p-2 rounded-lg shadow-md flex items-center space-x-2">
        {/* South African Flag as SVG */}
        <svg 
          width="40" 
          height="24" 
          viewBox="0 0 300 180" 
          className="rounded-sm"
        >
          {/* Black triangle */}
          <path d="M0,0 L300,90 L0,180 Z" fill="black" />
          
          {/* Yellow stripe */}
          <path d="M0,30 L240,90 L0,150 Z" fill="#FFB81C" />
          
          {/* Green background */}
          <rect x="0" y="0" width="300" height="60" fill="#007C59" />
          <rect x="0" y="120" width="300" height="60" fill="#007C59" />
          
          {/* White bands */}
          <rect x="0" y="60" width="300" height="15" fill="white" />
          <rect x="0" y="105" width="300" height="15" fill="white" />
          
          {/* Red top and bottom */}
          <rect x="0" y="75" width="300" height="30" fill="#DE3831" />
          
          {/* Blue triangle */}
          <path d="M0,0 L100,90 L0,180 Z" fill="#002395" />
        </svg>
        
        <div className="text-xs font-semibold">
          <span className="block">Proudly</span>
          <span className="block text-sm">South African</span>
        </div>
      </div>
    </div>
  );
}