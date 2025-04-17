import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useNavigation } from '@/context/NavigationContext';
import { Link } from 'wouter';
import BackButton from './BackButton';

interface NavigationControlsProps {
  mode?: 'floating' | 'fixed' | 'inline';
  showHistory?: boolean;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * Navigation controls component that provides:
 * - Back/forward navigation
 * - History browsing
 * - "Undo" navigation functionality
 * 
 * Can be displayed as a floating button, fixed bar, or inline component
 */
const NavigationControls: React.FC<NavigationControlsProps> = ({
  mode = 'floating',
  showHistory = true,
  className = '',
  position = 'bottom-right',
}) => {
  const { history, goBack, goForward, canGoBack, canGoForward } = useNavigation();
  const [historyOpen, setHistoryOpen] = useState(false);
  
  // Determine position classes for floating mode
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }[position];
  
  // Create the main navigation controls
  const navigationButtons = (
    <div className="flex items-center space-x-2">
      <BackButton 
        variant="outline" 
        size="sm" 
        showText={mode !== 'floating'}
        text="Back"
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={goForward} 
        disabled={!canGoForward}
      >
        {mode !== 'floating' && 'Forward'}
        <ChevronRight className={`h-4 w-4 ${mode !== 'floating' ? 'ml-2' : ''}`} />
      </Button>
      
      {showHistory && (
        <TooltipProvider>
          <Tooltip>
            <Popover open={historyOpen} onOpenChange={setHistoryOpen}>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <h4 className="font-medium">Navigation History</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setHistoryOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="max-h-80 overflow-auto">
                  {history.length > 0 ? (
                    <div className="py-2">
                      {history.slice().reverse().map((entry, index) => (
                        <Link 
                          key={`${entry.path}-${index}`}
                          href={entry.path}
                          onClick={() => setHistoryOpen(false)}
                          className="flex items-center px-3 py-2 hover:bg-muted transition-colors duration-200"
                        >
                          <div className="flex-1 truncate">
                            <div className="text-sm font-medium truncate">{entry.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{entry.path}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTimestamp(entry.timestamp)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-6 text-center text-muted-foreground">
                      No navigation history available
                    </div>
                  )}
                </div>
              </PopoverContent>
              
              <TooltipContent>
                <p>View navigation history</p>
              </TooltipContent>
            </Popover>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
  
  // Render based on the mode
  if (mode === 'floating') {
    return (
      <div className={`fixed ${positionClasses} z-50 ${className}`}>
        <div className="bg-background border rounded-full p-1 shadow-lg">
          {navigationButtons}
        </div>
      </div>
    );
  } else if (mode === 'fixed') {
    return (
      <div className={`bg-background border-b py-2 px-4 ${className}`}>
        <div className="container mx-auto">
          {navigationButtons}
        </div>
      </div>
    );
  } else {
    // Inline mode
    return (
      <div className={`inline-flex ${className}`}>
        {navigationButtons}
      </div>
    );
  }
};

// Helper to format timestamp
function formatTimestamp(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  
  // If today, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
  
  // If yesterday, show "Yesterday"
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // Otherwise show date
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default NavigationControls;