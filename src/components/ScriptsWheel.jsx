import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Download, Eye } from 'lucide-react';

// Episodes array remains the same
const episodes = [
    {
        number: 1,
        title: "Leap of Faith",
        filename: "Living_with_the_Ghost_of_Sam_Ep1.pdf",
        available: true
    },
    // ... rest of the episodes
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
        <div className="w-full max-w-xl mx-auto px-8">
            <h1 className="text-4xl text-center text-white mb-8 font-bold">
                TV Show Scripts
            </h1>
            
            {/* Fixed-size main container */}
            <div style={{ 
                border: '4px solid white',
                borderRadius: '8px',
                height: '480px',
                position: 'relative',
                backgroundColor: '#111',
                marginBottom: '2rem',
                padding: '1rem',
                overflow: 'hidden'
            }}>
                {getVisibleEpisodes().map((episode, idx) => (
                    <div 
                        key={episode.number}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            right: '1rem',
                            padding: '1rem',
                            transition: 'all 0.3s ease',
                            top: idx === 0 ? '2%' : idx === 1 ? '33%' : '64%',
                            opacity: idx === 1 ? 1 : 0.5,
                            transform: `scale(${idx === 1 ? 1 : 0.95})`,
                            zIndex: idx === 1 ? 2 : 1, // Higher z-index for active box
                            pointerEvents: idx === 1 ? 'auto' : 'none' // Only allow clicking on active box
                        }}
                    >
                        {/* Individual episode box */}
                        <div style={{
                            border: '2px solid white',
                            borderRadius: '8px',
                            padding: '1rem',
                            backgroundColor: idx === 1 ? '#2a2a4a' : '#1a1a1a', // Different background for active box
                            boxShadow: idx === 1 ? '0 0 20px rgba(255, 255, 255, 0.1)' : 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ textAlign: 'center' }}>
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
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    backgroundColor: '#22c55e',
                                                    color: 'white',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    border: '2px solid #16a34a',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseOver={e => {
                                                    e.currentTarget.style.backgroundColor = '#16a34a';
                                                }}
                                                onMouseOut={e => {
                                                    e.currentTarget.style.backgroundColor = '#22c55e';
                                                }}
                                                download={episode.filename}
                                                type="application/pdf"
                                            >
                                                <Download size={18} />
                                                Download
                                            </a>
                                            <a 
                                                href={`/living-with-the-ghost-of-sam/scripts/${episode.filename}`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    backgroundColor: '#2563eb',
                                                    color: 'white',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    border: '2px solid #1d4ed8',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseOver={e => {
                                                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                                                }}
                                                onMouseOut={e => {
                                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                                }}
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
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    backgroundColor: '#374151',
                                                    color: '#9ca3af',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    border: '2px solid #4b5563',
                                                    cursor: 'not-allowed'
                                                }}
                                                disabled
                                            >
                                                <Download size={18} />
                                                Download
                                            </button>
                                            <button 
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    backgroundColor: '#374151',
                                                    color: '#9ca3af',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    border: '2px solid #4b5563',
                                                    cursor: 'not-allowed'
                                                }}
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

            {/* Navigation controls */}
            <div className="flex justify-center gap-6">
                <button 
                    onClick={moveUp}
                    style={{
                        backgroundColor: '#9333ea',
                        padding: '1rem',
                        borderRadius: '9999px',
                        border: '2px solid #a855f7',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.backgroundColor = '#7e22ce';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.backgroundColor = '#9333ea';
                    }}
                    aria-label="Previous episode"
                >
                    <ChevronUp className="w-6 h-6 text-white" />
                </button>
                <button 
                    onClick={moveDown}
                    style={{
                        backgroundColor: '#9333ea',
                        padding: '1rem',
                        borderRadius: '9999px',
                        border: '2px solid #a855f7',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.backgroundColor = '#7e22ce';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.backgroundColor = '#9333ea';
                    }}
                    aria-label="Next episode"
                >
                    <ChevronDown className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    );
};

export default ScriptsWheel;
