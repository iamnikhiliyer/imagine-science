import { useCurrentFrame } from 'remotion';
import { color, Heading, ScientificMotif, Stage } from './design';

export function Opening() {
  const frame = useCurrentFrame();
  return <Stage chapter="01 / THE IDEA">
    <ScientificMotif frame={frame} />
    <Heading lines={['Give your science', 'a moving explanation.']} kicker="FROM RESEARCH TO UNDERSTANDING" y={280} size={107} />
    <div style={{ position: 'absolute', left: 100, top: 650, color: color.muted, fontSize: 30 }}>An animation workflow built for scientific storytelling.</div>
    <div style={{ position: 'absolute', left: 100, bottom: 220, color: color.teal, fontSize: 23, letterSpacing: 1 }}>A CODEX SKILL + A REMOTION STARTER</div>
  </Stage>;
}
