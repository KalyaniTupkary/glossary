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
            // this.startTimer(); // Start timer when the entry becomes current
            // this.startRelatedWordsTimer(); // Start related words timer
        } else {
            this.element.classList.remove("current");
            // this.stopTimer(); // Stop timer when the entry is no longer current
            // this.stopRelatedWordsTimer(); // Stop related words timer
        }
    }

    addClickListener() {
        this.element.addEventListener("click", () => {
            if (!this.element.classList.contains("current")) {
                this.entries.forEach(entry => entry.isClicked = false);
                this.isClicked = true;
                this.entries.forEach(entry => entry.updatePosition(this.index));
                console.log(`Clicked on entry ${this.index}`);
            }
        });
    }

    startTimer() {
        // Reset elapsed time and update immediately
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

    startRelatedWordsTimer() {
        // Reset index and clear any previous timer
        this.relatedWordsIndex = 0;
        this.stopRelatedWordsTimer();

        // Start a timer for the first related word after 5 seconds
        this.relatedWordsTimer = setTimeout(() => {
            this.addRelatedWord(this.relatedWords[this.relatedWordsIndex]);

            // Continue adding a new word every second
            this.relatedWordsTimer = setInterval(() => {
                this.relatedWordsIndex++;
                if (this.relatedWordsIndex < this.relatedWords.length) {
                    this.addRelatedWord(this.relatedWords[this.relatedWordsIndex]);
                } else {
                    // Stop the interval if all words are added
                    this.stopRelatedWordsTimer();
                }
            }, 1000);
        }, 1000);
    }

    stopRelatedWordsTimer() {
        // Clear both the timeout and interval for related words
        clearTimeout(this.relatedWordsTimer);
        clearInterval(this.relatedWordsTimer);
        this.relatedWordsTimer = null;
    }

    addRelatedWord(word) {
        if (!word) return;
    
        // Create a new element for the related word
        const wordElement = document.createElement("div");
        wordElement.classList.add("related-word");
        wordElement.textContent = word;
    
        // Get dimensions of the entry element
        const { width, height } = this.element.getBoundingClientRect();
    
        // Randomly choose top or bottom third
        const isTop = Math.random() < 0.5;
        const randomX = Math.random() * width; // Full width of the div
        const randomY = isTop
            ? Math.random() * (height / 3) // Top third
            : Math.random() * (height / 3) + (2 * height / 3); // Bottom third
    
        // Style the related word element
        wordElement.style.position = "absolute";
        wordElement.style.left = `${randomX}px`;
        wordElement.style.top = `${randomY}px`;
        wordElement.style.transform = "translate(-50%, -50%)";
    
        // Append the word to the entry div
        this.element.appendChild(wordElement);
    }
}

// Helper function to calculate position
function calculatePosition(index, currentIndex, isMobile, padding, elementWidth) {
    if (currentIndex === null) return "0px";

    if (index === currentIndex) {
        // Current entry is centered
        return isMobile ? "12px" : `${padding * index}px`;
    } else if (index > currentIndex) {
        // Entries after the current one
        return isMobile
            ? `${12}px` // Peak 12px on the right
            : `${padding * index}px`;
    } else {
        // Entries before the current one
        return isMobile
            ? `${-elementWidth + 12}px` // Peak 12px on the left
            : `-${elementWidth - padding * (index + 1) -1}px`;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1hL_f05Hzl_vdeEyiOuxKZ2LV3oRPaUUlZYkDd9n4ngg/values/Glossary?key=AIzaSyBvMMzxGc8F_GTs7ytfJDNo_ZEWp_wze5k';

    const fetchEntries = async () => {
        try {
            const response = await fetch(GOOGLE_SHEETS_API_URL);
            const data = await response.json();
            const rows = data.values;

            // Format rows into entries
            return rows.slice(1).map((row) => ({
                word: row[0],
                pos: row[1], // Optional: part of speech, if you want to include it
                description: row[2],
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    const entriesContainer = document.querySelector(".entries");

    // Fetch and format entries
    const dataset = await fetchEntries();

    // Dynamically create and append .entry elements
    dataset.forEach((data) => {
        const entryElement = document.createElement("div");
        entryElement.classList.add("entry");
        entryElement.innerHTML = `
            <div class="entry-content">
                <h2 class="word">
                    ${data.word} <span class="word-type">${data.pos}</span>
                </h2>
                <p class="definition">${data.description}</p>
                <p class="time">Time on this entry: 0 seconds</p>
            </div>
        `;
        entriesContainer.insertBefore(entryElement, document.querySelector(".entry.suggest"));
        // appendChild(entryElement);
    });

    const entries = document.querySelectorAll(".entry");
    const entryCount = entries.length;
    let padding = window.innerWidth * 0.25 / entryCount;

    const entryObjects = Array.from(entries).map((entry, index) => new Entry(entry, index, padding, []));
    entryObjects.forEach(entry => entry.entries = entryObjects);

    let currentIndex = 0; // Start at index 0
    entryObjects.forEach(entry => entry.updatePosition(currentIndex));

    // GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const scrollTrigger = ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: () => `+=${window.innerHeight * entryCount}`,
        scrub: true,
        snap: {
            snapTo: 1 / (entryCount - 1),
            duration: { min: 0.2, max: 0.5 },
            ease: "power1.inOut"
        },
        onUpdate: (self) => {
            const progress = self.progress * (entryCount - 1);
            const newIndex = Math.round(progress);
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                entryObjects.forEach(entry => entry.updatePosition(currentIndex));
            }
        }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
        padding = window.innerWidth * 0.25 / entryCount;
        entryObjects.forEach(entry => {
            entry.padding = padding; // Update padding for each Entry instance
            entry.updatePosition(currentIndex);
        });
    });
});
