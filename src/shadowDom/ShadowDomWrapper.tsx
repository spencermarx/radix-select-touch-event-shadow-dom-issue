import { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { cn } from "../lib/utils";
import { getShadowDomCss } from "./getShadowDomCss";

// Constants for ShadowDOM setup
export const DEBUG_SHADOW_ROOT_ID = "debug-shadow-root";
export const DEBUG_SHADOW_PORTAL_ID = "debug-shadow-portal";

/**
 * Production-like Shadow DOM wrapper for debugging Radix UI React-Select issue
 */
export const ShadowWrapper = (props: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);
  const portalContainerRef = useRef<HTMLElement | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize Shadow DOM structure once
  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;

    const shadowContainer = containerRef.current;
    let shadow: ShadowRoot;

    try {
      console.log("[Debug] Setting up Shadow DOM identical to production");

      // Step 1: Setup shadow DOM (mode: open is important for debugging)
      shadow =
        shadowContainer.shadowRoot ||
        shadowContainer.attachShadow({ mode: "open" });

      // Clear any existing content for clean setup
      shadow.innerHTML = "";

      // Step 2: Inject styles into shadow DOM - exactly as in production
      const style = document.createElement("style");
      style.textContent = getShadowDomCss();
      shadow.appendChild(style);

      // Step 3: Create a portal container for React mounting - exactly as in production
      const portalContainer = document.createElement("div");
      portalContainer.id = DEBUG_SHADOW_PORTAL_ID;
      portalContainer.classList.add(DEBUG_SHADOW_PORTAL_ID);
      shadow.appendChild(portalContainer);
      portalContainerRef.current = portalContainer;

      // Step 4: Create React root - this happens once
      rootRef.current = createRoot(portalContainer);
      isInitializedRef.current = true;

      console.log("[Debug] Shadow DOM setup complete", {
        shadowRoot: shadow,
        portal: portalContainer,
      });
    } catch (error) {
      console.error("[Debug] Error setting up Shadow DOM:", error);
    }

    // Cleanup function - fixes the race condition by using async cleanup
    return () => {
      console.log("[Debug] Cleaning up Shadow DOM");

      if (rootRef.current) {
        const root = rootRef.current;
        // Schedule cleanup for next tick to avoid race condition
        setTimeout(() => {
          try {
            root.unmount();
          } catch (error) {
            console.error("[Debug] Error during cleanup:", error);
          }
        }, 0);
        rootRef.current = null;
      }

      isInitializedRef.current = false;
    };
  }, []); // Empty deps - Shadow DOM setup happens once

  // Update React content when children change (separate from Shadow DOM setup)
  useEffect(() => {
    if (isInitializedRef.current && rootRef.current) {
      console.log("[Debug] Updating React content in Shadow DOM");
      rootRef.current.render(props.children);
    }
  }, [props.children]);

  return (
    <div
      ref={containerRef}
      id={DEBUG_SHADOW_ROOT_ID}
      className={cn(DEBUG_SHADOW_ROOT_ID)}
      data-testid="shadow-wrapper"
    />
  );
};
