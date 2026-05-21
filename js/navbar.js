const lis = document.querySelectorAll("li");

const highlight = (item) => {
    item.style.backgroundColor = "#745943";

    // FIX: make only a's underlined, not p's
    item.style.textDecoration = "underline";

    if (!(item.classList.contains("current"))) {
        item.style.color = "white";
    }
};

const unhighlight = (item) => {
    item.style.backgroundColor = "white";
    item.style.textDecoration = "none";
    if (!(item.classList.contains("current"))) {
        item.style.color = "#2C2440";
    }
}

lis.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        highlight(item);
    });

    item.addEventListener("mouseleave", () => {
        unhighlight(item);
    });
    
    let links = item.querySelectorAll("a");
    links.forEach((link) => {
        link.addEventListener("focus", () => {
            highlight(item);
        })
        link.addEventListener("blur", () => {
            unhighlight(item);
        })
    });

    let buttons = item.querySelectorAll("button");
    buttons.forEach((button) => {
        button.addEventListener("focus", () => {
            highlight(button.parentElement);
        })
        button.addEventListener("blur", (event) => {
            unhighlight(button.parentElement);
        })
    });
});


const parents = document.querySelectorAll(".has-dropdown");
let lastExpanded = null;
let aboutOpen = false;
let meetOpen = false;
let lastCollapsed = null;

const expand = (parent) => {
    const dropdown = parent.querySelector("ul");
    const button = parent.querySelector("button");
    lastExpanded = parent;

    dropdown.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    parent.dataset.expanded = "true";
    dropdown.style.visibility = "visible";
    dropdown.querySelector("a", "p").focus();
    
    // flip the expand/collapse triangle icon
    if (button.className !== "meet") {
        button.style.transform = "scaleY(-1)";
    }
    else {
        button.style.transform = "scaleX(-1)";
    }

    if (button.className === "meet") {
        meetOpen = true;
    }
    else if (button.className === "about") {
        aboutOpen = true;
    }
};

const collapse = (parent) => {
    const dropdown = parent.querySelector("ul");
    const button = parent.querySelector("button");
    let lastExpanded = null;

    dropdown.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    parent.dataset.expanded = "false";
    dropdown.style.visibility = "hidden";
    button.focus();

    // flip the expand/collapse triangle icon back to normal
    if (button.className !== "meet") {
        button.style.transform = "scaleY(1)";
    }
    else {
        button.style.transform = "scaleX(1)";
    }

    if (button.className === "meet") {
        meetOpen = false;
        lastCollapsed = "meet";
    }
    else if (button.className === "about") {
        aboutOpen = false;
        lastCollapsed = "about"
    }
    else {
        lastCollapsed = "members"
    }

    if ((aboutOpen == false) && meetOpen) {
        // collapse Meet the Band since About has been collapsed
        let meet = document.querySelector(".has-dropdown.meet");
        collapse(meet);
    }

    if (aboutOpen && (meetOpen == false)) {
        // set lastExpanded to About if About is still expanded
        lastExpanded = document.querySelector("li");
    }
};

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lastExpanded) {
        collapse(lastExpanded);
    }
});

parents.forEach((parent) => {
    const button = parent.querySelector("button");
    
    button.addEventListener("click", (event) => {
        if (button.ariaExpanded === "false") {
            expand(parent);
        }
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

    button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (button.ariaExpanded === "false") {
                expand(parent);
            }
            else {
                collapse(parent);
            }
        }
    });

    const subMenuTabs = parent.querySelectorAll("ul a");
    if (subMenuTabs.length) {
        const lastTab = subMenuTabs[subMenuTabs.length - 1];
        lastTab.addEventListener("keydown", (event) => {
            if (event.key === "Tab" && !event.shiftKey) {
                event.preventDefault();
                button.focus();

                // FIX: make this happen for going back to the button too
                
                // only close Meet dropdown after returning to its button, don't close About too
                if (aboutOpen && lastCollapsed !== "meet") {
                    collapse(lastExpanded);
                }
                // always close Members and Meet the Band dropdowns after returning to their buttons
                else if (lastExpanded.classList.contains("members") || lastExpanded.classList.contains("meet")) {
                    collapse(lastExpanded);
                }
            }
        });
    }    
});