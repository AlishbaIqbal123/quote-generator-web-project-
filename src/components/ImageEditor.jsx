import { useState, useRef } from 'react';
import { Download, X, Move, RotateCcw, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const fonts = [
    'Playfair Display', // Elegant Serif
    'Merriweather',     // Classic Serif
    'Cinzel',           // Trajan-style for drama
    'Roboto',           // Modern Sans
    'Montserrat',       // Geometric Sans
    'Open Sans',        // Humanist Sans
    'Oswald',           // Condensed Sans for headlines
    'Outfit',           // Rounded, friendly
    'Dancing Script',   // Smooth Handwriting
    'Great Vibes',      // Fancy Calligraphy
    'Pacifico',         // Brush Script
    'Lobster',          // Bold Script
    'Abril Fatface',    // Heavy Display
    'Righteous',        // Retro-futuristic
    'Space Mono'        // Typewriter style
];

const ImageEditor = ({ image, onClose, customImageSource }) => {
    const imageSource = customImageSource || image?.urls?.regular;
    const imageId = image?.id || 'custom-' + Math.random().toString(36).substr(2, 9);

    const [text, setText] = useState("Inspiration is everywhere.");
    const [textStyle, setTextStyle] = useState({
        color: "#ffffff",
        fontSize: 32,
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'center',
        textDecoration: 'none',
        textTransform: 'none',
        letterSpacing: 0
    });

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
            const dataUrl = await toPng(editorRef.current, { cacheBust: true, pixelRatio: 2 });
            download(dataUrl, `inspiria-edit-${imageId}.png`);
            toast.success('Image downloaded!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate image. Try again.');
        }
    };

    const updateStyle = (key, value) => {
        setTextStyle(prev => ({ ...prev, [key]: value }));
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-slate-900 sm:rounded-3xl overflow-hidden shadow-2xl w-full max-w-6xl flex flex-col lg:flex-row h-full lg:h-[90vh] relative">

                {/* Preview Area */}
                <div className="relative flex-[0_0_50%] lg:flex-1 bg-neutral-900 flex items-center justify-center overflow-hidden p-4 sm:p-8 min-h-[50vh] lg:min-h-0">
                    <div
                        ref={editorRef}
                        className="relative inline-block shadow-2xl overflow-hidden"
                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                    >
                        <img
                            src={imageSource}
                            alt="Editor preview"
                            className="max-h-[45vh] lg:max-h-[80vh] w-auto block object-contain pointer-events-none select-none"
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
                                className="outline-none whitespace-pre-wrap select-none"
                                style={{
                                    color: textStyle.color,
                                    fontSize: `${textStyle.fontSize}px`,
                                    fontFamily: textStyle.fontFamily,
                                    fontWeight: textStyle.fontWeight,
                                    fontStyle: textStyle.fontStyle,
                                    textAlign: textStyle.textAlign,
                                    textDecoration: textStyle.textDecoration,
                                    textTransform: textStyle.textTransform,
                                    letterSpacing: `${textStyle.letterSpacing}px`,
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
                <div className="w-full lg:w-[400px] bg-gray-50 dark:bg-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col border-t lg:border-t-0 lg:border-l dark:border-slate-700 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            Studio Editor
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors relative z-10 cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-8 pb-20">
                        {/* Text Controls */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Typography</h4>

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm font-outfit"
                                rows="2"
                                placeholder="Enter your quote..."
                            />

                            {/* Font Family Selector */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Font Family</label>
                                <select
                                    value={textStyle.fontFamily}
                                    onChange={(e) => updateStyle('fontFamily', e.target.value)}
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    {fonts.map(font => (
                                        <option key={font} value={font}>{font}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Font Style & Alignment Buttons */}
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStyle('fontWeight', textStyle.fontWeight === 'bold' ? 'normal' : 'bold')}
                                        className={`p-2 rounded-lg border flex-1 flex justify-center ${textStyle.fontWeight === 'bold' ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400'}`}
                                        title="Bold"
                                    >
                                        <Bold size={18} />
                                    </button>
                                    <button
                                        onClick={() => updateStyle('fontStyle', textStyle.fontStyle === 'italic' ? 'normal' : 'italic')}
                                        className={`p-2 rounded-lg border flex-1 flex justify-center ${textStyle.fontStyle === 'italic' ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400'}`}
                                        title="Italic"
                                    >
                                        <Italic size={18} />
                                    </button>
                                    <button
                                        onClick={() => updateStyle('textDecoration', textStyle.textDecoration === 'underline' ? 'none' : 'underline')}
                                        className={`p-2 rounded-lg border flex-1 flex justify-center ${textStyle.textDecoration === 'underline' ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400'}`}
                                        title="Underline"
                                    >
                                        <Underline size={18} />
                                    </button>
                                    <button
                                        onClick={() => updateStyle('textTransform', textStyle.textTransform === 'uppercase' ? 'none' : 'uppercase')}
                                        className={`p-2 rounded-lg border flex-1 flex justify-center font-bold items-center ${textStyle.textTransform === 'uppercase' ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400'}`}
                                        title="Uppercase"
                                    >
                                        <span className="text-xs">TT</span>
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStyle('textAlign', 'left')}
                                        className={`p-2 rounded-lg border flex-1 flex justify-center ${textStyle.textAlign === 'left' ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400'}`}
                                        title="Align Left"
                                    >
                                        <AlignLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => updateStyle('textAlign', 'center')}
                                        className={`p-2 rounded-lg border flex-1 flex justify-center ${textStyle.textAlign === 'center' ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400'}`}
                                        title="Align Center"
                                    >
                                        <AlignCenter size={18} />
                                    </button>
                                    <button
                                        onClick={() => updateStyle('textAlign', 'right')}
                                        className={`p-2 rounded-lg border flex-1 flex justify-center ${textStyle.textAlign === 'right' ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400'}`}
                                        title="Align Right"
                                    >
                                        <AlignRight size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Letter Spacing Slider */}
                            <div>
                                <label className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    <span>Letter Spacing</span>
                                    <span>{textStyle.letterSpacing}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="-2"
                                    max="20"
                                    value={textStyle.letterSpacing}
                                    onChange={(e) => updateStyle('letterSpacing', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                                />
                            </div>

                            {/* Font Size Slider */}
                            <div>
                                <label className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    <span>Size</span>
                                    <span>{textStyle.fontSize}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="16"
                                    max="120"
                                    value={textStyle.fontSize}
                                    onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                                />
                            </div>

                            {/* Color Picker */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Text Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {['#ffffff', '#000000', '#f87171', '#fbbf24', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6'].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => updateStyle('color', c)}
                                            className={`w-8 h-8 rounded-full border-2 ${textStyle.color === c ? 'border-indigo-500 scale-110' : 'border-gray-200 dark:border-slate-600 hover:scale-105'} transition-all shadow-sm`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                    {/* Custom Color Picker Input */}
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-600 cursor-pointer">
                                        <input
                                            type="color"
                                            value={textStyle.color}
                                            onChange={(e) => updateStyle('color', e.target.value)}
                                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filter Controls */}
                        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Image Filters</h4>
                                <button onClick={resetFilters} className="text-xs text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
                                    <RotateCcw size={12} /> Reset
                                </button>
                            </div>

                            {[
                                { label: 'Brightness', key: 'brightness', min: 0, max: 200 },
                                { label: 'Contrast', key: 'contrast', min: 0, max: 200 },
                                { label: 'Grayscale', key: 'grayscale', min: 0, max: 100 },
                            ].map((f) => (
                                <div key={f.key}>
                                    <label className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        <span>{f.label}</span>
                                        <span>{filters[f.key]}%</span>
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
