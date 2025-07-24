
import { useEffect, useState } from 'react';

interface ExtensionDetectionResult {
  hasInterference: boolean;
  detectedExtensions: string[];
  recommendations: string[];
}

export const useBrowserExtensionDetector = () => {
  const [detection, setDetection] = useState<ExtensionDetectionResult>({
    hasInterference: false,
    detectedExtensions: [],
    recommendations: []
  });

  useEffect(() => {
    const detectInterference = () => {
      const detectedExtensions: string[] = [];
      const recommendations: string[] = [];

      // Check for common extension interference patterns
      const checks = [
        {
          name: 'Content Script Errors',
          test: () => {
            const hasContentScriptErrors = window.console && 
              window.console.error && 
              document.querySelector('[data-extension]');
            return hasContentScriptErrors;
          },
          recommendation: 'Disable browser extensions temporarily'
        },
        {
          name: 'Modified DOM',
          test: () => {
            return document.querySelector('[data-extension], [class*="extension"], [id*="extension"]') !== null;
          },
          recommendation: 'Check for ad blockers or content modifiers'
        },
        {
          name: 'Script Injection',
          test: () => {
            return Array.from(document.scripts).some(script => 
              script.src && (
                script.src.includes('extension://') || 
                script.src.includes('moz-extension://')
              )
            );
          },
          recommendation: 'Disable script-injecting extensions'
        }
      ];

      checks.forEach(check => {
        try {
          if (check.test()) {
            detectedExtensions.push(check.name);
            recommendations.push(check.recommendation);
          }
        } catch (error) {
          console.warn('Extension detection check failed:', check.name, error);
        }
      });

      const hasInterference = detectedExtensions.length > 0;

      if (hasInterference) {
        console.warn('🔍 Browser extension interference detected:', {
          detectedExtensions,
          recommendations
        });
      }

      setDetection({
        hasInterference,
        detectedExtensions,
        recommendations
      });
    };

    // Run detection after a short delay to allow extensions to load
    const timer = setTimeout(detectInterference, 1000);

    return () => clearTimeout(timer);
  }, []);

  return detection;
};
