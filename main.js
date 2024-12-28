let currentIndex = 0;



document.addEventListener("DOMContentLoaded", async () => {

  
     const loadingScreen = document.getElementById("load");

    // Function to hide the loading screen
    function hideLoadingScreen() {
     
        setTimeout(()=> {
            loadingScreen.classList.add("hidden");
        },2000)
       
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
    let isMobile = window.innerWidth < 768; // Mobile detection
    // Dynamically create and append the "about" entry
    const aboutEntry = document.createElement("div");
    aboutEntry.classList.add("about");
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

        ${isMobile ? '<div class="mobileNavItem">Incomplete Glossary of Time</div>' : ''}
    `;
    
    let aboutIsOpen = false;
    let suggestIsOpen = false;

    let mainContainer = document.querySelector(".container");

    function appendAbout(isMobile) {
        if (isMobile) {
            mainContainer.appendChild(aboutEntry);
            
            aboutEntry.style.top = `${-aboutEntry.offsetHeight + 48}px`;

            aboutEntry.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent click from propagating to the document
                if (!aboutIsOpen) {
                    aboutEntry.style.top = "0";
                    aboutIsOpen = !aboutIsOpen;
                } 
               
            });

            document.addEventListener("click", (event) => {
                if (aboutIsOpen && !aboutEntry.contains(event.target)) {
                aboutEntry.style.top = `${-aboutEntry.offsetHeight + 48}px`;
                aboutIsOpen = false;
                }
            });

        } else {
            aboutEntry.classList.add("entry");
            entriesContainer.appendChild(aboutEntry);
        }
    }

    appendAbout(isMobile);


   
    
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
    suggestEntry.classList.add("suggest");
    suggestEntry.innerHTML = `
       ${isMobile ? '<div class="mobileNavItem">Suggest a word</div>' : ''}
       <div class="suggest-content">
            <p class="suggest-text">
                Words can render new realities and expand our perception of time. Share your experiences—specific or vague—that might otherwise fall through the cracks of conventional language.
            </p>
            <form class="suggest-form" id="suggestForm">
                <label for="name">name</label>
                <input type="text" id="name" name="name" required />

                <label for="email">email</label>
                <input type="email" id="email" name="email" required />

                <label for="wordDetails">words about the word</label>
                <textarea id="word-details" name="wordDetails" required></textarea>

                <button type="submit">Submit</button>
            </form>
        </div>
    `;


    function appendSuggest(isMobile) {
        if (isMobile) {

            mainContainer.appendChild(suggestEntry);
            suggestEntry.style.bottom = `${-suggestEntry.offsetHeight + 48}px`;
    
            suggestEntry.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent click from propagating to the document
                if(!suggestIsOpen) {
                // suggestEntry.style.bottom = `${-suggestEntry.offsetHeight + 48}px`;
                    suggestEntry.style.bottom = "0";
                    suggestIsOpen = true;
                }
               
            });
    
            document.addEventListener("click", (event) => {
                if (suggestIsOpen && !suggestEntry.contains(event.target)) {
                suggestEntry.style.bottom = `${-suggestEntry.offsetHeight + 48}px`;
                suggestIsOpen = false;
                }
            });
    
            // console.log(suggestEntry.offsetHeight);
        } else {
            suggestEntry.classList.add("entry");
            entriesContainer.appendChild(suggestEntry);
        }
    }


    

    appendSuggest(isMobile)

    document.getElementById("suggestForm").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission
    
        const formData = new FormData(event.target); // Create FormData object from the form
    
        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbxhAQzQS-9UF2ObIaEA5Gt5dKJf6smbGaZ5MzjE71SImJ1UnpM6mPa_xclQru2EWJBdlQ/exec", {
                method: "POST",
                body: formData,
                mode: "no-cors",
            });
    
            const result = await response.json(); // Parse the response as JSON
            if (result.status === "success") {
                alert("Form submitted successfully!");
            } else {
                // alert("Failed to submit form.");
            }
        } catch (error) {
            console.error("Error:", error);
            // alert("An error occurred while submitting the form.");
        }
    });


    
    
    hideLoadingScreen();

    // Select all dynamically created entries
    const allEntries = document.querySelectorAll(".entry");
    const entryCount = allEntries.length;
    let padding = window.innerWidth * 0.25 / (entryCount - 1);

    function updateProgressBar() {
        const progressBar = document.querySelector("#progress .bar");
        const progressPercentage = ((currentIndex) / entryCount) * 100; // Calculate progress
        progressBar.style.width = `${100/entryCount}%`;
        progressBar.style.left = `${progressPercentage}%`;
        // console.log(100/entryCount);
    }

    const progressBar = document.querySelector("#progress .bar");
    const progressContainer = document.querySelector("#progress");
    let isDragging = false;

    // Helper function to update entry based on progress bar position
    function updateEntryFromProgress(progressPercentage) {
        const targetIndex = Math.round(progressPercentage * (entryCount - 1));
        if (currentIndex !== targetIndex) {
            currentIndex = targetIndex;
            changeEntry(currentIndex);
        }
    }

    // Event listener for dragging the progress bar
    progressBar.addEventListener("mousedown", (event) => {
        isDragging = true;
        document.body.style.cursor = "grabbing"; // Change cursor style
        document.body.style.userSelect = "none"; // Disable text selection
        progressBar.classList.add("disableTransition");
        document.body.classList.add("disableHover");
    });

    document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;

        const progressBounds = progressContainer.getBoundingClientRect();
        const mouseX = event.clientX - progressBounds.left;
        const progressPercentage = Math.max(0, Math.min(mouseX / progressBounds.width, 1)); // Clamp between 0 and 1

        // Update bar position
        progressBar.style.left = `${progressPercentage * 100}%`;

        // Update the corresponding entry
        updateEntryFromProgress(progressPercentage);
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = "default"; // Reset cursor style
            document.body.style.userSelect = "";

            // Snap the progress bar to the closest entry
            const progressPercentage = currentIndex / (entryCount - 1);
            progressBar.style.left = `${progressPercentage * 100}%`;
            progressBar.classList.remove("disableTransition");
            document.body.classList.remove("disableHover");
        }
    });

    function changeEntry(targetIndex) {
        entryObjects.forEach((entry) => entry.element.classList.add("animating"));
        currentIndex = targetIndex;
        entryObjects.forEach(entry => entry.updatePosition(currentIndex));
        updateProgressBar();

        setTimeout(() => {
            entryObjects.forEach((entry) => entry.element.classList.remove("animating"));
        }, 800); // Match the CSS transition duration
    }


    const entryObjects = Array.from(allEntries).map((entry, index) => new Entry(entry, index, padding, [], changeEntry));
    entryObjects.forEach(entry => entry.entries = entryObjects);
    
    // Start at index 0

    const randomIndex = Math.floor(Math.random() * entryCount);
    changeEntry(randomIndex);

    // Handle window resize
    window.addEventListener("resize", () => {
        padding = window.innerWidth * 0.25 / entryCount;
        changeEntry(currentIndex);
    });

    document.getElementById("navAbout").addEventListener("click", () => {
        currentIndex = 0;
        changeEntry(currentIndex);
    });

    document.getElementById("navSuggest").addEventListener("click", () => {
        currentIndex = entryObjects.length - 1;
        changeEntry(currentIndex);
    });

    let isAnimating = false;

    function handleScroll(event) {
        if (isAnimating) return;

        const delta = event.deltaY || event.detail || -event.wheelDelta;
        const direction = delta > 0 ? 1 : -1;

        if ((direction === 1 && currentIndex < entryCount - 1) || (direction === -1 && currentIndex > 0)) {
            currentIndex += direction;
            isAnimating = true;
            changeEntry(currentIndex);

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




