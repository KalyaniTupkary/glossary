let currentIndex = 0;

document.addEventListener("DOMContentLoaded", async () => {

    const loadingScreen = document.getElementById("load");

    // Function to hide the loading screen
    function hideLoadingScreen() {
        setTimeout(() => {
            loadingScreen.classList.add("hidden");
        }, 2000); // Add a 2-second delay
    }



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

    // Dynamically create and append the "about" entry
    const aboutEntry = document.createElement("div");
    aboutEntry.classList.add("entry", "about");
    aboutEntry.innerHTML = `
        <p class="intro">
            <span id="clock"></span> 
            Dear reader,<br><br>
            More than what we can do with words, this glossary uncovers what words can do with us. These words give form to the nuanced phenomena we encounter—leaky sensations, feelings, in-between moments, and fleeting experiences that can be named but don’t seem to be.
            <br><br>
            We all have these textured experiences of time, but a rather limited set of words to describe them. There are gaping holes in the lexicon of time that we don’t even know we are missing. When these experiences remain unnamed, they remain unwritten, undefined and hence unknown.
            <br><br>
            To name them, I tinkered with ChatGPT, feeding it elusive experiences as prompts. What began as a playful experiment soon drew on AI’s ability to ‘hallucinate’ or imagine notions beyond our known reality to deepen our understanding of time. 
            <br><br>
            Peruse it slowly,<br>
            Kalyani
            <br><br>
            P.S. Project by yours truly, with the website brought to life by Jon Packles.
        </p>
    `;
    entriesContainer.appendChild(aboutEntry);
    document.getElementById("clock").innerHTML = getNaturalLanguageTime();

    // Fetch and format entries
    const dataset = await fetchEntries();

    // Dynamically create and append regular .entry elements
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

    // Dynamically create and append the "suggest a word" entry
    const suggestEntry = document.createElement("div");
    suggestEntry.classList.add("entry", "suggest");
    suggestEntry.innerHTML = `
       <div class="suggest-content">
            <p class="suggest-text">
                Words can render new realities and expand our perception of time. Share your experiences—specific or vague—that might otherwise fall through the cracks of conventional language.
            </p>
            <form class="suggest-form">
                <label for="name">name</label>
                <input type="text" id="name" name="name" />

                <label for="email">email</label>
                <input type="email" id="email" name="email" />

                <label for="word-details">words about the word</label>
                <textarea id="word-details" name="word-details"></textarea>

                <button type="submit">Send</button>
            </form>
        </div>
    `;
    entriesContainer.appendChild(suggestEntry);

    hideLoadingScreen();

    // Select all dynamically created entries
    const allEntries = document.querySelectorAll(".entry");
    const entryCount = allEntries.length;
    let padding = window.innerWidth * 0.25 / (entryCount - 1);

    function updateProgressBar() {
        const progressBar = document.querySelector("#progress .bar");
        const progressPercentage = ((currentIndex) / entryCount) * 100; // Calculate progress
        progressBar.style.width = `${100/entryCount * 8}%`;
        progressBar.style.left = `${progressPercentage}%`;
        // console.log(100/entryCount);
    }

    const entryObjects = Array.from(allEntries).map((entry, index) => new Entry(entry, index, padding, []));
    entryObjects.forEach(entry => entry.entries = entryObjects);
    updateProgressBar();
    // Start at index 0
    entryObjects.forEach(entry => entry.updatePosition(currentIndex));

    // Handle window resize
    window.addEventListener("resize", () => {
        padding = window.innerWidth * 0.25 / entryCount;
        entryObjects.forEach(entry => {
            entry.padding = padding;
            entry.updatePosition(currentIndex);
        });
        updateProgressBar();
    });

    document.getElementById("navAbout").addEventListener("click", () => {
        currentIndex = 0;
        updateProgressBar(); 
        entryObjects.forEach(entry => entry.updatePosition(currentIndex));
    });

    document.getElementById("navSuggest").addEventListener("click", () => {
        currentIndex = entryObjects.length - 1;
        updateProgressBar(); 
        entryObjects.forEach(entry => entry.updatePosition(currentIndex));
    });

    let isAnimating = false;

    function handleScroll(event) {
        if (isAnimating) return;

        const delta = event.deltaY || event.detail || -event.wheelDelta;
        const direction = delta > 0 ? 1 : -1;

        if ((direction === 1 && currentIndex < entryCount - 1) || (direction === -1 && currentIndex > 0)) {
            currentIndex += direction;
            isAnimating = true;
            updateProgressBar(); 
            entryObjects.forEach(entry => entry.updatePosition(currentIndex));

            setTimeout(() => {
                isAnimating = false;
            }, 1000);
        }
    }

    document.addEventListener("wheel", handleScroll, { passive: false });
    

    let touchStartY = 0;
    document.addEventListener("touchstart", (event) => {
        touchStartY = event.touches[0].clientY;
    });

    document.addEventListener("touchmove", (event) => {
        const touchEndY = event.touches[0].clientY;
        const delta = touchStartY - touchEndY;

        if (Math.abs(delta) > 50) {
            handleScroll({ deltaY: delta });
        }
    });
});



