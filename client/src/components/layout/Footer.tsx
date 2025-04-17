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
              <h3 className="text-primary font-display font-bold text-xl">WeddingPro</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Your complete wedding planning solution to find and book the best service providers for your special day.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Globe size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-4">For Couples</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">How It Works</Link></li>
              <li><Link href="/vendors" className="text-muted-foreground hover:text-primary transition">Browse Vendors</Link></li>
              <li><Link href="/planner" className="text-muted-foreground hover:text-primary transition">Wedding Planner Tools</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Wedding Inspiration</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Real Weddings</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-4">For Vendors</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Join as Vendor</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Vendor Benefits</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Vendor Dashboard</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Success Stories</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Advertising Options</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">FAQs</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition">About Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">© 2023 WeddingPro. All rights reserved.</p>
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
