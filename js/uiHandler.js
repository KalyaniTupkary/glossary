import { addClock } from "./clock.js";
import { fetchTextContent } from './entryDataHandler.js';

export function hideLoadingScreen(loaderTimeout) {
    const loadingScreen = document.getElementById("load");
    setTimeout(() => {
        loadingScreen.classList.add("hidden");
    }, loaderTimeout);
}

// Function to determine if the user is on mobile
export function isMobileDevice() {
    return window.innerWidth < 768; // Adjust breakpoint if needed
}

export async function appendAbout(entriesContainer) {
    const isMobile = isMobileDevice();
    const aboutEntry = document.createElement("div");
    aboutEntry.classList.add("about");
    if(!isMobile){
        aboutEntry.classList.add("entry");
    }

    const textData = await fetchTextContent();
    
    aboutEntry.innerHTML = `
    
        <p class="intro">
            <img id="stamp" src="images/wordbyword.png" />
            ${textData.about.map(text => `${text}<br><br>`).join('')}
            <span class="ps">P.S. Project by <a href="https://kalyanitupkary.com/">yours truly</a>, with the website brought to life by <a href="https://realnice.net/">Jon Packles.</a></span>

        </p>
    `;
    

    if (isMobile) {
        aboutEntry.classList.add("mNavContent");
        document.querySelector("#mNavAbout").appendChild(aboutEntry);
        addClock(aboutEntry.children[0], true);
    } else {
        entriesContainer.prepend(aboutEntry);
        addClock(aboutEntry, false);
    }
}

export async function appendSuggest(entriesContainer) {
    const isMobile = isMobileDevice();
    const suggestEntry = document.createElement("div");
    suggestEntry.classList.add("suggest");
    if(!isMobile){
        suggestEntry.classList.add("entry");
    }

    const textData = await fetchTextContent();
    

    suggestEntry.innerHTML = `
        <div class="suggest-content">
            <p class="suggest-text">
                ${textData.suggest[0]}
            </p>
            <form class="suggest-form" id="suggestForm">
                <div class="form-group">
                    <label for="name">name</label>
                    <input type="text" id="name" name="name" />
                </div>
                <div class="form-group">
                    <label for="email">email</label>
                    <input type="email" id="email" name="email" />
                </div>
                <div class="form-group">
                    <label for="wordDetails">words about the word</label>
                    <textarea id="word-details" name="wordDetails" required></textarea>
                </div>
                <button type="submit">Submit</button>
    
            </form>
        </div>
    `;

    if (isMobile) {
        suggestEntry.classList.add("mNavContent");
        document.querySelector("#mNavSuggest").appendChild(suggestEntry);
    } else {
        entriesContainer.appendChild(suggestEntry);
    }
}


export  function updateNavHightlight(el){
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