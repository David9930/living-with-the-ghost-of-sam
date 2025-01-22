// ... previous imports and renderEpisodeBox function stay the same ...

const ScriptsWheel = () => {
    // ... all state and functions stay the same ...

    return (
        <div className="w-full max-w-xl mx-auto px-8" style={{ 
            position: 'relative', 
            zIndex: '1',
            marginTop: '-3rem' // This will pull the entire container up closer to the header
        }}>
            <h1 className="text-4xl text-center text-white mb-8 font-bold">
                TV Show Script Selector
            </h1>
            
            {/* Restored original container height */}
            <div style={{ 
                border: '4px solid white',
                borderRadius: '8px',
                height: '480px', // Restored to original height
                position: 'relative',
                backgroundColor: '#111',
                marginBottom: '2rem',
                padding: '1rem',
                overflow: 'hidden',
                zIndex: '1'
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

            {/* Navigation controls */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12rem',
                marginTop: '2rem',
                position: 'relative',
                zIndex: '1'
            }}>
                {/* ... navigation buttons stay the same ... */}
            </div>
        </div>
    );
};

export default ScriptsWheel;
