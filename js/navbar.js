let lastKey = null;

const updateLastKey = (event) => {
    lastKey = event.key;
}

document.addEventListener("keydown", updateLastKey);

const lis = document.querySelectorAll("li");

const highlight = (item) => {
    // prevent highlighting an already highlighted element
    if (item.dataset.highlighted === "true") {
        return;
    }

    item.style.backgroundColor = "#745943";
    item.style.textDecoration = "underline";
    item.dataset.highlighted = "true";

    // only recolor if it's not supposed to stay yellow because it's the current page
    if (!(item.classList.contains("current"))) {
        item.style.color = "white";
    }
};

const unhighlight = (item) => {
    // prevent unhighlighting an already unhighlighted element
    if (item.dataset.highlighted === "false") {
        return;
    }

    item.style.backgroundColor = "white";
    item.style.textDecoration = "none";
    item.dataset.highlighted = "false";

    // only recolor if it's not supposed to stay yellow because it's the current page
    if (!(item.classList.contains("current"))) {
        item.style.color = "#2C2440";
    }
}

lis.forEach((item) => {
    let links = item.querySelectorAll("a");
    links.forEach((link) => {
        // for mouse-acessibility
        link.addEventListener("mouseenter", () => {
            highlight(item);
        });

        link.addEventListener("mouseleave", () => {
            unhighlight(item);
        });
        
        // for keyboard-accessibility
        link.addEventListener("focus", () => {
            highlight(item);
        });

        link.addEventListener("blur", () => {
            unhighlight(item);
        });
    });

    let buttons = item.querySelectorAll("button");
    buttons.forEach((button) => {
        // for mouse-accessibility
        button.addEventListener("mouseenter", () => {
            highlight(button.parentElement);
        });
        
        button.addEventListener("mouseleave", () => {
            unhighlight(button.parentElement);
        });

        // for keyboard-accessibility
        button.addEventListener("focus", () => {
            highlight(button.parentElement);
        });

        button.addEventListener("blur", (event) => {
            // FIX: need a mouse equivalent + About should also stay highlighted
            // don't unhighlight a dropdown menu if it's opened
            if ((lastKey !== "Enter" && lastKey !== " ")) {
                unhighlight(button.parentElement);
            }
        });
    });
});


const parents = document.querySelectorAll(".has-dropdown");
let lastExpanded = null;
let lastCollapsed = null;
let aboutOpen = false;
let meetOpen = false;

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
    // focus on the first dropdown element
    dropdown.querySelector("a", "p").focus();
    
    // flip the expand/collapse triangle icon
    if (triangle.className !== "meet") {
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
};

const collapse = (parent) => {
    const dropdown = parent.querySelector("ul");
    const button = parent.querySelector("button");
    const triangle = parent.querySelector("p");
    let lastExpanded = null;

    button.focus();
    // hide from screenreaders since we've collapsed the dropdown
    dropdown.setAttribute("aria-hidden", "true");
    // let screenreaders know we've collapsed the dropdown
    button.setAttribute("aria-expanded", "false");
    parent.dataset.expanded = "false";
    dropdown.style.visibility = "hidden";

    // flip the expand/collapse triangle icon back to normal
    if (triangle.className !== "meet") {
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

// edit to be event listener for navbar only?
document.addEventListener("keydown", (event) => {
    updateLastKey(event);

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
        expand(parent);
    });

    parent.addEventListener("mouseleave", () => {
        collapse(parent);
    });

    // for keyboard-accessibility
    button.addEventListener("keydown", (event) => {
        updateLastKey(event);

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

        // if we're in the About dropdown, lastTab should be the Meet the Band button, not the Rank 13 link
        if (parent.classList.contains("about")) {
            lastTab = document.querySelector("button.meet");
        }

        // prevent the default action if the user hits Tab on the last element (keep it from going to the next item)
        lastTab.addEventListener("keydown", (event) => {
            updateLastKey(event);

            if (event.key === "Tab" && !event.shiftKey) {
                event.preventDefault();
            }
        });
    }    
});