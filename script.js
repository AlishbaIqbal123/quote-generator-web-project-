const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const copyBtn = document.getElementById('copy-btn');
const twitterBtn = document.getElementById('twitter-btn');
const whatsappBtn = document.getElementById('whatsapp-btn');
const toast = document.getElementById('toast');

// fallback quotes in case API fails
const localQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

async function getQuote() {
    // Add loading state
    newQuoteBtn.disabled = true;
    newQuoteBtn.querySelector('span').textContent = 'Fetching...';
    quoteText.classList.add('fade-out');
    quoteAuthor.classList.add('fade-out');

    try {
        // Using a reliable public API
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
        const data = await response.json();
        const quoteObj = JSON.parse(data.contents)[0];
        
        setTimeout(() => {
            quoteText.textContent = quoteObj.q;
            quoteAuthor.textContent = quoteObj.a;
            
            removeLoading();
        }, 300);

    } catch (error) {
        console.error("Error fetching quote, using local fallback:", error);
        const randomIndex = Math.floor(Math.random() * localQuotes.length);
        const randomQuote = localQuotes[randomIndex];
        
        setTimeout(() => {
            quoteText.textContent = randomQuote.text;
            quoteAuthor.textContent = randomQuote.author;
            
            removeLoading();
        }, 300);
    }
}

function removeLoading() {
    newQuoteBtn.disabled = false;
    newQuoteBtn.querySelector('span').textContent = 'New Quote';
    quoteText.classList.remove('fade-out');
    quoteAuthor.classList.remove('fade-out');
}

// Copy Quote
copyBtn.addEventListener('click', () => {
    const text = `"${quoteText.textContent}" - ${quoteAuthor.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
        showToast();
    });
});

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Share on Twitter
twitterBtn.addEventListener('click', () => {
    const text = `"${quoteText.textContent}" - ${quoteAuthor.textContent}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
});

// Share on WhatsApp
whatsappBtn.addEventListener('click', () => {
    const text = `"${quoteText.textContent}" - ${quoteAuthor.textContent}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
});

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);

// Initial Quote
getQuote();
