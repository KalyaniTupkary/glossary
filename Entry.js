class Entry {
    constructor(element, index, padding, entries) {
        this.element = element;
        this.index = index;
        this.padding = padding;
        this.entries = entries;
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
        this.element.addEventListener("click", () => {
            if (!this.element.classList.contains("current")) {
                currentIndex = this.index;

                // Update positions of all entries
                this.entries.forEach(entry => entry.isClicked = false);
                this.isClicked = true;

                // Update the current positions and classes
                this.entries.forEach(entry => entry.updatePosition(currentIndex));
                console.log(`Clicked on entry ${this.index}`);
                updateProgressBar(); // Update progress bar
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
