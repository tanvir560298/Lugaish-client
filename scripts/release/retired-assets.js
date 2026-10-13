import { existsSync } from "node:fs";
import { resolve } from "node:path";

// Historical course media belongs in the private archive, never Vite's public
// copy directory. Keeping this gate also prevents accidental reintroduction.
export const RETIRED_PUBLIC_ASSETS = [
  "audio/day1-ielts-listening-audio.mp3",
  "audio/day1-ielts-listening-audio-2.mp3",
  "images/day1-listening-question-sheet.jpg",
  ...Array.from({ length: 5 }, (_, index) =>
    `videos/day-speaking-self-intro-reel-${index + 1}.mp4`),
];

export function assertRetiredAssetsAbsent(directory) {
  if (RETIRED_PUBLIC_ASSETS.some((path) => existsSync(resolve(directory, path))))
    throw new Error("Retired course media cannot be included in public build assets.");
}
