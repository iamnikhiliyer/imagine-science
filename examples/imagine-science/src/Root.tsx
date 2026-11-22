import { Composition } from 'remotion';
import project from '../film.project.json';
import { LineFilm } from './Film';

// This registration is intentionally controlled by the project manifest.
export const RemotionRoot = () => (
  <Composition
    id={project.compositionId}
    component={LineFilm}
    width={project.width}
    height={project.height}
    fps={project.fps}
    durationInFrames={project.durationInFrames}
  />
);
