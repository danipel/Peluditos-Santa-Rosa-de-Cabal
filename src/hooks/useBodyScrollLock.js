import { useEffect } from "react";

let activeLocks = 0;
let originalOverflow = "";
let originalPaddingRight = "";

/**
 * Hook to lock background body scroll when a modal or overlay is open.
 * Handles scrollbar compensation to avoid layout shift and supports nested/stacked modals via reference counting.
 *
 * @param {boolean} isLocked - Whether the scroll lock is active (default: true)
 */
export function useBodyScrollLock(isLocked = true) {
  useEffect(() => {
    if (!isLocked) return;

    if (activeLocks === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      // Compensate for vertical scrollbar width on desktop to prevent layout jitter
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      document.body.style.overflow = "hidden";
    }

    activeLocks++;

    return () => {
      activeLocks--;
      if (activeLocks <= 0) {
        activeLocks = 0;
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [isLocked]);
}

export default useBodyScrollLock;
