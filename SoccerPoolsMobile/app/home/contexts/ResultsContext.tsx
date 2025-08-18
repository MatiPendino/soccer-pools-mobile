import { createContext, useContext, useMemo, useState } from 'react';

const ResultsContext = createContext(null);

export const ResultsProvider = ({ children }) => {
    const [arePredictionsSaved, setArePredictionsSaved] = useState(true);
    const value = useMemo(() => ({arePredictionsSaved, setArePredictionsSaved}), [arePredictionsSaved]);

    return (
        <ResultsContext.Provider value={value}>
            {children}
        </ResultsContext.Provider>
    )
}

export const useResultsContext = () => {
    const context = useContext(ResultsContext);
    if (!context) throw new Error('useResultsContext must be used within a ResultsProvider');

    return context;
}