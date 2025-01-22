import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Download, Eye } from 'lucide-react';

// Episodes array
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

// Helper function defined before the main component
const renderEpisodeBox = (episode, isActive) => (
    <div style={{
        border: '2px solid white',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: isActive ? '#2a2a4a' : '#1a1a1a',
        boxShadow: isActive ? '0 0 20px rgba(255, 255, 255, 0.1)' : 'none',
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
);

// Main component
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
        const previous = currentIndex === 0 ? episodes.length - 1 : currentIndex - 1;
        const next = currentIndex === episodes.length - 1 ? 0 : currentIndex + 1;
        return {
            previous: episodes[previous],
            current: episodes[currentIndex],
            next: episodes[next]
        };
    };

    useEffect(() => {
        const imageBox = document.createElement('div');
        imageBox.id = 'image-box';
        imageBox.style.position = 'fixed';
        imageBox.style.width = '300px';
        imageBox.style.height = '200px';
        imageBox.style.transition = 'transform 0.5s ease-in-out';
        imageBox.style.background = 'transparent';
        imageBox.style.pointerEvents = 'none';
        imageBox.style.zIndex = '0';
        imageBox.style.top = '0';
        imageBox.style.left = '0';

        const samImage = document.createElement('img');
        samImage.id = 'sam-image';
        samImage.src = 'https://david9930.github.io/living-with-the-ghost-of-sam/images/SamImagesmall.jpg';
        samImage.alt = 'Sam';
        samImage.style.width = '100%';
        samImage.style.height = '100%';
        samImage.style.objectFit = 'cover';
        samImage.style.display = 'block';
        samImage.style.opacity = '0.3';

        imageBox.appendChild(samImage);
        document.body.insertBefore(imageBox, document.body.firstChild);

        function randomPosition() {
            const viewportWidth = Math.max(window.innerWidth, 320);
            const viewportHeight = Math.max(window.innerHeight, 240);
            
            const boxWidth = 300;
            const boxHeight = 200;
            
            const maxX = viewportWidth - boxWidth;
            const maxY = viewportHeight - boxHeight;
            
            const x = Math.max(0, Math.min(Math.floor(Math.random() * maxX), maxX));
            const y = Math.max(0, Math.min(Math.floor(Math.random() * maxY), maxY));
            
            return { x, y };
        }

        function moveImageBox() {
            const { x, y } = randomPosition();
            imageBox.style.transform = `translate(${x}px, ${y}px)`;
        }

        moveImageBox();
        const intervalId = setInterval(moveImageBox, 3000);

        window.addEventListener('resize', moveImageBox);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', moveImageBox);
            if (document.body.contains(imageBox)) {
                document.body.removeChild(imageBox);
            }
        };
    }, []);

    const visibleEpisodes = getVisibleEpisodes();

    return (
        <div className="w-full max-w-xl mx-auto px-8" style={{ 
            position: 'relative', 
            zIndex: '1',
            marginTop: '-3rem' // Pull everything up closer to the header
        }}>
            <h1 className="text-4xl text-center text-white mb-8 font-bold">
                TV Show Script Selector
            </h1>
            
            <div style={{ 
                border: '4px solid white',
                borderRadius: '8px',
                height: '480px',
                position: 'relative',
                backgroundColor: '#111',
                marginBottom: '2rem',
                padding: '1rem',
                overflow: 'hidden',
                zIndex: '1'
            }}>
                <div style={{
                    position: 'absolute',
                    left: '1rem',
                    right: '1rem',
                    padding: '1rem',
                    top: '2%',
                    opacity: 0.5,
                    transform: 'scale(0.95)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease'
                }}>
                    {renderEpisodeBox(visibleEpisodes.previous, false)}
                </div>

                <div style={{
                    position: 'absolute',
                    left: '1rem',
                    right: '1rem',
                    padding: '1rem',
                    top: '33%',
                    opacity: 1,
                    transform: 'scale(1)',
                    zIndex: 2,
                    transition: 'all 0.3s ease'
                }}>
                    {renderEpisodeBox(visibleEpisodes.current, true)}
                </div>

                <div style={{
                    position: 'absolute',
                    left: '1rem',
                    right: '1rem',
                    padding: '1rem',
                    top: '64%',
                    opacity: 0.5,
                    transform: 'scale(0.95)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease'
                }}>
                    {renderEpisodeBox(visibleEpisodes.next, false)}
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12rem',
                marginTop: '2rem',
                position: 'relative',
                zIndex: '1'
            }}>
                <button 
                    onClick={moveUp}
                    style={{
                        backgroundColor: '#dc2626',
                        padding: '1rem',
                        borderRadius: '9999px',
                        border: '2px solid #ef4444',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.backgroundColor = '#b91c1c';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                    aria-label="Previous episode"
                >
                    <ChevronUp className="w-8 h-8 text-white" strokeWidth={3} />
                </button>
                <button 
                    onClick={moveDown}
                    style={{
                        backgroundColor: '#dc2626',
                        padding: '1rem',
                        borderRadius: '9999px',
                        border: '2px solid #ef4444',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.backgroundColor = '#b91c1c';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                    aria-label="Next episode"
                >
                    <ChevronDown className="w-8 h-8 text-white" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};

export default ScriptsWheel;
