const fs = require('fs');
const d3 = require('d3');
const tf = require('@tensorflow/tfjs');
async function GetData(file) {
    const csv = fs.readFileSync(file,'utf-8');
    const data = d3.csvParse(csv);
    let  fulldata = tf.tensor2d(data.map(rows => {
        let features = {};
        Object.keys(rows).forEach(value => {
            features[value] = +rows[value];
        }
        )
        return Object.values(features);
    }));
    fulldata = await Describe(fulldata)
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
async function Describe(fulldata) {
  const isNanMask = tf.isNaN(fulldata);
    const hasNans = isNanMask.any().dataSync()[0];

    if (hasNans) {
        const mean = tf.tidy(() => {
            const zeros = tf.where(isNanMask, tf.zerosLike(fulldata), fulldata);
            const counts = tf.logicalNot(isNanMask).sum(0).cast('float32');
            return zeros.sum(0).div(counts);
        });

        
        const cleanData = tf.where(isNanMask, mean, fulldata);

        const stats = tf.tidy(() => {
            const {mean: m, variance: v} = tf.moments(cleanData, 0);
            return {
                mean: m,
                std: tf.sqrt(v),
                min: cleanData.min(0),
                max: cleanData.max(0)
            };
        });
        console.log("--- Column Statistics ---");
        stats.mean.print(); 
        stats.std.print();
        stats.min.print();
        stats.max.print();

        return cleanData;
    }
    return fulldata
}
function main(){
    const file = "HeartDieaseData.csv"
    if(!fs.existsSync(file)) {
        console.log("csv file  does not exist in the current directory");
        process.exit(1);
    }
    let {X,y} =  GetData(file);
      
}
main()
