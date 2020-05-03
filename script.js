const toggleClass = (el, className) => {
    const currentClass = el.getAttribute('class');
    const reg = RegExp(className);
    if (reg.test(currentClass)) {
        el.setAttribute('class', currentClass.replace(' ' + className, ''));
    }
    else {
        el.setAttribute('class', currentClass.concat(' ' + className));
    }
}

const clickResult = () => {
    document.querySelector('.result.ess-current .result-title, .pagination-button.ess-current').click();
}

const selectResult = (direction) => {
    toggleClass(currentSelection, 'ess-current');
    currentIndex += direction;
    currentSelection = selectables[currentIndex];
    toggleClass(currentSelection, 'ess-current');

    if (currentIndex !== 0) {
        const rect = currentSelection.getBoundingClientRect();
        const yOffset = window.pageYOffset;
        if (direction === 1) {
            if (/pagination-button/.test(currentSelection.getAttribute('class'))) {
                const targetY = yOffset + document.querySelector('.pagination').getBoundingClientRect().top;
                window.scrollTo(0, targetY);
            }
            else {
                const clientHeight = document.documentElement.clientHeight;
                const targetY = (yOffset + rect.top) - (clientHeight - rect.height) + 10;
                if (targetY > yOffset || rect.top < 0) {
                    window.scrollTo(0, targetY);
                }
            }
        }
        else if (direction === -1) {
            const targetY = yOffset + rect.top - 10;
            if (targetY < yOffset || yOffset < rect.top) {
                window.scrollTo(0, targetY);
            }
        }
    }
    else {
        window.scrollTo(0, 0);
    }
}

const focusSearchBox = (e) => {
    searchBox.focus();
    searchBox.setSelectionRange(-1, -1);
    e.preventDefault();
}

const moveFocus = (e) => {
    const code = e.keyCode;

    let command;
    if (/13/.test(code)) command = 'enter';   // => 13: [Enter]
    if (/74|40/.test(code)) command = 1;      // => 74: [j], 40: [↓]
    if (/75|38/.test(code)) command = -1;     // => 75: [k], 38: [↑]
    if (/191/.test(code)) command = 'search'; // => 191: [/]
    
    switch(command) {
        case 'enter':
            clickResult();
        break;

        case 1:
        case -1:
            e.preventDefault();
            if (command === 1 && currentIndex + 1 < selectableCounts) {
                selectResult(1);
            }
            if (command === -1 && currentIndex + 1 > 1) {
                selectResult(-1);
            }
        break;

        case 'search': // => /検索ボックス
            focusSearchBox(e);
        break;

        default:
        break;
    }
}

const searchBox = document.querySelector('[name="q"]');
const selectables = document.querySelectorAll('.card-web > .result, .pagination-button.enabled');
const selectableCounts = selectables.length;
let currentIndex = 0;
let currentSelection = selectables[currentIndex];

toggleClass(currentSelection, 'ess-current');

document.addEventListener('keydown', (e) => {
    if (searchBox === document.activeElement) {
        if (e.keyCode === 27) { // Esc.
            searchBox.blur();
        }
    }
    else {
        moveFocus(e);
    }
});
