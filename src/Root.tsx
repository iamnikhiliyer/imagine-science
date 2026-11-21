import { Composition, Folder } from 'remotion';
import project from '../film.project.json';
import { ExplainerFilm } from './explainer/Film';
import { Opening } from './explainer/Opening';
import { Sources } from './explainer/Sources';
import { Compose } from './explainer/Compose';
import { Review } from './explainer/Review';
import { Closing } from './explainer/Closing';

// This registration is intentionally controlled by the project manifest.
export const RemotionRoot = () => (
  <>
  <Composition
    id={project.compositionId}
    component={ExplainerFilm}
    width={project.width}
    height={project.height}
    fps={project.fps}
    durationInFrames={project.durationInFrames}
  />
  <Folder name="Scenes">
    <Composition id="The-Idea" component={Opening} width={1920} height={1080} fps={30} durationInFrames={project.scenes[0].endFrame-project.scenes[0].startFrame} />
    <Composition id="The-Material" component={Sources} width={1920} height={1080} fps={30} durationInFrames={project.scenes[1].endFrame-project.scenes[1].startFrame} />
    <Composition id="The-Animation" component={Compose} width={1920} height={1080} fps={30} durationInFrames={project.scenes[2].endFrame-project.scenes[2].startFrame} />
    <Composition id="The-Review" component={Review} width={1920} height={1080} fps={30} durationInFrames={project.scenes[3].endFrame-project.scenes[3].startFrame} />
    <Composition id="Imagine-Science-Close" component={Closing} width={1920} height={1080} fps={30} durationInFrames={project.scenes[4].endFrame-project.scenes[4].startFrame} />
  </Folder>
  </>
);
