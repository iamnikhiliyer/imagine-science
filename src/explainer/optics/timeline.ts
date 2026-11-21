import project from '../../../film.project.json';

export const smooth = (frame:number, a:number, b:number) => {
  const t = Math.max(0,Math.min(1,(frame-a)/(b-a)));
  return t*t*(3-2*t);
};
export const windowAt = (f:number,a:number,b:number,c:number,d:number) => smooth(f,a,b)*(1-smooth(f,c,d));
export function cue(label:string) {
  const found = project.cues.find(item=>item.label===label);
  if (!found) throw new Error('Missing cue '+label);
  return found.frame;
}

const react=cue('React describes'), svg=cue('SVG draws'), render=cue('renders the frames');
export const spreadCue=cue('the particles spread,');
export const before=cue('label arrives late,');
export const after=cue('renders it again.');
// Rows are frame, screen x/y, magnification, pitch, yaw and roll.
// Monotone cubic tangents carry velocity through each camera mark.
const camera = [
  [0,1270,530,1.30,48,-21,-21],[96,1190,560,1.12,46,-16,-12],
  [202,1090,510,.95,32,-12,-8],[315,990,475,1.47,10,3,4],
  [391,1180,510,.96,35,-16,10],[508,1000,505,1.34,15,-9,-6],
  [590,1115,510,.95,32,-19,-13],[679,900,550,.78,49,-15,-17],
  [759,955,537,1.12,38,10,-9],[react,1020,610,.89,56,11,-15],
  [svg+16,996,612,.88,61,-9,-8],[1014,991,531,1.21,27,-12,8],
  [1097,1140,495,1.63,9,-8,17],[1195,1005,515,.99,41,-15,-5],
  [1290,920,522,1.15,33,6,-17],[1369,953,522,1.73,12,1,-12],
  [spreadCue+62,965,502,1.19,17,-7,-3],[1490,1020,505,.96,37,-13,11],
  [render+44,1000,510,.68,53,12,16],[1678,958,508,.76,39,-20,-11],
  [1764,950,504,1.12,22,-7,-5],[1858,980,505,1.21,12,5,3],
  [1930,1160,515,.97,32,-12,-5],[2021,1025,505,1.28,10,-3,6],
  [2118,937,515,1.26,17,9,-5],[2192,985,523,1.12,29,6,-10],
  [2278,1020,527,.99,38,-6,-6],[2330,995,510,1.16,19,-2,3],
  [2389,1330,495,.88,35,-15,8],[2429,1350,489,.83,37,-18,11]
];
function tangent(i:number,k:number) {
  if(i<=0 || i>=camera.length-1) return 0;
  const l=camera[i-1], m=camera[i], r=camera[i+1];
  const a=(m[k]-l[k])/(m[0]-l[0]), b=(r[k]-m[k])/(r[0]-m[0]);
  return a*b<=0?0:2*a*b/(a+b);
}
export function cameraAt(f:number) {
  const i=camera.findIndex((row,j)=>j+1<camera.length && f>=row[0] && f<camera[j+1][0]);
  if(i<0)return camera[camera.length-1].slice(1);
  const a=camera[i],b=camera[i+1],h=b[0]-a[0],t=(f-a[0])/h;
  return a.slice(1).map((v,j)=>{
    const k=j+1;
    return (2*t**3-3*t*t+1)*v+(t**3-2*t*t+t)*h*tangent(i,k)+(-2*t**3+3*t*t)*b[k]+(t**3-t*t)*h*tangent(i+1,k);
  });
}
export function specimenTime(f:number) {
  if(f>=after) return f-after;
  if(f>=before) return Math.min(92,f-before);
  return f;
}
export function concentration(f:number) {
  if(f>=before)return .16+.77*smooth(specimenTime(f),4,34);
  const natural=.57+.25*Math.sin(f*.018);
  const locked=windowAt(f,1260,1360,1450,1510);
  return natural*(1-locked)+(.14+.79*smooth(f,spreadCue,spreadCue+41))*locked;
}
