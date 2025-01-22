{/* Previous imports and episodes array stay the same */}

const ScriptsWheel = () => {
    // ... all the state and functions stay the same ...

    return (
        <div className="w-full max-w-xl mx-auto px-4" style={{ 
            position: 'relative', 
            zIndex: '1',
            marginTop: '0',  // Removed top margin
            paddingTop: '0.5rem' // Added minimal padding
        }}>
            <h1 className="text-4xl text-center text-white mb-4 font-bold">  {/* Reduced bottom margin */}
                TV Show Script Selector
            </h1>
            
            {/* Fixed-size main container - reduced height */}
            <div style={{ 
                border: '4px solid white',
                borderRadius: '8px',
                height: '400px',  // Reduced height
                position: 'relative',
                backgroundColor: '#111',
                marginBottom: '1rem', // Reduced bottom margin
                padding: '1rem',
                overflow: 'hidden',
                zIndex: '1'
            }}>
                {/* Previous Episode - adjusted positioning */}
                <div style={{
                    position: 'absolute',
                    left: '1rem',
                    right: '1rem',
                    padding: '0.5rem', // Reduced padding
                    top: '2%',
                    opacity: 0.5,
                    transform: 'scale(0.95)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease'
                }}>
                    {renderEpisodeBox(visibleEpisodes.previous, false)}
                </div>

                {/* Current Episode - adjusted positioning */}
                <div style={{
                    position: 'absolute',
                    left: '1rem',
                    right: '1rem',
                    padding: '0.5rem', // Reduced padding
                    top: '33%',
                    opacity: 1,
                    transform: 'scale(1)',
                    zIndex: 2,
                    transition: 'all 0.3s ease'
                }}>
                    {renderEpisodeBox(visibleEpisodes.current, true)}
                </div>

                {/* Next Episode - adjusted positioning */}
                <div style={{
                    position: 'absolute',
                    left: '1rem',
                    right: '1rem',
                    padding: '0.5rem', // Reduced padding
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

            {/* Navigation controls - adjusted spacing */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8rem',  // Reduced gap between buttons
                marginTop: '0.5rem', // Reduced top margin
                position: 'relative',
                zIndex: '1'
            }}>
                <button 
                    onClick={moveUp}
                    style={{
                        backgroundColor: '#dc2626',
                        padding: '1rem', // Slightly reduced padding
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
                        padding: '1rem', // Slightly reduced padding
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

// renderEpisodeBox function stays the same

export default ScriptsWheel;
