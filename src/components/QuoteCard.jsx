import { Copy, Twitter, RefreshCw, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const QuoteCard = ({ quote, loading, fetchQuote }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
        toast.success('Quote copied to clipboard!');
    };

    const shareTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote.text}" - ${quote.author}`)}`;
        window.open(twitterUrl, '_blank');
    };

    return (
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 transition-all duration-300 transform border border-gray-100 dark:border-slate-700 relative overflow-hidden group">

            {/* Background Decorative Icon */}
            <Quote
                size={120}
                className="absolute -top-6 -left-6 text-gray-100 dark:text-slate-700 opacity-50 transform -rotate-12 transition-transform group-hover:rotate-0 duration-700 pointer-events-none"
            />

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center h-48"
                    >
                        <RefreshCw size={40} className="text-indigo-500 animate-spin" />
                        <span className="sr-only">Loading quote...</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10 flex flex-col items-center text-center"
                    >
                        <blockquote className="mb-8 relative">
                            <p className="font-playfair text-3xl md:text-4xl text-gray-800 dark:text-gray-100 leading-snug font-medium italic">
                                "{quote.text}"
                            </p>
                        </blockquote>

                        <div className="w-16 h-1 bg-indigo-500 rounded-full mb-6"></div>

                        <cite className="font-outfit text-xl text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-widest not-italic mb-10 block">
                            — {quote.author}
                        </cite>

                        <div className="flex items-center gap-4 w-full justify-center">
                            <button
                                onClick={copyToClipboard}
                                className="p-3 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:hover:text-indigo-400 transition-colors tooltip tooltip-bottom"
                                title="Copy Quote"
                                aria-label="Copy to Clipboard"
                            >
                                <Copy size={20} />
                            </button>

                            <button
                                onClick={shareTwitter}
                                className="p-3 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-blue-900 dark:hover:text-blue-400 transition-colors"
                                title="Share on Twitter"
                                aria-label="Share on Twitter"
                            >
                                <Twitter size={20} />
                            </button>

                            <button
                                onClick={fetchQuote}
                                disabled={loading}
                                className="ml-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                                New Quote
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuoteCard;
