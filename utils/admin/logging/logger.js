import pino from 'pino';

export const logger = pino({
    level: 'debug',
    timestamp: pino.stdTimeFunctions.isoTime
}, pino.transport({
    target: 'pino/file',
    options: {destination: './data-temp/main.log'}
}));
