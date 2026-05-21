const lis = document.querySelectorAll("li");

const highlight = (item) => {
    item.style.backgroundColor = "#745943";
    item.style.color = "white";
    item.style.textDecoration = "underline";
};

const unhighlight = (item) => {
    item.style.backgroundColor = "white";
    item.style.textDecoration = "none";
    if (item.className !== "current") {
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

    let paras = item.querySelectorAll("p");
    paras.forEach((para) => {
        para.addEventListener("focus", () => {
            highlight(item);
        });

        para.addEventListener("blur", () => {
            unhighlight(item);
        });
    });

    let links = item.querySelectorAll("a");
    links.forEach((link) => {
        link.addEventListener("focus", () => {
            highlight(item);
        })
        link.addEventListener("blur", () => {
            unhighlight(item);
        })
    })
});


const parents = document.querySelectorAll(".has-dropdown");
let lastExpanded = null;
let aboutOpen = false;
let meetOpen = false;

const expand = (parent) => {
    const dropdown = parent.querySelector("ul");
    const button = parent.querySelector("button");
    lastExpanded = parent;

    dropdown.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    parent.dataset.expanded = "true";
    dropdown.style.visibility = "visible";
    dropdown.querySelector("a", "p").focus();
    
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
    lastExpanded = null;

    dropdown.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    parent.dataset.expanded = "false";
    dropdown.style.visibility = "hidden";
    button.focus();
    button.style.rotate = "0deg";

    if (button.className !== "meet") {
        button.style.transform = "scaleY(1)";
    }
    else {
        button.style.transform = "scaleX(1)";
    }

    if (button.className === "meet") {
        meetOpen = false;
    }
    else if (button.className === "about") {
        aboutOpen = false;
    }

    if ((aboutOpen == false) && meetOpen) {
        // close meet
        let meet = document.querySelector(".has-dropdown.meet");
        collapse(meet);
    }

    if (aboutOpen && (meetOpen == false)) {
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

    const subMenuTabs = parent.querySelectorAll("ul a", "ul button");
    if (subMenuTabs.length) {
        const lastTab = subMenuTabs[subMenuTabs.length - 1];
        lastTab.addEventListener("keydown", (event) => {
            if (event.key === "Tab" && !event.shiftKey) {
                event.preventDefault();
                button.focus();
                collapse(lastExpanded);
            }
        });
    }    
});