import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Search, Heart, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const [location] = useLocation();
  
  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home
    },
    {
      name: "Search by Category",
      href: "/BrowseByCategory",
      icon: Search
    },
    {
      name: "My Favourites",
      href: "/LikedItems",
      icon: Heart
    },
    {
      name: "My Account",
      href: "/account",
      icon: User
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-xs space-y-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "h-6 w-6",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}