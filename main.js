class Entry {
    constructor(element, index, padding, entries) {
        this.element = element;
        this.index = index;
        this.padding = padding;
        this.entries = entries;
        this.isClicked = false;
        this.updatePosition();
        this.addClickListener();
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
                this.entries.forEach(entry => entry.isClicked = false);
                this.isClicked = true;
                this.entries.forEach(entry => entry.updatePosition(this.index));
                console.log(`Clicked on entry ${this.index}`);
            }
        });
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
            ? `${-elementWidth+12}px` // Peak 12px on the left
            : `-${elementWidth - padding * (index + 1)}px`;
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
            </div>
        `;
        entriesContainer.appendChild(entryElement);
    });

    const entries = document.querySelectorAll(".entry");
    const entryCount = entries.length;
    let padding = window.innerWidth * 0.25 / entryCount;

    const entryObjects = Array.from(entries).map((entry, index) => new Entry(entry, index, padding, []));
    entryObjects.forEach(entry => entry.entries = entryObjects);

    let currentIndex = 0; // Start at index 0
    entryObjects.forEach(entry => entry.updatePosition(currentIndex));

    const progressIndicator = document.createElement("div");
    progressIndicator.classList.add("progress-indicator");
    document.body.appendChild(progressIndicator);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" && currentIndex > 0) {
            currentIndex--;
            entryObjects.forEach(entry => entry.updatePosition(currentIndex));
            updateProgressIndicator(currentIndex, entryCount);
        } else if (event.key === "ArrowRight" && currentIndex < entryCount - 1) {
            currentIndex++;
            entryObjects.forEach(entry => entry.updatePosition(currentIndex));
            updateProgressIndicator(currentIndex, entryCount);
        }
    });

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
                updateProgressIndicator(currentIndex, entryCount);
            }
        }
    });

    function updateProgressIndicator(currentIndex, entryCount) {
        const progressPercentage = ((currentIndex + 0.5) / entryCount) * 100;
        progressIndicator.style.left = `${progressPercentage}%`;
    }

    updateProgressIndicator(currentIndex, entryCount);

    // Handle window resize
    window.addEventListener("resize", () => {
        padding = window.innerWidth * 0.25 / entryCount;
        entryObjects.forEach(entry => {
            entry.padding = padding; // Update padding for each Entry instance
            entry.updatePosition(currentIndex);
        });

        // Update ScrollTrigger's end point
        scrollTrigger.kill();
        ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: `+=${window.innerHeight * entryCount}`,
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
                    updateProgressIndicator(currentIndex, entryCount);
                }
            }
        });
    });
});
