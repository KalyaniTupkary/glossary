export function initializeMobileNav() {
    let container = document.querySelector('.container');

    let aboutNavItem = createNavItem('Incomplete Glossary of Time', 'mNavAbout');
    let suggestNavItem = createNavItem('Suggest a word', 'mNavSuggest');

    container.appendChild(aboutNavItem);
    container.appendChild(suggestNavItem);
  
}

function createNavItem(text, id){
    let navItem = document.createElement('div');
    let navHeader = document.createElement('h3');
    navItem.appendChild(navHeader);
    navItem.id = id;
    navHeader.textContent = text;
    navItem.classList.add('mobileNavItem');
    navItem.addEventListener('click', () => openMobileNav(navItem));
    
    return navItem;
}

function openMobileNav(el) {
    console.log(el);

    if (!el.classList.contains("open")) {
        el.classList.add("open");

        closeButton.classList.remove('hidden');
        console.log(el);

        closeButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent the click from triggering the parent's click event
            el.classList.remove("open");
            closeButton.classList.add('hidden');
            console.log('Close button clicked');
        });
    }
}
