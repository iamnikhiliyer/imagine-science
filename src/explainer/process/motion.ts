type Camera = { x: number; y: number; scale: number; rx: number; ry: number; rz: number };
type Key = Camera & { frame: number };

export const smooth = (frame: number, from: number, to: number) => {
  const t = Math.max(0, Math.min(1, (frame - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const keys: Key[] = [
  { frame: 0, x: 1020, y: 440, scale: 2.1, rx: 16, ry: -4, rz: -5 },
  { frame: 80, x: 980, y: 480, scale: 1.08, rx: 38, ry: -12, rz: -5 },
  { frame: 109, x: 960, y: 470, scale: .92, rx: 42, ry: -12, rz: -6 },
  { frame: 200, x: 960, y: 490, scale: .76, rx: 48, ry: -3, rz: -8 },
  { frame: 300, x: 960, y: 470, scale: .82, rx: 40, ry: 8, rz: -5 },
  { frame: 324, x: 960, y: 460, scale: .93, rx: 36, ry: 10, rz: -3 },
  { frame: 390, x: 960, y: 500, scale: .88, rx: 52, ry: -10, rz: -3 },
  { frame: 470, x: 960, y: 490, scale: 1.13, rx: 20, ry: -9, rz: 0 },
  { frame: 511, x: 960, y: 490, scale: 1.02, rx: 12, ry: -2, rz: 0 },
  { frame: 560, x: 960, y: 490, scale: .88, rx: 5, ry: 0, rz: 0 },
  { frame: 610, x: 960, y: 480, scale: 1.12, rx: 3, ry: 0, rz: 0 },
  { frame: 660, x: 960, y: 485, scale: 1.08, rx: 25, ry: -10, rz: -3 },
  { frame: 735, x: 960, y: 500, scale: .95, rx: 35, ry: -13, rz: -4 },
  { frame: 830, x: 1330, y: 480, scale: .74, rx: 26, ry: -8, rz: -3 },
  { frame: 919, x: 1330, y: 480, scale: .74, rx: 26, ry: -8, rz: -3 },
];

export function processState(frame: number) {
  const end = keys.find(key => key.frame >= frame) ?? keys[keys.length - 1];
  const index = keys.indexOf(end);
  const start = keys[Math.max(0, index - 1)];
  const t = start === end ? 1 : smooth(frame, start.frame, end.frame);
  const camera: Camera = {
    x: mix(start.x, end.x, t), y: mix(start.y, end.y, t), scale: mix(start.scale, end.scale, t),
    rx: mix(start.rx, end.rx, t), ry: mix(start.ry, end.ry, t), rz: mix(start.rz, end.rz, t),
  };
  const strip = smooth(frame, 511, 552) * (1 - smooth(frame, 588, 650));
  return {
    camera, heroOpacity: 1, heroScale: 1 - .37 * strip,
    sources: smooth(frame, 108, 154) * (1 - smooth(frame, 295, 343)),
    input: smooth(frame, 165, 294),
    layers: smooth(frame, 327, 380) * (1 - smooth(frame, 424, 480)),
    strip,
    inspect: smooth(frame, 551, 573) * (1 - smooth(frame, 633, 669)),
    correction: smooth(frame, 589, 621),
    brand: smooth(frame, 775, 825),
    sampleFrame: frame <= 520 ? frame : frame <= 645 ? 520 : frame - 125,
    wire: smooth(frame, 110, 165) * (1 - smooth(frame, 279, 338)),
  };
}
