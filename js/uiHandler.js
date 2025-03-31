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
            More than what we can do with words, this glossary uncovers what words can do with us. These words give form to the unexplored nooks of everyday life—leaky sensations, fleeting feelings, in-between moments, and nuanced experiences that can be named but don’t seem to be.
            <br><br>
            We carry textured experiences of time, yet our vocabulary for them is surprisingly sparse. There are gaping holes in the lexicon of time that we don’t even realize we are missing. When these encounters remain unnamed, they remain unknown.

            <br><br>
            To name them, I tinkered with AI tools (ChatGPT, Gemini and Claude) feeding them elusive experiences as prompts. What began as a playful experiment soon drew on AI’s ability to ‘hallucinate’ or imagine notions beyond the world we know. Each new word unearthed worlds within our world.
            <br><br>
            Word by word,<br>
            Kalyani
            <br><br>
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
                This glossary offers ways of ‘feeling’ time and more importantly, naming what we feel - which is fundamental to sense-making. Share your encounters—specific or vague—that might otherwise slip through the weave of language.
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