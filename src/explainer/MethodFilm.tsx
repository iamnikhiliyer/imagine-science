import '@fontsource-variable/manrope';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Narration } from './Narration';
import { Specimen, position } from './optics/Specimen';
import { Archive, AudioGroove, Disc, FilmRibbon, Glass, Note, plane } from './optics/Materials';
import { after, before, cameraAt, concentration, cue, smooth, specimenTime, windowAt } from './optics/timeline';

const field='Manrope Variable, Arial, sans-serif',mono='Menlo, monospace';
const edge={position:'absolute',left:96,top:96,color:'#f0ecd7',fontFamily:field} as const;
const notes = [
  [cue('TypeScript.'),'Diffusion.tsx'],
  [cue('React describes'),'<ParticleCloud />'],
  [cue('SVG draws'),'<circle cx={x} cy={y} />'],
  [cue('Remotion controls'),'useCurrentFrame()'],
] as const;

function Projection({f}:{f:number}) {
  const sample=specimenTime(f), spread=concentration(f);
  const [baseX,baseY,baseScale,pitch,yaw,roll]=cameraAt(f);
  const layers=windowAt(f,765,852,940,1014);
  const paperFirst=1-smooth(f,209,313);
  const paperSource=windowAt(f,481,548,657,750);
  const paperCompare=windowAt(f,1905,1940,1986,2025);
  const paper=Math.max(paperFirst,paperSource,paperCompare);
  const transfer=smooth(f,116,284);
  const openingX=-570+540*transfer;
  const paperX=paperFirst>0?openingX:-603+42*Math.sin(f*.018);
  const paperY=paperFirst>0?-98+78*transfer:-39;
  const wire=windowAt(f,845,911,973,1023);
  const ring=windowAt(f,1080,1145,1435,1504);
  const strip=windowAt(f,1490,1574,1743,1807);
  const travel=smooth(f,1506,1744);
  const replay=sample;
  const fixed = f>=after;
  const label=f>=before?smooth(replay,fixed?4:48,fixed?12:56):0;
  const proof=windowAt(f,1760,1813,1987,2030);
  const compare=windowAt(f,1913,1940,1987,2020);
  const story=windowAt(f,655,688,737,775);
  const tag=[...notes].reverse().find(([at])=>at<=f);
  const srcRay=windowAt(f,567,608,666,708);
  const [tx,ty]=position(111,sample,spread);
  // Rack into the actual amber tracer. Its projected position stays in the
  // composition while the other beads and the rim pass the lens at different speeds.
  const macro=1.54*windowAt(f,198,303,316,393)
    +1.14*windowAt(f,394,473,482,534)
    +1.91*windowAt(f,1003,1090,1113,1181)
    +1.37*windowAt(f,1298,1366,1387,1450)
    +1.21*windowAt(f,1973,2044,2070,2124);
  const scale=baseScale+macro;
  const angle=roll*Math.PI/180;
  const x=baseX-macro*(tx*Math.cos(angle)-ty*Math.sin(angle));
  const y=baseY-macro*(tx*Math.sin(angle)+ty*Math.cos(angle));
  const sync=windowAt(f,1212,1253,1392,1420);
  const strikes=cue('cue the motion.');
  const cueSweep=smooth(f,1233,strikes);

  const fix=windowAt(f,2190,2219,2318,2340);
  return <>
    <Img src={staticFile('explainer/optic-studio.jpg')} style={{width:'100%',height:'100%',position:'absolute'}}/>
    <div style={{position:'absolute',left:x-570*scale,top:Math.min(825,y+215*scale),width:1140*scale,height:190*scale,borderRadius:'50%',background:'radial-gradient(ellipse,#000b,transparent 69%)',transform:`rotate(${roll*.4}deg)`}}/>
    <div style={{position:'absolute',inset:0,perspective:2050,perspectiveOrigin:'50% 48%'}}>
      <div style={{position:'absolute',transformStyle:'preserve-3d',left:x,top:y,transform:`scale(${scale}) rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg)`}}>
        <Archive frame={f} fade={1-smooth(f,144,267)}/>
        <div style={{position:'absolute',transformStyle:'preserve-3d',transform:`scale(${1-.24*strip})`}}>
          <Disc/>
          <Glass z={38+layers*114} opacity={layers} kind="geometry"/>
          <div style={plane(1000,1000,`translateZ(${12+layers*202}px)`)}>
            <Specimen time={sample} spread={spread} wire={wire} trail={.65+.35*wire} label={label}/>
          </div>
          <Glass z={33+layers*338} opacity={layers} kind="labels"/>
          {tag && f<1100 && <div style={{...plane(680,55,`translate3d(0,295px,${54+layers*305}px)`),color:'#f6dbac',textAlign:'center',font:`34px ${mono}`,opacity:windowAt(f,794,823,1058,1094)}}>
            {tag[1].slice(0,Math.max(1,Math.ceil((f-tag[0]+1)*1.15)))}
          </div>}
          <AudioGroove frame={f} opacity={ring} progress={smooth(f,1090,1460)}/>
          {sync>.01 && <svg viewBox="-500 -500 1000 1000" style={{...plane(1000,1000,'translateZ(48px)'),opacity:sync}}>
            <path d="M-346 150Q0 310 346 150" fill="none" stroke="#c8d8bb" strokeWidth="1.3" strokeDasharray="3 7"/>
            <g transform={`translate(${-172+172*cueSweep} ${205+25*cueSweep})`}>
              <rect x="-99" y="-23" width="198" height="44" rx="7" fill="#112d2c" stroke="#dfc89f"/>
              <text textAnchor="middle" y="7" fill="#fff0c9" fontSize="24">the particles spread</text>
            </g>
            <path d={`M0 204Q5 110 ${tx} ${ty}`} stroke="#f8c881" strokeWidth="2" fill="none" pathLength="1" strokeDasharray={`${smooth(f,strikes,strikes+26)} 1`}/>
          </svg>}
          {proof>.01 && <svg viewBox="-500 -500 1000 1000" style={{...plane(1000,1000,'translateZ(41px)'),opacity:proof}}>
            <defs><clipPath id="review-mask"><circle r="400"/></clipPath></defs>
            <g clipPath="url(#review-mask)">
              <path d={`M${-445+890*smooth(f,1803,1931)} -408v816`} stroke="#ffe2a2" strokeWidth="4"/>
              <path d={`M${-471+890*smooth(f,1803,1931)} -408v816`} stroke="#e3d59e" strokeOpacity=".12" strokeWidth="50"/>
            </g>
            <circle cx={tx} cy={ty} r={34+19*compare} stroke="#efcb8f" strokeWidth="2" fill="none" strokeDasharray="8 6"/>
          </svg>}
          {fix>.01 && <svg viewBox="-500 -500 1000 1000" style={{...plane(1000,1000,'translateZ(85px)'),opacity:fix}}>
            <path d="M-288 301H292M-72 265V335" stroke="#e3d7b1" strokeWidth="2"/>
            <text x="-111" y="367" fill="#f1e4c1" fontSize="23">voice cue</text>
            <g transform={`translate(${123-195*smooth(f,cue('changes the scene'),after-6)} 301)`}>
              <path d="M0 0L-9 -13H9Z" fill="#ffbc77"/><text x="0" y="-24" fill="#ffcf95" fontSize="26" textAnchor="middle">label</text>
            </g>
          </svg>}
        </div>
        {paper>.005 && <div style={{...plane(503,634,`translate3d(${paperX}px,${paperY}px,${paperFirst>0?120-90*transfer:95}px) rotateY(${paperFirst>0?-19+17*transfer:9}deg) rotateZ(${paperFirst>0?-12+12*transfer:-8}deg)`),opacity:paper,boxShadow:'-10px 20px 32px #07141770'}}><Note/></div>}
        {srcRay>.01 && <svg viewBox="-850 -400 1700 800" style={{...plane(1700,800,'translateZ(112px)'),opacity:srcRay}}>
          <path d={`M-580 150C-415 210 -332 -260 ${tx} ${ty}`} fill="none" stroke="#e4b97f" strokeWidth="2.8" pathLength="1" strokeDasharray={`${smooth(f,573,651)} 1`}/>
        </svg>}
        {story>.01 && [-1,1].map(i=><div key={i} style={{...plane(1000,1000,`translate3d(${i*(460+200*story)}px,130px,-110px) scale(.4)`),borderRadius:'50%',background:'#123638',border:'3px solid #87a89b',opacity:story*.9}}>
          <Specimen time={i<0?10:90} spread={i<0?.15:.92} trail={.5}/>
        </div>)}
        <FilmRibbon opacity={strip} progress={.75+.25*strip} advance={-2.1+travel*5.3} audio={smooth(f,cue('adds the narration'),1711)}/>
      </div>
    </div>
    {f<260 && <div style={{...edge,top:93,opacity:windowAt(f,7,42,194,252),textShadow:'0 4px 25px #061719'}}>
      <div style={{fontSize:24,letterSpacing:2,color:'#d4dcc6'}}>Worldwide · 2024</div>
      <div style={{font:'128px Georgia',lineHeight:1.06,letterSpacing:-6}}>9,600</div>
      <div style={{fontSize:26}}>papers per day, on average</div>
    </div>}
    {f>=285 && f<506 && <div style={{...edge,top:124,opacity:windowAt(f,298,340,427,500),font:'75px Georgia',lineHeight:.99,letterSpacing:-3}}>Imagine<br/>Science</div>}
    {f>=1750 && f<1950 && <div style={{...edge,opacity:windowAt(f,1768,1805,1918,1946),fontSize:26}}>
      <div style={{font:'37px Georgia',marginBottom:17}}>Export check</div>
      {[[cue('frame count,'),'2,429 frames'],[cue('dimensions,'),'1920 × 1080'],[cue('audio track,'),'AAC narration']].map(([at,s])=><div key={s} style={{marginTop:7,color:'#d1dfc9',opacity:smooth(f,Number(at),Number(at)+10)}}>{s}</div>)}
    </div>}
    {f>=2347 && <div style={{...edge,top:312,left:115,opacity:smooth(f,2347,2376),transform:`translateX(${-28*(1-smooth(f,2347,2376))}px)`}}>
      <div style={{font:'126px Georgia',letterSpacing:-6,lineHeight:.92}}>Imagine<br/>Science</div>
      <div style={{fontSize:27,marginTop:48,color:'#cbd9c8'}}>github.com/iamnikhiliyer/imagine-science</div>
    </div>}
  </>;
}

export function MethodFilm() {
  const f=useCurrentFrame();
  return <AbsoluteFill style={{background:'#0a1d21',overflow:'hidden',fontFamily:field}}>
    <Projection f={f}/><Narration/>
  </AbsoluteFill>;
}
