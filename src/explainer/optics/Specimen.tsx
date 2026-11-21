import { useLayoutEffect, useRef } from 'react';
import { random } from 'remotion';

export const particles=Array.from({length:139},(_,i)=>{
  const theta=i*2.399963, radial= Math.sqrt((i+.5)/139);
  return {x:Math.cos(theta)*radial, y:Math.sin(theta)*radial,
    r:2.3+random('pearl-r'+i)**2*11.5, phase:random('pearl-p'+i)*Math.PI*2,
    depth:random('pearl-z'+i)};
});
const tracked=111;
export function position(i:number,t:number,spread:number) {
  const p=particles[i],a=p.phase;
  const wobble=5+17*spread;
  return [p.x*(59+299*spread)+wobble*(Math.sin(t*.065+a)+.48*Math.sin(t*.154+2*a)),
    p.y*(61+278*spread)+wobble*(Math.cos(t*.056+a)+.47*Math.cos(t*.131+3*a))];
}
const sprites: HTMLCanvasElement[]=[];
function sprite(gold:boolean,depth:number) {
  const key=(gold?4:0)+depth;
  if(sprites[key])return sprites[key];
  const cvs=document.createElement('canvas');cvs.width=cvs.height=96;
  const c=cvs.getContext('2d')!;
  const tint=gold?'255,171,77':'144,226,209';
  const halo=c.createRadialGradient(48,48,16,48,48,46);
  halo.addColorStop(0,`rgba(${tint},.36)`);halo.addColorStop(1,`rgba(${tint},0)`);
  c.fillStyle=halo;c.fillRect(0,0,96,96);
  const sphere=c.createRadialGradient(39,35,1,48,48,23);
  const shades=gold?['#fff4bb','#f6be67','#ba7243','#583727','#f5b776']:['#f6f6cd','#cbe2b9','#76b4a7','#284e50','#b1d4b9'];
  [0,.24,.52,.84,1].forEach((v,j)=>sphere.addColorStop(v,shades[j]));
  c.fillStyle=sphere;c.beginPath();c.arc(48,48,23,0,Math.PI*2);c.fill();
  c.strokeStyle=gold?'#fff2bd':'#d3ebd4';c.lineWidth=1.6;
  c.beginPath();c.arc(48,48,22,3.6,5.25);c.stroke();
  if(depth===0){c.globalCompositeOperation='destination-in';c.fillStyle='rgba(0,0,0,.55)';c.fillRect(0,0,96,96);}
  sprites[key]=cvs;return cvs;
}
const paintOrder=particles.map((_,i)=>i).sort((a,b)=>particles[a].depth-particles[b].depth);
export function Specimen({time,spread,wire=0,trail=1,label=0,reveal=1}:{time:number;spread:number;wire?:number;trail?:number;label?:number;reveal?:number}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useLayoutEffect(()=>{
    const canvas=ref.current!,ctx=canvas.getContext('2d')!;
    const resolution=canvas.width/1000;
    ctx.setTransform(resolution,0,0,resolution,canvas.width/2,canvas.height/2);
    ctx.clearRect(-500,-500,1000,1000);
    if(trail>0){
      for(let i=0;i<24;i++){
        const index=i===0?tracked:(i*13)%particles.length;
        ctx.strokeStyle=i===0?`rgba(255,188,111,${.88*trail})`:`rgba(155,213,193,${.25*trail})`;
        ctx.lineWidth=i===0?2.3:1;
        ctx.beginPath();
        for(let j=0;j<=54;j++){
          const dt=54-j;
          const [x,y]=position(index,time-dt*1.6,Math.max(.12,spread-dt*.004));
          if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }ctx.stroke();
      }
    }
    for(const i of paintOrder){
      if(particles[i].depth>reveal)continue;
      const [x,y]=position(i,time,spread), p=particles[i],gold=i===tracked;
      const size=gold?24:p.r*(.64+.44*p.depth);
      ctx.globalAlpha=1-.84*wire;
      ctx.drawImage(sprite(gold,Math.floor(p.depth*3)),x-size*2,y-size*2,size*4,size*4);
      if(wire>.01){
        ctx.globalAlpha=wire;ctx.strokeStyle=gold?'#ffd08b':'#a5d7c4';ctx.lineWidth=1.4;
        ctx.beginPath();ctx.arc(x,y,size*.83,0,2*Math.PI);ctx.stroke();
      }
    }
    ctx.globalAlpha=1;
    if(label>0){
      const [x,y]=position(tracked,time,spread);
      ctx.globalAlpha=label;ctx.strokeStyle='#f3c087';ctx.fillStyle='#fff0cc';ctx.lineWidth=1.8;
      ctx.beginPath();ctx.arc(x,y,28,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x+22,y-17);ctx.lineTo(x+65,y-61);ctx.lineTo(x+234,y-61);ctx.stroke();
      ctx.font='22px Arial';ctx.fillText('Cloud spreads',x+73,y-70);ctx.globalAlpha=1;
    }
  },[time,spread,wire,trail,label,reveal]);
  return <canvas width={1250} height={1250} ref={ref} style={{width:1000,height:1000}}/>;
}
