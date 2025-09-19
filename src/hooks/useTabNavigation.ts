
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

interface UseTabNavigationProps {
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

export const useTabNavigation = ({ 
  defaultTab = 'dashboard',
  onTabChange 
}: UseTabNavigationProps = {}) => {
  const navigate = useNavigate();
  const { tab: urlTab, subtab: urlSubtab } = useParams();
  const location = useLocation();
  
  // Initialize activeTab from URL or default
  const [activeTab, setActiveTab] = useState(() => {
    return urlTab || defaultTab;
  });

  // Sync state with URL changes
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
      onTabChange?.(urlTab);
    }
  }, [urlTab, activeTab, onTabChange]);

  // Function to change tabs (updates both state and URL)
  const handleTabChange = useCallback((newTab: string) => {
    
    // Update local state immediately
    setActiveTab(newTab);
    
    // Update URL without page refresh
    if (newTab === defaultTab) {
      // For default tab, go to root path
      navigate('/', { replace: true });
    } else {
      // For other tabs, use the tab name as path
      navigate(`/${newTab}`, { replace: true });
    }
    
    // Call optional callback
    onTabChange?.(newTab);
  }, [navigate, defaultTab, onTabChange]);

  // Function to navigate to subtab
  const navigateToSubtab = useCallback((tab: string, subtab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}/${subtab}`, { replace: true });
    onTabChange?.(tab);
  }, [navigate, onTabChange]);

  return {
    activeTab,
    setActiveTab: handleTabChange,
    navigateToSubtab,
    urlTab,
    urlSubtab,
    currentPath: location.pathname
  };
};
