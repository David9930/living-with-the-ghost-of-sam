import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

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

    // Get visible episodes (current + one above and below)
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
            <h1 className="text-4xl text-center text-white mb-8 font-bold">TV Show Scripts</h1>
            
            {/* Fixed height container */}
            <div className="relative h-96 mb-8">
                {/* Main viewing window with fixed height */}
                <div className="absolute inset-0 bg-black/20 rounded-lg overflow-hidden">
                    <div className="relative h-full">
                        {getVisibleEpisodes().map((episode, idx) => (
                            <div 
                                key={episode.number}
                                className={`absolute w-full p-4 transition-all duration-300
                                          ${idx === 0 ? 'top-0 opacity-50 scale-95' : 
                                            idx === 1 ? 'top-1/3 opacity-100 scale-100' :
                                                      'top-2/3 opacity-50 scale-95'}`}
                            >
                                {/* Individual episode card */}
                                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                                    <div className="text-center space-y-3">
                                        <h3 className="text-2xl text-white font-bold">
                                            Episode {episode.number}
                                        </h3>
                                        <p className="text-xl text-yellow-400 italic font-serif">
                                            "{episode.title}"
                                        </p>
                                        <div className="flex flex-col gap-2 mt-4">
                                            {episode.available ? (
                                                <>
                                                    <a 
                                                        href={`/living-with-the-ghost-of-sam/scripts/${episode.filename}`}
                                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-200 text-center"
                                                        download={episode.filename}
                                                        type="application/pdf"
                                                    >
                                                        Download
                                                    </a>
                                                    <a 
                                                        href={`/living-with-the-ghost-of-sam/scripts/${episode.filename}`}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200 text-center"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View PDF
                                                    </a>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        className="bg-gray-500 text-gray-300 py-2 px-4 rounded cursor-not-allowed"
                                                        disabled
                                                    >
                                                        Download
                                                    </button>
                                                    <button 
                                                        className="bg-gray-500 text-gray-300 py-2 px-4 rounded cursor-not-allowed"
                                                        disabled
                                                    >
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

            {/* Navigation controls below the container */}
            <div className="flex justify-center gap-4">
                <button 
                    onClick={moveUp}
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-200"
                    aria-label="Previous episode"
                >
                    <ChevronUp className="w-6 h-6 text-white" />
                </button>
                <button 
                    onClick={moveDown}
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-200"
                    aria-label="Next episode"
                >
                    <ChevronDown className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    );
};

export default ScriptsWheel;
