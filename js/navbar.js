const parents = document.querySelectorAll(".has-dropdown");
let currentItem = null;

const expand = (parent) => {
    const dropdown = parent.querySelector("ul");
    const button = parent.querySelector("button");
    currentItem = parent;

    dropdown.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    parent.dataset.expanded = "true";
    dropdown.style.visibility = "visible";
    dropdown.querySelector("a", "p").focus();
};

const collapse = (parent) => {
    const dropdown = parent.querySelector("ul");
    const button = parent.querySelector("button");
    currentItem = null;

    dropdown.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    parent.dataset.expanded = "false";
    dropdown.style.visibility = "hidden";
    button.focus();
};

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

    const subMenuTabs = parent.querySelectorAll("ul a", "ul button");
    if (subMenuTabs.length) {
        const lastTab = subMenuTabs[subMenuTabs.length - 1];
        lastTab.addEventListener("keydown", (event) => {
            if (event.key === "Tab" && !event.shiftKey) {
                event.preventDefault();
                button.focus();
            }
        });
    }
});