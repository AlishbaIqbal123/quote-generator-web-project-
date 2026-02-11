import { useState, useEffect } from 'react';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = '63bWwYPkkVI9cK-idE5Z6d-eTIWCXlzZB8Pm56nwIVg';

const useUnsplash = (initialQuery) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchImages = async (searchTerm = initialQuery) => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = searchTerm
                ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`
                : `https://api.unsplash.com/photos/random?count=12&client_id=${UNSPLASH_ACCESS_KEY}`;

            const res = await axios.get(endpoint);
            // Handle both random (array) and search (object with results)
            const data = res.data.results ? res.data.results : res.data;
            setImages(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load images');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchImages(initialQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { images, loading, error, fetchImages };
};

export default useUnsplash;
