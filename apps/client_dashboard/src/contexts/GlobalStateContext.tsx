import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// Define types
interface GlobalState {
  authToken: string | null;
}

type GlobalAction = { type: 'SET_AUTH_TOKEN'; payload: string } | { type: 'CLEAR_AUTH_TOKEN' };

interface GlobalStateContextType {
  state: GlobalState;
  dispatch: Dispatch<GlobalAction>;
}

// Initial state
const initialState: GlobalState = {
  authToken: null
};

// Reducer function
const reducer = (state: GlobalState, action: GlobalAction): GlobalState => {
  switch (action.type) {
    case 'SET_AUTH_TOKEN':
      return { ...state, authToken: action.payload };
    case 'CLEAR_AUTH_TOKEN':
      return { ...state, authToken: null };
    default:
      return state;
  }
};

// Create the context
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// Custom hook to access the context
const useGlobalStateContext = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalStateContext must be used within a GlobalStateProvider');
  }
  return context;
};

// Context provider component
interface GlobalStateProviderProps {
  children: ReactNode;
}

const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export { GlobalStateProvider, useGlobalStateContext };
