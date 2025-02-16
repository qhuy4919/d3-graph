import { createContext, useContext } from 'react';

export const D3GraphContext = createContext<{
    maxWidthLabel?: number
}>({
    maxWidthLabel: 0
});

export const useD3graphContext = () => useContext(D3GraphContext)