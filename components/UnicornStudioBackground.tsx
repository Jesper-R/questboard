"use client";

import { useState, useEffect } from "react";
import UnicornScene from "unicornstudio-react";

export default function UnicornBackground() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="fixed inset-0 -z-50">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <UnicornScene
          // Remix of https://www.unicorn.studio/remix/DVuHLBRdBnjYAbk2Dq0T
          projectId="VWxwwHafUsxj1d9x7I0P"
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
    </div>
  );
}
