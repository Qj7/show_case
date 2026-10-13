declare module "vanta/dist/vanta.net.min" {
  type VantaNetOptions = {
    el: HTMLElement;
    THREE?: unknown;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    backgroundAlpha?: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
    showDots?: boolean;
  };

  type VantaEffect = {
    destroy(): void;
    resize(): void;
    setOptions(options: Partial<VantaNetOptions>): void;
    blending: "additive" | "subtractive";
    linesMesh: { material: { blending: number; needsUpdate: boolean } };
  };

  export default function NET(options: VantaNetOptions): VantaEffect;
}
