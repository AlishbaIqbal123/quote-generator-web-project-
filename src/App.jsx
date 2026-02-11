import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Quote, Image as ImageIcon } from 'lucide-react';
import useQuote from './hooks/useQuote';
import useUnsplash from './hooks/useUnsplash';
import QuoteCard from './components/QuoteCard';
import ImageGallery from './components/ImageGallery';
import ThemeToggle from './components/ThemeToggle';
import UserGuide from './components/UserGuide';

const App = () => {
  // State for active tab (Quote vs Gallery) to manage UI switching
  const [activeTab, setActiveTab] = useState('quote');

  // State for gallery search input to allow user queries
  const [searchQuery, setSearchQuery] = useState('');

  // Custom hook for Quote logic - separates business logic from UI
  const { quote, loading: quoteLoading, fetchQuote } = useQuote();

  // Custom hook for Unsplash logic - handles API calls and image data
  const { images, loading: imagesLoading, fetchImages } = useUnsplash('nature');

  return (
    <div className="relative min-h-screen transition-colors duration-500 font-outfit overflow-hidden bg-slate-50 dark:bg-slate-950">
      <UserGuide />

      {/* Animated Background Blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      <Toaster position="bottom-center" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white',
        style: { borderRadius: '15px', background: '#333', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      }} />

      {/* Header */}
      <header className="relative z-10 w-full py-8 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-300">
            <span className="font-black text-2xl">I</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            Inspiria
          </h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-8 md:py-16 w-full max-w-7xl mx-auto">

        {/* Navigation Tabs - Refined Glass Style */}
        <div className="flex p-1.5 space-x-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl mb-16 shadow-lg border border-white/20 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('quote')}
            className={`flex items-center gap-2 px-8 py-3 text-sm font-bold leading-5 rounded-xl transition-all duration-300 focus:outline-none
              ${activeTab === 'quote'
                ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-700 dark:text-indigo-300'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            <Quote size={18} />
            Quote Generator
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-8 py-3 text-sm font-bold leading-5 rounded-xl transition-all duration-300 focus:outline-none
              ${activeTab === 'gallery'
                ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-700 dark:text-indigo-300'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            <ImageIcon size={18} />
            Image Gallery
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full flex justify-center perspective-1000">
          {activeTab === 'quote' ? (
            <div className="w-full flex justify-center animate-fade-in">
              <QuoteCard
                quote={quote}
                loading={quoteLoading}
                fetchQuote={fetchQuote}
              />
            </div>
          ) : (
            <ImageGallery
              images={images}
              loading={imagesLoading}
              fetchImages={fetchImages}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-gray-500 dark:text-slate-500 text-sm border-t border-gray-200/50 dark:border-slate-800/50 mt-auto backdrop-blur-md">
        <p className="font-medium tracking-wide">© {new Date().getFullYear()} Inspiria. Crafted with precision & passion.</p>
      </footer>
    </div>
  );
};

export default App;
