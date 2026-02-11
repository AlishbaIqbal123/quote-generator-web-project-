import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Quote, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import useQuote from './hooks/useQuote';
import useUnsplash from './hooks/useUnsplash';
import QuoteCard from './components/QuoteCard';
import ImageGallery from './components/ImageGallery';
import ThemeToggle from './components/ThemeToggle';
import UserGuide from './components/UserGuide';
import Studio from './components/Studio';
import FloatingLines from './components/FloatingLines';

const App = () => {
  // State for active tab (Quote vs Gallery vs Studio)
  const [activeTab, setActiveTab] = useState('quote');

  // State for gallery search input
  const [searchQuery, setSearchQuery] = useState('');

  // Custom hook for Quote logic
  const { quote, loading: quoteLoading, fetchQuote } = useQuote();

  // Custom hook for Unsplash logic
  const { images, loading: imagesLoading, fetchImages } = useUnsplash('nature');

  // Detection for dark mode to change line colors
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const pastelLight = ["#ffccd5", "#ffb3ba", "#baffc9", "#bae1ff", "#e0bbe4"];
  const pastelDark = ["#4a3a4d", "#3a4d4a", "#4d4a3a", "#3a3d4d"];

  return (
    <div className="relative min-h-screen transition-all duration-700 font-outfit overflow-hidden flex flex-col">
      <UserGuide />

      {/* Premium Floating Lines Background */}
      <FloatingLines
        linesGradient={isDarkMode ? pastelDark : pastelLight}
        animationSpeed={0.4}
        parallaxStrength={0.1}
      />

      <Toaster position="bottom-center" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white',
        style: { borderRadius: '15px', background: '#333', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      }} />

      {/* Header */}
      <header className="relative z-20 w-full py-8 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
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
      <main className="relative flex-grow flex flex-col items-center px-4 py-8 md:py-16 w-full max-w-7xl mx-auto">

        {/* Navigation Tabs - Refined Glass Style */}
        <div className="flex p-1.5 space-x-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl mb-8 md:mb-16 shadow-lg border border-white/20 dark:border-slate-800 max-w-full overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('quote')}
            className={`flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3 text-sm font-bold leading-5 rounded-xl transition-all duration-300 focus:outline-none whitespace-nowrap
              ${activeTab === 'quote'
                ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            <Quote size={18} />
            <span className="hidden xs:inline">Quote Generator</span>
            <span className="xs:hidden">Quote</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3 text-sm font-bold leading-5 rounded-xl transition-all duration-300 focus:outline-none whitespace-nowrap
              ${activeTab === 'gallery'
                ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            <ImageIcon size={18} />
            <span className="hidden xs:inline">Image Gallery</span>
            <span className="xs:hidden">Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3 text-sm font-bold leading-5 rounded-xl transition-all duration-300 focus:outline-none whitespace-nowrap
              ${activeTab === 'studio'
                ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            <Sparkles size={18} />
            <span className="hidden xs:inline">Design Studio</span>
            <span className="xs:hidden">Studio</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full flex justify-center">
          {activeTab === 'quote' && (
            <div className="w-full flex justify-center animate-fade-in">
              <QuoteCard
                quote={quote}
                loading={quoteLoading}
                fetchQuote={fetchQuote}
              />
            </div>
          )}
          {activeTab === 'gallery' && (
            <ImageGallery
              images={images}
              loading={imagesLoading}
              fetchImages={fetchImages}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}
          {activeTab === 'studio' && (
            <Studio />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full py-8 text-center text-slate-600 dark:text-slate-500 text-sm border-t border-gray-200/50 dark:border-slate-800/50 mt-auto backdrop-blur-md">
        <p className="font-medium tracking-wide">© {new Date().getFullYear()} Inspiria. Crafted with precision & passion.</p>
      </footer>
      <Analytics />
    </div>
  );
};

export default App;
