import { createContext } from 'react';
import { Data } from '../Data';

export const StoreContext = createContext<Data>({} as Data);
export const StoreProvider = StoreContext.Provider;
