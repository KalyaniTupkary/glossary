import { initializeFormHandler } from './suggestForm.js';
import { addClock, getNaturalLanguageTime } from './clock.js';
import { fetchEntries } from './entryDataHandler.js';
import { Entry } from './Entry.js';
import { initializeMobileNav } from './mobileNav.js';
import { initializeLogoAnimation } from './logo.js';
import { hideLoadingScreen, appendAbout, appendSuggest, isMobileDevice } from './uiHandler.js';

let currentIndex = 0;
let loaderTimeout = 1000;

document.addEventListener("DOMContentLoaded", async () => {
    const loadingScreen = document.getElementById("load");

    // Initialize components
    initializeMobileNav();
    initializeLogoAnimation();
    

    const entriesContainer = document.querySelector(".entries");

    function updateNavHightlight(el){
        if(el.classList.contains('about')){
            document.getElementById('navSuggest').classList.remove('active');
            document.getElementById('navAbout').classList.add('active');
        } else if(el.classList.contains('suggest')){
            document.getElementById('navAbout').classList.remove('active');
            document.getElementById('navSuggest').classList.add('active');
        } else {
            document.getElementById('navAbout').classList.remove('active');
            document.getElementById('navSuggest').classList.remove('active');
        }
    }

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

    

    // Function to initialize the form
    function checkAndInitializeForm() {
        const form = document.querySelector("#suggestForm");
        if (form) {
            initializeFormHandler("#suggestForm", () => {
            });
            observer.disconnect(); // Stop observing once initialized
        }
    }

  


    // Create MutationObserver to watch for form being added to the DOM
    const observer = new MutationObserver(() => {
        checkAndInitializeForm();
    });

    // Start observing the entire document for added elements
    observer.observe(document.body, { childList: true, subtree: true });

    // Call initially in case the form is already in the DOM
    checkAndInitializeForm();


    hideLoadingScreen(1000);

    const allEntries = document.querySelectorAll(".entry");
    const entryCount = allEntries.length;
    let padding = window.innerWidth * 0.25 / (entryCount - 1);



    function updateProgressBar() {
        const progressBar = document.querySelector("#progress .bar");
        const progressPercentage = (currentIndex / entryCount) * 100;
        progressBar.style.width = `${100 / entryCount}%`;
        progressBar.style.left = `${progressPercentage}%`;
    }
    

    function changeEntry(targetIndex) {
        entryObjects.forEach((entry) => entry.element.classList.add("animating"));
        currentIndex = targetIndex;
        entryObjects.forEach(entry => entry.updatePosition(currentIndex));
        updateProgressBar();
        
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
            console.log("swipe left");
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
    
        console.log("Swipe gestures enabled with Hammer.js");
    }
    
    // Check for touch support and initialize Hammer.js if applicable
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        initializeSwipeHandler();
        console.log("Touch support detected");
    }
    
  
    
   
});




