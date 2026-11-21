import '@fontsource-variable/manrope';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import project from './project.json';
import { Narration } from '../Narration';
import { Inputs } from './Inputs';
import { Plate } from './Plate';
import { events, processState, smooth } from './motion';

export function ProcessVisual({ frame }: { frame: number }) {
  const state = processState(frame);
  const { camera } = state;
  const actionBeats = [
    { frame: events.identity, text: 'Imagine Science' },
    { frame: events.sources, text: 'From your references.' },
    { frame: events.build, text: 'Build the scene.' },
    { frame: events.sequence, text: 'Show the sequence.' },
    { frame: events.slow, text: 'Slow the critical step.' },
    { frame: events.match, text: 'Match narration to action.' },
    { frame: events.freeze, text: 'Shape the explanation.' },
    { frame: events.timingStart, text: 'Adjust the timing.' },
    { frame: events.editStart, text: 'Refine the labels.' },
    { frame: events.resume, text: 'Keep shaping the same project.' },
  ];
  const actionIndex = actionBeats.findIndex((beat,i)=>frame>=beat.frame && frame<(actionBeats[i+1]?.frame ?? events.closing));
  const action = actionBeats[actionIndex];
  const actionOpacity = action ? smooth(frame,action.frame,action.frame+9)*(1-smooth(frame,(actionBeats[actionIndex+1]?.frame ?? events.closing)-5,actionBeats[actionIndex+1]?.frame ?? events.closing)) : 0;
  const slowVisible = smooth(frame,events.slow,events.slow+12)*(1-smooth(frame,events.freeze-8,events.freeze));
  return <AbsoluteFill style={{ background: '#09191f', fontFamily: 'Manrope Variable,Arial,sans-serif', overflow: 'hidden' }}>
    <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="lab-light" cx=".55" cy=".36" r=".7"><stop stopColor="#294a48"/><stop offset=".58" stopColor="#11282c"/><stop offset="1" stopColor="#07151b"/></radialGradient>
        <radialGradient id="floor-light"><stop stopColor="#648d7528"/><stop offset="1" stopColor="#648d7500"/></radialGradient>
        <filter id="floor-blur"><feGaussianBlur stdDeviation="24"/></filter>
      </defs>
      <rect width="1920" height="1080" fill="url(#lab-light)"/>
      <ellipse cx={camera.x} cy="825" rx={620*camera.scale} ry="75" fill="#000" opacity=".28" filter="url(#floor-blur)"/>
      <ellipse cx="1000" cy="745" rx="950" ry="260" fill="url(#floor-light)"/>
      <path d="M-160 855L1920 920M-100 901L1920 966" stroke="#42665c" opacity=".15"/>
    </svg>
    <div style={{ position: 'absolute', inset: 0, perspective: 1800, perspectiveOrigin: '50% 45%' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.scale}) rotateX(${camera.rx}deg) rotateY(${camera.ry}deg) rotateZ(${camera.rz}deg)` }}>
        <Inputs frame={frame} opacity={state.sources} progress={state.input}/>
        {state.strip>0 && [-2,-1,1,2].map(i=><Plate key={i} frame={frame} sampleFrame={72+i*17} scale={.63} x={i*710*state.strip} opacity={state.strip} miniature />)}
        {state.strip>0 && <svg width="3700" height="650" style={{ position: 'absolute', left: -1850, top: -325, opacity: state.strip, transform: 'translateZ(-25px)' }}>
          <path d="M0 95H3700M0 555H3700" stroke="#779b89" strokeWidth="2"/>
          {Array.from({length:68},(_,i)=><g key={i}><rect x={i*55+8} y="106" width="25" height="15" rx="3" fill="#b4c9ab" opacity=".65"/><rect x={i*55+8} y="529" width="25" height="15" rx="3" fill="#b4c9ab" opacity=".65"/></g>)}
        </svg>}
        <Plate frame={frame} sampleFrame={state.sampleFrame} layers={state.layers} wire={state.wire} scale={state.heroScale} inspect={state.inspect} correction={state.correction} cue={state.cue} narrationVisible={slowVisible} timingVisible={state.timingVisible} timingCorrection={state.timingCorrection}/>
        {state.layers>.01 && <div style={{ position: 'absolute', left: 560, top: 80, transform: 'translateZ(110px)', color: '#a6cbb6', fontSize: 23, opacity: state.layers, borderLeft: '1px solid #8ab79f', padding: '8px 16px', whiteSpace: 'nowrap' }}>Source, geometry, timing.<br/><span style={{fontSize:17,color:'#789f8e'}}>Independently editable.</span></div>}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 100, color: '#9bbbab', fontSize: 21, letterSpacing: 2, opacity: 1-smooth(frame,events.identity-15,events.identity) }}>ILLUSTRATIVE SEQUENCE</div>
    <div style={{ position: 'absolute', left: 120, top: 118, color: '#c1d6c4', fontSize: 36, letterSpacing: -.7, opacity: actionOpacity }}>{action?.text}</div>
    <div style={{ position: 'absolute', right: 120, top: 103, textAlign: 'right', color: '#d4e3c9', opacity: slowVisible }}>
      <div style={{ fontSize: 16, letterSpacing: 2, color: '#9ab9a6' }}>PLAYBACK</div>
      <div style={{ fontSize: 38, fontVariantNumeric: 'tabular-nums' }}>{state.playbackRate.toFixed(2)}×</div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 300, opacity: state.brand, translate: `${(1-state.brand)*-35}px 0` }}>
      <div style={{ fontFamily: 'Georgia,serif', color: '#eff0df', fontSize: 142, letterSpacing: -6, lineHeight: 1.04 }}>Imagine<br/>Science</div>
      <div style={{ color: '#8abda5', fontSize: 26, marginTop: 38 }}>Scientific animations. Editable source.</div>
      <div style={{ color: '#a6bbab', fontSize: 22, marginTop: 48 }}>github.com/iamnikhiliyer/imagine-science</div>
    </div>
  </AbsoluteFill>;
}

export function ProcessFilm() {
  const frame = useCurrentFrame();
  return <AbsoluteFill><ProcessVisual frame={frame}/><Narration processDraft/></AbsoluteFill>;
}
export function IdeaShot() { return <ProcessVisual frame={useCurrentFrame()}/>; }
export function ToolkitShot() { return <ProcessVisual frame={project.scenes[1].startFrame+useCurrentFrame()}/>; }
export function ShapeShot() { return <ProcessVisual frame={project.scenes[2].startFrame+useCurrentFrame()}/>; }
export function EditableShot() { return <ProcessVisual frame={project.scenes[3].startFrame+useCurrentFrame()}/>; }
export function ClosingShot() { return <ProcessVisual frame={project.scenes[4].startFrame+useCurrentFrame()}/>; }
