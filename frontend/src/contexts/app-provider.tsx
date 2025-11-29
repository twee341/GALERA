'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export type Settings = {
  threshold: number;
  audioAlerts: boolean;
  visualAlerts: boolean;
};

type AppContextType = {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  isSessionActive: boolean;
  setIsSessionActive: Dispatch<SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    threshold: 40,
    audioAlerts: true,
    visualAlerts: true,
  });
  const [isSessionActive, setIsSessionActive] = useState(false);

  return (
    <AppContext.Provider value={{ settings, setSettings, isSessionActive, setIsSessionActive }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
