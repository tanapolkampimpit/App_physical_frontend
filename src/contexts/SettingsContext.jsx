import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  // Retrieve initial settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return {
      eyeCareMode: false,
      aiVoice: true,
      cameraEnabled: true,
      darkMode: false,
      iconSize: 'md', // sm, md, lg
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [settings]);

  // Apply Dark Mode effect
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Apply Eye Care Mode effect (warm filter)
  useEffect(() => {
    if (settings.eyeCareMode) {
      document.body.style.filter = 'sepia(0.3) hue-rotate(-15deg)';
    } else {
      document.body.style.filter = 'none';
    }
  }, [settings.eyeCareMode]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};
