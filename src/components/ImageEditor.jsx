import { useState, useRef } from 'react';
import { Download, X, Move, RotateCcw } from 'lucide-react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ImageEditor = ({ image, onClose }) => {
    const [text, setText] = useState("Inspiration is everywhere.");
    const [color, setColor] = useState("#ffffff");
    const [fontSize, setFontSize] = useState(32);
    const [filters, setFilters] = useState({
        grayscale: 0,
        sepia: 0,
        brightness: 100,
        contrast: 100,
        blur: 0
    });

    const editorRef = useRef(null);

    const handleDownload = async () => {
        if (editorRef.current === null) return;

        try {
            // Temporarily scale up for better resolution if needed, but standard capture works well
            const dataUrl = await toPng(editorRef.current, { cacheBust: true, pixelRatio: 2 });
            download(dataUrl, `inspiria-edit-${image.id}.png`);
            toast.success('Image downloaded!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate image. Try again.');
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            grayscale: 0,
            sepia: 0,
            brightness: 100,
            contrast: 100,
            blur: 0
        });
    };

    const filterString = `grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) brightness(${filters.brightness}%) contrast(${filters.contrast}%) blur(${filters.blur}px)`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl w-full max-w-6xl flex flex-col lg:flex-row h-[90vh]">

                {/* Preview Area */}
                <div className="relative flex-1 bg-neutral-900 flex items-center justify-center overflow-hidden p-8">
                    <div
                        ref={editorRef}
                        className="relative inline-block shadow-2xl overflow-hidden"
                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                    >
                        <img
                            src={image.urls.regular}
                            alt="Editor preview"
                            className="max-h-[80vh] w-auto block object-contain pointer-events-none select-none"
                            crossOrigin="anonymous"
                            style={{ filter: filterString }}
                        />

                        {/* Draggable Text Overlay */}
                        <motion.div
                            drag
                            dragMomentum={false}
                            className="absolute top-1/2 left-1/2 cursor-move hover:ring-2 hover:ring-white/50 rounded-lg p-2 transition-shadow"
                            style={{ x: '-50%', y: '-50%' }}
                        >
                            <h2
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => setText(e.currentTarget.textContent)}
                                className="font-playfair font-bold text-center outline-none whitespace-pre-wrap"
                                style={{
                                    color: color,
                                    fontSize: `${fontSize}px`,
                                    textShadow: '0 4px 8px rgba(0,0,0,0.8)',
                                    minWidth: '200px'
                                }}
                            >
                                {text}
                            </h2>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white/50 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                                <Move size={16} />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Controls Sidebar */}
                <div className="w-full lg:w-96 bg-gray-50 dark:bg-slate-800 p-6 flex flex-col border-l dark:border-slate-700 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            Studio Editor
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-8 pb-20">
                        {/* Text Controls */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Typography</h4>
                            <div>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
                                    rows="2"
                                    placeholder="Enter your quote..."
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <span>Size</span>
                                    <span>{fontSize}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="20"
                                    max="100"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {['#ffffff', '#000000', '#f87171', '#fbbf24', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6'].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-indigo-500 scale-110' : 'border-gray-200 dark:border-slate-600 hover:scale-105'} transition-all shadow-sm`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Filter Controls */}
                        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Filters</h4>
                                <button onClick={resetFilters} className="text-xs text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
                                    <RotateCcw size={12} /> Reset
                                </button>
                            </div>

                            {[
                                { label: 'Brightness', key: 'brightness', min: 0, max: 200 },
                                { label: 'Contrast', key: 'contrast', min: 0, max: 200 },
                                { label: 'Grayscale', key: 'grayscale', min: 0, max: 100 },
                                { label: 'Sepia', key: 'sepia', min: 0, max: 100 },
                                { label: 'Blur', key: 'blur', min: 0, max: 10 }
                            ].map((f) => (
                                <div key={f.key}>
                                    <label className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        <span>{f.label}</span>
                                        <span>{filters[f.key]}{f.key === 'blur' ? 'px' : '%'}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={f.min}
                                        max={f.max}
                                        value={filters[f.key]}
                                        onChange={(e) => handleFilterChange(f.key, parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 sticky bottom-0">
                        <button
                            onClick={handleDownload}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Download size={20} />
                            Download Masterpiece
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
