import { useState, useEffect } from 'react';

export default function useDarkMode() {
  // 1. Revisamos si el usuario ya tenía el modo oscuro guardado en localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('erp_theme');
    // Si no hay nada guardado, podrías usar la preferencia de su sistema:
    // return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark';
  });

  // 2. Este efecto se ejecuta cada vez que 'isDarkMode' cambia
  useEffect(() => {
    const htmlElement = document.documentElement;

    if (isDarkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('erp_theme', 'dark'); // Guardamos la preferencia
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('erp_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return { isDarkMode, toggleDarkMode };
}
