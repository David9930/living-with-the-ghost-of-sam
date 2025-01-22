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
        <div className="w-full max-w-lg mx-auto px-4">
            <h1 className="text-4xl text-center text-white mb-8 font-bold">
                TV Show Scripts
            </h1>
            
            {/* Main container with solid border */}
            <div className="relative h-96 mb-8 border-4 border-white rounded-lg bg-black">
                {/* Episodes container */}
                <div className="absolute inset-0 bg-gray-900 rounded-lg">
                    <div className="relative h-full p-4">
                        {getVisibleEpisodes().map((episode, idx) => (
                            <div 
                                key={episode.number}
                                className={`absolute w-full p-2 transition-all duration-300
                                          ${idx === 0 ? 'top-0 opacity-50' : 
                                            idx === 1 ? 'top-1/3 opacity-100' :
                                                      'top-2/3 opacity-50'}`}
                            >
                                {/* Individual episode box */}
                                <div className="border-2 border-white rounded-lg p-4 bg-gray-800">
                                    <div className="text-center">
                                        <h3 className="text-2xl text-white font-bold mb-2">
                                            Episode {episode.number}
                                        </h3>
                                        <p className="text-xl text-yellow-400 italic mb-4">
                                            "{episode.title}"
                                        </p>
                                        <div className="flex gap-4 justify-center">
                                            {episode.available ? (
                                                <>
                                                    <a 
                                                        href={`/living-with-the-ghost-of-sam/scripts/${episode.filename}`}
                                                        className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg border-2 border-green-500"
                                                        download={episode.filename}
                                                        type="application/pdf"
                                                    >
                                                        <Download size={18} />
                                                        Download
                                                    </a>
                                                    <a 
                                                        href={`/living-with-the-ghost-of-sam/scripts/${episode.filename}`}
                                                        className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg border-2 border-blue-500"
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
                                                        className="flex items-center gap-2 bg-gray-700 text-gray-400 py-2 px-4 rounded-lg border-2 border-gray-600"
                                                        disabled
                                                    >
                                                        <Download size={18} />
                                                        Download
                                                    </button>
                                                    <button 
                                                        className="flex items-center gap-2 bg-gray-700 text-gray-400 py-2 px-4 rounded-lg border-2 border-gray-600"
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

            {/* Navigation controls */}
            <div className="flex justify-center gap-6">
                <button 
                    onClick={moveUp}
                    className="bg-purple-600 p-4 rounded-full border-2 border-purple-500"
                    aria-label="Previous episode"
                >
                    <ChevronUp className="w-6 h-6 text-white" />
                </button>
                <button 
                    onClick={moveDown}
                    className="bg-purple-600 p-4 rounded-full border-2 border-purple-500"
                    aria-label="Next episode"
                >
                    <ChevronDown className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    );
};

export default ScriptsWheel;
