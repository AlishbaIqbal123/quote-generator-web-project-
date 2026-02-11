import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageEditor from './ImageEditor';
import toast from 'react-hot-toast';

const Studio = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
                toast.success('Image uploaded successfully!');
            };
            reader.readAsDataURL(file);
        } else {
            toast.error('Please upload a valid image file.');
        }
    };

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, []);

    const onFileSelect = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4">
            <AnimatePresence>
                {selectedImage ? (
                    <ImageEditor
                        customImageSource={selectedImage}
                        onClose={() => setSelectedImage(null)}
                    />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full"
                    >
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-4 tracking-tight">
                                Creation <span className="text-indigo-600">Studio</span>
                            </h2>
                            <p className="text-slate-600 dark:text-gray-400 max-w-lg mx-auto">
                                Bring your own visuals to life. Upload an image and overlay it with powerful, inspiring words.
                            </p>
                        </div>

                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            className={`relative group cursor-pointer transition-all duration-500 rounded-[2.5rem] border-4 border-dashed overflow-hidden
                                ${isDragging
                                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-105'
                                    : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500/50'
                                }`}
                        >
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={onFileSelect}
                                accept="image/*"
                            />

                            <div className="py-24 px-10 flex flex-col items-center text-center">
                                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500
                                    ${isDragging
                                        ? 'bg-indigo-600 text-white rotate-12 scale-110 shadow-2xl shadow-indigo-500/50'
                                        : 'bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white shadow-xl group-hover:shadow-indigo-500/30'
                                    }`}>
                                    <Upload size={40} className={isDragging ? 'animate-bounce' : ''} />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    Drop your image here
                                </h3>
                                <p className="text-slate-600 dark:text-gray-400 text-sm mb-6">
                                    or click to browse from your device
                                </p>

                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-full text-xs font-bold text-gray-600 dark:text-gray-400">
                                        <ImageIcon size={14} /> PNG, JPG, WEBP
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-full text-xs font-bold text-gray-600 dark:text-gray-400">
                                        <Sparkles size={14} /> Max 10MB
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full -translate-x-10 translate-y-10"></div>
                        </div>

                        {/* Recent / Tips Section */}
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'High Res', desc: 'Use high-resolution images for the best download quality.', icon: <ImageIcon size={20} /> },
                                { title: 'Contrast', desc: 'Pick images with space for text to ensure readability.', icon: <Sparkles size={20} /> },
                                { title: 'Share', desc: 'Download and share your masterpieces with the world.', icon: <Upload size={20} /> }
                            ].map((tip, i) => (
                                <div key={i} className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/20 dark:border-slate-800">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                                        {tip.icon}
                                    </div>
                                    <h4 className="font-bold text-gray-800 dark:text-white mb-1">{tip.title}</h4>
                                    <p className="text-slate-600 dark:text-gray-400 text-xs leading-relaxed">{tip.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Studio;
