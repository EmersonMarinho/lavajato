// Animation polyfill for React Native
// This replaces the problematic @react-aria/utils animation.mjs module

export const useAnimationState = () => {
  return {
    isAnimating: false,
    isVisible: true,
    isExiting: false,
  };
};

export const useAnimationFrame = () => {
  return {
    requestAnimationFrame: (callback: () => void) => {
      // Use setTimeout as a fallback for React Native
      return setTimeout(callback, 16) as any;
    },
    cancelAnimationFrame: (id: any) => {
      clearTimeout(id);
    },
  };
};

export const useAnimationDuration = () => {
  return {
    duration: 0,
    delay: 0,
  };
};

// Export as default to match the expected import
export default {
  useAnimationState,
  useAnimationFrame,
  useAnimationDuration,
};
