import { Img, staticFile, useCurrentFrame } from 'remotion';
import { color, ease, Heading, Stage } from './design';

export function Compose() {
  const frame = useCurrentFrame();
  const playhead = ease(frame, 30, 160);
  return <Stage chapter="03 / THE ANIMATION" dark>
    <Heading lines={['Build the scene.', 'Keep the source.']} kicker="YOUR AGENT + REMOTION" y={237} size={99} dark />
    <div style={{ position: 'absolute', left: 102, top: 586, color: '#a7b9ad', fontSize: 27, lineHeight: 1.65 }}>
      <span style={{ color: '#82c5ad' }}>const</span> frame = <span style={{ color: '#e4b593' }}>useCurrentFrame</span>();<br/>
      <span style={{ color: '#82c5ad' }}>const</span> position = interpolate(frame, ...);
    </div>
    <div style={{ position: 'absolute', left: 102, top: 780, color: '#b7c8bb', fontSize: 22 }}>Editable React / SVG source</div>
    <div style={{ position: 'absolute', left: 935, top: 235, width: 800, height: 450, rotate: `${-2 * (1 - ease(frame, 0, 40))}deg`, translate: `0 ${(1 - ease(frame, 0, 40)) * 45}px`, boxShadow: '0 24px 80px #0005', border: '1px solid #56786b' }}>
      <Img src={staticFile('explainer/starter-preview.png')} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', left: 22, top: 20, color: color.teal, background: color.paper, padding: '6px 10px', fontSize: 16 }}>FROM THE INCLUDED STARTER</div>
    </div>
    <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
      <g transform="translate(935 755)">
        <text y="-28" fill="#a7b9ad" fontSize="20" letterSpacing="1.5">YOUR TIMING STAYS EDITABLE</text>
        <path d="M0 0H800" stroke="#496258" />
        {['Idea', 'Compose', 'Review', 'Deliver'].map((label,i) => <g key={label}>
          <rect x={i * 200 + 2} y="18" width="187" height="49" rx="3" fill={i === 1 ? '#568f7b' : '#2d4941'} />
          <text x={i*200+18} y="50" fill={color.paper} fontSize="19">{label}</text>
        </g>)}
        <path d={`M${playhead*790} -8V82`} stroke="#e7b086" strokeWidth="3" />
        <circle cx={playhead*790} cy="-8" r="5" fill="#e7b086" />
      </g>
    </svg>
  </Stage>;
}
