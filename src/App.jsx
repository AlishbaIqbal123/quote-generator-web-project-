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
    if (activeTab === 'gallery') {
      fetchImages();
    }
  }, [activeTab]);

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `inspiria-${filename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started!');
    } catch (err) {
      toast.error('Download failed.');
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
    <div className="container">
      <Toaster position="bottom-center" />

      <header className="app-header">
        <h1 className="title-gradient">Inspiria</h1>
        <p className="subtitle">Premium Creative Portal</p>
      </header>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'quote' ? 'active' : ''}`}
          onClick={() => setActiveTab('quote')}
        >
          <Quote size={18} style={{ marginRight: 8 }} />
          Quote Generator
        </button>
        <button
          className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <ImageIcon size={18} style={{ marginRight: 8 }} />
          Image Gallery
        </button>
      </div>

      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'quote' ? (
            <motion.section
              key="quote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card quote-container"
            >
              <div className="quote-content">
                <p className="quote-text">"{quote.text}"</p>
                <p className="quote-author">— {quote.author}</p>
              </div>

              <div className="quote-actions">
                <button onClick={copyToClipboard} className="tab-btn" title="Copy">
                  <Copy size={20} />
                </button>
                <button onClick={shareTwitter} className="tab-btn" title="Tweet">
                  <Twitter size={20} />
                </button>
                <button
                  onClick={fetchQuote}
                  className="tab-btn active"
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RefreshCw size={18} className={loading ? 'spin' : ''} />
                  New Quote
                </button>
              </div>
            </motion.section>
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
                  placeholder="Search stunning images..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="tab-btn active">
                  <Search size={20} />
                </button>
              </form>

              {loading && <div className="loader"></div>}

              <div className="grid-gallery">
                {images.map((img) => (
                  <motion.div
                    layout
                    key={img.id}
                    className="glass-card image-card"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={img.urls.regular} alt={img.alt_description} />
                    <div className="image-overlay">
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{img.user.name}</p>
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(img.links.download, img.id)}
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>&copy; 2024 Inspiria x Internee.pk | Designed with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
