import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * SessionManager Component
 * Handles session expiry events and automatic logout
 * Should be mounted at the root level of the app
 */
export const SessionManager = () => {
  const { logout, openAuth } = useAuth();

  useEffect(() => {
    const handleSessionExpired = (event: CustomEvent) => {
      
      
      // Show error toast
      toast.error(event.detail.message || 'Your session has expired. Please login again.', {
        duration: 5000,
        position: 'top-center',
      });

      // Logout user
      logout();
      
      // Open auth modal for re-login
      setTimeout(() => {
        openAuth();
      }, 500);
    };

    // Listen for custom session expired event
    window.addEventListener('sessionExpired' as any, handleSessionExpired);

    return () => {
      window.removeEventListener('sessionExpired' as any, handleSessionExpired);
    };
  }, [logout, openAuth]);

  return null;
};

export default SessionManager;
