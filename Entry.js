class Entry {
    constructor(element, index, padding, entries) {
        this.element = element;
        this.index = index;
        this.padding = padding;
        this.entries = entries;
        this.isClicked = false;
        this.updatePosition();
        this.addClickListener();

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
    }

    updatePosition(currentIndex = null) {
        const isMobile = window.innerWidth < 768; // Mobile detection
        const position = calculatePosition(this.index, currentIndex, isMobile, this.padding, this.element.offsetWidth);
        this.element.style.left = position;
        this.element.style.zIndex = 100 - this.index;

        // Toggle 'current' class based on whether it's the current entry
        if (this.index === currentIndex) {
            this.element.classList.add("current");
        } else {
            this.element.classList.remove("current");
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
                updateProgressBar();
            }
        });


    }
}