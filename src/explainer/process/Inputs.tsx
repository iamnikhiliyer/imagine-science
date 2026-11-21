import waveform from './waveform.json';
import project from './project.json';
import { mix, smooth } from './motion';

export function Inputs({ frame, opacity, progress }: { frame: number; opacity: number; progress: number }) {
  return <>
    <div style={{ position: 'absolute', left: -890, top: -275, width: 320, height: 430, transformStyle: 'preserve-3d', transform: `translate3d(${mix(-110,0,progress)}px,0,90px) rotateY(-12deg) rotateZ(-8deg)`, opacity }}>
      {[2,1,0].map(i => <div key={i} style={{ position: 'absolute', inset: 0, background: i?'#b3c2ae':'#e9e8d6', border: '1px solid #9fb4a2', transform: `translate3d(${-i*14}px,${-i*15}px,${-i*7}px)`, boxShadow: i===2?'0 20px 40px #0006':undefined }}/>) }
      <svg width="320" height="430" style={{ position: 'absolute', inset: 0, transform: 'translateZ(2px)' }}>
        <text x="26" y="42" fill="#3c7667" fontSize="15" letterSpacing="2">SOURCE NOTES</text>
        <text x="26" y="95" fontFamily="Georgia,serif" fontSize="27" fill="#213b38">A scientific idea.</text>
        {[137,155,173].map((y,i)=><path key={y} d={`M26 ${y}H${i===1?256:290}`} stroke="#829b87" strokeWidth="3"/>) }
        <path d="M28 280C80 180 160 330 286 221" fill="none" stroke="#417e6d" strokeWidth="2.4"/>
        {[[30,273],[120,241],[210,259],[283,224]].map(([x,y])=><circle key={x} cx={x} cy={y} r="5" fill="#417e6d"/>) }
        <path d="M26 328H292" stroke="#b8c1ac"/>
        <text x="26" y="362" fill="#627768" fontSize="15">Source · context · assumptions</text>
        <text x="26" y="394" fill="#417e6d" fontSize="14">Original schematic</text>
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 560, top: -120, width: 380, height: 255, transform: `translate3d(${mix(110,0,progress)}px,0,80px) rotateY(16deg) rotateZ(6deg)`, opacity: opacity*progress, background: 'linear-gradient(130deg,#1d4546,#10292f)', border: '1px solid #729f90', borderRadius: 8, boxShadow: '0 24px 40px #0006' }}>
      <svg width="380" height="255">
        <text x="25" y="39" fontSize="15" letterSpacing="2" fill="#bdd4bc">NARRATION</text>
        <path d="M25 126H355" stroke="#456b61"/>
        {waveform.map((value,i)=><path key={i} d={`M${26+i*4.1} ${126-value*53}v${Math.max(2,value*106)}`} stroke={i/80<progress?'#c2e4c2':'#4c756b'} strokeWidth="2"/>) }
        <text x="25" y="222" fontSize="15" fill="#90b5a2">narration.flac / 00:{(project.durationInFrames / project.fps).toFixed(2)}</text>
      </svg>
    </div>
    <svg width="2000" height="1000" style={{ position: 'absolute', left: -1000, top: -500, transform: 'translateZ(72px)', overflow: 'visible', opacity }}>
      {[-1,1].map((side,i)=>{
        const p = ((frame*.012+i*.4)%1+1)%1;
        const start=1000+side*650, end=1000+side*310;
        return <g key={side} opacity={progress}>
          <path d={`M${start} 500C${1000+side*540} 500 ${1000+side*430} 420 ${end} 420`} stroke="#77b69d" strokeWidth="1.4" fill="none" strokeDasharray="5 8"/>
          <circle cx={mix(start,end,p)} cy={500-80*smooth(p,0,1)} r="4" fill="#d7eec7"/>
        </g>;
      })}
    </svg>
  </>;
}
