export function initializeMobileNav() {
    let container = document.querySelector('.container');

    let aboutNavItem = createNavItem('Incomplete Glossary of Time', 'mNavAbout');
    let suggestNavItem = createNavItem('Suggest a word', 'mNavSuggest');

    let overlay = document.createElement('div');
    overlay.id = 'mobileOverlay';
    overlay.addEventListener('click', () => closeMobileNav());

    document.querySelector('body').appendChild(overlay);

    container.appendChild(aboutNavItem);
    container.appendChild(suggestNavItem);
  
}

function createNavItem(text, id){
    let navItem = document.createElement('div');
    let navHeader = document.createElement('h3');
    let closeIcon = document.createElement('img');
    closeIcon.src = '../images/close.svg';
    closeIcon.alt = 'Close';
    closeIcon.classList.add('closeIcon');
    closeIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        closeMobileNav();
    });
    
    navItem.appendChild(closeIcon);
    navItem.appendChild(navHeader);
    navItem.id = id;
    navHeader.textContent = text;
    navItem.classList.add('mobileNavItem');
    navItem.addEventListener('click', () => openMobileNav(navItem));
    
    return navItem;
}

function openMobileNav(el) {
    if (!el.classList.contains("open")) {

        document.querySelectorAll('.mobileNavItem.open').forEach(item => {
            item.classList.remove('open');
        });

        document.getElementById('mobileOverlay').classList.add('showOverlay');
        document.getElementById('mobileOverlay').pointerEvents = 'auto';

        el.style.pointerEvents = 'auto';
        el.classList.add("open");
    }
}

function closeMobileNav() {
    let overlay = document.getElementById('mobileOverlay');
    

    document.querySelector('.mobileNavItem.open').classList.remove('open');
    overlay.classList.remove('showOverlay');
    document.body.style.pointerEvents = 'auto';
    document.getElementById('mobileOverlay').removeEventListener('click', closeMobileNav());
}
