import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Download, Eye } from 'lucide-react';

// ... episodes array and renderEpisodeBox function stay the same ...

const ScriptsWheel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // ... moveUp, moveDown, and getVisibleEpisodes functions stay the same ...

    useEffect(() => {
        // Create the image box element
        const imageBox = document.createElement('div');
        imageBox.id = 'image-box';
        imageBox.style.position = 'fixed';
        imageBox.style.width = '300px';
        imageBox.style.height = '200px';
        imageBox.style.transition = 'transform 0.5s ease-in-out';
        imageBox.style.background = 'rgba(255, 255, 255, 0.1)';
        imageBox.style.pointerEvents = 'none';
        imageBox.style.zIndex = '-1'; // Keep it behind other content

        // Create and setup the image
        const samImage = document.createElement('img');
        samImage.id = 'sam-image';
        samImage.src = 'https://david9930.github.io/living-with-the-ghost-of-sam/images/SamImagesmall.jpg';
        samImage.alt = 'Sam';
        samImage.style.width = '100%';
        samImage.style.height = '100%';
        samImage.style.objectFit = 'cover';
        samImage.style.display = 'block';
        samImage.style.opacity = '0.3'; // Make it slightly transparent

        // Add image to the box
        imageBox.appendChild(samImage);
        document.body.appendChild(imageBox);

        // Function to calculate random position
        function randomPosition() {
            const viewportWidth = Math.max(window.innerWidth, 320);
            const viewportHeight = Math.max(window.innerHeight, 240);
            
            const boxWidth = 300; // imageBox width
            const boxHeight = 200; // imageBox height
            
            const maxX = viewportWidth - boxWidth;
            const maxY = viewportHeight - boxHeight;
            
            const x = Math.max(0, Math.min(Math.floor(Math.random() * maxX), maxX));
            const y = Math.max(0, Math.min(Math.floor(Math.random() * maxY), maxY));
            
            return { x, y };
        }

        // Function to move the image box
        function moveImageBox() {
            const { x, y } = randomPosition();
            imageBox.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            imageBox.style.webkitTransform = `translate3d(${x}px, ${y}px, 0)`;
        }

        // Initial movement and interval setup
        moveImageBox();
        const intervalId = setInterval(moveImageBox, 3000);

        // Handle window resizing
        window.addEventListener('resize', moveImageBox);

        // Cleanup function
        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', moveImageBox);
            document.body.removeChild(imageBox);
        };
    }, []); // Empty dependency array means this runs once on mount

    const visibleEpisodes = getVisibleEpisodes();

    return (
        <div className="w-full max-w-xl mx-auto px-8" style={{ position: 'relative', zIndex: '1' }}>
            {/* Rest of your component stays the same */}
            <h1 className="text-4xl text-center text-white mb-8 font-bold">
                TV Show Scripts
            </h1>
            
            {/* Main container - adding higher z-index to keep it above the flying image */}
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
                {/* ... rest of your component content ... */}
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
