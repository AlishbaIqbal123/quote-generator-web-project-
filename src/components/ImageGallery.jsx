import { useState } from 'react';
import { Search, Download, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

import ImageEditor from './ImageEditor';

const ImageGallery = ({ images, loading, fetchImages, searchQuery, setSearchQuery }) => {
    const [downloading, setDownloading] = useState(null);
    const [editingImage, setEditingImage] = useState(null);

    const handleDownload = async (img) => {
        // ... (existing download logic)
        setDownloading(img.id);
        toast.promise(
            (async () => {
                try {
                    await axios.get(img.links.download_location, {
                        headers: { Authorization: `Client-ID 63bWwYPkkVI9cK-idE5Z6d-eTIWCXlzZB8Pm56nwIVg` }
                    }).catch(err => console.error("Tracking failed", err));

                    const response = await fetch(img.urls.regular);
                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);

                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `inspiria-${img.id}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                } finally {
                    setDownloading(null);
                }
            })(),
            {
                loading: 'Downloading...',
                success: 'Download started!',
                error: 'Failed to download.',
            }
        );
    };

    return (
        <div className="w-full relative z-10 transition-colors animate-fade-in px-4">
            {editingImage && (
                <ImageEditor
                    image={editingImage}
                    onClose={() => setEditingImage(null)}
                />
            )}

            {/* Search Bar */}
            <form
                onSubmit={(e) => { e.preventDefault(); fetchImages(); }}
                className="max-w-xl mx-auto mb-10 relative flex items-center"
            >
                {/* ... (existing search bar code) */}
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 py-4 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-all font-outfit"
                        placeholder="Search for inspiration (e.g., Nature, Tech)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-colors"
                    >
                        <Search size={18} />
                    </button>
                </div>
            </form>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-200 dark:bg-slate-800 rounded-2xl h-64 w-full"></div>
                    ))}
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((img) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={img.id}
                            className="relative break-inside-avoid rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-shadow bg-slate-900 cursor-pointer"
                            onClick={() => setEditingImage(img)}
                        >
                            <img
                                src={img.urls.regular}
                                alt={img.alt_description}
                                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={img.user.profile_image.small}
                                            alt={img.user.name}
                                            className="w-8 h-8 rounded-full border-2 border-white"
                                        />
                                        <span className="text-white text-sm font-medium truncate max-w-[120px]">
                                            {img.user.name}
                                        </span>
                                    </div>

                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => setEditingImage(img)}
                                            className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-sm transition-colors"
                                            title="Edit Image"
                                        >
                                            <Camera size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(img)}
                                            disabled={downloading === img.id}
                                            className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-sm transition-colors"
                                            title="Download Original"
                                        >
                                            {downloading === img.id ? (
                                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            ) : (
                                                <Download size={20} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
