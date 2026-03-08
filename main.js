const fs = require('fs');
const d3 = require('d3');
function GetData(file) {
    const csv = fs.readFileSync(file,'utf-8');
    const data = d3.csvParse(csv);

}
function main(){
    const file = "HeartDieaseData.csv"
    if(!fs.existsSync(file)) {
        console.log("csv file  does not exist in the current directory");
        process.exit(1);
    }
    GetData(file);
}
main()
