import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    smsAlerts: boolean;
    emailUpdates: boolean;
  };
  isAdmin?: boolean;
  isVerified?: boolean;
  kycStatus?: 'pending' | 'verified' | 'rejected' | 'none';
}

interface SessionInfo {
  expiresAt: number;
  expiresIn: number;
}

interface AuthContextType {
  user: User | null;
  isAuthOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
  sessionInfo: SessionInfo | null;
  isSessionExpired: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const sessionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check session expiry and setup auto-logout
  const setupSessionTimer = useCallback((expiresAt: number) => {
    // Clear existing timers
    if (sessionTimer.current) clearTimeout(sessionTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    if (timeUntilExpiry <= 0) {
      // Session already expired
      setIsSessionExpired(true);
      handleAutoLogout("Your session has expired. Please login again.");
      return;
    }

    // Warning 5 minutes before expiry
    const warningTime = timeUntilExpiry - 5 * 60 * 1000;
    if (warningTime > 0) {
      warningTimer.current = setTimeout(() => {
        if (user) {
          toast.warning(
            "Your session will expire in 5 minutes. Please save your work!",
            { duration: 5000 }
          );
        }
      }, warningTime);
    }

    // Auto logout on expiry
    sessionTimer.current = setTimeout(() => {
      setIsSessionExpired(true);
      handleAutoLogout("Your session has expired. Please login again.");
    }, timeUntilExpiry);
  }, [user]);

  // Handle automatic logout
  const handleAutoLogout = useCallback((message?: string) => {
    setUser(null);
    setIsSessionExpired(true);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionInfo");
    setIsAuthOpen(true);
    if (message) {
      toast.error(message, { duration: 4000 });
    }
  }, []);

  // Load user from localStorage on mount and setup session timer
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");
    const savedSessionInfo = localStorage.getItem("sessionInfo");

    if (token && savedUser && savedSessionInfo) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const parsedSessionInfo = JSON.parse(savedSessionInfo) as SessionInfo;
        
        // Check if session is already expired
        if (parsedSessionInfo.expiresAt <= Date.now()) {
          handleAutoLogout("Your session has expired. Please login again.");
        } else {
          setUser(parsedUser);
          setSessionInfo(parsedSessionInfo);
          setupSessionTimer(parsedSessionInfo.expiresAt);
        }
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("sessionInfo");
      }
    }
    setLoading(false);
  }, []);

  const openAuth = useCallback(() => setIsAuthOpen(true), []);
  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  const register = useCallback(async (name: string, email: string, password: string, phone: string) => {
    setLoading(true);
    try {
      const response = await authAPI.register(name, email, password, phone);
      if (response.success) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        const sessionInfo = {
          expiresAt: response.expiresAt,
          expiresIn: response.expiresIn,
        };
        localStorage.setItem("sessionInfo", JSON.stringify(sessionInfo));
        
        setUser(response.user);
        setSessionInfo(sessionInfo);
        setIsSessionExpired(false);
        setupSessionTimer(response.expiresAt);
        setIsAuthOpen(false);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setupSessionTimer]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        const sessionInfo = {
          expiresAt: response.expiresAt,
          expiresIn: response.expiresIn,
        };
        localStorage.setItem("sessionInfo", JSON.stringify(sessionInfo));
        
        setUser(response.user);
        setSessionInfo(sessionInfo);
        setIsSessionExpired(false);
        setupSessionTimer(response.expiresAt);
        setIsAuthOpen(false);
        toast.success(`Welcome back, ${response.user.name}!`);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setupSessionTimer]);

  const logout = useCallback(() => {
    // Clear timers
    if (sessionTimer.current) clearTimeout(sessionTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    setUser(null);
    setSessionInfo(null);
    setIsSessionExpired(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionInfo");
    toast.success("Logged out successfully");
  }, []);

  const isAdmin = user?.isAdmin ?? false;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthOpen, 
        openAuth, 
        closeAuth, 
        login, 
        register, 
        logout, 
        isAdmin, 
        loading,
        sessionInfo,
        isSessionExpired
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
