import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
}

const FontSizeContext = createContext<FontSizeContextType>({
  fontSize: 'text-base',
  setFontSize: () => {},
  increaseFont: () => {},
  decreaseFont: () => {},
  resetFont: () => {},
});

export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem('fontSize') as FontSize) || 'text-base'
  );

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const increaseFont = () => {
    if (fontSize === 'text-sm') setFontSize('text-base');
    else if (fontSize === 'text-base') setFontSize('text-lg');
    else if (fontSize === 'text-lg') setFontSize('text-xl');
  };

  const decreaseFont = () => {
    if (fontSize === 'text-xl') setFontSize('text-lg');
    else if (fontSize === 'text-lg') setFontSize('text-base');
    else if (fontSize === 'text-base') setFontSize('text-sm');
  };

  const resetFont = () => setFontSize('text-base');

  return (
    <FontSizeContext.Provider
      value={{ fontSize, setFontSize, increaseFont, decreaseFont, resetFont }}
    >
      <div className={fontSize}>{children}</div>
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);
