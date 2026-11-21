import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import project from '../film.project.json';
import { AudioTrack } from './AudioTrack';

// Smooth seeded paths illustrate spread. They are not a Brownian dynamics solver
// and do not encode physical time, concentration, or a diffusion coefficient.
const particles = Array.from({ length: 72 }, (_, i) => ({
  angle: random(`angle-${i}`) * Math.PI * 2,
  radius: Math.sqrt(random(`radius-${i}`)),
  phase: random(`phase-${i}`) * Math.PI * 2,
  speed: .4 + random(`speed-${i}`) * .6,
}));

export function Diffusion() {
  const frame = useCurrentFrame();
  const scene = project.scenes.find(s => frame >= s.startFrame && frame < s.endFrame) ?? project.scenes[project.scenes.length - 1];
  const spread = interpolate(frame, [0, project.durationInFrames - 1], [22, 214], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sceneOpacity = interpolate(frame - scene.startFrame, [0, 12], [.25, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#f6f2e9', color: '#102023', fontFamily: 'Arial, Helvetica, sans-serif' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%" role="img" aria-label="Schematic particles spreading from a localized region">
      <defs>
        <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#102023" opacity=".10" /></pattern>
        <clipPath id="chamber"><rect x="641" y="146" width="544" height="440" rx="10" /></clipPath>
      </defs>
      <rect width="1280" height="720" fill="url(#dots)" />
      <text x="64" y="67" fontSize="18" letterSpacing="3" fill="#39776c">IMAGINE SCIENCE</text>
      <text x="1216" y="67" textAnchor="end" fontSize="17" fill="#536661">FIELD NOTES / 001</text>
      <path d="M64 95H1216" stroke="#bac5bc" />
      <g opacity={sceneOpacity}>
        <text x="64" y="185" fontSize="18" fill="#39776c">{String(project.scenes.indexOf(scene) + 1).padStart(2, '0')} / DIFFUSION</text>
        {scene.title.split('\n').map((line, i) => <text key={line} x="60" y={278 + i * 67} fontSize="53" letterSpacing="-2" fontFamily="Georgia, serif">{line}</text>)}
        <foreignObject x="64" y="408" width="470" height="134">
          <div style={{ fontSize: 23, lineHeight: 1.5, color: '#536661' }}>{scene.caption}</div>
        </foreignObject>
      </g>
      <rect x="641" y="146" width="544" height="440" rx="10" fill="#e7ebe1" stroke="#b9c7bd" />
      <path d="M913 164V568M659 366H1167" stroke="#b9c7bd" strokeDasharray="4 8" />
      <g clipPath="url(#chamber)">
        {[1, 2, 3].map(r => <circle key={r} cx="913" cy="366" r={r * 66} fill="none" stroke="#c8d2c6" />)}
        {particles.map((p, i) => {
          const a = p.angle + Math.sin(frame * .013 * p.speed + p.phase) * .35;
          const x = 913 + Math.cos(a) * p.radius * spread;
          const y = 366 + Math.sin(a) * p.radius * spread * .82;
          return <circle key={i} cx={x} cy={y} r={i % 7 === 0 ? 5.5 : 3.5} fill={i % 7 === 0 ? '#bf6846' : '#39776c'} opacity=".87" />;
        })}
      </g>
      <text x="641" y="625" fontSize="16" letterSpacing="1.4" fill="#536661">ILLUSTRATIVE TRAJECTORIES · NO PHYSICAL SCALE</text>
      <path d="M64 658H1216" stroke="#bac5bc" />
      <path d={`M64 658H${64 + 1152 * frame / (project.durationInFrames - 1)}`} stroke="#39776c" strokeWidth="3" />
      <text x="64" y="691" fontSize="15" fill="#536661">Editable source. Inspectable frames. Documented assumptions.</text>
      <text x="1216" y="691" textAnchor="end" fontSize="15" fill="#536661">SCHEMATIC / SILENT STARTER</text>
    </svg>
    <AudioTrack path={project.audio.path} captions={project.audio.captions} />
  </AbsoluteFill>;
}
