// Image Lightbox Functionality
document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxContentWrapper = document.querySelector('.lightbox-content-wrapper');
    
    // Get all images with data-lightbox attribute
    const lightboxImages = document.querySelectorAll('[data-lightbox="true"]');
    
    // Open lightbox function
    function openLightbox(imageSrc, imageTitle, imageDescription) {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageTitle;
        lightboxTitle.textContent = imageTitle;
        lightboxDescription.textContent = imageDescription || '';
        lightboxModal.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox function
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.classList.remove('lightbox-open');
        document.body.style.overflow = '';
    }
    
    // Add click event listeners to all lightbox images
    lightboxImages.forEach(image => {
        image.addEventListener('click', (e) => {
            e.preventDefault();
            // Use the image src directly (JavaScript will resolve relative paths correctly)
            const imageSrc = image.src;
            const imageTitle = image.getAttribute('data-title') || image.alt || 'Feature Image';
            
            // Get description from data-description attribute or from the next sibling <p> element
            let imageDescription = image.getAttribute('data-description');
            if (!imageDescription) {
                // Try to find the description in the next sibling <p> tag
                const featureItem = image.closest('.feature-item');
                if (featureItem) {
                    const descriptionElement = featureItem.querySelector('p');
                    if (descriptionElement) {
                        imageDescription = descriptionElement.textContent.trim();
                    }
                }
            }
            
            openLightbox(imageSrc, imageTitle, imageDescription);
        });
    });
    
    // Close lightbox when clicking the close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Close lightbox when clicking outside the content wrapper
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
    
    // Close lightbox when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Prevent lightbox from closing when clicking on the content wrapper or its children
    if (lightboxContentWrapper) {
        lightboxContentWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});

