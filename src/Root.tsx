import { Composition } from 'remotion';
import project from '../film.project.json';
import { Diffusion } from './Diffusion';

// This registration is intentionally controlled by the project manifest.
export const RemotionRoot = () => (
  <Composition
    id={project.compositionId}
    component={Diffusion}
    width={project.width}
    height={project.height}
    fps={project.fps}
    durationInFrames={project.durationInFrames}
  />
);
