import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Download, Eye } from 'lucide-react';

// ... episodes array and renderEpisodeBox function stay the same ...

const ScriptsWheel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // ... moveUp, moveDown, getVisibleEpisodes functions stay the same ...

    useEffect(() => {
        // Create the image box element
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

        // Create and setup the image
        const samImage = document.createElement('img');
        samImage.id = 'sam-image';
        samImage.src = 'https://david9930.github.io/living-with-the-ghost-of-sam/images/SamImagesmall.jpg';
        samImage.alt = 'Sam';
        samImage.style.width = '100%';
        samImage.style.height = '100%';
        samImage.style.objectFit = 'cover';
        samImage.style.display = 'block';
        samImage.style.opacity = '0.3';

        // Add image to the box
        imageBox.appendChild(samImage);
        document.body.insertBefore(imageBox, document.body.firstChild);

        // Function to calculate random position
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

        // Function to move the image box
        function moveImageBox() {
            const { x, y } = randomPosition();
            imageBox.style.transform = `translate(${x}px, ${y}px)`;
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
            marginTop: '1rem'  // Reduced top margin
        }}>
            <h1 className="text-4xl text-center text-white mb-6 font-bold">
                TV Show Script Selector
            </h1>
            
            {/* Rest of the component remains the same */}
            {/* ... */}
        </div>
    );
};

export default ScriptsWheel;
