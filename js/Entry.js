import { calculatePosition } from './calculatePosition.js';

export class Entry {
    constructor(element, index, padding, entries, changeEntry) {
        this.element = element;
        this.index = index;
        this.padding = padding;
        this.entries = entries;
        this.changeEntry = changeEntry;
        this.isClicked = false;
        this.timerInterval = null; // To track the live timer interval
        this.timeElapsed = 0; // Elapsed time in seconds
        this.relatedWords = [
            "word 1",
            "word 2",
            "word 3",
            "word 4",
            "word 5",
        ]; // Array of related words
        this.relatedWordsIndex = 0; // Tracks which related word to show next
        this.relatedWordsTimer = null; // Timer for adding related words

        this.updatePosition();
        this.addClickListener();
    }

    updatePosition(currentIndex = null) {
        const isMobile = window.innerWidth < 768; // Mobile detection
        const position = calculatePosition(this.index, currentIndex, isMobile, this.padding, this.element.offsetWidth);
        this.element.style.left = position;
        this.element.style.zIndex = 100 - this.index;

        // Toggle 'current' class and start/stop timer
        if (this.index === currentIndex) {
            this.element.classList.add("current");
            this.startTimer(); // Start the timer when the entry becomes current
        } else {
            this.element.classList.remove("current");
            this.stopTimer(); // Stop the timer when the entry is no longer current
        }
    }

    addClickListener() {
        this.element.addEventListener("click", (event) => {
            const stamp = this.element.querySelector("#stamp");
    
            // Check if the clicked element is the #stamp
            if (event.target === stamp) {
                return;  // Prevent further processing
            }
    
            // If this entry isn't current, handle the click normally
            if (!this.element.classList.contains("current")) {
                this.entries.forEach(entry => entry.isClicked = false);
                this.isClicked = true;
                this.changeEntry(this.index);
            }
        });
    }

    startTimer() {
        // Reset elapsed time
        this.timeElapsed = 0;
        this.updateTimeDisplay();

        // Start interval to update the timer every second
        if (!this.timerInterval) {
            this.timerInterval = setInterval(() => {
                this.timeElapsed++;
                this.updateTimeDisplay();
            }, 1000);
        }
    }

    stopTimer() {
        // Stop the timer interval
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    updateTimeDisplay() {
        // Update the <p class="time"> element inside this entry
        const timeElement = this.element.querySelector(".time");
        if (timeElement) {
            timeElement.textContent = `Time on this entry: ${this.timeElapsed} second${this.timeElapsed !== 1 ? "s" : ""}`;
        }
    }
}