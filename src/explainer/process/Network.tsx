import { useId } from 'react';

const cells = [
  [165, 175], [355, 110], [590, 145], [815, 180], [270, 340], [505, 290],
  [725, 360], [150, 480], [420, 475], [650, 495], [865, 480],
];
const links = [[0,1],[0,4],[1,2],[1,5],[2,3],[2,5],[3,6],[4,5],[4,7],[5,6],[5,8],[6,9],[6,10],[7,8],[8,9],[9,10]];
const point = (a: number, b: number, c: number, d: number, t: number) => (1-t)**3*a + 3*(1-t)**2*t*b + 3*(1-t)*t*t*c + t**3*d;

export function Network({ sampleFrame, layer = 'both', wire = 0, opacity = 1 }: {
  sampleFrame: number; layer?: 'traces' | 'cells' | 'both'; wire?: number; opacity?: number;
}) {
  const id = useId().replace(/:/g, '');
  const time = sampleFrame / 30;
  return <svg viewBox="0 0 1000 600" width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity }}>
    <defs>
      <radialGradient id={`${id}-soma`}><stop stopColor="#e4f3d8"/><stop offset=".38" stopColor="#a8d3b2"/><stop offset="1" stopColor="#548d7e" stopOpacity=".25"/></radialGradient>
      <filter id={`${id}-bloom`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    {layer !== 'cells' && <g>{links.map(([a,b], i) => {
      const [x1,y1] = cells[a], [x2,y2] = cells[b];
      const cx1 = x1+(x2-x1)*.42, cy1 = y1-38, cx2 = x1+(x2-x1)*.64, cy2=y2+38;
      const d = `M${x1} ${y1}C${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`;
      const progress = ((time*.52+i*.173)%1+1)%1;
      const px = point(x1,cx1,cx2,x2,progress), py=point(y1,cy1,cy2,y2,progress);
      return <g key={i}>
        <path d={d} stroke="#97c1ad" strokeWidth="7" opacity=".055" fill="none"/>
        <path d={d} stroke={i%4===0?'#cca88a':'#719e90'} strokeWidth={i%3===0?2:1.2} opacity={.47+wire*.25} fill="none"/>
        <circle cx={px} cy={py} r="7" fill="#b9edd2" opacity={(1-wire)*.48} filter={`url(#${id}-bloom)`}/>
        <circle cx={px} cy={py} r="2.6" fill={i%4===0?'#e2c59e':'#c7f5dd'} opacity={(1-wire)*.95}/>
      </g>;
    })}</g>}
    {layer !== 'traces' && <g>{cells.map(([x,y],i) => {
      const pulse = Math.max(0, Math.sin(time*2.6-i*.88))**7;
      return <g key={i} transform={`translate(${x} ${y}) rotate(${i*37})`}>
        <circle r={31+pulse*11} fill="#a9edc8" opacity={(.025+pulse*.09)*(1-wire)} filter={`url(#${id}-bloom)`}/>
        {[-2,-1,0,1,2].map(j => <g key={j} transform={`rotate(${j*66})`} opacity={.48+.3*pulse}>
          <path d="M0 -10C-8 -27 5 -38 0 -62M0 -35L-13 -47M1 -47L11 -58" fill="none" stroke="#94bda5" strokeWidth="1.35"/>
        </g>)}
        <path d="M-19 -6C-21 -22 0 -27 12 -17C27 -15 25 5 12 15C0 29 -21 14 -19 -6Z" fill={`url(#${id}-soma)`} fillOpacity={1-wire*.78} stroke="#a9cbb2" strokeWidth="1.2"/>
        <ellipse cx="-2" cy="-1" rx="8" ry="10" fill="#cfe8c3" opacity={.5+pulse*.4}/>
        <circle cx="-3" cy="-3" r="3" fill="#f1f3d9" opacity=".7"/>
      </g>;
    })}</g>}
  </svg>;
}
