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

formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value
    if (e.key === 'Enter' && inputFormula) {
        let address = addressBar.value;
        let [cell, cellProp] = getCellandCellProp(address);
        if (inputFormula !== cellProp.formula) {
            removeChildFromParent(cellProp.formula);
        }

        addChildToGraphComponent(inputFormula, address)

        // Check formula is cyclic or not, then only evaluate
        // True -> cycle, False -> Not cyclic
        // console.log(graphComponentMatrix);
        let cycleResponse = isGraphCylic(graphComponentMatrix);
        if (cycleResponse) {
            // alert("Your formula is cyclic");
            let response = confirm("Your formula is cyclic. Do you want to trace your path?");
            while (response === true) {
                // Keep on tracking color until user is sartisfied
                await isGraphCylicTracePath(graphComponentMatrix, cycleResponse); // I want to complete full  iteration of color tracking, so I will attach wait here also
                response = confirm("Your formula is cyclic. Do you want to trace your path?");
            }

            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula)


        setCellUIandCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);
    }
})

function addChildToGraphComponent(formula, childAddress) {
    let [childrid, childcid] = decodeRIDCIDFromAddress(childAddress)
    let encodedFormula = formula.split(' ')
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentrid, parentcid] = decodeRIDCIDFromAddress(encodedFormula[i])
            graphComponentMatrix[parentrid][parentcid].push([childrid, childcid]);
        }
    }
}

function removeChildFromGraphComponent(formula, childAddress) {
    let [childrid, childcid] = decodeRIDCIDFromAddress(childAddress)
    let encodedFormula = formula.split(' ')
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentrid, parentcid] = decodeRIDCIDFromAddress(encodedFormula[i])
            graphComponentMatrix[parentrid][parentcid].pop();
        }
    }
}
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