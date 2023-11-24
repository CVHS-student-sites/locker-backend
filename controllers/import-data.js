import fs from 'fs';
import { parse } from 'csv-parse';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const convertStringValuesToNumbers = (obj) => {
    const result = {};
    result.Num = parseInt(obj.Num);
    result.Location = {
        Building: parseFloat(obj.Building),
        TopBottom: obj.TopBottom === 'bottom' ? 0 : 1,
        Floor: parseFloat(obj.Floor),
        X: parseFloat(obj.X),
        Y: parseFloat(obj.Y),
    };
    return result;
};

const processFile = async () => {
    const records = [];
    const parser = fs
        .createReadStream(`${__dirname}/l.csv`)
        .pipe(parse({
            columns: true,
            bom: true,
        }));

    for await (const record of parser) {
        records.push(record);
    }

    return records;
};

const records = await processFile();
const convertedData = records.map(convertStringValuesToNumbers);

console.log(convertedData);
