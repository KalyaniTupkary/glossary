import { initializeFormHandler } from './suggestForm.js';
import { fetchEntries } from './entryDataHandler.js';
import { Entry } from './Entry.js';
import { initializeMobileNav } from './mobileNav.js';
import { initializeLogoAnimation } from './logo.js';
import { updateProgressBar } from './progressBar.js';
import { hideLoadingScreen, appendAbout, appendSuggest, isMobileDevice, updateNavHightlight } from './uiHandler.js';

let currentIndex = 0;
let loaderTimeout = 1000;

document.addEventListener("DOMContentLoaded", async () => {
    const loadingScreen = document.getElementById("load");
    // Initialize components
    initializeMobileNav();
    initializeLogoAnimation();
    
    const entriesContainer = document.querySelector(".entries");


    if(!isMobileDevice()){
        appendAbout(entriesContainer);
    } else {
        appendAbout(document.querySelector(".container"));
       
    }

    const dataset = await fetchEntries();
    
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

    if(!isMobileDevice()){
        appendSuggest(entriesContainer);
    } else {
        appendSuggest(document.querySelector(".container"));
    }

    function checkAndInitializeForm() {
        const form = document.querySelector("#suggestForm");
        if (form) {
            initializeFormHandler("#suggestForm", () => {
            });
            observer.disconnect(); // Stop observing once initialized
        }
    }
    const observer = new MutationObserver(() => {
        checkAndInitializeForm();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    checkAndInitializeForm();

    hideLoadingScreen(1000);

    const allEntries = document.querySelectorAll(".entry");
    const entryCount = allEntries.length;
    let padding = window.innerWidth * 0.25 / (entryCount - 1);


    function changeEntry(targetIndex) {
        entryObjects.forEach((entry) => entry.element.classList.add("animating"));
        currentIndex = targetIndex;
        entryObjects.forEach(entry => entry.updatePosition(currentIndex));
        updateProgressBar(currentIndex, entryCount);
        
        updateNavHightlight(entryObjects[currentIndex].element);

        setTimeout(() => {
            entryObjects.forEach((entry) => entry.element.classList.remove("animating"));
        }, 800);
    }

    const entryObjects = Array.from(allEntries).map((entry, index) => 
        new Entry(entry, index, padding, [], changeEntry)
    );

    entryObjects.forEach(entry => entry.entries = entryObjects);
    let randomIndex = Math.floor(Math.random() * (entryCount - 2)) + 1;
    changeEntry(randomIndex);

    document.getElementById("stamp").addEventListener("click", () => {
        randomIndex = Math.floor(Math.random() * (entryCount - 2)) + 1;
        changeEntry(randomIndex);
    });

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

    document.getElementById("logo").addEventListener("click", () => {
        currentIndex = 0
        changeEntry(currentIndex);
    });


    document.addEventListener("keydown", (event) => {
        if (isAnimating) return;

        if (event.key === "ArrowLeft" && currentIndex > 0) {
            currentIndex -= 1;
            // isAnimating = true;
            changeEntry(currentIndex);
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        } else if (event.key === "ArrowRight" && currentIndex < entryCount - 1) {
            currentIndex += 1;
            isAnimating = true;
            changeEntry(currentIndex);
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }
    });



    let isAnimating = false;
    let SCROLL_THRESHOLD = 10;


    // interaction handlers

    function handleScroll(event) {
        if (isAnimating) return;
    
        if (document.querySelector('.mobileNavItem.open')) {
            return;
        }
    
        const isTouchEvent = event.type === "touchmove";
    
        let deltaY, deltaX;
    
        if (isTouchEvent) {
            // For touch events, use manually calculated delta values
            deltaY = -Math.abs(event.deltaY || 0);
            deltaX = -Math.abs(event.deltaX || 0);
        } else {
            // For mouse wheel events, use event properties
            deltaY = Math.abs(event.deltaY);
            deltaX = Math.abs(event.deltaX);
        }
    
        if (deltaY < SCROLL_THRESHOLD && deltaX < SCROLL_THRESHOLD) {
            return;
        }
    
        const direction = deltaX > deltaY
            ? (event.deltaX > 0 ? 1 : -1)
            : (event.deltaY > 0 ? 1 : -1);
    
        // Reverse direction for touch events
        const finalDirection = isTouchEvent ? -direction : direction;
    
        if ((finalDirection === 1 && currentIndex < entryCount - 1) || (finalDirection === -1 && currentIndex > 0)) {
            currentIndex += finalDirection;
            isAnimating = true;
            changeEntry(currentIndex);
    
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }
    }

    
    // Add event listeners
    document.addEventListener("wheel", handleScroll, { passive: false });

    function initializeSwipeHandler() {
        const touchArea = document.body; // Or specify a specific container element
        const hammer = new Hammer(touchArea);
    
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    
        hammer.on("swipeleft", () => {
            if (currentIndex < entryCount - 1) {
                currentIndex++;
                changeEntry(currentIndex);
            }
        });
    
        hammer.on("swiperight", () => {
            if (currentIndex > 0) {
                currentIndex--;
                changeEntry(currentIndex);
            }
        });
    
    }
    
    // Check for touch support and initialize Hammer.js if applicable
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        initializeSwipeHandler();
    }


const progressBar = document.getElementById('progress');

let isDragging = false;

progressBar.addEventListener("mousedown", (e) => startDrag(e));
progressBar.addEventListener("touchstart", (e) => startDrag(e.touches[0]));

document.addEventListener("mousemove", (e) => drag(e));
document.addEventListener("touchmove", (e) => drag(e.touches[0]));

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

function startDrag(event) {
    isDragging = true;
    progressBar.classList.add("dragging");
    document.body.classList.add("dragging");
    updateEntryFromProgress(event);
}

function drag(event) {
    console.log(isDragging);
    if (!isDragging) return;
    updateEntryFromProgress(event);
}

function stopDrag() {
    isDragging = false;
    progressBar.classList.remove("dragging");
    document.body.classList.remove("dragging"); 
}

function updateEntryFromProgress(event) {
    const rect = progressBar.getBoundingClientRect();
    let offsetX = event.clientX - rect.left; // Mouse position relative to progress bar
    let progress = offsetX / rect.width; // Convert to percentage
    
    progress = Math.max(0, Math.min(progress, 1)); // Clamp between 0 and 1
    currentIndex = Math.round(progress * (entryCount - 1)); // Convert to index

    changeEntry(currentIndex);
    updateProgressBar();
}

    
});




