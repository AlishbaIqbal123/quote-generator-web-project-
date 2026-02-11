import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Image as ImageIcon, Search, Download, RefreshCw, Copy, Twitter, Instagram } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

const UNSPLASH_ACCESS_KEY = '63bWwYPkkVI9cK-idE5Z6d-eTIWCXlzZB8Pm56nwIVg'; // User should replace this

function App() {
  const [activeTab, setActiveTab] = useState('quote');
  const [quote, setQuote] = useState({ text: 'Inspiration is the spark that lights the path to greatness.', author: 'Inspiria' });
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Quote Generation
  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
      const data = JSON.parse(res.data.contents)[0];
      setQuote({ text: data.q, author: data.a });
    } catch (err) {
      toast.error('Failed to fetch new quote. Using fallback.');
    } finally {
      setLoading(false);
    }
  };

  // Image Fetching
  const fetchImages = async (query = 'nature') => {
    setLoading(true);
    try {
      const endpoint = searchQuery
        ? `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`
        : `https://api.unsplash.com/photos/random?count=12&client_id=${UNSPLASH_ACCESS_KEY}`;

      const res = await axios.get(endpoint);
      const newImages = searchQuery ? res.data.results : res.data;
      setImages(newImages);
    } catch (err) {
      if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
        toast.error('Please add your Unsplash Access Key in App.jsx');
      } else {
        toast.error('Failed to fetch images.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    if (activeTab === 'gallery') {
      fetchImages();
    }
  }, [activeTab]);

  const handleDownload = async (img) => {
    try {
      toast.loading('Downloading...', { id: 'download' });

      // Trigger Unsplash download tracking
      await axios.get(img.links.download_location, {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
      }).catch(err => console.error("Tracking failed", err));

      // Fetch the actual image
      const response = await fetch(img.urls.regular);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `inspiria-${img.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started!', { id: 'download' });
    } catch (err) {
      console.error(err);
      toast.error('Download failed. Try opening in new tab.', { id: 'download' });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    toast.success('Quote copied!');
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote.text}" - ${quote.author}`)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="main-wrapper">
      <div className="background-animate"></div>
      <Toaster position="bottom-center" />

      <header className="app-header">
        <h1 className="title-gradient">Inspiria</h1>
        <p className="subtitle">Daily Inspiration & Creative Assets</p>
      </header>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'quote' ? 'active' : ''}`}
          onClick={() => setActiveTab('quote')}
        >
          <Quote size={18} style={{ marginRight: 8 }} />
          Daily Quote
        </button>
        <button
          className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <ImageIcon size={18} style={{ marginRight: 8 }} />
          Image Gallery
        </button>
      </div>

      <main className="content-container">
        <AnimatePresence mode="wait">
          {activeTab === 'quote' ? (
            <motion.div
              key="quote"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="quote-card-wrapper"
            >
              <div className="glass-card quote-card">
                <div className="quote-icon-bg"><Quote size={80} /></div>
                <div className="quote-content">
                  <p className="quote-text">"{quote.text}"</p>
                  <div className="quote-divider"></div>
                  <p className="quote-author">{quote.author}</p>
                </div>

                <div className="quote-actions">
                  <button onClick={copyToClipboard} className="icon-btn" title="Copy">
                    <Copy size={22} />
                  </button>
                  <button onClick={shareTwitter} className="icon-btn" title="Tweet">
                    <Twitter size={22} />
                  </button>
                  <button
                    onClick={fetchQuote}
                    className="generate-btn"
                    disabled={loading}
                  >
                    <RefreshCw size={20} className={loading ? 'spin' : ''} />
                    <span>New Quote</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.section
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="gallery-section"
            >
              <form
                className="search-bar"
                onSubmit={(e) => { e.preventDefault(); fetchImages(); }}
              >
                <input
                  type="text"
                  placeholder="Search for inspiration..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <Search size={20} />
                </button>
              </form>

              {loading && <div className="loader"></div>}

              <div className="grid-gallery">
                {images.map((img) => (
                  <motion.div
                    layout
                    key={img.id}
                    className="image-card"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={img.urls.regular} alt={img.alt_description} loading="lazy" />
                    <div className="image-overlay">
                      <div className="photographer-info">
                        <img src={img.user.profile_image.small} alt={img.user.name} className="user-avatar" />
                        <span>{img.user.name}</span>
                      </div>
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(img)}
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer>
        <p>Inspiria &copy; 2024</p>
      </footer>
    </div>
  );
}

export default App;
