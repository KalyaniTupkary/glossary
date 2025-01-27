import { addClock } from "./clock.js";

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

export function appendAbout(entriesContainer) {
    const isMobile = isMobileDevice();
    const aboutEntry = document.createElement("div");
    aboutEntry.classList.add("about");
    if(!isMobile){
        aboutEntry.classList.add("entry");
    }

    aboutEntry.innerHTML = `
        <p class="intro">
            <img id="stamp" src="images/wordbyword.png" />
            Dear reader,<br><br>
            More than what we can do with words, this glossary uncovers what words can do with us. 
            These words give form to the nuanced phenomena we encounter—leaky sensations, feelings, 
            in-between moments, and fleeting experiences that can be named but don’t seem to be.
            <br><br>
            We all have these textured experiences of time, but a rather limited set of words to describe them. 
            There are gaping holes in the lexicon of time that we don’t even know we are missing. 
            When these experiences remain unnamed, they remain unwritten, undefined and hence unknown.
            <br><br>
            To name them, I tinkered with ChatGPT, feeding it elusive experiences as prompts. 
            What began as a playful experiment soon drew on AI’s ability to ‘hallucinate’ or imagine notions 
            beyond our known reality to deepen our understanding of time. 
            <br><br>
            Peruse it slowly,<br>
            Kalyani
            <br><br>
            <span class="ps">P.S.</span> Project by yours truly, with the website brought to life by Jon Packles.
        </p>
    `;


    

    if (isMobile) {
        aboutEntry.classList.add("mNavContent");
        document.querySelector("#mNavAbout").appendChild(aboutEntry);
    } else {
        entriesContainer.prepend(aboutEntry);
        addClock(aboutEntry.children[0]);

    }
}

export function appendSuggest(entriesContainer) {
    const isMobile = isMobileDevice();
    const suggestEntry = document.createElement("div");
    suggestEntry.classList.add("suggest");
    if(!isMobile){
        suggestEntry.classList.add("entry");
    }

    suggestEntry.innerHTML = `
        <div class="suggest-content">
            <p class="suggest-text">
                Words can render new realities and expand our perception of time. 
                Share your experiences—specific or vague—that might otherwise fall through the cracks of conventional language.
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
