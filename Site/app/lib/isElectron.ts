export default function isElecton() {
    // Detect the renderer process, but only if nodeIntegration is enabled, because it injects the global `process` variable to the `window` object
    if (
        typeof window !== "undefined" &&
        typeof window.process === "object" &&
        window.process.type === "renderer"
    ) {
        return true;
    }

    // This method is browser specific, so we need to check that `window` and `navigator` are available
    if (
        typeof navigator === "object" &&
        typeof navigator.userAgent === "string" &&
        navigator.userAgent.indexOf("Electron") >= 0
    ) {
        return true;
    }

    return false;
}
