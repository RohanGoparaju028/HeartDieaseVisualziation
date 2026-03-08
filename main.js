const fs = require('fs');
const d3 = require('d3');
const tf = require('@tensorflow/tfjs');
function GetData(file) {
    const csv = fs.readFileSync(file,'utf-8');
    const data = d3.csvParse(csv);
    const exclude = ["id","Heart Diease"];
    let features = data.map(row => {
        const feature = {};
        Object.keys(row).forEach(key => {
            if(!exclude.includes(key)) {
                feature[key] = +row[key];
            }
        })
        return Object.values(feature);
    });
    let label = data.map(d => d["Heart Diease"] == "Presence" ? 1 : 0);
    let X = tf.tensor2d(features);
    let y = tf.tensor1d(label);
    console.log(X.shape);
    console.log(y.shape);
    return {X,y};
}
function main(){
    const file = "HeartDieaseData.csv"
    if(!fs.existsSync(file)) {
        console.log("csv file  does not exist in the current directory");
        process.exit(1);
    }
    let {X,y} =  GetData(file);
    console.log(X);
    console.log(y);
}
main()
