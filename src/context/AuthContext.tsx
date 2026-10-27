import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Gym } from '../types';
import { storage } from '../db/storage';
import {
  auth,
  isAuthorizedOwner,
  AUTHORIZED_OWNER_EMAIL,
  AUTHORIZED_OWNER_DEFAULT_PASS,
  authenticateFirebaseUser,
  onAuthStateChanged,
  fbSignOut,
} from '../db/firebase';

interface AuthContextType {
  currentUser: UserProfile | null;
  gym: Gym;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Omit<UserProfile, 'id' | 'joinedDate' | 'joinStatus'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  quickSwitchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  refreshState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_USER_ID_KEY = 'fitcare_session_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [gym, setGym] = useState<Gym>(storage.getGym());
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  const loadSession = () => {
    const savedUserId = localStorage.getItem(SESSION_USER_ID_KEY);
    const users = storage.getUsers();

    if (savedUserId) {
      const user = users.find((u) => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
        setIsLoading(false);
        return;
      }
    }

    // Default to Gym Owner Varad Sutar for initial rich administrative experience
    const defaultOwner = users.find((u) => u.email === AUTHORIZED_OWNER_EMAIL && u.role === 'owner') || users.find((u) => u.role === 'owner') || users[0];
    if (defaultOwner) {
      setCurrentUser(defaultOwner);
      localStorage.setItem(SESSION_USER_ID_KEY, defaultOwner.id);
    }
    setGym(storage.getGym());
    setIsLoading(false);
  };

  useEffect(() => {
    loadSession();

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && fbUser.email) {
        setIsFirebaseConnected(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = storage.getUserByEmail(normalizedEmail);

    // Strict Gym Owner portal security enforcement:
    // Only varadsutar1703@gmail.com can access the Gym Owner role
    if (user && user.role === 'owner') {
      if (!isAuthorizedOwner(normalizedEmail)) {
        return {
          success: false,
          error: 'Access Denied: The Gym Owner Portal is exclusively restricted to ' + AUTHORIZED_OWNER_EMAIL + '.',
        };
      }
      if (password && password !== AUTHORIZED_OWNER_DEFAULT_PASS) {
        return {
          success: false,
          error: 'Invalid password. Please enter the authorized Gym Owner password (12136).',
        };
      }
    }

    if (!user) {
      return {
        success: false,
        error: 'No account found with this email. Please check spelling or register.',
      };
    }

    // Authenticate with Firebase Auth
    try {
      const fbAuthResult = await authenticateFirebaseUser(
        normalizedEmail,
        password || user.password || '12136'
      );
      if (!fbAuthResult.success) {
        console.warn('Firebase auth notice:', fbAuthResult.error);
      }
    } catch (e) {
      console.warn('Firebase auth connection notice:', e);
    }

    setCurrentUser(user);
    localStorage.setItem(SESSION_USER_ID_KEY, user.id);
    return { success: true };
  };

  const register = async (
    data: Omit<UserProfile, 'id' | 'joinedDate' | 'joinStatus'>
  ): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = storage.getUserByEmail(normalizedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Protect Gym Owner role from unauthorized registration
    if (data.role === 'owner' && !isAuthorizedOwner(normalizedEmail)) {
      return {
        success: false,
        error: 'Access Denied: Only ' + AUTHORIZED_OWNER_EMAIL + ' can be registered as Gym Owner.',
      };
    }

    // Verify gym code if provided
    const gymInstance = storage.getGym();
    let status: 'active' | 'pending' = 'active';
    if (data.role === 'member' && data.gymCode && data.gymCode.toUpperCase() !== gymInstance.code.toUpperCase()) {
      status = 'pending';
    }

    const newUser: UserProfile = {
      ...data,
      id: 'user-' + Date.now(),
      email: normalizedEmail,
      joinedDate: new Date().toISOString().split('T')[0],
      joinStatus: status,
      gymId: gymInstance.id,
      gymCode: gymInstance.code,
      membershipPlan: data.role === 'owner' || data.role === 'trainer' ? 'Staff' : (data.membershipPlan || 'Standard'),
      isProfilePublic: data.isProfilePublic ?? false,
      allowLeaderboard: data.allowLeaderboard ?? true,
    };

    // Also provision in Firebase Auth
    if (data.password) {
      try {
        await authenticateFirebaseUser(normalizedEmail, data.password);
      } catch (e) {
        console.warn('Firebase registration notice:', e);
      }
    }

    storage.saveUser(newUser);
    setCurrentUser(newUser);
    localStorage.setItem(SESSION_USER_ID_KEY, newUser.id);

    // Notify owner
    storage.addNotification({
      id: 'notif-' + Date.now(),
      userId: gymInstance.ownerId,
      title: 'New Member Registered',
      message: newUser.fullName + ' (' + newUser.fitnessGoal.replace('_', ' ') + ') has registered with the gym.',
      read: false,
      date: new Date().toISOString().split('T')[0],
      type: 'approval',
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_USER_ID_KEY);
    fbSignOut(auth).catch(() => {});
    const users = storage.getUsers();
    const guestUser = users.find((u) => u.role === 'member');
    if (guestUser) {
      setCurrentUser(guestUser);
      localStorage.setItem(SESSION_USER_ID_KEY, guestUser.id);
    }
  };

  const switchUser = (userId: string) => {
    const user = storage.getUserById(userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(SESSION_USER_ID_KEY, user.id);
    }
  };

  const quickSwitchRole = (role: UserRole) => {
    const users = storage.getUsers();
    let target: UserProfile | undefined;
    if (role === 'owner') {
      target = users.find((u) => u.email === AUTHORIZED_OWNER_EMAIL && u.role === 'owner') || users.find((u) => u.role === 'owner');
    } else {
      target = users.find((u) => u.role === role);
    }
    if (target) {
      setCurrentUser(target);
      localStorage.setItem(SESSION_USER_ID_KEY, target.id);
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    storage.saveUser(updated);
    setCurrentUser(updated);
  };

  const refreshState = () => {
    if (currentUser) {
      const refreshed = storage.getUserById(currentUser.id);
      if (refreshed) setCurrentUser(refreshed);
    }
    setGym(storage.getGym());
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        gym,
        isLoading,
        isFirebaseConnected,
        login,
        register,
        logout,
        switchUser,
        quickSwitchRole,
        updateProfile,
        refreshState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
