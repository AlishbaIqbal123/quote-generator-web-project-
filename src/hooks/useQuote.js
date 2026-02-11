import { useState, useEffect } from 'react';
import { getQuote as fetchQuoteApi } from '../services/quoteApi';

const useQuote = () => {
    const [quote, setQuote] = useState({ text: '', author: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuote = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchQuoteApi();
            setQuote(data);
        } catch (err) {
            setError('Failed to fetch quote');
        } finally {
            // Small delay for smooth transition even if API is instant
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => {
        fetchQuote();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    return { quote, loading, error, fetchQuote };
};

export default useQuote;
