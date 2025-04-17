import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'wouter';
import { useNavigation } from '@/context/NavigationContext';

interface BreadcrumbsProps {
  className?: string;
  homeLink?: string;
  homeLabel?: string;
  items?: { path: string; label: string }[];
  maxItems?: number;
  showHome?: boolean;
}

/**
 * Breadcrumb navigation component
 * Shows the path a user has taken to reach the current page
 * and allows them to navigate back to previous pages
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  className = '',
  homeLink = '/',
  homeLabel = 'Home',
  items = [],
  maxItems = 3,
  showHome = true,
}) => {
  const { history, currentPath } = useNavigation();
  
  // Generate breadcrumb items from navigation history or from props
  const breadcrumbItems = items.length > 0 
    ? items 
    : generateBreadcrumbsFromHistory(history, maxItems, showHome, homeLink, homeLabel);
  
  return (
    <nav className={`flex text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              )}
              
              {isLast ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.path}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {index === 0 && showHome && item.path === homeLink ? (
                    <span className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/**
 * Generate breadcrumb items from navigation history
 */
function generateBreadcrumbsFromHistory(
  history: Array<{ path: string; title: string }>,
  maxItems: number,
  showHome: boolean,
  homeLink: string,
  homeLabel: string
): Array<{ path: string; label: string }> {
  // Start with home if requested
  const items = showHome 
    ? [{ path: homeLink, label: homeLabel }] 
    : [];
  
  // Add unique items from history (most recent first, up to max count)
  const uniquePaths = new Set<string>();
  uniquePaths.add(homeLink); // Add home to avoid duplication
  
  // Use recent history items but avoid duplicates
  for (let i = history.length - 1; i >= 0; i--) {
    const item = history[i];
    
    // Skip home path and duplicate paths
    if (!uniquePaths.has(item.path)) {
      uniquePaths.add(item.path);
      
      // Add the item
      items.push({
        path: item.path,
        label: formatPathToLabel(item.path, item.title),
      });
      
      // Stop when we reach the maximum number of items
      if (items.length >= maxItems) {
        break;
      }
    }
  }
  
  return items;
}

/**
 * Format a path or use a provided title to create a breadcrumb label
 */
function formatPathToLabel(path: string, title?: string): string {
  // If title is provided, use it
  if (title && title !== 'Page') {
    return title;
  }
  
  // Otherwise format the path
  const parts = path.split('/').filter(Boolean);
  
  if (parts.length === 0) {
    return 'Home';
  }
  
  // Get the last part of the path
  const lastPart = parts[parts.length - 1];
  
  // Format the last part (e.g., convert-kebab-case to "Convert Kebab Case")
  return lastPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default Breadcrumbs;