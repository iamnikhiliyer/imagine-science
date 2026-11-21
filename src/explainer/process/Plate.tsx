import type { CSSProperties } from 'react';
import { Network } from './Network';
import { mix, smooth } from './motion';

const fill: CSSProperties = { position: 'absolute', inset: 0, borderRadius: 20 };

export function Plate({ sampleFrame, frame, layers = 0, wire = 0, inspect = 0, correction = 0, scale = 1, x = 0, opacity = 1, miniature = false }: {
  sampleFrame: number; frame: number; layers?: number; wire?: number; inspect?: number; correction?: number;
  scale?: number; x?: number; opacity?: number; miniature?: boolean;
}) {
  const labelX = mix(510, 790, correction), labelY = mix(277, 95, correction);
  return <div style={{ position: 'absolute', left: -500, top: -300, width: 1000, height: 600, transformStyle: 'preserve-3d', transform: `translate3d(${x}px,0,0) scale(${scale})`, opacity }}>
    {[0,1,2,3].map(i => <div key={i} style={{ ...fill, transform: `translateZ(${-i*4}px)`, background: i===0?'linear-gradient(135deg,#183a3b,#0c2228 70%)':'#153239', border: `1px solid ${i===0?'#7ca397':'#335353'}`, boxShadow: i===3?'0 32px 65px #0008':undefined }}/>) }
    <div style={{ ...fill, background: 'linear-gradient(125deg,#bcdec609,transparent 50%,#89c9c510)', border: '1px solid #82b7a326', transform: 'translateZ(1px)' }} />
    <svg width="1000" height="600" style={{ position: 'absolute', inset: 0, transform: 'translateZ(2px)', opacity: .5 }}>
      {Array.from({length:19},(_,i)=><path key={i} d={`M${50+i*50} 70V540`} stroke="#53766c" strokeWidth=".5" opacity=".28"/>)}
      {Array.from({length:10},(_,i)=><path key={i} d={`M50 ${70+i*50}H950`} stroke="#53766c" strokeWidth=".5" opacity=".28"/>)}
      <path d="M22 60V22H65M935 22H978V60M22 540V578H65M935 578H978V540" fill="none" stroke="#b1cdb3" strokeWidth="2"/>
    </svg>
    <div style={{ ...fill, transform: `translateZ(${10+layers*130}px)`, border: layers>.05?'1px solid #84c9b64d':undefined, background: layers>.05?'#163b3c20':undefined }}>
      <Network sampleFrame={sampleFrame} layer="traces" wire={wire}/>
      {!miniature && <div style={{ position: 'absolute', right: 22, top: 15, color: '#9ec5b3', fontSize: 15, letterSpacing: 2, opacity: layers }}>GEOMETRY</div>}
    </div>
    <div style={{ ...fill, transform: `translateZ(${14+layers*290}px)`, border: layers>.05?'1px solid #b5d4ad38':undefined }}>
      <Network sampleFrame={sampleFrame} layer="cells" wire={wire}/>
      {!miniature && <div style={{ position: 'absolute', right: 22, top: 15, color: '#c9dabc', fontSize: 15, letterSpacing: 2, opacity: layers }}>ANIMATION</div>}
    </div>
    <svg width="1000" height="600" style={{ position: 'absolute', inset: 0, transform: `translateZ(${24+layers*320}px)` }}>
      <text x="35" y="39" fill="#a1bdad" fontSize="15" letterSpacing="2.5" opacity={miniature?1:smooth(frame,35,75)}>ANIMATED SCHEMATIC</text>
      <text x="965" y="565" fill="#789e92" fontSize="16" textAnchor="end" opacity={miniature?1:smooth(frame,35,75)}>{String(Math.max(0,Math.floor(sampleFrame))).padStart(4,'0')}</text>
      <g opacity={Math.max(inspect,correction)}>
        <circle cx="505" cy="290" r={76+Math.sin(frame*.1)*3} fill="none" stroke="#dab695" strokeWidth="1.6" strokeDasharray="5 9" opacity={inspect}/>
        <path d={`M505 290L${labelX-25} ${labelY+23}H${labelX}`} fill="none" stroke={correction>.5?'#bedcc2':'#d5a986'} strokeWidth="1.6"/>
        <rect x={labelX-9} y={labelY-8} width="167" height="42" rx="4" fill="#123037" stroke={correction>.5?'#bedcc2':'#d5a986'} strokeWidth="1.3"/>
        <text x={labelX+5} y={labelY+19} fontSize="18" fill="#e4e5ce">Schematic cell</text>
        <rect x="8" y="8" width="984" height="584" rx="16" fill="none" stroke="#dbb993" strokeWidth="3" opacity={inspect*smooth(frame,551,578)}/>
      </g>
    </svg>
    {!miniature && <div style={{ position: 'absolute', left: 35, bottom: 27, color: '#6d9588', fontSize: 14, letterSpacing: 2, transform: 'translateZ(26px)', opacity: smooth(frame,35,75) }}>ILLUSTRATIVE · SOURCE RETAINED</div>}
  </div>;
}
