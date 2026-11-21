import { AbsoluteFill, Series, useVideoConfig } from 'remotion';
import project from '../../film.project.json';
import { Closing } from './Closing';
import { Compose } from './Compose';
import { Narration } from './Narration';
import { Opening } from './Opening';
import { Review } from './Review';
import { Sources } from './Sources';

export function ExplainerFilm() {
  const { fps } = useVideoConfig();
  const duration = (index: number) => project.scenes[index].endFrame - project.scenes[index].startFrame;
  return <AbsoluteFill>
    <Series>
      <Series.Sequence name="The idea" durationInFrames={duration(0)} premountFor={fps}><Opening /></Series.Sequence>
      <Series.Sequence name="The source material" durationInFrames={duration(1)} premountFor={fps}><Sources /></Series.Sequence>
      <Series.Sequence name="The editable animation" durationInFrames={duration(2)} premountFor={fps}><Compose /></Series.Sequence>
      <Series.Sequence name="The review" durationInFrames={duration(3)} premountFor={fps}><Review /></Series.Sequence>
      <Series.Sequence name="Imagine Science" durationInFrames={duration(4)} premountFor={fps}><Closing /></Series.Sequence>
    </Series>
    <Narration />
  </AbsoluteFill>;
}
