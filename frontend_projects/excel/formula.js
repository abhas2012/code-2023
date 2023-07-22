for (let i = 0; i < rows; i++) {
    for (j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [cell, cellProp] = getCellandCellProp(address);
            let enteredData = cell.innerText;
            if (enteredData == cellProp.value) return;
            cellProp.value = enteredData;
            // if data modified remove p-c relation, remove formula, update children
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })
    }
}

formulaBar.addEventListener("keydown", (e) => {
    let inputFormula = formulaBar.value
    if (e.key === 'Enter' && inputFormula) {
        let evaluatedValue = evaluateFormula(inputFormula)
        let address = addressBar.value;
        let [cell, cellProp] = getCellandCellProp(address);
        if (inputFormula !== cellProp.formula) {
            removeChildFromParent(cellProp.formula);
        }
        setCellUIandCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);
    }
})

function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellandCellProp(parentAddress);
    let children = parentCellProp.children;
    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellandCellProp(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIandCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, parentCellProp] = getCellandCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula) {

    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, parentCellProp] = getCellandCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);

        }
    }
}
function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = getCellandCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;

        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIandCellProp(evaluatedValue, formula, address) {
    let [cell, cellProp] = getCellandCellProp(address)

    cell.innerText = evaluatedValue; // UI update
    // DB update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;



}