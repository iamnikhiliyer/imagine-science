import { useCurrentFrame } from 'remotion';
import { color, ease, Heading, Stage } from './design';
import waveform from './waveform.json';

export function Sources() {
  const frame = useCurrentFrame();
  return <Stage chapter="02 / THE MATERIAL">
    <Heading lines={['Start with', 'what you know.']} kicker="REFERENCES → A SCENE PLAN" y={246} />
    <div style={{ position: 'absolute', left: 100, top: 600, width: 600, fontSize: 29, lineHeight: 1.5, color: color.muted }}>Keep the sources, assumptions,<br/>and explanation together.</div>
    <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
      <g transform={`translate(${935 + (1 - ease(frame, 5, 36)) * 130} 230) rotate(${-8 + 3 * ease(frame, 5, 36)} 200 230)`} opacity={ease(frame, 0, 15)}>
        <rect width="420" height="520" fill="#ece9df" stroke={color.line} />
        <text x="34" y="57" fill={color.teal} fontSize="19" letterSpacing="2">REFERENCE NOTES</text>
        <text x="34" y="115" fill={color.ink} fontFamily="Georgia, serif" fontSize="34">What should the</text>
        <text x="34" y="157" fill={color.ink} fontFamily="Georgia, serif" fontSize="34">audience understand?</text>
        {[210,236,262,288].map((y,i) => <path key={y} d={`M34 ${y}H${i % 2 ? 330 : 370}`} stroke="#b2beb1" strokeWidth="5" />)}
        <text x="34" y="369" fill={color.muted} fontSize="19">Source · claim · qualification</text>
        <path d="M34 398H370" stroke={color.line} />
        <text x="34" y="448" fill={color.teal} fontSize="20">Researcher review</text>
      </g>
      <g transform={`translate(${1320 + (1 - ease(frame, 24, 58)) * 140} 335) rotate(${6 - 3 * ease(frame, 24, 58)} 210 200)`} opacity={ease(frame, 20, 40)}>
        <rect width="475" height="400" fill={color.paper} stroke="#a7baaa" />
        <text x="32" y="56" fill={color.teal} fontSize="19" letterSpacing="2">DIAGRAM / SCHEMATIC</text>
        <path d="M70 240C130 80 290 350 395 130" fill="none" stroke={color.teal} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ease(frame, 40, 90)}/>
        {[[82,217],[190,160],[300,230],[390,138]].map(([x,y],i) => <g key={x} opacity={ease(frame, 50+i*8, 65+i*8)}><circle cx={x} cy={y} r="12" fill={i === 2 ? color.rust : color.teal}/><circle cx={x} cy={y} r="23" fill="none" stroke={color.line}/></g>)}
        <text x="32" y="354" fill={color.muted} fontSize="19">Clearly label illustrative material.</text>
      </g>
      <g transform="translate(1030 778)" opacity={ease(frame, 80, 100)}>
        <path d="M0 0H600" stroke={color.line} />
        {waveform.map((amplitude, i) => <path key={i} d={`M${i*7.5} ${-3 - amplitude*31}v${6 + amplitude*62}`} stroke={color.teal} strokeWidth="3" />)}
        <text x="0" y="70" fill={color.muted} fontSize="20">NARRATION / PREPARED AUDIO</text>
      </g>
    </svg>
  </Stage>;
}
