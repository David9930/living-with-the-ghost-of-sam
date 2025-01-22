import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Download, Eye } from 'lucide-react';

const episodes = [
    {
        number: 1,
        title: "Leap of Faith",
        filename: "Living_with_the_Ghost_of_Sam_Ep1.pdf",
        available: true
    },
    {
        number: 2,
        title: "Night Moves",
        filename: "Living_with_the_Ghost_of_Sam_Ep2.pdf",
        available: false
    },
    {
        number: 3,
        title: "Two out of Three Ain't Bad",
        filename: "Living_with_the_Ghost_of_Sam_Ep3.pdf",
        available: false
    },
    {
        number: 4,
        title: "Last Laugh",
        filename: "Living_with_the_Ghost_of_Sam_Ep4.pdf",
        available: false
    },
    {
        number: 5,
        title: "Digital Inheritance",
        filename: "Living_with_the_Ghost_of_Sam_Ep5.pdf",
        available: false
    },
    {
        number: 6,
        title: "Missing",
        filename: "Living_with_the_Ghost_of_Sam_Ep6.pdf",
        available: true
    },
    {
        number: 7,
        title: "Episode 7",
        filename: "Living_with_the_Ghost_of_Sam_Ep7.pdf",
        available: false
    },
    {
        number: 8,
        title: "Episode 8",
        filename: "Living_with_the_Ghost_of_Sam_Ep8.pdf",
        available: false
    },
    {
        number: 9,
        title: "Episode 9",
        filename: "Living_with_the_Ghost_of_Sam_Ep9.pdf",
        available: false
    },
    {
        number: 10,
        title: "Episode 10",
        filename: "Living_with_the_Ghost_of_Sam_Ep10.pdf",
        available: false
    }
];

const ScriptsWheel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const moveUp = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? episodes.length - 1 : prevIndex - 1
        );
    };
    
    const moveDown = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === episodes.length - 1 ? 0 : prevIndex + 1
        );
    };

    const getVisibleEpisodes = () => {
        const above = currentIndex === 0 ? episodes.length - 1 : currentIndex - 1;
        const below = currentIndex === episodes.length - 1 ? 0 : currentIndex + 1;
        return [
            episodes[above],
            episodes[currentIndex],
            episodes[below]
        ];
    };

    return (
        <div className="w-full max-w-md mx-auto px-4">
            <h1 className="text-4xl text-center text-white mb-8 font-bold">
                TV Show Scripts
            </h1>
            
            {/* Main container with glass effect and border */}
            <div className="relative h-96 mb-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl overflow-hidden">
                {/* Inner frame with additional styling */}
                <div className="absolute inset-2 bg-black/40 rounded-lg overflow-hidden border border-white/10">
                    <div className="relative h-full">
                        {getVisibleEpisodes().map((episode, idx) => (
                            <div 
                                key={episode.number}
                                className={`absolute w-full p-4 transition-all duration-300
                                          ${idx === 0 ? 'top-0 opacity-50 scale-95 translate-y-4' : 
                                            idx === 1 ? 'top-1/3 opacity-100 scale-100' :
                                                      'top-2/3 opacity-50 scale-95 -translate-y-4'}`}
                            >
                                {/* Episode card with modern styling */}
                                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl p-5 border border-white/10 shadow-lg">
                                    <div className="text-center space-y-3">
                                        {/* Episode number with decorative line */}
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
                                            <h3 className="text-2xl text-white font-bold">
                                                Episode {episode.number}
                                            </h3>
                                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
                                        </div>
                                        
                                        {/* Episode title with glowing effect */}
                                        <p className="text-xl text-yellow-400 italic font-serif drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                                            "{episode.title}"
                                        </p>
                                        
                                        {/* Button container */}
                                        <div className="flex gap-3 justify-center mt-4">
                                            {episode.available ? (
                                                <>
                                                    <a 
                                                        href={`/living-with-the-ghost-of-sam/scripts/${episode.filename}`}
                                                        className="flex items-center gap-2 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                                                        download={episode.filename}
                                                        type="application/pdf"
                                                    >
                                                        <Download size={18} />
                                                        Download
                                                    </a>
                                                    <a 
                                                        href={`/living-with-the-ghost-of-sam/scripts/${episode.filename}`}
                                                        className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Eye size={18} />
                                                        View PDF
                                                    </a>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        className="flex items-center gap-2 bg-gray-700/50 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed"
                                                        disabled
                                                    >
                                                        <Download size={18} />
                                                        Download
                                                    </button>
                                                    <button 
                                                        className="flex items-center gap-2 bg-gray-700/50 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed"
                                                        disabled
                                                    >
                                                        <Eye size={18} />
                                                        View PDF
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation controls with modern styling */}
            <div className="flex justify-center gap-6">
                <button 
                    onClick={moveUp}
                    className="bg-gradient-to-br from-purple-600/80 to-purple-700/80 hover:from-purple-500/80 hover:to-purple-600/80 p-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-purple-500/25 group"
                    aria-label="Previous episode"
                >
                    <ChevronUp className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </button>
                <button 
                    onClick={moveDown}
                    className="bg-gradient-to-br from-purple-600/80 to-purple-700/80 hover:from-purple-500/80 hover:to-purple-600/80 p-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-purple-500/25 group"
                    aria-label="Next episode"
                >
                    <ChevronDown className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ScriptsWheel;
