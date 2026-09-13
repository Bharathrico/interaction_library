// data/features.ts
import { ComponentType } from "react";
import Soundimage from "./interactions/soundimage/Soundimage";
import Rippleeffect from "./interactions/Rippleeffect/Rippleeffect";
import Liquideffect from "./interactions/Liquideffect/Liquideffect";
import Footballcomp from "./interactions/Footballcomp/Footballcomp";
import Mountaincard from "./interactions/Mountaincard/Mountaincard";
import Wavesphere from "./interactions/Wavesphere/Wavesphere";
import Zenstone from "./interactions/Zenstone/Zenstone";
import Icontest from "./interactions/Icontest/Icontest";
import Wavecard from "./interactions/Wavecard/Wavecard";
import Glasscard from "./interactions/Glasscard/Glasscard";
import Holecard from "./interactions/Holecard/Holecard";


export interface FeatureItem {
  name: string;
  duration: string;
  component: ComponentType<any>;
  tagline: string;
}

const features: Record<string, FeatureItem> = {
   holecard: {
    name: "Onboarding",
    duration: "5 min",
    component: Holecard,
    tagline: "Get started in minutes",
  },
  glasscard: {
    name: "Onboarding",
    duration: "5 min",
    component: Glasscard,
    tagline: "Get started in minutes",
  },
  soundcomponent: {
    name: "Onboarding",
    duration: "5 min",
    component: Soundimage,
    tagline: "Get started in minutes",
  },
  icontest: {
    name: "Onboarding",
    duration: "5 min",
    component: Icontest,
    tagline: "Get started in minutes",
  },
  wavecard: {
    name: "Advanced Setup",
    duration: "10 min",
    component: Wavecard,
    tagline: "Configure it your way",
  },
  rippleeffect: {
    name: "Advanced Setup",
    duration: "10 min",
    component: Rippleeffect,
    tagline: "Configure it your way",
  },
  liquideffect: {
    name: "Advanced Setup",
    duration: "10 min",
    component: Liquideffect,
    tagline: "Configure it your way",
  },
  footballcomp: {
    name: "Advanced Setup",
    duration: "10 min",
    component: Footballcomp,
    tagline: "Configure it your way",
  },
  wavesphere: {
    name: "Advanced Setup",
    duration: "10 min",
    component: Wavesphere,
    tagline: "Configure it your way",
  },
  mountaincard: {
    name: "Advanced Setup",
    duration: "10 min",
    component: Mountaincard,
    tagline: "Configure it your way",
  },
  zenstone: {
    name: "Advanced Setup",
    duration: "10 min",
    component: Zenstone,
    tagline: "Configure it your way",
  },
  // ...3 more
};

export default features;
