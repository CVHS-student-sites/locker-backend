import fs from 'fs';
import {prettyFactory} from 'pino-pretty'
import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function getLogs() {
    console.log(__dirname);

    const pretty = prettyFactory({
        colorize: true,
        singleLine: true
    });

    let maxLogs = 2;

    const rawLogs = fs.readFileSync('./data-temp/main.log', 'utf-8');
    const logEntries = rawLogs
        .split('\n') // Split logs by line
        .filter(Boolean); // Remove any empty lines

    const limitedLogs = logEntries.slice(-maxLogs); // Get the last `maxLogs` entries

    const prettyLogs = limitedLogs
        .map(log => pretty(log)) // Pretty-print each log
        .join(''); // Join them back together

    console.log(prettyLogs);
}
