
// 1. Import React context utilities and the IUserSettings type
import React, { createContext, useContext } from 'react';
import { IUserSettings } from '../../entities/db-entities/user-settings';

// 2. Create a React context for user settings (initially undefined)
export const UserSettingsContext = createContext<IUserSettings | undefined>(undefined);

// 4. Custom hook to access user settings context, with error handling if used outside provider
export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    // 5. Throw a clear error if the hook is used outside the provider
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};

// Provider component to wrap your app and supply user settings
export const UserSettingsProvider: React.FC<{ children: React.ReactNode; value: IUserSettings }> = ({ children, value }) => (
  <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>
);
