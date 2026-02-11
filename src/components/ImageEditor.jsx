import { useState, useRef } from 'react';
import { Download, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import toast from 'react-hot-toast';

const ImageEditor = ({ image, onClose }) => {
    const [text, setText] = useState("Inspiration is everywhere.");
    const [color, setColor] = useState("#ffffff");
    const [fontSize, setFontSize] = useState(24);
    const [position, setPosition] = useState({ x: 50, y: 50 }); // Center by default

    const editorRef = useRef(null);

    const handleDownload = async () => {
        if (editorRef.current === null) {
            return;
        }

        try {
            const dataUrl = await toPng(editorRef.current, { cacheBust: true, });
            download(dataUrl, `inspiria-edit-${image.id}.png`);
            toast.success('Image downloaded!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate image.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl flex flex-col md:flex-row max-h-[90vh]">

                {/* Preview Area */}
                <div className="relative flex-1 bg-gray-900 flex items-center justify-center overflow-auto p-4">
                    <div
                        ref={editorRef}
                        className="relative inline-block shadow-lg"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                    >
                        <img
                            src={image.urls.regular}
                            alt="Editor preview"
                            className="max-h-[70vh] w-auto block object-contain"
                            crossOrigin="anonymous"
                        />
                        {/* Draggable Text Overlay (Simplified as absolute centered for now) */}
                        <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            style={{
                                top: `${position.y}%`,
                                left: `${position.x}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <h2
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => setText(e.currentTarget.textContent)}
                                className="font-playfair font-bold text-center px-4 py-2 pointer-events-auto cursor-move select-none focus:outline-dotted focus:outline-white/50"
                                style={{
                                    color: color,
                                    fontSize: `${fontSize}px`,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                                }}
                            >
                                {text}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Controls Sidebar */}
                <div className="w-full md:w-80 bg-gray-50 dark:bg-slate-800 p-6 flex flex-col gap-6 border-l dark:border-slate-700 overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Edit Image</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quote Text</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                rows="3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Font Size: {fontSize}px</label>
                            <input
                                type="range"
                                min="16"
                                max="80"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text Color</label>
                            <div className="flex gap-2">
                                {['#ffffff', '#000000', '#f87171', '#fbbf24', '#4ade80', '#60a5fa', '#a78bfa'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-indigo-500 scale-110' : 'border-transparent hover:scale-105'} transition-transform shadow-sm`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                            <button
                                onClick={handleDownload}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                Download Edited
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Tip: Click on the text in the preview to edit directly!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
