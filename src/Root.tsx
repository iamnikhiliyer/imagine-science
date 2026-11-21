import { Composition, Folder } from 'remotion';
import project from '../film.project.json';
import { ExplainerFilm } from './explainer/Film';
import { ProcessFilm, IdeaShot, SourceShot, ComposeShot, ReviewShot, ClosingShot } from './explainer/process/Film';

// This registration is intentionally controlled by the project manifest.
export const RemotionRoot = () => (
  <>
  <Composition
    id={project.compositionId}
    component={ProcessFilm}
    width={project.width}
    height={project.height}
    fps={project.fps}
    durationInFrames={project.durationInFrames}
  />
  <Folder name="Shots">
    <Composition id="The-Idea" component={IdeaShot} width={1920} height={1080} fps={30} durationInFrames={project.scenes[0].endFrame-project.scenes[0].startFrame} />
    <Composition id="The-Material" component={SourceShot} width={1920} height={1080} fps={30} durationInFrames={project.scenes[1].endFrame-project.scenes[1].startFrame} />
    <Composition id="The-Animation" component={ComposeShot} width={1920} height={1080} fps={30} durationInFrames={project.scenes[2].endFrame-project.scenes[2].startFrame} />
    <Composition id="The-Review" component={ReviewShot} width={1920} height={1080} fps={30} durationInFrames={project.scenes[3].endFrame-project.scenes[3].startFrame} />
    <Composition id="Imagine-Science-Close" component={ClosingShot} width={1920} height={1080} fps={30} durationInFrames={project.scenes[4].endFrame-project.scenes[4].startFrame} />
  </Folder>
  <Folder name="Earlier-Draft"><Composition id="Presentation-Draft" component={ExplainerFilm} width={1920} height={1080} fps={30} durationInFrames={project.durationInFrames}/></Folder>
  </>
);
