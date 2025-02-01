const progressBar = document.querySelector("#progress .bar");

export function updateProgressBar(currentIndex, entryCount) {
    
    const progressPercentage = (currentIndex / entryCount) * 100;
    progressBar.style.width = `${100 / entryCount}%`;
    progressBar.style.left = `${progressPercentage}%`;
}