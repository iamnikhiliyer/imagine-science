"""Bake the original illustrative glass, brushed metal and studio light fields.
Requires NumPy and ffmpeg. No source photographs or external textures.
"""
from pathlib import Path
import subprocess
import numpy as np

OUT = Path(__file__).resolve().parents[1] / "public" / "explainer"
rng = np.random.default_rng(718)
def bake(name, rgb):
    rgb = np.uint8(np.clip(rgb, 0, 255))
    h, w, _ = rgb.shape
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                    "-s", f"{w}x{h}", "-i", "-", "-frames:v", "1", "-q:v", "2",
                    str(OUT / (name + ".jpg"))], input=rgb.tobytes(), check=True)

def color(x): return np.array(x, dtype=float)

y, x = np.mgrid[-1:1:1450j, -1:1:1450j]
r = np.hypot(x,y)
a = np.arctan2(y,x)
def ring(center, sigma): return np.exp(-((r-center)/sigma)**2)
def sheen(ang, sharp): return np.maximum(0, np.cos(a-ang))**sharp
warp = np.sin(2*x+3*y+1.2*np.sin(3*y)) + .52*np.cos(4*x-3*y+1.3*np.sin(3*x))
marble = .5+.5*np.cos(10*y+5*warp+2*x+.8*np.sin(10*x+2*y))
filaments = np.power(marble,9)*(.45+.55*np.sin(2.7*x-2*y)**2)
rimmed = ring(.82,.17) * (.2+.8*sheen(-2.3,2))
glass = color([11,36,39]) + (1-r**2)[:,:,None]*color([8,16,16])
glass += filaments[:,:,None]*color([13,26,23]) + rimmed[:,:,None]*color([41,68,60])
glass += ((.5+.5*np.cos(14*warp+11*y))**15 * ring(.7,.26))[:,:,None]*color([11,19,17])
spark = rng.normal(0,1.5,r.shape)
glass += spark[:,:,None]
# Machined bevels, lathe marks and directional reflections share the plate's normal.
normal = .08+.48*sheen(-2.4,4)+.34*sheen(.62,7)+.13*sheen(2.5,9)
groove = .23*np.cos(r*3100+.4*np.sin(5*a)) + .11*np.sin(r*751)
metal = color([31,42,43])+normal[:,:,None]*color([161,153,112])+groove[:,:,None]*color([25,24,20])
metal += (ring(.917,.009)+ring(.984,.006))[:,:,None]*(.28+normal[:,:,None])*color([110,110,85])
metal += rng.normal(0,3,r.shape)[:,:,None]
rgb=np.where((r>.9)[:,:,None],metal,glass)
for radius,amp,width in [(.875,.7,.006),(.888,.9,.003),(.899,.75,.003),(.928,-.28,.007),(.965,-.25,.003),(.991,.7,.003)]:
    rgb += (ring(radius,width)*amp)[:,:,None]*(.17+normal[:,:,None])*color([160,181,153])
bake("optic-surface",rgb)
y,x=np.mgrid[-1:1:1080j,-1:1:1920j]
light = np.exp(-((x+.2)**2/.83+(y+.28)**2/.72))
beam = np.exp(-((y+.38+.32*x)/.3)**2)*np.exp(-((x+.42)/1.1)**2)
floor = color([4,12,18])+light[:,:,None]*color([15,32,33])+beam[:,:,None]*color([10,18,14])
floor += rng.normal(0,.85,x.shape)[:,:,None]
bake("optic-studio",floor)
