// storage
let sheetDB = [];

for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < cols; j++)
    {
        let cellProp = {
            bold:false,
            italic:false,
            underline:false,
            alignment:"left",
            fontFamily:"monospace",
            fontSize:"14",
            fontColor:"#000000",
            bgColor:"#000000" 
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}