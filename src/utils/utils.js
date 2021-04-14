export const getCanvasDimensions = () => {
  if (window.innerWidth > 1023) {
    return { width: 900, height: 642 };
  }
  if (window.innerWidth > 767) {
    return { width: 600, height: 642 };
  }
  if (window.innerWidth > 480) {
    return { width: 400, height: 580 };
  }
  return { width: 200, height: 580 };
};

export const isElectron = () => {
  // Renderer process
  if (
    !!window &&
    typeof window.process === 'object' &&
    window.process.type === 'renderer'
  ) {
    return true;
  }

  // Main process
  if (
    !!process &&
    typeof process.versions === 'object' &&
    !!process.versions.electron
  ) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  ) {
    return true;
  }

  return false;
};
