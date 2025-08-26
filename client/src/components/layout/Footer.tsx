import React from "react";
import { Link } from "wouter";
import { Heart, Instagram, Facebook, Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Heart className="text-primary mr-2" />
              <h3 className="text-primary font-display font-bold text-xl">Vibeventz</h3>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/vendors" className="text-muted-foreground hover:text-primary transition">Browse Vendors</Link></li>
              <li><Link href="/planner" className="text-muted-foreground hover:text-primary transition">Event Planner</Link></li>
              <li><Link href="/support" className="text-muted-foreground hover:text-primary transition">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">© 2025 Vibeventz. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary text-sm transition">Terms</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary text-sm transition">Privacy</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary text-sm transition">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
