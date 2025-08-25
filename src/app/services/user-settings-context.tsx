import React, { createContext, useContext, useState } from 'react';
import { IUserSettings } from '../../entities/db-entities/user-settings';

export const UserSettingsContext = createContext<IUserSettings | undefined>(undefined);

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};

export const UserSettingsProvider: React.FC<{ children: React.ReactNode; value: IUserSettings }> = ({ children, value }) => (
  <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>
);
