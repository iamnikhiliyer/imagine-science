import '@fontsource-variable/manrope';
import type {ReactNode} from 'react';
import {createTikTokStyleCaptions} from '@remotion/captions';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import project from '../../film.project.json';
import words from './words.json';
import envelope from './waveform.json';
import {smooth} from './process/motion';

const paper='#f6f4ed', sheet='#fffef8', ink='#193731', green='#367b63', faint='#bccac0', orange='#b75937';
const sans='Manrope Variable, Arial, sans-serif', mono='Menlo, monospace';
function at(phrase:string) {
  const tokens=phrase.split(' ');
  const index=words.findIndex((_,i)=>tokens.every((t,j)=>words[i+j]?.text===t));
  if(index<0)throw Error('Missing narration anchor '+phrase);
  return Math.ceil(words[index].startMs*project.fps/1000);
}
const marks={
  stat:at('9,600'), single:at('single figure'), name:at('Imagine Science is'), animate:at('turn research'),
  source:at('It starts'), claim:at('each claim'), cite:at('its source,'), story:at('builds a storyline'),
  code:at('The agent writes'), react:at('React describes'), svg:at('SVG draws'), shape:at('shapes and labels.'),
  labels:at('labels.'), remotion:at('Remotion controls'), next:at('Next, ElevenLabs'), voice:at('generates one'),
  phrase:at('each phrase'), caption:at('place the captions'), motion:at('cue the motion.'), show:at('When the narrator'),
  spread:at('spread, the cloud'), export:at('Once the timing'), frames:at('renders the frames'),
  join:at('stitches them'), add:at('adds the narration'), mp4:at('final MP4.'), check:at('Then the agent'),
  count:at('frame count,'), size:at('dimensions,'), audio:at('audio track,'), compare:at('compares individual'),
  play:at('Watching the film'), late:at('If a label'), lateWord:at('late, or'),
  evidence:at('a movement suggests'), fix:at('changes the scene'), replay:at('renders it again.'), end:at('Check out'),
};
const t=(f:number,start:number,length:number)=>smooth(f,start,start+length);
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;

function Label({x=0,y=0,children,size=26,color=ink,face=sans,anchor='middle',weight=500}:{x?:number;y?:number;children:ReactNode;size?:number;color?:string;face?:string;anchor?:'start'|'middle'|'end';weight?:number}) {
  return <text x={x} y={y} fill={color} fontSize={size} fontFamily={face} textAnchor={anchor} fontWeight={weight}>{children}</text>;
}
function stroke(d:string,progress=1,color=green,width=3) {
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray={`${progress} 1`}/>;
}
const dots=Array.from({length:17},(_,i)=>{
  const a=i*2.39996,r=Math.sqrt((i+.5)/17);
  return {x:r*Math.cos(a),y:r*Math.sin(a),radius:i===12?11:7+i%3};
});
// Every view uses the same positions, including the paper diagram and the replay.
function Cloud({spread=0,draw=1,outlines=false}:{spread?:number;draw?:number;outlines?:boolean}) {
  return <>{dots.map((p,i)=>{
    const show=Math.max(0,Math.min(1,draw*dots.length-i));
    const bend=Math.sin(spread*Math.PI)*(i%2?10:-10);
    return <circle key={i} cx={p.x*(51+223*spread)+bend} cy={p.y*(47+104*spread)-bend*.6}
      r={p.radius} fill={outlines?'none':i===12?orange:green} stroke={i===12?orange:green} strokeWidth="2.8" opacity={show}/>;
  })}</>;
}
function Panel({spread=0,label='',draw=1,outlines=false}:{spread?:number;label?:string;draw?:number;outlines?:boolean}) {
  return <><rect x="-330" y="-187" width="660" height="374" rx="19" fill={sheet} stroke={ink} strokeWidth="3"/>
    <Cloud spread={spread} draw={draw} outlines={outlines}/>
    {label && <Label y={235} size={27}>{label}</Label>}
  </>;
}
function Note({highlight=0,cite=0,stat=false,number=1,figure=false}:{highlight?:number;cite?:number;stat?:boolean;number?:number;figure?:boolean}) {
  return <>
    <rect x="-304" y="-234" width="608" height="468" rx="9" fill={sheet} stroke={ink} strokeWidth="3"/>
    {stat ? <>
      <Label y={-109} size={23} color={green}>Worldwide · 2024</Label>
      <g opacity={number} transform={`translate(0 ${10*(1-number)})`}><Label y={41} size={136} face="Georgia">9,600</Label></g>
      <Label y={103} size={25}>Science and engineering papers per day</Label>
    </> : <>
      <Label x={-253} y={-166} anchor="start" size={40} face="Georgia">Brownian motion</Label>
      <Label x={-251} y={-127} anchor="start" size={21} color={green}>Research note · Einstein, 1905</Label>
      <g transform="translate(0 -24) scale(.49)"><Cloud spread={.75}/></g>
      {figure ? <path d="M-76 83H76" stroke={faint} strokeWidth="3"/> : <>
        <Label x={-249} y={105} size={25} anchor="start">A localized cloud spreads over time.</Label>
        {stroke('M-248 119H192',highlight,orange,4)}
        <g opacity={cite}><Label x={-247} y={177} anchor="start" size={22} color={green}>Source · sections IV–V</Label></g>
      </>}
    </>}
  </>;
}
function Wave({progress=1,width=680,height=72}:{progress?:number;width?:number;height?:number}) {
  return <>{envelope.map((amp,i)=>{
    const p=Math.max(0,Math.min(1,progress*envelope.length-i));
    const x=-width/2+(i+.5)*width/envelope.length,h=p*(3+height*amp);
    return h>0?<path key={i} d={`M${x} ${-h}v${2*h}`} stroke={green} strokeWidth={Math.min(5,width/110)} strokeLinecap="round"/>:null;
  })}</>;
}
function Triptych({progress,join=0}:{progress:number;join?:number}) {
  return <>{[0,1,2].map(i=>{
    const p=Math.max(0,Math.min(1,progress*3-i));
    const slide=t(progress,.333,.42);
    const x=(i-1)*mix(344,294,join)+(1-slide)*344;
    return <g key={i} opacity={p} transform={`translate(${x} ${20*(1-p)}) scale(.445)`}><Panel spread={i/2}/></g>;
  })}</>;
}
const title=(s:string)=><Label y={-267} size={35} weight={650}>{s}</Label>;

function PaperSequence({f}:{f:number}) {
  const concentrate=t(f,marks.single-24,34);
  if(f<marks.name) {
    const toFigure=t(f,marks.single-5,21);
    return <>
      {[3,2,1].map(i=><rect key={i} transform={`translate(${(1-t(f,7+(3-i)*21,27))*92} 0)`} x={-304+i*mix(32,0,concentrate)} y={-234-i*(13+7*t(f,20,46))*(1-concentrate)} width="608" height="468" rx="9" fill={sheet} stroke={ink} strokeWidth="2.5" opacity={(1-concentrate)*t(f,7+(3-i)*21,21)}/>)}
      <g opacity={1-toFigure}><Note stat number={t(f,marks.stat-6,15)}/></g>
      <g opacity={toFigure}><Note figure/></g>
    </>;
  }
  if(f<marks.source) {
    const lift=t(f,marks.animate,31),run=t(f,marks.animate+30,44);
    return <>
      {title('Imagine Science')}
      <g transform={`scale(${mix(.84,.96,lift)})`}><g opacity={1-lift}><Note figure/></g>
        <g opacity={lift}><Panel spread={run}/></g></g>
    </>;
  }
  if(f<marks.story) return <Note highlight={t(f,marks.claim,22)} cite={t(f,marks.cite,14)}/>;
  const progress=t(f,marks.story,64);
  return <>{title('Storyline')}<Triptych progress={.333+.667*progress}/></>;
}
function WriteScene({f}:{f:number}) {
  if(f<marks.react) {
    const code='const scene = <ParticleCloud />;';
    return <>{title('TypeScript')}<Label y={13} face={mono} size={40}>{code.slice(0,Math.ceil(code.length*t(f,marks.code,62)))}</Label></>;
  }
  if(f<marks.svg){
    const branch=t(f,marks.react+7,27),children=t(f,marks.react+28,18);
    return <>{title('React')}<Label y={-60} face={mono} size={38}>ParticleCloud</Label>
      {stroke('M0 -30V8M-145 40V8H145V40',branch)}
      <g opacity={children}><Label x={-145} y={91} size={31}>Particles</Label><Label x={145} y={91} size={31}>Label</Label></g></>;
  }
  if(f<marks.remotion){
    return <>{title('SVG')}<Panel draw={t(f,marks.svg,43)} label={f>=marks.labels?'Particle cloud':''}/></>;
  }
  const run=t(f,marks.remotion+14,70);
  return <>{title('Remotion')}<Panel spread={run} label={`Frame ${Math.round(run*60)}`}/></>;
}
function Voice({f}:{f:number}) {
  if(f<marks.show) {
    const marker=t(f,marks.phrase,29),attach=t(f,marks.caption,22);
    return <>{title('ElevenLabs')}<Wave progress={t(f,marks.next,86)}/>
      {stroke('M-338 104H338',t(f,marks.voice+36,30),faint,2)}
      <g opacity={marker} transform={`translate(${mix(-310,-68,marker)} 0)`}>
        <path d="M0 -94V105" stroke={orange} strokeWidth="3"/>
        <g opacity={attach} transform={`translate(0 ${22*(1-attach)})`}><Label y={151} size={25}>“the particles spread”</Label></g>
        {f>=marks.motion && <circle cy="104" r={7*t(f,marks.motion,10)} fill={orange}/>}
      </g></>;
  }
  return <Panel spread={t(f,marks.spread,41)}/>;
}
function FileIcon({check=0}:{check?:number}){
  return <><path d="M-105 -143H42L109 -77V143H-105Z" fill={sheet} stroke={ink} strokeWidth="4" strokeLinejoin="round"/>
    <path d="M42 -142V-77H108" fill="none" stroke={ink} strokeWidth="3"/>
    <Label y={31} size={45} face={mono}>MP4</Label>
    {check>0 && stroke('M-25 80l18 18 38 -43',check,green,5)}</>;
}
function Export({f}:{f:number}){
  const reveal=t(f,marks.frames,54),join=t(f,marks.join,30),add=t(f,marks.add,29),file=t(f,marks.mp4-8,25);
  return <>{title(f<marks.join-19?'Remotion':'FFmpeg')}
    <g opacity={1-file} transform={`scale(${mix(1,.72,file)})`}><Triptych progress={.333+reveal*.667} join={join}/>
      <g transform="translate(0 135)" opacity={add}><Wave width={854} height={17} progress={add}/></g></g>
    <g opacity={file}><FileIcon/></g></>;
}
function Review({f}:{f:number}){
  if(f<marks.compare){
    const info=f<marks.count?'':f<marks.size?`${project.durationInFrames.toLocaleString('en-US')} frames`:f<marks.audio?`${project.width} × ${project.height}`:'AAC audio';
    return <>{title('Export check')}<FileIcon check={t(f,marks.check+22,21)}/><Label y={211} size={33}>{info}</Label></>;
  }
  if(f<marks.play){
    const compare=t(f,marks.compare,38);
    return <>{title('Compare with the source')}
      <g transform={`translate(${-230*compare} 0) scale(.64)`}><Note/></g>
      <g transform={`translate(${250*compare} 0) scale(.60)`} opacity={compare}><Panel spread={.75} label="Rendered frame"/></g></>;
  }
  return <Panel spread={t(f,marks.play+18,66)} label="Playback"/>;
}
function Revision({f}:{f:number}){
  if(f<marks.fix) {
    const demo=f-marks.late, questionable=t(f,marks.evidence+12,31);
    return <>{title('Review the timing')}<Panel spread={t(demo,2,24)*(1-.52*questionable)} label={f>=marks.lateWord?'Cloud spreads':''}/></>;
  }
  if(f<marks.replay) {
    const move=t(f,marks.fix+3,31),x=mix(230,-83,move);
    return <>{title('Edit the cue')}{stroke('M-317 0H317',1,faint)}
      <path d="M-83 -54V54" stroke={green} strokeWidth="4"/><Label x={-83} y={100} size={26}>Voice</Label>
      <g transform={`translate(${x} 0)`}><circle r="10" fill={orange}/><Label y={-67} size={26}>Label</Label></g></>;
  }
  const replay=t(f,marks.replay+2,24);
  return <>{title('Replay')}<Panel spread={replay} label={f>=marks.replay+2?'Cloud spreads':''}/></>;
}
const {pages: captionPages} = createTikTokStyleCaptions({
  captions: words.map(word => ({...word, text: ' ' + word.text})),
  combineTokensWithinMilliseconds: 10_000,
});

function WordHighlight({ms}: {ms: number}) {
  const page = captionPages.find(({startMs, tokens}) =>
    startMs <= ms && ms < tokens[tokens.length - 1].toMs);
  if (!page) return null;
  // Render the companion films' 1920px caption layout at this composition's scale.
  return <div style={{
    position: 'absolute', insetInline: 0, bottom: '10.926%', display: 'flex',
    justifyContent: 'center', pointerEvents: 'none', fontFamily: sans,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4, backgroundColor: '#edf0e5',
      borderRadius: 120, padding: '18px 34px', color: '#090f12', fontSize: 98,
      fontWeight: 670, lineHeight: 1.15, letterSpacing: '-.025em',
    }}>
      {page.tokens.map(token => <span key={token.fromMs} style={{
        backgroundColor: ms >= token.fromMs && ms < token.toMs ? '#afdfca' : 'transparent',
        padding: '6px 14px 12px', borderRadius: 48,
      }}>{token.text.trim()}</span>)}
    </div>
  </div>;
}

export function LineFilm(){
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  let drawing:ReactNode;
  if(f<marks.code)drawing=<PaperSequence f={f}/>;
  else if(f<marks.next)drawing=<WriteScene f={f}/>;
  else if(f<marks.export)drawing=<Voice f={f}/>;
  else if(f<marks.check)drawing=<Export f={f}/>;
  else if(f<marks.late)drawing=<Review f={f}/>;
  else if(f<marks.end)drawing=<Revision f={f}/>;
  else drawing=<><Label y={-8} face="Georgia" size={95}>Imagine Science</Label><Label y={70} size={27} color={green}>github.com/iamnikhiliyer/imagine-science</Label></>;
  return <AbsoluteFill style={{background:paper}}>
    <svg width="100%" height="100%" viewBox="0 0 1600 900">
      <g transform="translate(800 410) scale(1.16)">{drawing}</g>
    </svg>
    <WordHighlight ms={f * 1000 / fps}/>
    <Audio src={staticFile(project.audio.path)} premountFor={fps}/>
  </AbsoluteFill>;
}
