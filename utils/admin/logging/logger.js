import pino from 'pino';

const transport = pino.transport({
    target: 'pino/file',
    options: {destination: `./data-temp/main.log`},
})
export const logger = pino(transport)