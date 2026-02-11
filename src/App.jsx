import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Quote, Image as ImageIcon } from 'lucide-react';
import useQuote from './hooks/useQuote';
import useUnsplash from './hooks/useUnsplash';
import QuoteCard from './components/QuoteCard';
import ImageGallery from './components/ImageGallery';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  const [activeTab, setActiveTab] = useState('quote');
  const [searchQuery, setSearchQuery] = useState('');

  const { quote, loading: quoteLoading, fetchQuote } = useQuote();
  const { images, loading: imagesLoading, fetchImages } = useUnsplash('nature');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 font-outfit flex flex-col">
      <Toaster position="bottom-center" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      }} />

      {/* Header */}
      <header className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <span className="font-bold text-xl">I</span>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Inspiria
          </h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 py-8 md:py-12 w-full max-w-7xl mx-auto">

        {/* Navigation Tabs */}
        <div className="flex p-1 space-x-1 bg-gray-200 dark:bg-slate-800 rounded-xl mb-12">
          <button
            onClick={() => setActiveTab('quote')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-slate-900 ring-indigo-500
              ${activeTab === 'quote'
                ? 'bg-white dark:bg-slate-700 shadow text-indigo-700 dark:text-indigo-300'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
          >
            <Quote size={18} />
            Quote Generator
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-slate-900 ring-indigo-500
              ${activeTab === 'gallery'
                ? 'bg-white dark:bg-slate-700 shadow text-indigo-700 dark:text-indigo-300'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
          >
            <ImageIcon size={18} />
            Image Gallery
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full flex justify-center">
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
      <footer className="w-full py-6 text-center text-gray-500 dark:text-slate-500 text-sm border-t border-gray-200 dark:border-slate-800 mt-auto">
        <p>© {new Date().getFullYear()} Inspiria. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
