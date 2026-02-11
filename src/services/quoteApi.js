import axios from 'axios';

// Fetch random quote from ZenQuotes
// Since ZenQuotes has CORS restrictions on free tier, we use a proxy
export const getQuote = async () => {
    try {
        const response = await axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
        const data = JSON.parse(response.data.contents)[0];
        return {
            text: data.q,
            author: data.a,
        };
    } catch (error) {
        console.error('Error fetching quote:', error);
        // Fallback quote
        return {
            text: "Code is like humor. When you have to explain it, it’s bad.",
            author: "Cory House"
        };
    }
};
