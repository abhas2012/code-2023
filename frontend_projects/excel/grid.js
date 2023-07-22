let rows = 100;
let cols = 26;

let addressColContainer = document.querySelector('.address-col-container')
let addressRowContainer = document.querySelector('.address-row-container')
let cellsContainer = document.querySelector('.cells-container')
let addressBar = document.querySelector('.address-bar');

for (let i = 0; i < rows; i++) {
    let addressCol = document.createElement("div")
    addressCol.setAttribute('class', 'address-col')
    addressCol.innerText = i + 1;
    addressColContainer.appendChild(addressCol)
}

for (let i = 0; i < cols; i++) {
    let addressRow = document.createElement("div")
    addressRow.setAttribute('class', 'address-row')
    addressRow.innerText = String.fromCharCode(65 + i);
    addressRowContainer.appendChild(addressRow)
}

for (let i = 0; i < rows; i++) {
    let rowContainer = document.createElement('div')
    rowContainer.setAttribute('class', 'row-container')
    for (let j = 0; j < cols; j++) {
        let cell = document.createElement('div')
        cell.setAttribute('class', 'cell');
        cell.setAttribute('contenteditable', "true");
        // attributes for cell and storage identification
        cell.setAttribute('rid',i);
        cell.setAttribute('cid',j);
        cell.setAttribute('spellcheck',"false");
        rowContainer.appendChild(cell);
        addListenerForAddressBarDisplay(cell, i, j);
    }
    cellsContainer.appendChild(rowContainer);
}

function addListenerForAddressBarDisplay(cell, i, j) {
    cell.addEventListener("click", (e) => {
        let rowID = i + 1;
        let colID = String.fromCharCode(65 + j)
        addressBar.value = `${ colID }${ rowID }`
    })
}
// By default click on first cell via DOM
let firstCell = document.querySelector('.cell');
firstCell.click()