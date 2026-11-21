import '@fontsource-variable/manrope';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import type { ReactNode } from 'react';
import project from '../../film.project.json';
import waveform from './waveform.json';
import words from './words.json';
import { Narration } from './Narration';

const ink = '#11282b', muted = '#4e6963', mint = '#8ad5bd', coral = '#ff9778', paper = '#f3eee1';
const mono = 'Menlo, monospace', serif = 'Georgia, serif';
const ease = (frame: number, start: number, end: number) => {
  const t = Math.max(0, Math.min(1, (frame - start) / (end - start)));
  return t * t * (3 - 2 * t);
};
function cue(label: string) {
  const found = project.cues.find(c => c.label === label);
  if (!found) throw new Error('Missing visual cue ' + label);
  return found.frame;
}

const seeds = Array.from({length: 92}, (_, i) => ({
  x: Math.cos(i * 2.39996) * Math.sqrt((i + 1) / 92),
  y: Math.sin(i * 2.39996) * Math.sqrt((i + 1) / 92),
  phase: random('diffusion-' + i) * Math.PI * 2,
}));

function point(i: number, frame: number, spread: number) {
  const {x, y, phase} = seeds[i];
  return [
    x * (38 + 278 * spread) + Math.sin(frame * .042 + phase) * (4 + spread * 12),
    y * (34 + 154 * spread) + Math.cos(frame * .037 + phase) * (3 + spread * 11),
  ];
}

function Cloud({frame, spread, annotation = true, wire = 0}: {frame: number; spread: number; annotation?: boolean; wire?: number}) {
  const track = 80;
  const trail = Array.from({length: 35}, (_, j) => point(track, frame - 3 * (34 - j), Math.max(0, spread - (34 - j) * .012)).join(',')).join(' ');
  const [tx, ty] = point(track, frame, spread);
  return <g>
    {[68,136,204].map(r=><circle key={r} r={r} fill="none" stroke="#49645e" strokeWidth="1" strokeDasharray="2 9"/>)}
    <path d="M-338 0H338 M0 -194V194" stroke="#345651" strokeDasharray="4 9"/>
    <polyline points={trail} fill="none" stroke={coral} strokeWidth="2.5" opacity={annotation ? .95 : .12}/>
    {seeds.map((_,i)=>{const [x,y]=point(i,frame,spread);return <circle key={i} cx={x} cy={y} r={i%5===0?5.2:3.8} fill={wire>.65?'none':i%9===0?'#f5e8bc':mint} stroke={mint} strokeWidth={wire>.65?1.8:.4}/>;})}
    <circle cx={tx} cy={ty} r="7" fill={coral}/>
    {annotation && <circle cx={tx} cy={ty} r="15" stroke={coral} fill="none" strokeWidth="1.5"/>}
  </g>;
}

function Type({x=0,y=0,size=25,fill=ink,face='Manrope Variable',children,weight=500}: {x?:number;y?:number;size?:number;fill?:string;face?:string;children:ReactNode;weight?:number}) {
  return <text x={x} y={y} fill={fill} fontSize={size} fontFamily={face} fontWeight={weight}>{children}</text>;
}

function ReferencePage({frame}: {frame:number}) {
  return <g>
    <rect width="360" height="458" fill="#f9f6ec" stroke="#b1b5a5" strokeWidth="2"/>
    <path d="M27 65H332 M27 371H332" stroke="#97a99a"/>
    <Type x={28} y={42} size={15} face={mono}>RESEARCH NOTE   /   1905</Type>
    <Type x={28} y={113} size={37} face={serif}>Brownian motion</Type>
    <Type x={29} y={146} size={18} fill={muted}>Albert Einstein · Annalen der Physik</Type>
    <rect x="28" y="177" width="304" height="163" fill={ink}/>
    <g transform="translate(180 260) scale(.38)"><Cloud frame={frame} spread={.86}/></g>
    <Type x={29} y={397} size={15} face={mono}>ORIGINAL SCHEMATIC</Type>
    <Type x={29} y={426} size={16} fill={muted}>doi:10.1002/andp.19053220806</Type>
  </g>;
}

function Lines({items, active, y=475}: {items:string[];active:number;y?:number}) {
  return <g>{items.map((line,i)=><g key={line} opacity={i<=active?1:.38}>
    <rect x={105} y={y+i*54-20} width={i===active?35:13} height="3" fill={i===active?'#ae4938':'#789088'}/>
    <Type x={157} y={y+i*54-8} size={27} fill={i===active?ink:muted}>{line}</Type>
  </g>)}</g>;
}

function Scope({frame,spread,annotation=true,wire=0,tag='Illustrative diffusion',footer='Particle trajectories · schematic'}:{frame:number;spread:number;annotation?:boolean;wire?:number;tag?:string;footer?:string}) {
  return <g>
    <rect width="840" height="568" rx="3" fill={ink}/>
    <path d="M32 71H808 M32 498H808" stroke="#5c7972"/>
    <Type x={36} y={48} size={20} face={mono} fill="#ccdfcf">{tag}</Type>
    <Type x={36} y={540} size={20} fill="#c4d6c7">{footer}</Type>
    <g transform="translate(420 286)"><Cloud frame={frame} spread={spread} annotation={annotation} wire={wire}/></g>
  </g>;
}

function Wave({progress,x,y,w=710,h=68}:{progress:number;x:number;y:number;w?:number;h?:number}) {
  return <g transform={`translate(${x} ${y})`}>
    {waveform.map((v,i)=><path key={i} d={`M${i*w/waveform.length} ${-4-v*h/2}v${8+v*h}`} stroke={i/waveform.length<=progress?'#a54a36':'#acb4a6'} strokeWidth="4"/>)}
    <path d={`M${w*progress} ${-h*.7}v${h*1.4}`} stroke={ink} strokeWidth="3"/>
  </g>;
}

function Strip({frame,progress}: {frame:number;progress:number}) {
  return <g transform="translate(110 626)">
    <rect width="1670" height="206" fill={ink}/>
    {Array.from({length:67},(_,i)=><path key={i} d={`M${12+i*25} 11h12 M${12+i*25} 194h12`} stroke="#c5cdbb" strokeWidth="5"/>)}
    {[0,1,2,3,4,5,6].map(i=><g key={i} transform={`translate(${25+i*235} 27)`} opacity={progress*7>=i?1:.24}>
      <rect width="208" height="149" fill="#1a3938" stroke="#6e9186"/>
      <g transform="translate(104 74) scale(.29)"><Cloud frame={frame+i*11} spread={i/6} annotation={false}/></g>
      <Type x={8} y={135} size={14} face={mono} fill="#b6c7b9">{String(i*10).padStart(3,'0')}</Type>
    </g>)}
  </g>;
}

function Heading({lines}:{lines:string[]}) {
  return <>{lines.map((line,i)=><Type key={line} x={101} y={281+i*93} size={83} face={serif}>{line}</Type>)}</>;
}

export function MethodFilm() {
  const frame = useCurrentFrame();
  const scene = project.scenes.find(s => frame < s.endFrame)!;
  const id = scene.id;
  const local = frame-scene.startFrame;
  const age = (label:string, n=20)=>ease(frame,cue(label),cue(label)+n);
  const idleSpread = .48 + .34*Math.sin(frame*.017);
  const sampleSpread = id==='voice' ? .08+.91*age('the particles spread,',41) : idleSpread;
  const wordFrame = (term: string) => Math.ceil(words.find(w => w.text === term)!.startMs * project.fps / 1000);
  const focus = id === 'mission' ? 1 : ease(frame,wordFrame('outside'),wordFrame('figure'));
  const intoFilm = id === 'mission' ? ease(frame,wordFrame('turn'),wordFrame('animations')) : 0;
  const correctedRun = frame >= cue('renders it again.');
  const revisionClock = correctedRun ? frame - cue('renders it again.') : local;
  const revisionSpread = .10 + .79 * ease(revisionClock, 2, 31);
  const labelShown = ease(revisionClock, correctedRun ? 2 : 52, correctedRun ? 10 : 64);
  const switchCue = (labels:string[]) => labels.filter(l=>frame>=cue(l)).length;
  const codeStep = switchCue(['React describes','SVG draws','Remotion controls']);
  const exportProgress = age('renders the frames',67);
  const correction = age('changes the scene',27);
  return <AbsoluteFill style={{background:paper,fontFamily:'Manrope Variable, Arial, sans-serif'}}>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs><pattern id="folio-grid" width="38" height="38" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#738675" opacity=".28"/></pattern></defs>
      <rect width="1920" height="1080" fill="url(#folio-grid)"/>
      <path d="M102 103H1818 M102 887H1818" stroke="#9aa99b" strokeWidth="1.5"/>
      <Type x={103} y={75} size={25} weight={720}>Imagine Science</Type>
      <text x="1818" y="75" textAnchor="end" fontSize="20" fontFamily={mono} fill={muted}>{scene.title}</text>
      {(id==='opening'||id==='mission') && <>
        <g opacity={1-intoFilm} transform={`translate(${960-135*focus} ${152-15*focus}) scale(${1+focus*.12})`}>
          {[4,3,2,1,0].map(i=><g key={i} transform={`translate(${330+i*(40-38*focus)+(i+1)*Math.cos(frame*.009)*8+(1-ease(frame,0,88))*i*105} ${40+i*8}) rotate(${(-8+i*7)*(1-focus)+(i+1)*Math.sin(frame*.011)*.6} 180 230) scale(1.18)`}><ReferencePage frame={frame+i*12}/></g>)}
        </g>
        {id==='mission' && intoFilm>0 && <g opacity={intoFilm} transform={`translate(${965+90*(1-intoFilm)} 195)`}><Scope frame={frame} spread={.12+.8*ease(local,125,205)} tag="From the research note" footer="An editable, narrated figure"/></g>}
        {id==='opening' ? <><g opacity={1-focus}>
          <Type x={100} y={321} size={35} face={mono} fill={muted}>Worldwide · 2024</Type>
          <Type x={85} y={523} size={209} face={serif}>{(Math.round(96*ease(frame,0,wordFrame('9,600')))*100).toLocaleString('en-US')}</Type>
          <Type x={106} y={587} size={40}>science and engineering papers a day</Type>
          <Type x={106} y={797} size={23} fill={muted}>Daily average · National Science Board</Type></g>
          <g opacity={focus}>
            <Heading lines={['What changed','in the figure?']}/>
            <path d={`M110 471h${580*focus}`} stroke="#aa5540" strokeWidth="3"/>
            <Type x={109} y={555} size={34}>From one particle to the whole cloud.</Type>
          </g>
        </> : <>
          <Heading lines={['Imagine','Science']}/>
          <Type x={106} y={485} size={36}>An open-source animation studio</Type>
          <path d={`M107 552h${600*ease(local,0,115)}`} stroke="#b65e45" strokeWidth="3"/>
          <Type x={106} y={638} size={27} fill={muted}>Research paper → editable scientific film</Type>
        </>}
      </>}
      {id==='source' && <>
        <g transform={`translate(${130+20*ease(local,0,95)} 162) rotate(-3 180 230) scale(1.36)`}><ReferencePage frame={frame}/></g>
        <path d="M665 463C795 463 779 321 927 321" fill="none" stroke="#a85741" strokeWidth="3" pathLength="1" strokeDasharray={`${age('each claim',30)} 1`}/>
        <g transform="translate(957 0)">
          <Type y={272} size={66} face={serif}>Trace the claim.</Type>
          <Type y={367} size={32}>A localized cloud spreads over time.</Type>
          <Type y={416} size={22} fill={muted}>Source note · Einstein, 1905, §§ IV–V</Type>
          <g opacity={age('builds a storyline',15)}>
            <Type y={531} size={37} face={serif}>Build the sequence</Type>
            {[0,.48,.98].map((n,i)=><g key={n} transform={`translate(${i*269} 577)`}><rect width="240" height="144" fill={ink}/><g transform="translate(120 74) scale(.32)"><Cloud frame={frame} spread={n} annotation={false}/></g><Type y={185} size={23}>{['Localize','Follow','Pull back'][i]}</Type></g>)}
          </g>
        </g>
      </>}
      {id==='code' && <>
        <Heading lines={['Writing','the scene']}/>
        <g transform="translate(105 468)">
          {['Diffusion.tsx','<ParticleCloud />','<circle cx={x} cy={y} />','useCurrentFrame()'].map((line,i)=><g key={line}>
            <rect x="-2" y={i*61-36} width="646" height="51" fill={i===codeStep?'#d4dfce':'none'}/>
            <Type x={13} y={i*61} size={27} face={mono} fill={i===codeStep?ink:muted}>{line}</Type>
          </g>)}
        </g>
        <g transform="translate(890 192)"><Scope frame={frame} spread={codeStep===3?.10+.84*age('Remotion controls',71):.52} wire={codeStep===2?1:0} tag={['TypeScript / scene definition','React / component tree','SVG / vector geometry','Remotion / frame clock'][codeStep]} footer={['Component source','ParticleCloud → particles → label','Circle positions and editable labels','Position changes with the frame number'][codeStep]}/></g>
      </>}
      {id==='voice' && <>
        <Heading lines={['One continuous','voice track']}/>
        <Lines items={['Generate narration with Kokoro','Align the captions','Cue the particle motion']} active={switchCue(['place the captions','cue the motion.'])}/>
        <Wave x={108} y={746} w={645} progress={local/(scene.endFrame-scene.startFrame)} />
        <g transform="translate(887 193)"><Scope frame={frame} spread={sampleSpread} tag="Voice and picture" footer={frame<cue('the particles spread,')?'Awaiting the spoken cue':'“the particles spread”'}/></g>
      </>}
      {id==='export' && <>
        <Type x={100} y={276} size={90} face={serif}>{frame<cue('FFmpeg stitches')?'Rendering the frames':'Encoding the film'}</Type>
        <Type x={107} y={367} size={33}>{frame<cue('FFmpeg stitches')?'Remotion · headless browser':'FFmpeg · H.264 + AAC → MP4'}</Type>
        <g transform="translate(1100 132) scale(.72)"><Scope frame={frame} spread={exportProgress} tag="Render preview" footer="Schematic sequence"/></g>
        <path d="M110 470H916" stroke="#bdc8b9" strokeWidth="4"/><path d={`M110 470H${110+806*exportProgress}`} stroke="#577d6d" strokeWidth="6"/>
        {frame>=cue('adds the narration') && <Wave x={110} y={550} w={800} h={35} progress={age('adds the narration',60)}/>}
        <Strip frame={frame} progress={exportProgress}/>
      </>}
      {id==='review' && <>
        <Heading lines={['Check','the export']}/>
        <Lines items={[`${project.durationInFrames.toLocaleString('en-US')} decoded frames`,'1920 × 1080 at 30 fps','AAC narration','Compare the frame with its source','Play through at full speed']} active={switchCue(['frame count,','dimensions,','audio track,','compares individual','Watching the film'])-1}/>
        <g transform="translate(888 193)"><Scope frame={frame<cue('Watching the film')?0:local} spread={frame<cue('Watching the film')?.75:idleSpread} tag={frame<cue('Watching the film')?'Frame inspection':'Playback / 1.00×'} footer="Original illustrative sequence"/>
          {frame>=cue('compares individual') && frame<cue('Watching the film') && <g transform="translate(13 88) scale(.60)"><ReferencePage frame={0}/></g>}
        </g>
      </>}
      {id==='revise' && <>
        <Heading lines={['Correct','the cue']}/>
        <Type x={107} y={487} size={30}>Label timing</Type>
        <path d="M108 620H755" stroke="#879d8c" strokeWidth="3"/>
        <path d="M355 574V672" stroke={ink} strokeWidth="3"/>
        <Type x={285} y={709} size={21} face={mono}>spoken cue</Type>
        <g transform={`translate(${505-150*correction} 583)`}><rect width="192" height="72" rx="3" fill={correction>.9?'#bad6c3':'#edb29a'}/><Type x={22} y={46} size={22}>Cloud spreads</Type></g>
        <g transform="translate(888 193)"><Scope frame={local} spread={revisionSpread} tag={correction>.9?'Revised scene':'Review / timing discrepancy'} footer={correction>.9?'Label and motion share a cue':'Label enters after the motion'}/>
          <g opacity={labelShown}><path d="M580 199l65 -47h118" stroke={coral} fill="none" strokeWidth="2"/>
          <Type x={630} y={133} size={23} fill={coral}>Cloud spreads</Type></g></g>
      </>}
      {id==='close' && <>
        <Type x={98} y={342} size={115} face={serif}>Imagine Science</Type>
        <Type x={105} y={447} size={43}>Explore the project on GitHub.</Type>
        <Type x={107} y={562} size={28} face={mono} fill={muted}>github.com/iamnikhiliyer/</Type>
        <Type x={107} y={607} size={34} face={mono}>imagine-science</Type>
        <g transform="translate(1005 201) scale(.90)"><Scope frame={frame} spread={idleSpread} tag="Imagine Science" footer="Editable source · illustrative diffusion"/></g>
      </>}
    </svg>
    <Narration/>
  </AbsoluteFill>;
}
