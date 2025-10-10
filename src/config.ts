import type { BgConfig } from "./prefabs/CenteredBackground";
import type { DoorConfig } from "./prefabs/Door";
import { KeypadConfig } from "./prefabs/Keypad";
import { GlobalConfig, PasswordConfig } from "./scenes/Game";

type Config = {
  global: GlobalConfig;
  password: PasswordConfig
  backgrounds: Record<string, BgConfig>;
  door: DoorConfig;
  keypad: KeypadConfig;
};

export default {
  global: {
    minAspectRatio: 1,
    referenceResolution: {x: 1920, y: 1080},
    gameTimeout: 5,
  },
  password: {
    maxTurns: 9,
    squences: 3,
  },
  backgrounds: {
    vault: {
      layers: [
        "background",
      ],
      spriteConfig: {anchor: {x: 0.5, y: 0.5}, scaling: 0.95}
    },
  },
  door: {
      closed: { name: "doorClosed", offset: { x: 0, y: 0}, anchor: {x: 0.46, y: 0.53}, scaling: 0.95 },
      handle: { name: "doorHandle", offset: {x: 0, y: -25}, anchor: {x: 0.5, y: 0.5}, scaling: 0.95 },
      handleShadow: {name: "doorHandleShadow", offset: {x: 10, y: -25 }, anchor: {x: 0.5, y: 0.5}, scaling: 0.95 },
      open: {name: "doorOpen", offset: {x: 0, y: 0}, anchor: {x: -0.698, y: 0.525}, scaling: 0.93 },
      openShadow: {name: "doorOpenShadow", offset: {x: 0, y: 0}, anchor: {x: -0.67, y: 0.5}, scaling: 0.93 },
      handleSpinDegrees: 60,
      handleSpinDiration: 0.25,
      openDuration: 1,
      spinRepeats: 2,
  },
  keypad:{
    anchor: {x: 0.5, y: 0.5},
    offset: {x: -448, y: -56},
    blinkingDuration: 0.5,
    errorText: "XXXX",
    referenceScreenHeigh: 1080,
    textStyle: { fill: "red", fontSize: 25, fontFamily: "Verdana"}
  }
} as Config;
