import '@fontsource-variable/manrope';
import type { ReactNode } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const color = { paper: '#f6f2e9', ink: '#102023', teal: '#39776c', rust: '#bf6846', muted: '#64746b', line: '#cbd2c7', pale: '#e6ebdf' };
export const ease = (frame: number, start: number, end: number) => {
  const t = interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return t * t * (3 - 2 * t);
};

export function Stage({ children, chapter, dark = false }: { children: ReactNode; chapter: string; dark?: boolean }) {
  return <AbsoluteFill style={{ background: dark ? color.ink : color.paper, color: dark ? color.paper : color.ink, fontFamily: 'Manrope Variable, Arial, sans-serif', overflow: 'hidden' }}>
    <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
      <defs><pattern id="register" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".75" fill={dark ? color.paper : color.teal} opacity={dark ? .08 : .14}/></pattern></defs>
      <rect width="1920" height="1080" fill="url(#register)" />
      <path d="M96 118H1824M96 909H1824" stroke={dark ? '#37514c' : color.line}/>
    </svg>
    <div style={{ position: 'absolute', left: 96, top: 59, fontSize: 24, letterSpacing: 4, color: dark ? '#9cd5bf' : color.teal }}>IMAGINE SCIENCE</div>
    <div style={{ position: 'absolute', right: 96, top: 62, fontSize: 22, color: dark ? '#a1b5a9' : color.muted }}>{chapter}</div>
    {children}
  </AbsoluteFill>;
}

export function Heading({ lines, kicker, x = 96, y = 220, size = 100, dark = false }: { lines: string[]; kicker?: string; x?: number; y?: number; size?: number; dark?: boolean }) {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 26, stiffness: 100, mass: 1 } });
  return <div style={{ position: 'absolute', left: x, top: y, translate: `0 ${(1 - enter) * 20}px` }}>
    {kicker && <div style={{ fontSize: 23, letterSpacing: 2, marginBottom: 28, color: dark ? '#9cd5bf' : color.teal }}>{kicker}</div>}
    <div style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: size, lineHeight: 1.08, letterSpacing: -4.4, color: dark ? color.paper : color.ink }}>{lines.map(line => <div key={line}>{line}</div>)}</div>
  </div>;
}

export function ScientificMotif({ frame, x = 1450, y = 500, scale = 1 }: { frame: number; x?: number; y?: number; scale?: number }) {
  return <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}><g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle r="234" fill={color.pale} opacity=".7" />
    {[0,1,2].map(i => <ellipse key={i} rx="232" ry="86" fill="none" stroke={color.teal} strokeWidth="1.2" opacity=".55" transform={`rotate(${i * 60 + frame * .08})`} />)}
    <path d="M-285 0H285M0 -285V285" stroke={color.line} strokeDasharray="4 8" />
    {Array.from({ length: 18 }, (_, i) => {
      const angle = i * 2.39996 + frame * .003, r = 27 + Math.sqrt(i / 18) * 133;
      return <circle key={i} cx={Math.cos(angle) * r} cy={Math.sin(angle) * r * .83} r={i % 5 === 0 ? 8 : 5} fill={i % 5 === 0 ? color.rust : color.teal} />;
    })}
    <circle r="18" fill={color.paper} stroke={color.teal} strokeWidth="2" />
  </g></svg>;
}
