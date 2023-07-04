import { ReactNode, createContext, useContext, useMemo } from "react";
import { Self } from "@data/interface";

interface AppState {
  self: Self | null;
  setSelf: (self: Self | null) => void;
}

const StateContext = createContext<AppState | null>(null);

interface StateProviderProps extends AppState {
  children: ReactNode;
}

export const StateProvider = (props: StateProviderProps) => {
  const value = useMemo(() => {
    const res = Object.create(props);
    delete res.children;
    return res;
  }, [props]);

  return (
    <StateContext.Provider value={value}>
      {props.children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const state = useContext(StateContext);

  if (state === null) {
    throw new Error("useAppState has to be used within <StateProvider>");
  }

  return state;
};
