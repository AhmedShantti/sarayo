'use client';

import {createContext, useCallback, useContext, useMemo, useState} from 'react';

const FlavorContext = createContext(null);

export function FlavorProvider({children}) {
    const [selectedFlavor, setSelectedFlavor] = useState('all');

    const selectFlavor = useCallback((id) => {
        setSelectedFlavor(id || 'all');
        if (typeof window !== 'undefined') {
            const el = document.getElementById('products');
            if (el) {
                el.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }
    }, []);

    const value = useMemo(
        () => ({selectedFlavor, selectFlavor, setSelectedFlavor}),
        [selectedFlavor, selectFlavor]
    );

    return <FlavorContext.Provider value={value}>{children}</FlavorContext.Provider>;
}

export function useFlavor() {
    const ctx = useContext(FlavorContext);
    if (!ctx) throw new Error('useFlavor must be used inside FlavorProvider');
    return ctx;
}
