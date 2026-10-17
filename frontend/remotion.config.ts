import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";

Config.overrideWebpackConfig((current) => {
  const withTailwind = enableTailwind(current);
  return {
    ...withTailwind,
    resolve: {
      ...withTailwind.resolve,
      alias: {
        ...(withTailwind.resolve?.alias || {}),
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(85);
Config.setConcurrency(2);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setX264Preset("ultrafast");
