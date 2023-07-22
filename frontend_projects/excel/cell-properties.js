// storage
let sheetDB = [];

for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < cols; j++) {
        let cellProp = {
            bold: false,
            italic: false,
            underline: false,
            alignment: "left",
            fontFamily: "monospace",
            fontSize: "14",
            fontColor: "#000000",
            bgColor: "#ecf0f1"
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}

// Selectors for cell properties
let bold = document.querySelector('.bold')
let italic = document.querySelector('.italic')
let underline = document.querySelector('.underline')
let fontSize = document.querySelector('.font-size-prop')
let fontFamily = document.querySelector('.font-family-prop')
let fontColor = document.querySelector('.font-color-prop')
let bgColor = document.querySelector('.bg-color-prop')
let alignment = document.querySelectorAll('.alignment')
let leftAlign = alignment[0]
let centerAlign = alignment[1]
let rightAlign = alignment[2]

let activeColProp = "#d1d8e0";
let inactiveColProp = "#ecf0f1";

// two-way binding

// attach property listeners
bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    // modification
    cellProp.bold = !cellProp.bold; // data change
    cell.style.fontWeight = cellProp.bold ? 'bold' : 'normal'; // UI change 1
    bold.style.backgroundColor = cellProp.bold ? activeColProp : inactiveColProp;
})
italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    // modification
    cellProp.italic = !cellProp.italic; // data change
    cell.style.fontStyle = cellProp.italic ? 'italic' : 'normal'; // UI change 1
    italic.style.backgroundColor = cellProp.italic ? activeColProp : inactiveColProp;
})


underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    // modification
    cellProp.underline = !cellProp.underline; // data change
    cell.style.textDecoration = cellProp.underline ? 'underline' : 'none'; // UI change 1
    underline.style.backgroundColor = cellProp.underline ? activeColProp : inactiveColProp;
})

fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    //modification
    cellProp.fontSize = fontSize.value; // data change
    cell.style.fontSize = cellProp.fontSize + "px"; // UI change 1
})

fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    //modification
    cellProp.fontFamily = fontFamily.value; // data change
    cell.style.fontFamily = cellProp.fontFamily; // UI change 1
})

fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    //modification
    cellProp.fontColor = fontColor.value; // data change
    cell.style.color = cellProp.fontColor; // UI change 1
    fontColor.value = cellProp.fontColor;
})

bgColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    //modification
    cellProp.bgColor = bgColor.value; // data change
    cell.style.background = cellProp.bgColor; // UI change 1
    bgColor.value = cellProp.bgColor;

})

alignment.forEach((elem) => {
    elem.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = activeCell(address);
        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue
        cell.style.textAlign = cellProp.alignment;
        switch (alignValue) {
            case "left":
                leftAlign.style.backgroundColor = activeColProp;
                centerAlign.style.backgroundColor = inactiveColProp;
                rightAlign.style.backgroundColor = inactiveColProp;

                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColProp;
                centerAlign.style.backgroundColor = activeColProp;
                rightAlign.style.backgroundColor = inactiveColProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColProp;
                centerAlign.style.backgroundColor = inactiveColProp;
                rightAlign.style.backgroundColor = activeColProp;
                break;
        }


    })
})

let allCells = document.querySelectorAll('.cell')
for (let i = 0; i < allCells.length; i++) {
    addListenerToAttachCellProp(allCells[i]);
}

function addListenerToAttachCellProp(cell) {
    cell.addEventListener('click', (e) => {
        let address = addressBar.value;
        let [rid, cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];
        //apply cell properties
        cell.style.fontWeight = cellProp.bold ? 'bold' : 'normal'; // UI change 1
        cell.style.fontStyle = cellProp.italic ? 'italic' : 'normal'; // UI change 1
        cell.style.textDecoration = cellProp.underline ? 'underline' : 'none'; // UI change 1
        cell.style.fontSize = cellProp.fontSize + "px"; // UI change 1
        cell.style.fontFamily = cellProp.fontFamily; // UI change 1
        cell.style.color = cellProp.fontColor; // UI change 1
        cell.style.background = cellProp.bgColor; // UI change 1
        switch (cellProp.alignment) {
            case "left":
                leftAlign.style.backgroundColor = activeColProp;
                centerAlign.style.backgroundColor = inactiveColProp;
                rightAlign.style.backgroundColor = inactiveColProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColProp;
                centerAlign.style.backgroundColor = activeColProp;
                rightAlign.style.backgroundColor = inactiveColProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColProp;
                centerAlign.style.backgroundColor = inactiveColProp;
                rightAlign.style.backgroundColor = activeColProp;
                break;
        }

        bold.style.backgroundColor = cellProp.bold ? activeColProp : inactiveColProp;
        italic.style.backgroundColor = cellProp.italic ? activeColProp : inactiveColProp;
        underline.style.backgroundColor = cellProp.underline ? activeColProp : inactiveColProp;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        fontColor.value = cellProp.fontColor;
        bgColor.value = cellProp.bgColor;
    })
}
function activeCell(address) {
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    // access cell and storage object
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
    // address > 'A1'
    let rid = Number(address.slice(1)) - 1;
    let cid = Number(address.charCodeAt(0)) - 65;
    return [rid, cid];
}