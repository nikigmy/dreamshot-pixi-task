import type { BgConfig } from "./prefabs/CenteredBackground";

type Config = {
  backgrounds: Record<string, BgConfig>;
};

export default {
  backgrounds: {
    vault: {
      layers: [
        "background",
      ],
      minAspectRatio : 1
    },
  },
} as Config;
