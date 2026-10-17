import React from "react";
import { Composition } from "remotion";
import { ArmorDeskDemoVideo, TOTAL_DURATION_FRAMES } from "./ArmorDeskDemoVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ArmorDeskDemo"
        component={ArmorDeskDemoVideo}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
