import type { BgConfig } from "./prefabs/CenteredBackground";
import type { DoorConfig } from "./prefabs/Door";

type Config = {
  backgrounds: Record<string, BgConfig>;
  door: DoorConfig;
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
  door: {
      closed: { name: "doorClosed", offset: { x: 0, y: 0}, anchor: {x: 0.46, y: 0.53}, scaling: 0.63 },
      handle: { name: "doorHandle", offset: {x: 0, y: -25}, anchor: {x: 0.5, y: 0.5}, scaling: 0.27},
      handleShadow: {name: "doorHandleShadow", offset: {x: 10, y: -25 }, anchor: {x: 0.5, y: 0.5}, scaling: 0.27},
      open: {name: "doorOpen", offset: {x: 0, y: 0}, anchor: {x: -0.698, y: 0.525}, scaling: 0.63},
      openShadow: {name: "doorOpenShadow", offset: {x: 0, y: 0}, anchor: {x: -0.67, y: 0.5}, scaling: 0.63},
      handleSpinDegrees: 60,
      handleSpinDiration: 0.25,
      openDuration: 1,
      spinRepeats: 2,
  }
} as Config;
