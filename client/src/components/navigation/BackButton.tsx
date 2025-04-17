import React from 'react';
import { ChevronLeft, RotateCcw, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBackButton } from '@/context/NavigationContext';

interface BackButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
  text?: string;
  icon?: 'arrow' | 'rotate' | 'history';
  tooltip?: string;
  customAction?: () => void;
}

/**
 * Reusable back button component that uses navigation history
 * to help users easily return to previous pages
 */
const BackButton: React.FC<BackButtonProps> = ({
  variant = 'outline',
  size = 'default',
  className = '',
  showText = true,
  text = 'Back',
  icon = 'arrow',
  tooltip = 'Go back to previous page',
  customAction,
}) => {
  const { handleGoBack, canGoBack } = useBackButton(customAction);
  
  // Select the appropriate icon based on props
  const Icon = icon === 'arrow' ? ChevronLeft : 
               icon === 'rotate' ? RotateCcw : History;
  
  const button = (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleGoBack}
      disabled={!customAction && !canGoBack && !window.history.length}
    >
      <Icon className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
      {showText && text}
    </Button>
  );
  
  // If tooltip is provided, wrap button in tooltip component
  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return button;
};

export default BackButton;