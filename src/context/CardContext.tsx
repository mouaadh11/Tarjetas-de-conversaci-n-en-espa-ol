import { createContext, ReactNode } from "react";

// Define the context type
interface CardContextType {
  refresh: () => void;
}

// Create the context with a default value
export const CardContext = createContext<CardContextType>({
  refresh: () => {},
});

interface CardProviderProps {
  children: ReactNode;
  loadCards: () => void;
}

// Define the provider component
export const CardProvider = ({ children, loadCards }: CardProviderProps) => {
  return (
    <CardContext.Provider value={{ refresh: loadCards }}>
      {children}
    </CardContext.Provider>
  );
};
