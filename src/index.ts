import net from 'net';
import { createInterface } from 'readline';

const server = process.argv[2];
const port = parseInt(process.argv[3]);
const userInput = process.argv.slice(5);
const loggingLevel = process.argv[4];

enum LogLevel {
    INFO,
    WARN,
    ERROR,
}
function stringToLogLevel(level: string): LogLevel {
    if (!level) {
        return LogLevel.WARN;
    }
    switch (level.toUpperCase()) {
        case 'INFO':
            return LogLevel.INFO;
        case 'WARNING':
            return LogLevel.WARN;
        case 'SEVERE':
            return LogLevel.ERROR;
        default:
            return LogLevel.WARN;
    }
}

const logLevel: LogLevel = stringToLogLevel(loggingLevel);

function logMessage(level: LogLevel, message: string) {
    if (level >= logLevel) {
        console.log(message);
    }
}

logMessage(LogLevel.INFO, `Connecting to server: ${server} on port: ${port}`);
const socket: net.Socket = net.createConnection({ host: server, port }, () => {
    logMessage(LogLevel.INFO, 'Connected to server');

    userInput.forEach((input: string) => {
        socket.write(input + '\n');
    });

    const rl = createInterface(process.stdin, process.stdout);
    rl.on('line', (input: string) => {
        socket.write(input + '\n');
    });
});

socket.setEncoding('utf-8');

socket.on('data', (data: string) => {
    process.stdout.write(data);
});

socket.on('error', (err: Error) => {
    logMessage(LogLevel.ERROR, `\nError connecting to server: ${err}`);
});

socket.on('close', () => {
    logMessage(LogLevel.INFO, '\nExiting client');
});
