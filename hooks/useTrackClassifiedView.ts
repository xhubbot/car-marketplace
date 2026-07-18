import { useEffect } from "react";

/**
 * Hook to track classified page views
 * Automatically sends a view tracking request when the component mounts
 *
 * @param classifiedId - The ID of the classified being viewed
 * @param enabled - Whether tracking is enabled (default: true)
 */
export function useTrackClassifiedView(
  classifiedId: number | null,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!classifiedId || !enabled) {
      return;
    }

    const trackView = async () => {
      try {
        const response = await fetch(
          `/api/classifieds/${classifiedId}/track-view`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          console.log(
            "View tracked:",
            data.data.counted ? "New view recorded" : "Already viewed today"
          );
        }
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    // Track view after a short delay to avoid tracking accidental clicks
    const timer = setTimeout(trackView, 1000);

    return () => clearTimeout(timer);
  }, [classifiedId, enabled]);
}
