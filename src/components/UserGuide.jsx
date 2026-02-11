import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Image as ImageIcon, Camera, Sparkles, ChevronRight, X } from 'lucide-react';

const steps = [
    {
        title: "Welcome to Inspiria",
        description: "Your ultimate creative studio for quotes and visuals. Let's take a quick tour!",
        icon: <Sparkles size={64} className="text-yellow-400" />,
        color: "from-indigo-500 to-purple-600"
    },
    {
        title: "Daily Inspiration",
        description: "Discover thought-provoking quotes daily. Copy them or share directly to Twitter with a single click.",
        icon: <Quote size={64} className="text-blue-400" />,
        color: "from-blue-500 to-cyan-500"
    },
    {
        title: "Visual Gallery",
        description: "Explore a vast library of high-quality images from Unsplash. Search for any topic that inspires you.",
        icon: <ImageIcon size={64} className="text-pink-400" />,
        color: "from-pink-500 to-rose-500"
    },
    {
        title: "Create & Edit",
        description: "Click any image to open the Studio. Overlay quotes, customize styles, and download your masterpiece.",
        icon: <Camera size={64} className="text-green-400" />,
        color: "from-emerald-500 to-teal-500"
    }
];

const UserGuide = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenGuide = localStorage.getItem('hasSeenGuide');
        if (!hasSeenGuide) {
            setIsOpen(true);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenGuide', 'true');
        onComplete && onComplete();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full relative"
            >
                {/* Background Gradient */}
                <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${steps[currentStep].color} transition-colors duration-500`} />

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8 flex flex-col items-center text-center relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center"
                        >
                            <div className="mb-6 p-6 bg-gray-50 dark:bg-slate-800 rounded-full shadow-inner">
                                {steps[currentStep].icon}
                            </div>

                            <h2 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white font-playfair">
                                {steps[currentStep].title}
                            </h2>

                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                                {steps[currentStep].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress Indicators */}
                    <div className="flex gap-2 mb-8">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentStep ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-300 dark:bg-slate-700'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                    >
                        {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                        {currentStep !== steps.length - 1 && (
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default UserGuide;
