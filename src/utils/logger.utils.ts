const log = (message: string, ...args: any[]) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...args);
};

const error = (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...args);
};

const warn = (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...args);
};

export default {
    log,
    error,
    warn
};