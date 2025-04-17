import React, { useState, useEffect } from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface UndoRedoButtonProps<T> {
  value: T;
  onChange: (value: T) => void;
  initialValue?: T;
  disabled?: boolean;
  className?: string;
  maxHistory?: number;
}

/**
 * UndoRedoButton - A generic component that provides undo/redo functionality
 * for form values or any other state.
 * 
 * Perfect for allowing users to undo changes within a form or editor.
 */
function UndoRedoButton<T>({ 
  value, 
  onChange, 
  initialValue, 
  disabled = false,
  className = '',
  maxHistory = 30
}: UndoRedoButtonProps<T>) {
  // Track history of changes and current position in history
  const [history, setHistory] = useState<T[]>([]);
  const [position, setPosition] = useState(-1);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize history with initial value if provided
  useEffect(() => {
    if (!isInitialized) {
      const initialHistory = initialValue !== undefined 
        ? [initialValue] 
        : [value];
      
      setHistory(initialHistory);
      setPosition(0);
      setIsInitialized(true);
    }
  }, [initialValue, value, isInitialized]);
  
  // Update history when value changes
  useEffect(() => {
    if (isInitialized && 
        (history.length === 0 || JSON.stringify(value) !== JSON.stringify(history[position]))) {
      
      // Create new history by truncating future history (if any) and adding new value
      const newHistory = [...history.slice(0, position + 1), value].slice(-maxHistory);
      setHistory(newHistory);
      setPosition(newHistory.length - 1);
    }
  }, [value, history, position, isInitialized, maxHistory]);
  
  // Undo function
  const handleUndo = () => {
    if (position > 0) {
      const newPosition = position - 1;
      setPosition(newPosition);
      onChange(history[newPosition]);
    }
  };
  
  // Redo function
  const handleRedo = () => {
    if (position < history.length - 1) {
      const newPosition = position + 1;
      setPosition(newPosition);
      onChange(history[newPosition]);
    }
  };
  
  // Check if undo/redo are available
  const canUndo = position > 0;
  const canRedo = position < history.length - 1;
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={disabled || !canUndo}
              className="h-8 w-8 p-0"
            >
              <Undo2 className="h-4 w-4" />
              <span className="sr-only">Undo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo change</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRedo}
              disabled={disabled || !canRedo}
              className="h-8 w-8 p-0"
            >
              <Redo2 className="h-4 w-4" />
              <span className="sr-only">Redo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo change</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default UndoRedoButton;