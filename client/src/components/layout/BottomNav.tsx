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
      name: "Search",
      href: "/BrowseByCategory",
      icon: Search
    },
    {
      name: "Favourites",
      href: "/LikedItems",
      icon: Heart
    },
    {
      name: "Account",
      href: "/account",
      icon: User
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-50">
      <div className="flex justify-center items-center h-16 max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-xs space-y-1 flex-1 min-w-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-[9px] text-center leading-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}