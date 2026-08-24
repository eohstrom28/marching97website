let lastKey = null;

document.addEventListener("keydown", (event) => {
    lastKey = event.key;
});

const parents = document.querySelectorAll(".has-dropdown");
let lastExpanded = null;
let lastCollapsed = null;
let aboutOpen = false;
let meetOpen = false;
let membersOpen = false;

const expand = (parent) => {
    // prevent trying to expand an already expanded dropdown
    if (parent.dataset.expanded === "true") {
        return;
    }

    const dropdown = parent.querySelector("ul");
    const button = parent.querySelector("button");
    const triangle = parent.querySelector("p");
    lastExpanded = parent;

    // show to screenreaders since dropdown was expanded
    dropdown.setAttribute("aria-hidden", "false");
    // let screenreaders know that we've expanded the dropdown
    button.setAttribute("aria-expanded", "true");
    parent.dataset.expanded = "true";
    dropdown.style.visibility = "visible";

    // display dropdown if its display was previously set to none by smaller screen size
    if (dropdown.style.display === "none") {
        dropdown.style.display = "flex";
    }

    if (document.activeElement !== document.querySelector("body") && lastKey !== null) {
        // focus on the first dropdown element if using keyboard
        dropdown.querySelector("a", "p").focus();
    }
    
    // flip the expand/collapse triangle icon
    if (!triangle.classList.contains("meet") || triangle.classList.contains("vertical")) {
        triangle.style.transform = "scaleY(-1)";
    }
    else {
        triangle.style.transform = "scaleX(-1)";
    }

    if (button.classList.contains("meet")) {
        meetOpen = true;
    }
    else if (button.classList.contains("about")) {
        aboutOpen = true;
    }
    else {
        membersOpen = true;
    }
};

const collapse = (parent) => {
    const dropdown = parent.querySelector("ul");
    const button = parent.querySelector("button");
    const triangle = parent.querySelector("p");
    let lastExpanded = null;

    if (document.activeElement !== document.querySelector("body") && lastKey !== null) {
        // focus back on the button if using keyboard
        button.focus();
    }
    // hide from screenreaders since we've collapsed the dropdown
    dropdown.setAttribute("aria-hidden", "true");
    // let screenreaders know we've collapsed the dropdown
    button.setAttribute("aria-expanded", "false");
    parent.dataset.expanded = "false";
    dropdown.style.visibility = "hidden";

    // don't display dropdown if screen size is small enough
    if (window.innerWidth < 732) {
        dropdown.style.display = "none";
    }

    // flip the expand/collapse triangle icon back to normal
    if (triangle.className !== "meet" || triangle.classList.contains("vertical")) {
        triangle.style.transform = "scaleY(1)";
    }
    else {
        triangle.style.transform = "scaleX(1)";
    }

    if (button.classList.contains("meet")) {
        meetOpen = false;
        lastCollapsed = "meet";
    }
    else if (button.classList.contains("about")) {
        aboutOpen = false;
        lastCollapsed = "about"
    }
    else {
        membersOpen = false;
        lastCollapsed = "members"
    }

    // necessary if using both keyboard and mouse
    if ((aboutOpen == false) && meetOpen) {
        // collapse Meet the Band since About has been collapsed (sub-dropdown shouldn't remain open)
        let meet = document.querySelector(".has-dropdown.meet");
        collapse(meet);
    }

    if (aboutOpen && (meetOpen == false)) {
        // set lastExpanded to About if About is still expanded and we collapsed Meet the Band
        lastExpanded = document.querySelector("li.has-dropdown.about");
    }
};

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lastExpanded) {
        collapse(lastExpanded);

        if (aboutOpen && (meetOpen == false)) {
            // set lastExpanded to About if About is still expanded
            lastExpanded = document.querySelector("li.has-dropdown.about");
        }
    }

    if (event.key === "Tab") {        
        // no dropdown is currently expanded, so ignore this event
        if (!lastExpanded) {
            return;
        }

        const dropdown = lastExpanded.querySelector("ul");
        // the element currently focused on
        const focusedEl = lastExpanded.querySelector(":focus");
        // the first focusable element within the current dropdown
        const firstFocusableEl = lastExpanded.querySelector("ul li a");
        // the last focusable element within the current dropdown
        let lastFocusableEl = dropdown.lastElementChild.querySelector("a");

        // update lastFocusableEl for About to be the Meet the Band button so it collapses if Meet the Band isn't expanded
        if (lastExpanded.classList.contains("about")) {
            lastFocusableEl = dropdown.querySelector("button.meet");
        }

        // tell keyboard users they've exited the dropdown by collapsing it and focusing on the button
        if (!event.shiftKey && focusedEl === lastFocusableEl) {
            event.preventDefault();
            collapse(lastExpanded);

            if (aboutOpen && (meetOpen == false)) {
                // set lastExpanded to About if About is still expanded
                lastExpanded = document.querySelector("li.has-dropdown.about");
            }

            return;
        }

        // tell keyboard users they've reached the end of the dropdown by collapsing it and focusing on the button
        if (event.shiftKey && focusedEl === firstFocusableEl) {
            event.preventDefault();
            collapse(lastExpanded);
            
            if (aboutOpen && (meetOpen == false)) {
                // set lastExpanded to About if About is still expanded
                lastExpanded = document.querySelector("li.has-dropdown.about");
            }

            return;
        }
    }
});

parents.forEach((parent) => {
    const button = parent.querySelector("button");
    
    // for mouse-accessibility
    button.addEventListener("click", (event) => {
        // expand the dropdown if it's not currently expanded
        if (button.ariaExpanded === "false") {
            expand(parent);
        }
        // otherwise collapse the dropdown
        else {
            collapse(parent);
        }
    });

    parent.addEventListener("mouseenter", () => {
        if (window.innerWidth >= 732) {
            expand(parent);
        }
    });

    parent.addEventListener("mouseleave", () => {
        if (window.innerWidth >= 732) {
            collapse(parent);
        }
    });

    // for keyboard-accessibility
    button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            // expand the dropdown if it's not currently expanded
            if (button.ariaExpanded === "false") {
                expand(parent);
            }
            // otherwise collapse the dropdown
            else {
                collapse(parent);
            }
        }
    });

    const subMenuTabs = parent.querySelectorAll("ul a, ul p button");
    if (subMenuTabs.length) {
        let lastTab = subMenuTabs[subMenuTabs.length - 1];

        // if we're in the About dropdown, lastTab should be the Meet the Band button, not the last rank
        if (parent.classList.contains("about")) {
            lastTab = document.querySelector("button.meet");
        }

        // prevent the default action if the user hits Tab on the last element (keep it from going to the next item)
        lastTab.addEventListener("keydown", (event) => {
            if (event.key === "Tab" && !event.shiftKey) {
                event.preventDefault();
            }
        });
    }    
});

const aboutMenu = document.querySelector(".has-dropdown.about");
const aboutDropdown = document.querySelector(".hide-about");
const meetMenu = document.querySelector(".has-dropdown.meet");
const meetDropdown = document.querySelector(".hide-meet");
const membersMenu = document.querySelector(".has-dropdown.members");
const membersDropdown = document.querySelector(".hide-members");
const meetTriangle = document.querySelector("p.meet");
let prevWidth = window.innerWidth;
let timer;

const nav = document.querySelector("nav");
const mainLinks = document.querySelector("nav ul");
const hamburger = document.querySelector(".hamburger");

const toggleHamburger = () => {
    if (hamburger.ariaExpanded === "true") {
        mainLinks.style.display = "none";
        // hide links from screen readers
        mainLinks.setAttribute("aria-hidden", "true");

        nav.style.justifyContent = "space-between";
        nav.style.alignItems = "center";
        nav.style.padding = "10px";

        hamburger.setAttribute("aria-expanded", "false");
        
        // collapse all dropdowns
        if (aboutOpen) {
            collapse(aboutMenu);
        }

        if (meetOpen) {
            collapse(meetMenu);
        }

        if (membersOpen) {
            collapse(membersMenu);
        }
    }
    else {
        mainLinks.style.display = "flex";
        // show links to screen readers
        mainLinks.setAttribute("aria-hidden", "false");

        nav.style.justifyContent = "center";
        nav.style.alignItems = "flex-start";

        hamburger.setAttribute("aria-expanded", "true");
    }
};

window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        return;
    }, 1000);

    // adjust navbar if screen width is changed from horizontal to vertical
    if (window.innerWidth < 732 && prevWidth >= 732) {
        // keep the current dropdown open, even if the screen size shrinks
        if (!aboutOpen) {
            aboutDropdown.style.display = "none";
        }

        if (!meetOpen) {
            meetDropdown.style.display = "none";
        }

        if (!membersOpen) {
            membersDropdown.style.display = "none";
        }

        // have the triangle point down instead of to the right
        meetTriangle.innerHTML = " &#9660";
        meetTriangle.classList.add("vertical");

        // flip it if the dropdown is expanded
        if (meetOpen) {
            meetTriangle.style.transform = "scaleY(-1)";
        }

        mainLinks.style.display = "flex";

        nav.style.flexDirection = "column";
        nav.style.justifyContent = "center";
        nav.style.padding = "10px 0";

        // show hamburger button to screen readers
        hamburger.setAttribute("aria-hidden", "false");
        hamburger.setAttribute("aria-expanded", "true");
    }
    // adjust navbar if screen width is changed from vertical to horizontal
    else if (window.innerWidth >= 732 && prevWidth < 732) {
        // collapse all other menus except last expanded
        if (lastExpanded === aboutMenu) {
            if (meetOpen) {
                collapse(meetMenu);
            }

            if (membersOpen) {
                collapse(membersMenu);
            }
        }
        else if (lastExpanded === meetMenu) {
            if (membersOpen) {
                collapse(membersMenu);
            }
        }
        else if (lastExpanded === membersMenu) {
            if (aboutOpen) {
                collapse(aboutMenu);
            }

            if (meetOpen) {
                collapse(meetMenu);
            }
        }

        // have the triangle point to the right instead of down
        meetTriangle.innerHTML = " &#9654 ";
        meetTriangle.classList.remove("vertical");

        // flip it if the dropdown is expanded
        if (meetOpen) {
            meetTriangle.style.transform = "scaleX(-1)";
        }

        mainLinks.style.display = "flex";
        // show links to screen readers
        mainLinks.setAttribute("aria-hidden", "false");

        nav.style.flexDirection = "row";
        nav.style.justifyContent = "space-between";
        nav.style.padding = "10px";

        // hide hamburger button from screen readers
        hamburger.setAttribute("aria-hidden", "true");
        hamburger.setAttribute("aria-expanded", "true");
    }

    prevWidth = window.innerWidth;
});

// hide all dropdowns if the navbar is loaded vertically
if (window.innerWidth < 732) {
    aboutDropdown.style.display = "none";
    meetDropdown.style.display = "none";
    membersDropdown.style.display = "none";

    // show hamburger button to screen readers
    hamburger.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
    // start with links hidden
    toggleHamburger();

    // have the triangle point down instead of to the right
    meetTriangle.innerHTML = " &#9660";
    meetTriangle.classList.add("vertical");
}

hamburger.addEventListener("click", () => {
    toggleHamburger();
});

hamburger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleHamburger();
    }
});