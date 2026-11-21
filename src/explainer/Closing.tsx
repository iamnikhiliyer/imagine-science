import { useCurrentFrame } from 'remotion';
import { color, ease, Heading, Stage } from './design';

export function Closing() {
  const frame = useCurrentFrame();
  return <Stage chapter="05 / MAKE IT YOURS">
    <Heading lines={['Imagine', 'Science']} y={213} size={161} />
    <div style={{ position: 'absolute', left: 105, top: 646, fontSize: 29, color: color.muted }}>A moving explanation. An inspectable process.</div>
    <div style={{ position: 'absolute', left: 105, top: 791, fontSize: 26, color: color.teal }}>github.com/iamnikhiliyer/imagine-science</div>
    <div style={{ position: 'absolute', left: 1100, top: 310, width: 640 }}>
      {['Traceable sources.', 'Editable films.', 'Your scientific judgment.'].map((line, i) => <div key={line} style={{ opacity: ease(frame, i*18, i*18+24), translate: `${(1 - ease(frame, i*18, i*18+24))*24}px 0`, borderTop: `1px solid ${color.line}`, padding: '29px 0', fontSize: i === 2 ? 37 : 42, color: i === 2 ? color.teal : color.ink, fontFamily: 'Georgia, serif', letterSpacing: -.7 }}>{line}</div>)}
      <div style={{ marginTop: 32, fontSize: 22, letterSpacing: 1.5, color: color.muted, opacity: ease(frame, 65, 95) }}>OPEN SOURCE / BUILT ON REMOTION</div>
    </div>
  </Stage>;
}
