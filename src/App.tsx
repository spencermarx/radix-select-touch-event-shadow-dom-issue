import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./components/ui/select";
import {
  DEBUG_SHADOW_ROOT_ID,
  DEBUG_SHADOW_PORTAL_ID,
} from "./shadowDom/ShadowDomWrapper";
import { useSetupLogs } from "./useSetupLogs";

export default () => {
  const [clickCount, setClickCount] = React.useState(0);
  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null);
  const { logEvent, events } = useSetupLogs();

  // Setup portal container
  React.useEffect(() => {
    const shadowHost = document.getElementById(DEBUG_SHADOW_ROOT_ID);
    const portalElement =
      shadowHost?.shadowRoot?.getElementById(DEBUG_SHADOW_PORTAL_ID) ||
      document.body;

    setPortalContainer(portalElement);

    logEvent("Portal container setup", {
      portalElement: portalElement.id || "document.body",
      isShadowDOM: portalElement !== document.body,
    });
  }, []);

  const handleSelectChange = (value: string) => {
    logEvent(`Select VALUE CHANGED to: ${value}`, { value });
    setSelectedValue(value);
  };

  const handleShadowButtonClick = () => {
    logEvent("🚨 ShadowDOM button clicked!");
    setClickCount((prev) => prev + 1);
  };

  // Enhanced event handlers with detailed logging
  const handleButtonTouchStart = (e: React.TouchEvent) => {
    logEvent("Button touchstart", {
      touches: e.touches.length,
      timeStamp: e.timeStamp,
      target: e.target,
    });
  };

  const handleButtonTouchEnd = (e: React.TouchEvent) => {
    logEvent("Button touchend", {
      changedTouches: e.changedTouches.length,
      timeStamp: e.timeStamp,
      target: e.target,
    });
  };

  const handleButtonPointerDown = (e: React.PointerEvent) => {
    logEvent("Button pointerdown", {
      pointerType: e.pointerType,
      timeStamp: e.timeStamp,
    });
  };

  const handleButtonPointerUp = (e: React.PointerEvent) => {
    logEvent("Button pointerup", {
      pointerType: e.pointerType,
      timeStamp: e.timeStamp,
    });
  };

  // Get portal container for Select portaling
  const getPortalContainer = () => {
    return portalContainer || undefined;
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ShadowDOM Touch Event Test
        </h2>
        <p className="text-gray-600 mb-6">
          This test environment mirrors a production app's ShadowDOM setup to
          reproduce touch event bleed-through.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a state (portaled to ShadowDOM):
            </label>
            <Select
              value={selectedValue}
              onValueChange={handleSelectChange}
              onOpenChange={(open) => {
                logEvent(
                  `Select onOpenChange: ${open ? "OPENING" : "CLOSING"}`,
                  { open }
                );
              }}
            >
              <SelectTrigger
                className="w-80"
                onClick={(e) =>
                  logEvent("SelectTrigger clicked", { timeStamp: e.timeStamp })
                }
                onPointerDown={(e) =>
                  logEvent("SelectTrigger pointerdown", {
                    pointerType: e.pointerType,
                  })
                }
              >
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent
                portalContainer={getPortalContainer()}
                onCloseAutoFocus={(e) => {
                  logEvent("🔒 SelectContent onCloseAutoFocus", {
                    defaultPrevented: e.defaultPrevented,
                  });
                }}
                onAnimationStart={(e) => {
                  logEvent("🎯 SelectContent onAnimationStart", {
                    animationName: e.animationName,
                    dataState: e.currentTarget.dataset.state,
                    className: e.currentTarget.className,
                  });
                }}
                onAnimationEnd={(e) => {
                  logEvent("🎯 SelectContent onAnimationEnd", {
                    animationName: e.animationName,
                    dataState: e.currentTarget.dataset.state,
                    className: e.currentTarget.className,
                  });
                }}
                onPointerDownOutside={(e) => {
                  logEvent("SelectContent onPointerDownOutside", {
                    target: e.target,
                    detail: e.detail,
                  });
                }}
                onEscapeKeyDown={(e) => {
                  logEvent("SelectContent onEscapeKeyDown");
                }}
              >
                <SelectItem
                  value="california"
                  onPointerDown={(e) =>
                    logEvent("SelectItem pointerdown: California", {
                      pointerType: e.pointerType,
                      isPrimary: e.isPrimary,
                    })
                  }
                  onPointerUp={(e) =>
                    logEvent("SelectItem pointerup: California", {
                      pointerType: e.pointerType,
                      isPrimary: e.isPrimary,
                    })
                  }
                  onTouchStart={(e) =>
                    logEvent("📱 SelectItem touchstart: California", {
                      touches: e.touches.length,
                      defaultPrevented: e.defaultPrevented,
                    })
                  }
                  onTouchEnd={(e) => {
                    logEvent("📱 SelectItem touchend", {
                      touches: e.touches.length,
                      changedTouches: e.changedTouches.length,
                      defaultPrevented: e.defaultPrevented,
                    });
                  }}
                  onClick={(e) =>
                    logEvent("SelectItem clicked: California", {
                      detail: e.detail,
                      defaultPrevented: e.defaultPrevented,
                    })
                  }
                >
                  California
                </SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="texas">Texas</SelectItem>
                <SelectItem value="florida">Florida</SelectItem>
                <SelectItem value="district-of-columbia">
                  District of Columbia
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleShadowButtonClick}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onTouchStart={handleButtonTouchStart}
              onTouchEnd={handleButtonTouchEnd}
              onPointerDown={handleButtonPointerDown}
              onPointerUp={handleButtonPointerUp}
              onMouseDown={(e) =>
                logEvent("Button mousedown", {
                  target: e.target,
                  timeStamp: e.timeStamp,
                })
              }
              onMouseUp={(e) =>
                logEvent("Button mouseup", {
                  target: e.target,
                  timeStamp: e.timeStamp,
                })
              }
            >
              ShadowDOM Button ({clickCount} clicks)
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Event Log:</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-gray-500 text-sm">No events yet...</p>
              ) : (
                events.map((event, index) => (
                  <div key={index} className="font-mono text-xs text-gray-700">
                    {event}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Test Instructions:
            </h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Use browser DevTools and mobile device emulation</li>
              <li>
                This test uses a select dropdown portaled into a ShadowDOM
                container
              </li>
              <li>Touch the "Select a state" dropdown to open it</li>
              <li>Select any option (e.g., "California" or "New York")</li>
              <li>
                Watch the blue ShadowDOM button to see intermitten touch events
                result in interpreted clicks
              </li>
              <li>Monitor the event log for touch event timing and behavior</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
