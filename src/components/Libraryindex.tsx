// data/features.ts
import { ComponentType } from "react";
import Soundimage from "./interactions/soundimage/Soundimage";
import Wavecard from "./interactions/Liquideffect/Liquideffect";
export interface FeatureItem {
  name: string;
  duration: string;
  component: ComponentType<any>;
  tagline: string;
}

const features: Record<string, FeatureItem> = {
  soundcomponent: {
    name: "Onboarding",
    duration: "5 min",
    component: Soundimage,
    tagline: "Get started in minutes",
  },
  wavecard: {
    name: "Advanced Setup",
    duration: "10 min",
    component: Wavecard,
    tagline: "Configure it your way",
  },
  // ...3 more
};

export default features;