import fs from 'fs';
import {prettyFactory} from 'pino-pretty'

export async function getLogs() {
    const pretty = prettyFactory({
        colorize: true,
        singleLine: true
    });

    let maxLogs = 1000;

    const rawLogs = fs.readFileSync('./data-temp/main.log', 'utf-8');
    const logEntries = rawLogs
        .split('\n')
        .filter(Boolean);

    const limitedLogs = logEntries.slice(-maxLogs);

    return limitedLogs
        .map(log => pretty(log))
        .join('');
}
