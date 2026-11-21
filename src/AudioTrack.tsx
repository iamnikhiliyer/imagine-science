import { Audio, staticFile, useCurrentFrame } from 'remotion';

type Caption = { startFrame: number; endFrame: number; text: string };

export function AudioTrack({ path, captions }: { path: string | null; captions: readonly Caption[] }) {
  const frame = useCurrentFrame();
  const caption = captions.find(c => frame >= c.startFrame && frame < c.endFrame);
  return <>
    {path && <Audio src={staticFile(path)} />}
    {caption && <div style={{ position: 'absolute', bottom: 24, left: 100, right: 100, textAlign: 'center', fontSize: 27, lineHeight: 1.4 }}>
      <span style={{ background: '#102023', color: '#f6f2e9', padding: '8px 16px', boxDecorationBreak: 'clone' }}>{caption.text}</span>
    </div>}
  </>;
}
