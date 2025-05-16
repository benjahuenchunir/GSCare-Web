import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type FontSize = 'text-base' | 'text-lg' | 'text-xl';

const FontSizeContext = createContext<{
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}>({ fontSize: 'text-base', setFontSize: () => {} });

export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem('fontSize') as FontSize) || 'text-base'
  );

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      <div className={fontSize}>{children}</div>
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);
