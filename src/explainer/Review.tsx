import type { ReactNode } from 'react';
import { Freeze, useCurrentFrame } from 'remotion';
import project from './archive/project.json';
import { Compose } from './Compose';
import { color, ease, Heading, Stage } from './design';
import { Opening } from './Opening';
import { Sources } from './Sources';

function Evidence({ children, x, localFrame, globalFrame }: { children: ReactNode; x: number; localFrame: number; globalFrame: number }) {
  const frame = useCurrentFrame();
  const visible = ease(frame, (x - 920) / 22, (x - 920) / 22 + 24);
  return <div style={{ position: 'absolute', left: x, top: 302, width: 281, opacity: visible, translate: `0 ${(1 - visible) * 22}px` }}>
    <div style={{ width: 281, height: 158, overflow: 'hidden', border: `1px solid ${color.line}`, background: color.pale }}>
      <div style={{ width: 1920, height: 1080, scale: 281 / 1920, transformOrigin: '0 0', position: 'relative' }}><Freeze frame={localFrame}>{children}</Freeze></div>
    </div>
    <div style={{ fontSize: 19, color: color.muted, marginTop: 17 }}>FRAME {String(globalFrame).padStart(4, '0')}</div>
  </div>;
}

export function Review() {
  const frame = useCurrentFrame();
  return <Stage chapter="04 / THE REVIEW">
    <Heading lines={['Look closely.', 'Make it clearer.']} kicker="INSPECT → REFINE → VERIFY" y={250} size={100} />
    <div style={{ position: 'absolute', left: 100, top: 610, width: 625, fontSize: 29, lineHeight: 1.5, color: color.muted }}>Review the frames.<br/>Keep scientific judgment in the loop.</div>
    <Evidence x={920} localFrame={45} globalFrame={45}><Opening /></Evidence>
    <Evidence x={1228} localFrame={90} globalFrame={project.scenes[1].startFrame+90}><Sources /></Evidence>
    <Evidence x={1536} localFrame={100} globalFrame={project.scenes[2].startFrame+100}><Compose /></Evidence>
    <div style={{ position: 'absolute', left: 920, top: 560, color: color.teal, fontFamily: 'monospace', fontSize: 26 }}>npm run review</div>
    <div style={{ position: 'absolute', left: 920, top: 623, width: 894 }}>
      {['Picture dimensions & timing', 'Audio & decoded frames', 'Researcher review of the explanation'].map((line,i) => <div key={line} style={{ opacity: ease(frame, 50+i*16, 70+i*16), display: 'flex', alignItems: 'center', gap: 20, borderTop: `1px solid ${color.line}`, padding: '18px 0', fontSize: 24, color: color.ink }}>
        <span style={{ color: i === 2 ? color.rust : color.teal, width: 20 }}>{i === 2 ? '↗' : '→'}</span>{line}
      </div>)}
    </div>
  </Stage>;
}
