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
        this.relatedWordsIndex = 0; // Tracks which related word to show next
        this.relatedWordsTimer = null; // Timer for adding related words
        this.relatedWordElements = [];
        // this.word = this.element.querySelector(".word").textContent;
        
        this.element.querySelectorAll(".related-word").forEach((element, index) => {
            this.relatedWordElements.push(element);
        })

        // Reorder relatedWordElements to 0, 3, 1, 4, 2
        this.relatedWordElements = [
            this.relatedWordElements[0],
            this.relatedWordElements[3],
            this.relatedWordElements[1],
            this.relatedWordElements[4],
            this.relatedWordElements[2]
        ];
        
        this.updatePosition();
        this.addClickListener();
    
        this.startTimer();
    }


    showRelatedWord() {
        this.relatedWordElements.forEach((element, index) => {
            if (index === this.relatedWordsIndex) {
                const randomTranslateY = Math.random() * 60 + 20; // Random value between 20 and 80
                element.style.transform = `translateY(${randomTranslateY}%)`;

                element.classList.add("visible");
            }
        });
    }
    
    
    clearRelatedWords(){

        const relatedWords = this.element.querySelectorAll(".related-word");
        if (relatedWords) {
            relatedWords.forEach(element => {
            element.classList.remove("visible");
            });
        }
        this.relatedWordsIndex = 0;
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
            if (event.target === stamp || event.target.parentNode.classList.contains("related-word")) {
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

        // Check if the device is mobile
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            return;
        }
        // Reset elapsed time
        this.timeElapsed = 0;
        // Clear any existing interval to avoid multiple intervals running
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Start a new interval that calls showRelatedWord every second
        this.timerInterval = setInterval(() => {
            this.timeElapsed++;
            if (this.timeElapsed > 1) {
                this.showRelatedWord();
                this.relatedWordsIndex++;
            }
            
            if(this.relatedWordsIndex === this.relatedWordElements.length){
                this.stopTimer()
            }
            
        }, 3000);


    }

    stopTimer() {
        // Stop the timer interval
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

}