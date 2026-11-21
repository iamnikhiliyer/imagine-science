type Camera = { x: number; y: number; scale: number; rx: number; ry: number; rz: number };
type Key = Camera & { frame: number };

// Authored against the delivered word timings in ../words.json (30 fps).
export const events = {
  build: 249, sources: 365, sequence: 434, slow: 468, narrationCue: 546,
  freeze: 724, editStart: 735, editEnd: 783, resume: 818, closing: 829,
};

export const smooth = (frame: number, from: number, to: number) => {
  const t = Math.max(0, Math.min(1, (frame - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const keys: Key[] = [
  { frame: 0, x: 1020, y: 440, scale: 2.1, rx: 16, ry: -4, rz: -5 },
  { frame: 90, x: 1000, y: 455, scale: 1.65, rx: 18, ry: -7, rz: -5 },
  { frame: 145, x: 980, y: 480, scale: 1.08, rx: 38, ry: -12, rz: -5 },
  { frame: 180, x: 960, y: 475, scale: .98, rx: 38, ry: -12, rz: -6 },
  { frame: 245, x: 960, y: 475, scale: .90, rx: 42, ry: 5, rz: -4 },
  { frame: 295, x: 960, y: 500, scale: .88, rx: 52, ry: -10, rz: -3 },
  { frame: 355, x: 960, y: 470, scale: .90, rx: 34, ry: -5, rz: -4 },
  { frame: 365, x: 960, y: 470, scale: .82, rx: 40, ry: 8, rz: -5 },
  { frame: 420, x: 960, y: 490, scale: .76, rx: 48, ry: -3, rz: -8 },
  { frame: 445, x: 960, y: 490, scale: 1.02, rx: 20, ry: -5, rz: -2 },
  { frame: 485, x: 960, y: 485, scale: 1.13, rx: 12, ry: -2, rz: 0 },
  { frame: 535, x: 960, y: 480, scale: 1.0, rx: 7, ry: 0, rz: 0 },
  { frame: 565, x: 960, y: 480, scale: 1.12, rx: 3, ry: 0, rz: 0 },
  { frame: 635, x: 960, y: 485, scale: 1.08, rx: 22, ry: -10, rz: -3 },
  { frame: 695, x: 960, y: 480, scale: 1.0, rx: 20, ry: -5, rz: -2 },
  { frame: 740, x: 960, y: 480, scale: 1.12, rx: 8, ry: 0, rz: 0 },
  { frame: 783, x: 1020, y: 480, scale: 1.08, rx: 12, ry: -3, rz: -2 },
  { frame: 818, x: 1230, y: 480, scale: .85, rx: 26, ry: -8, rz: -3 },
  { frame: 870, x: 1330, y: 480, scale: .74, rx: 26, ry: -8, rz: -3 },
  { frame: 948, x: 1330, y: 480, scale: .74, rx: 26, ry: -8, rz: -3 },
];

function replayClock(frame: number) {
  const elapsed = Math.max(0, frame - events.slow);
  const u = Math.min(1, elapsed / 18);
  // Integral of a smooth speed ramp from 1× to .25×, then quarter-speed motion.
  const removedTime = elapsed < 18 ? 18 * (u**3 - .5*u**4) : elapsed - 9;
  return frame - events.sequence - .75*removedTime;
}

const replayOffset = 72 - replayClock(events.narrationCue);

export function signalState(sampleFrame: number) {
  const chain = [0,1,2,3,6,9,10];
  const phase = ((sampleFrame % 261) + 261) % 261;
  const edge = Math.min(5, Math.floor(phase / 36));
  return { from: chain[edge], to: chain[edge+1], progress: phase < 216 ? (phase % 36) / 36 : 1,
    active: phase < 216, phase, arrivals: chain.map((node,i) => ({ node, strength: phase<i*36 ? 0 : Math.exp(-(((phase-i*36)/12)**2)) })) };
}

export function processState(frame: number) {
  const end = keys.find(key => key.frame >= frame) ?? keys[keys.length - 1];
  const index = keys.indexOf(end);
  const start = keys[Math.max(0, index - 1)];
  const t = start === end ? 1 : smooth(frame, start.frame, end.frame);
  const camera: Camera = {
    x: mix(start.x, end.x, t), y: mix(start.y, end.y, t), scale: mix(start.scale, end.scale, t),
    rx: mix(start.rx, end.rx, t), ry: mix(start.ry, end.ry, t), rz: mix(start.rz, end.rz, t),
  };
  const strip = smooth(frame, events.slow+18, events.slow+58) * (1-smooth(frame,events.narrationCue+10,events.narrationCue+70));
  const heldClock = replayOffset + replayClock(events.freeze);
  const sampleFrame = frame < events.sequence ? frame : frame < events.freeze ? replayOffset+replayClock(frame) : frame <= events.resume ? heldClock : heldClock+frame-events.resume;
  return {
    camera, heroOpacity: 1, heroScale: 1 - .25*strip,
    sources: smooth(frame,events.sources,events.sources+24)*(1-smooth(frame,events.sequence,events.sequence+30)),
    input: smooth(frame,events.sources+12,events.sequence+20),
    layers: smooth(frame,events.build,events.build+42)*(1-smooth(frame,330,365)),
    strip,
    inspect: smooth(frame,events.freeze,events.freeze+12)*(1-smooth(frame,events.resume,events.resume+18)),
    correction: smooth(frame,events.editStart,events.editEnd),
    brand: smooth(frame,events.closing,870),
    sampleFrame,
    playbackRate: frame < events.slow ? 1 : frame < events.freeze ? 1-.75*smooth(frame,events.slow,events.slow+18) : frame <= events.resume ? 0 : 1,
    wire: smooth(frame,events.sources,events.sources+30)*(1-smooth(frame,events.sequence,events.sequence+22)),
    cue: smooth(frame,events.narrationCue-5,events.narrationCue)*(1-smooth(frame,events.narrationCue+8,events.narrationCue+22)),
  };
}
