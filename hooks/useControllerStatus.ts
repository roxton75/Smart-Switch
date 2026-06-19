/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";

import { subscribeToController } from "@/services/controllerService";

export function useControllerStatus() {
  const [controllerLoading, setControllerLoading] = useState(true);

  const [controllerOnline, setControllerOnline] = useState(false);

  const [controllerData, setControllerData] = useState<any>(null);

  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  const previousStatus = useRef<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToController((controller) => {
      setControllerData(controller);

      if (!controller?.lastSeen) {
        setControllerOnline(false);
        setControllerLoading(false);
        return;
      }

      setLastSeen(new Date(controller.lastSeen));

      setControllerLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!lastSeen) {
      setControllerOnline(false);
      return;
    }

    const diff = Date.now() - lastSeen.getTime();

    setControllerOnline(diff < 30000);

    const interval = setInterval(() => {
      const diff = Date.now() - lastSeen.getTime();

      setControllerOnline(diff < 30000);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSeen]);

  return {
    controllerOnline,
    controllerLoading,
    controllerData,
  };
}
