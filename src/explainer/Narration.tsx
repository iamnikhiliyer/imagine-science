import type { Caption } from '@remotion/captions';
import { Audio } from '@remotion/media';
import { staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import project from '../../film.project.json';
import words from './words.json';
import { color } from './design';

export function Narration() {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  const ms = frame / fps * 1000;
  const phrase = project.audio.captions.find(c => frame >= c.startFrame && frame < c.endFrame);
  const tokens: Caption[] = phrase ? words.filter(w => w.startMs >= phrase.startFrame / fps * 1000 - 34 && w.endMs <= phrase.endFrame / fps * 1000 + 1) : [];
  return <>
    <Audio src={staticFile('explainer/narration.flac')} premountFor={fps} />
    {phrase && <div style={{ position: 'absolute', bottom: 48, left: 110, right: 110, display: 'flex', justifyContent: 'center', zIndex: 50, fontFamily: 'Manrope Variable, Arial, sans-serif' }}>
      <div style={{ background: '#f6f2e9f5', color: color.ink, border: `1px solid ${color.line}`, borderRadius: 8, padding: '13px 22px', display: 'flex', gap: 8, fontSize: 35, lineHeight: 1.35 }}>
        {tokens.map(word => <span key={word.startMs} style={{ color: ms >= word.startMs && ms < word.endMs ? color.teal : color.ink, fontWeight: 550 }}>{word.text}</span>)}
      </div>
    </div>}
  </>;
}
