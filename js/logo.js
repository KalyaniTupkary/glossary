export function initializeLogoAnimation() {
    const logos = document.querySelectorAll(".logo"); // Select all .logo elements
    const imagesPath = "./images/logos/"; // Path to the images folder
    const totalImages = 4; // Total number of PNGs in the folder
    const intervalTime = 800; // Time between image changes (ms)

    logos.forEach((logo) => {
        const imgElement = logo.querySelector("img"); // Select the <img> inside .logo
        let intervalId;

        logo.addEventListener("mouseover", () => {
            let currentImage = 1;

            // Start cycling through images
            intervalId = setInterval(() => {
                imgElement.src = `${imagesPath}${currentImage}.png`;
                currentImage = (currentImage % totalImages) + 1; // Cycle through images
            }, intervalTime);
        });

        logo.addEventListener("mouseout", () => {
            // Stop cycling but do not change the image
            clearInterval(intervalId);
        });
    });
}

// Automatically initialize if script is loaded directly
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLogoAnimation);
} else {
    initializeLogoAnimation();
}
