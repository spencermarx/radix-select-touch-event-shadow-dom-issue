import React from "react";

export const useSetupLogs = () => {
  const [events, setEvents] = React.useState<string[]>([]);

  const logEvent = (event: string, details?: Record<string, unknown>) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const logMessage = `${timestamp}: ${event}`;

    // Enhanced console logging with details
    console.log(`[ShadowDOM Debug] ${logMessage}`, details || "");

    setEvents((prev) => [
      ...prev.slice(-19), // Keep last 20 events
      logMessage,
    ]);
  };

  // Add global event listeners for debugging
  React.useEffect(() => {
    const capturePhaseLogger = (e: Event) => {
      if (
        e.type.includes("touch") ||
        e.type.includes("pointer") ||
        e.type === "click"
      ) {
        console.log(`[Global Capture] ${e.type}`, {
          target: e.target,
          currentTarget: e.currentTarget,
          phase: e.eventPhase,
          timeStamp: e.timeStamp,
        });
      }
    };

    // Add listeners in capture phase to see all events
    ["touchstart", "touchend", "pointerdown", "pointerup", "click"].forEach(
      (eventType) => {
        document.addEventListener(eventType, capturePhaseLogger, true);
      }
    );

    return () => {
      ["touchstart", "touchend", "pointerdown", "pointerup", "click"].forEach(
        (eventType) => {
          document.removeEventListener(eventType, capturePhaseLogger, true);
        }
      );
    };
  }, []);

  // Add global touch event tracking
  React.useEffect(() => {
    const trackTouchEvents = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInDropdown = target.closest('[role="listbox"]');
      const isInButton = target.closest("button");

      console.log(`[Touch Event] ${e.type}`, {
        target: target.tagName,
        className: target.className,
        isInDropdown,
        isInButton,
        defaultPrevented: e.defaultPrevented,
        timeStamp: e.timeStamp,
        phase:
          e.eventPhase === 1
            ? "CAPTURE"
            : e.eventPhase === 2
            ? "TARGET"
            : "BUBBLE",
      });
    };

    // Listen in both capture and bubble phases
    ["touchstart", "touchend", "touchmove"].forEach((eventType) => {
      document.addEventListener(eventType, trackTouchEvents, {
        capture: true,
        passive: false,
      });
      document.addEventListener(eventType, trackTouchEvents, {
        capture: false,
        passive: false,
      });
    });

    return () => {
      ["touchstart", "touchend", "touchmove"].forEach((eventType) => {
        document.removeEventListener(eventType, trackTouchEvents, {
          capture: true,
        });
        document.removeEventListener(eventType, trackTouchEvents, {
          capture: false,
        });
      });
    };
  }, []);

  return { logEvent, events };
};
