import { useState, useEffect } from 'react';
import { getQuote as fetchQuoteApi } from '../services/quoteApi';

const useQuote = () => {
    // State for storing the fetched quote object (text and author)
    const [quote, setQuote] = useState({ text: '', author: '' });

    // Loading state to manage UI feedback during API calls
    const [loading, setLoading] = useState(false);

    // Error state for exception handling
    const [error, setError] = useState(null);

    /**
     * Fetches a new random quote from the service.
     * Manages loading and error states to ensure smooth UI transitions.
     */
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
