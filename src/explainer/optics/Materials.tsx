import type {CSSProperties} from 'react';
import {Img, staticFile} from 'remotion';
import {position, particles} from './Specimen';
import waveform from '../waveform.json';

export const plane=(w:number,h:number,transform:string):CSSProperties=>({
  position:'absolute',left:-w/2,top:-h/2,width:w,height:h,transform,
  backfaceVisibility:'hidden',
});
const mono='Menlo, monospace';
export function Note({detail=true}:{detail?:boolean}) {
  const ink='#293e37';
  return <svg width="100%" height="100%" viewBox="0 0 540 680">
    <rect width="540" height="680" fill="#dcd8ba"/>
    <rect x="8" y="8" width="524" height="664" fill="#efe9cf" stroke="#b5b79f"/>
    <path d="M36 66H504M36 586H504" stroke="#83927c"/>
    <text x="36" y="48" fontSize="16" fontFamily={mono} fill={ink}>ANNALEN DER PHYSIK</text>
    <text x="503" y="48" fontSize="16" textAnchor="end" fill={ink}>1905</text>
    <text x="35" y="130" fontSize="48" fontFamily="Georgia" fill={ink}>Brownian motion</text>
    <text x="37" y="166" fontSize="21" fill="#546553">A. Einstein  ·  Sections IV–V</text>
    <circle cx="270" cy="352" r="148" fill="#dce0c3" stroke="#8e9e87"/>
    <circle cx="270" cy="352" r="117" fill="none" stroke="#9eac95" strokeDasharray="3 7"/>
    <path d="M115 352H425M270 193V512" fill="none" stroke="#819782" strokeWidth=".8"/>
    {Array.from({length:detail?82:20},(_,i)=>{
      const [x,y]=position(i*7%139,27,.72);
      return <circle key={i} cx={270+x*.44} cy={352+y*.44} r={2+i%4} fill={i%8?'#52766a':'#a67446'}/>;
    })}
    <text x="36" y="546" fill={ink} fontFamily="Georgia" fontSize="23">A localized cloud spreads over time.</text>
    <text x="37" y="621" fontSize="16" fill={ink} fontFamily={mono}>10.1002/andp.19053220806</text>
    <text x="37" y="649" fontSize="15" fill="#627562">Research note · illustrative diagram</text>
  </svg>;
}
export function Archive({frame,fade}:{frame:number;fade:number}) {
  if(fade<=0)return null;
  return <>{Array.from({length:15},(_,i)=>{
    // A stream of papers passes behind the selected reference, each following the same path.
    const t=((i/15+frame/290)%1);
    const x=-2000+3650*t, y=80-560*Math.sin(t*Math.PI)+140*t;
    const edge=Math.min(1,t*15,(1-t)*12);
    return <div key={i} style={{...plane(279,354,`translate3d(${x}px,${y}px,${-600+145*Math.sin(t*7)}px) rotateZ(${-44+74*t}deg) rotateY(${22+36*Math.sin(t*5)}deg) rotateX(25deg)`),opacity:fade*edge*.87,boxShadow:'0 10px 30px #030d0eb0'}}><Note detail={false}/></div>;
  })}</>;
}

export function Rim() {
  return <svg viewBox="-500 -500 1000 1000" width="100%" height="100%">
    <defs><path id="rim-lettering" d="M-432 0a432 432 0 0 1 864 0"/></defs>
    {Array.from({length:144},(_,i)=><path key={i} d={`M0 -472v${i%12===0?20:i%3===0?11:5}`} transform={`rotate(${i*2.5})`} stroke={i%12===0?'#fcdeb0':'#d2caa5'} strokeWidth={i%12===0?2.5:1.45} opacity={i%3?.59:.84}/>)}
    <text fontSize="18" fill="#c4d7c3" letterSpacing="5" fontFamily={mono}><textPath href="#rim-lettering" startOffset="50%" textAnchor="middle">DIFFUSION  ·  ILLUSTRATIVE TRAJECTORIES</textPath></text>
    {[0,120,240].map(n=><g key={n} transform={`rotate(${n+35}) translate(0 -483)`}><circle r="5.1" fill="#263431" stroke="#d3cba8"/><path d="M-3 1L3 -1" stroke="#d2c7a4"/></g>)}
  </svg>;
}
export function Disc() {
  return <>
    {[-33,-23,-13].map(z=><div key={z} style={{...plane(1000,1000,`translateZ(${z}px)`),borderRadius:'50%',background:'linear-gradient(118deg,#091d21,#65817b 22%,#14292b 47%,#647163 76%,#142527)',border:'2px solid #4a635b'}}/>)}
    <Img src={staticFile('explainer/optic-surface.jpg')} style={{...plane(1000,1000,'translateZ(0px)'),borderRadius:'50%'}}/>
    <div style={plane(1000,1000,'translateZ(2px)')}><Rim/></div>
  </>;
}
export function Glass({z,opacity,kind}:{z:number;opacity:number;kind:'geometry'|'labels'}) {
  if(opacity<=.005)return null;
  return <svg width="1000" height="1000" viewBox="-500 -500 1000 1000" style={{...plane(1000,1000,`translateZ(${z}px)`),opacity}}>
    <circle r="431" stroke={kind==='geometry'?'#a5e2cb':'#d7c89e'} strokeWidth="3" fill="#b3e3d5" fillOpacity=".043"/>
    <path d="M-429 0A429 429 0 0 1 0 -429" fill="none" stroke="#e2f2d5" strokeWidth="6" opacity=".7"/>
    <path d="M-360 0H360 M0 -363V363" stroke="#acd1bd" opacity=".4" strokeDasharray="4 9"/>
    <text x="0" y="-352" textAnchor="middle" fontSize="26" letterSpacing="4" fill="#e2e8d1" fontFamily={mono}>{kind==='geometry'?'SVG / GEOMETRY':'REACT / LABELS'}</text>
  </svg>;
}
export function AudioGroove({frame,opacity,progress}:{frame:number;opacity:number;progress:number}) {
  if(opacity<=.005)return null;
  // The voice envelope is engraved around the outer edge and read by a fixed pickup.
  return <svg width="1280" height="1280" viewBox="-640 -640 1280 1280" style={{...plane(1280,1280,'translateZ(28px)'),opacity}}>
    <g transform={`rotate(${-progress*190-45})`}>
      <circle r="536" fill="none" stroke="#89bba9" strokeWidth="1.5"/>
      {Array.from({length:240},(_,i)=>{
        const v=waveform[i%waveform.length],amp=5+v*42;
        return <path key={i} d={`M0 -539v-${amp}`} transform={`rotate(${i*1.5})`} stroke={i%8?'#94c5b0':'#f4c88b'} strokeWidth="3"/>;
      })}
    </g>
    <path d="M356 463L329 430" stroke="#ffc880" strokeWidth="5"/>
    <circle cx="329" cy="430" r={5+2*Math.sin(frame*.18)} fill="#ffe2aa"/>
    <text x="365" y="483" fill="#f4d7a7" fontSize="23" fontFamily={mono}>VOICE</text>
  </svg>;
}

function Exposure({sample,index}:{sample:number;index:number}) {
  return <svg width="100%" height="100%" viewBox="0 0 350 235">
    <rect x="1" y="1" width="348" height="233" rx="3" fill="#192e2b" stroke="#97a990" strokeWidth="2"/>
    <rect x="6" y="27" width="338" height="178" fill="#091c20" stroke="#4b6c62"/>
    {Array.from({length:13},(_,j)=><g key={j} fill="#b6bd9d"><rect x={11+j*26} y="8" width="13" height="10" rx="2"/><rect x={11+j*26} y="214" width="13" height="10" rx="2"/></g>)}
    <g transform="translate(175 117)">
      <circle r="78" fill="#153739" stroke="#51746b"/>
      {particles.filter((_,i)=>i%2===0).map((_,j)=>{const [x,y]=position(j*2,sample,.15+.75*sample/100);return <circle key={j} cx={x*.25} cy={y*.24} r={1.3+j%3*.46} fill="#b5d6bb"/>;})}
      <circle cx={position(111,sample,.15+.75*sample/100)[0]*.25} cy={position(111,sample,.15+.75*sample/100)[1]*.24} r="5" fill="#f7b674"/>
    </g>
    <text x="13" y="195" fill="#b3c3a8" fontSize="13" fontFamily={mono}>{String(index).padStart(4,'0')}</text>
  </svg>;
}
export function FilmRibbon({progress,opacity,advance,audio}:{progress:number;opacity:number;advance:number;audio:number}) {
  if(opacity<.005)return null;
  return <>{Array.from({length:19},(_,j)=>{
    const i=j-9, u=i-advance, theta=u*.182;
    // Neighbouring gates tangent to the same curved strip.
    const x=Math.sin(theta)*1900*progress, z=27+(1-Math.cos(theta))*1900*progress;
    const y=145+u*15*progress;
    const sample=Math.min(100,Math.max(0,50+i*6));
    return <div key={i} style={{...plane(350,235,`translate3d(${x}px,${y}px,${z}px) rotateY(${-theta*180/Math.PI}deg) rotateZ(2.5deg)`),opacity}}>
      <Exposure sample={sample} index={1547+j*6}/>
      {audio>.01 && <svg width="350" height="28" style={{position:'absolute',left:0,top:231,opacity:audio}}>{Array.from({length:40},(_,k)=><path key={k} d={`M${k*9} 14v${(k%2?1:-1)*(2+waveform[(j*7+k)%80]*12)}`} stroke="#e9b67b" strokeWidth="3"/>)}</svg>}
    </div>;
  })}</>;
}
