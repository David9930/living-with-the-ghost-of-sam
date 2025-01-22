// ... episodes array and renderEpisodeBox function stay the same ...

const ScriptsWheel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // ... moveUp, moveDown, and getVisibleEpisodes functions stay the same ...

    const visibleEpisodes = getVisibleEpisodes();

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
                {/* Previous Episode */}
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

                {/* Current Episode */}
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

                {/* Next Episode */}
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

            {/* Navigation controls - now below the container with updated styling */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12rem',  // Increased gap between buttons
                marginTop: '2rem'
            }}>
                <button 
                    onClick={moveUp}
                    style={{
                        backgroundColor: '#dc2626', // Red background
                        padding: '1.25rem',
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
                        backgroundColor: '#dc2626', // Red background
                        padding: '1.25rem',
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
