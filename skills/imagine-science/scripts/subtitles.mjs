import assert from 'node:assert/strict';

function timestamp(frame, fps) {
  const ms = Math.round(frame * 1000 / fps);
  const two = n => String(n).padStart(2, '0');
  return two(Math.floor(ms / 3600000)) + ':' + two(Math.floor(ms / 60000) % 60)
    + ':' + two(Math.floor(ms / 1000) % 60) + '.' + String(ms % 1000).padStart(3, '0');
}

export function subtitles(project) {
  assert.equal(project.audio.mode, 'narrated', 'Subtitles require a narrated project');
  const cues = project.audio.captions.map(({ startFrame, endFrame, text }) => {
    const literal = text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    return timestamp(startFrame, project.fps) + ' --> ' + timestamp(endFrame, project.fps) + '\n' + literal;
  });
  return 'WEBVTT\n\n' + cues.join('\n\n') + '\n';
}
