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
        <div className="w-full max-w-2xl mx-auto px-4">
            <h1 className="text-4xl text-center text-white mb-12 font-bold">TV Show Scripts</h1>
            
            <div className="relative h-96">
                {/* Navigation Buttons */}
                <button 
                    onClick={moveUp}
                    className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-12 
                             bg-white/10 hover:bg-white/20 p-2 rounded-full z-10"
                >
                    <ChevronUp className="w-8 h-8 text-white" />
                </button>
                
                {/* Wheel Container */}
                <div className="relative h-full overflow-hidden rounded-lg bg-black/30">
                    {/* Episode Cards */}
                    <div className="absolute w-full h-full transition-transform duration-500"
                         style={{ transform: `translateY(-${currentIndex * 33.33}%)` }}>
                        {getVisibleEpisodes().map((episode, idx) => (
                            <div 
                                key={episode.number}
                                className={`absolute w-full transition-all duration-500
                                          ${idx === 0 ? 'top-0 opacity-50 scale-90' : 
                                            idx === 1 ? 'top-1/3 opacity-100 scale-100' :
                                                      'top-2/3 opacity-50 scale-90'}
                                          transform-gpu`}
                            >
                                <div className="mx-auto w-full max-w-lg p-6 bg-white/10 rounded-lg 
                                              backdrop-blur-sm shadow-xl">
                                    <div className="text-center mb-4">
                                        <h3 className="text-2xl text-white mb-2">Episode {episode.number}</h3>
                                        <p className="text-xl text-yellow-400 italic font-serif">"{episode.title}"</p>
                                    </div>
                                    
                                    <div className="flex justify-center gap-4">
                                        {episode.available ? (
                                            <>
                                                <a 
                                                    href={`/living-with-the-ghost-of-sam/scripts/${episode.filename}`}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 
                                                             rounded transition-colors duration-200"
                                                    download={episode.filename}
                                                    type="application/pdf"
                                                >
                                                    Download
                                                </a>
                                                <a 
                                                    href={`/living-with-the-ghost-of-sam/scripts/${episode.filename}`}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
                                                             rounded transition-colors duration-200"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View PDF
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    className="bg-gray-500 text-gray-300 px-4 py-2 
                                                             rounded cursor-not-allowed"
                                                    disabled
                                                >
                                                    Download
                                                </button>
                                                <button 
                                                    className="bg-gray-500 text-gray-300 px-4 py-2 
                                                             rounded cursor-not-allowed"
                                                    disabled
                                                >
                                                    View PDF
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <button 
                    onClick={moveDown}
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-12 
                             bg-white/10 hover:bg-white/20 p-2 rounded-full z-10"
                >
                    <ChevronDown className="w-8 h-8 text-white" />
                </button>
            </div>
        </div>
    );
};

export default ScriptsWheel;
