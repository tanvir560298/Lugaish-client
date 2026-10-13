const box = (x, z, w, d, h = 1) => ({ min: [x - w / 2, 0, z - d / 2], max: [x + w / 2, h, z + d / 2] });
// Mirrors StudyScene's furniture, including all non-interactive chairs.
export const STUDY_SOLIDS = [
  box(-.4, .6, 2.56, .80), box(-3.2, -1, 1.7, .8, .78),
  box(-.4, -1.2, 3.2, 1.15, .78), box(-.4, -3.2, 3.2, 1.15, .78),
  ...[-1.6, -.4, .8].flatMap(x => [-.6, -1.8, -2.6, -3.8].map(z => box(x, z, .52, .52))),
  box(-3.2, -.35, .52, .52), box(2, 1.6, 1.15, .68, .35),
  box(1.1, 1.6, .7, .6), box(2.9, 1.6, .7, .6),
  box(-5, 0, .2, 9), box(4.8, 0, .3, 9), box(0, -4.65, 10, .6), box(0, 4.4, 10, .2),
];
export const STUDY_ENVIRONMENT = { boxes: STUDY_SOLIDS, ground: () => 0 };
