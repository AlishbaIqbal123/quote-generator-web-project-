import axios from 'axios';

// Fetch random quote from Quotable API (fast & CORS friendly)
export const getQuote = async () => {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        const data = response.data;
        return {
            text: data.content,
            author: data.author,
        };
    } catch (error) {
        console.error('Error fetching quote:', error);
        // Fallback to ZenQuotes with proxy if Quotable fails
        try {
            const response = await axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
            const data = JSON.parse(response.data.contents)[0];
            return {
                text: data.q,
                author: data.a,
            };
        } catch (e) {
            return {
                text: "Code is like humor. When you have to explain it, it’s bad.",
                author: "Cory House"
            };
        }
    }
};
