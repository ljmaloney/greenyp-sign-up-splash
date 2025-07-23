
interface ContainerDetectionOptions {
  containerId: string;
  maxWaitTime?: number;
  checkInterval?: number;
  requireVisible?: boolean;
}

interface ContainerDetectionResult {
  success: boolean;
  container?: HTMLElement;
  error?: string;
  timeElapsed: number;
}

export const detectSquareContainer = async (
  options: ContainerDetectionOptions
): Promise<ContainerDetectionResult> => {
  const {
    containerId,
    maxWaitTime = 10000,
    checkInterval = 200,
    requireVisible = true
  } = options;

  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const check = () => {
      const timeElapsed = Date.now() - startTime;
      
      // Timeout check
      if (timeElapsed > maxWaitTime) {
        resolve({
          success: false,
          error: `Container '${containerId}' detection timeout after ${maxWaitTime}ms`,
          timeElapsed
        });
        return;
      }

      const container = document.getElementById(containerId);
      
      if (!container) {
        console.log(`🔍 Container '${containerId}' not found, retrying... (${timeElapsed}ms)`);
        setTimeout(check, checkInterval);
        return;
      }

      if (!container.isConnected) {
        console.log(`🔍 Container '${containerId}' not connected to DOM, retrying... (${timeElapsed}ms)`);
        setTimeout(check, checkInterval);
        return;
      }

      if (requireVisible && container.offsetParent === null) {
        console.log(`🔍 Container '${containerId}' not visible, retrying... (${timeElapsed}ms)`);
        setTimeout(check, checkInterval);
        return;
      }

      // Additional checks for container readiness
      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
        console.log(`🔍 Container '${containerId}' hidden by CSS, retrying... (${timeElapsed}ms)`);
        setTimeout(check, checkInterval);
        return;
      }

      console.log(`✅ Container '${containerId}' ready (${timeElapsed}ms)`, {
        connected: container.isConnected,
        visible: container.offsetParent !== null,
        dimensions: { width: container.offsetWidth, height: container.offsetHeight }
      });

      resolve({
        success: true,
        container,
        timeElapsed
      });
    };

    // Start checking
    check();
  });
};
