import { createYouTubeLoader, placeReadyYouTubeFrame } from "./youtubeApi.js";
import { reportOperationalEvent } from "../utils/operations.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { CanvasTexture, SRGBColorSpace, VideoTexture } from "three";

const projectedPhases = new Set([
  "PreparingLecture",
  "LectureReady",
  "LecturePlaying",
  "LecturePaused",
]);
function IdleScreen({ phase, lecture }) {
  const ended = phase === "Ended";
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#183c37";
    ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = "#b9cdb8";
    ctx.font = "24px Arial";
    ctx.fillText("LUGAISH / LANGUAGE STUDIO", 85, 145);
    ctx.fillStyle = "#e7e6d5";
    ctx.font = "64px Arial";
    ctx.fillText(
      ended
        ? "Your next step awaits."
        : lecture
          ? "Your lesson is ready."
          : "Choose your next lesson.",
      85,
      330,
    );
    if (!ended) {
      ctx.font = "32px Arial";
      ctx.fillText(
        (lecture?.title || "Open Courses & lessons to begin.").slice(0, 62),
        85,
        410,
      );
    }
    ctx.fillStyle = "#b2c6b5";
    ctx.font = "28px Arial";
    ctx.fillText(
      ended ? "Keep learning. Keep growing." : "Your classroom is ready.",
      85,
      560,
    );
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    return result;
  }, [ended, lecture?.title]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, 2, -14.78]}>
      <planeGeometry args={[3.74, 2.104]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
function FileProjector({
  lecture,
  phase,
  mediaRef,
  report,
  theater,
  theaterHost,
}) {
  const [source, setSource] = useState(null);
  const [aspect, setAspect] = useState(16 / 9);
  const active = projectedPhases.has(phase);
  useEffect(() => {
    let disposed = false,
      nativeOnly = false;
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.playsInline = true;
    video.preload = "auto";
    video.src = lecture.src;
    const texture = new VideoTexture(video);
    texture.colorSpace = SRGBColorSpace;
    const listeners = {
      loadedmetadata: () =>
        setAspect(video.videoWidth / Math.max(1, video.videoHeight)),
      canplay: () =>
        report({
          status: video.paused ? "ready" : "playing",
          ready: true,
          error: "",
        }),
      playing: () => report({ status: "playing", ready: true, error: "" }),
      pause: () => {
        if (!disposed && !video.ended)
          report({ status: "paused", ready: video.readyState >= 2 });
      },
      waiting: () => report({ status: "buffering" }),
      ended: () => report({ status: "ended" }),
      error: () => {
        reportOperationalEvent("classroom_media_failure");
        const remote =
          new URL(lecture.src, window.location.href).origin !==
          window.location.origin;
        if (remote && !nativeOnly) {
          // Playback may work without CORS although uploading frames to WebGL cannot.
          // Recover with the same element in the native player, never a permissive proxy.
          nativeOnly = true;
          texture.dispose();
          setSource({ video, texture: null });
          report({
            status: "loading",
            ready: false,
            error: "",
            nativeOnly: true,
          });
          video.removeAttribute("crossorigin");
          video.src = lecture.src;
          video.load();
          return;
        }
        const code = video.error?.code;
        report({
          status: "error",
          ready: false,
          error:
            code === 4
              ? "This video source or format is unavailable. Retry or choose another lesson."
              : code === 3
                ? "Your browser could not decode this video. Open the full lesson or choose another video."
                : "The video could not download. Check your connection, then retry.",
          nativeOnly,
        });
      },
    };
    Object.entries(listeners).forEach(([name, handler]) =>
      video.addEventListener(name, handler),
    );
    const adapter = {
      play: async () => {
        try {
          await video.play();
        } catch (error) {
          if (disposed) return;
          report(
            error.name === "NotAllowedError"
              ? {
                  status: "ready",
                  ready: true,
                  error: "Your browser needs a click. Select Play lecture.",
                }
              : {
                  status: "error",
                  ready: false,
                  error:
                    "Playback failed. Retry this lecture or return to My Classes.",
                },
          );
        }
      },
      pause: () => video.pause(),
      reset: () => {
        video.pause();
        video.currentTime = 0;
      },
      position: () => video.currentTime,
    };
    mediaRef.current = adapter;
    report({ status: "loading", ready: false, error: "", nativeOnly: false });
    setSource({ video, texture });
    video.load();
    return () => {
      disposed = true;
      Object.entries(listeners).forEach(([name, handler]) =>
        video.removeEventListener(name, handler),
      );
      video.pause();
      video.removeAttribute("src");
      video.load();
      texture.dispose();
      if (mediaRef.current === adapter) mediaRef.current = null;
    };
  }, [lecture.id, lecture.src, mediaRef, report]);
  useEffect(() => {
    if (phase === "LectureReady") mediaRef.current?.play();
    if (["Ended", "Error", "Waiting"].includes(phase))
      mediaRef.current?.reset();
  }, [phase, mediaRef]);
  useEffect(() => {
    if (!source) return;
    const video = source.video;
    if (theater && theaterHost.current) {
      video.controls = true;
      theaterHost.current.appendChild(video);
    } else {
      video.controls = false;
      video.remove();
    }
    return () => {
      video.controls = false;
      video.remove();
    };
  }, [source, theater, theaterHost]);
  const width = aspect > 16 / 9 ? 3.74 : 2.104 * aspect;
  const height = aspect > 16 / 9 ? 3.74 / aspect : 2.104;
  return (
    <>
      <mesh position={[0, 2, -14.798]}>
        <planeGeometry args={[3.74, 2.104]} />
        <meshBasicMaterial color="#081013" toneMapped={false} />
      </mesh>
      {source?.texture && active && (
        <mesh position={[0, 2, -14.785]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={source.texture} toneMapped={false} />
        </mesh>
      )}
      {(!active || !source?.texture) && (
        <IdleScreen phase={phase} lecture={lecture} />
      )}
    </>
  );
}
const loadYouTubeApi = createYouTubeLoader({
  window,
  document,
  setTimeout,
  clearTimeout,
});
function YouTubeProjector({
  lecture,
  phase,
  mediaRef,
  report,
  theater,
  theaterHost,
}) {
  const host = useRef(),
    playerRef = useRef();
  const theaterRef = useRef(theater);
  theaterRef.current = theater;
  const currentPhase = useRef(phase);
  currentPhase.current = phase;
  const transfer = useRef(null);
  // Modern browsers preserve an iframe's browsing context with moveBefore.
  // Older browsers recreate the sole player, restoring its actual timestamp.
  const preservesFrame = typeof document.body.moveBefore === "function";
  const destinationKey = preservesFrame ? "stable" : theater;
  const active = projectedPhases.has(phase);
  useEffect(() => {
    let disposed = false,
      player,
      adapter;
    const mount = document.createElement("div");
    const destination = theaterRef.current ? theaterHost.current : host.current;
    destination.appendChild(mount);
    report({ status: "loading", ready: false, error: "" });
    loadYouTubeApi()
      .then((YT) => {
        if (disposed) return;
        player = new YT.Player(mount, {
          width: 960,
          height: 540,
          videoId: lecture.youtubeId,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            origin: window.location.origin,
            playsinline: 1,
            rel: 0,
            controls: 1,
          },
          events: {
            onReady: () => {
              if (disposed) return;
              playerRef.current = player;
              if (preservesFrame)
                placeReadyYouTubeFrame(
                  player,
                  theaterRef.current ? theaterHost.current : host.current,
                );
              const previous = transfer.current;
              if (previous?.id === lecture.id) {
                player.seekTo(previous.time, true);
                if (previous.playing) player.playVideo();
                else player.pauseVideo();
              }
              transfer.current = null;
              adapter = {
                play: () => player.playVideo(),
                pause: () => player.pauseVideo(),
                reset: () => {
                  player.pauseVideo();
                  player.seekTo(0, true);
                },
                position: () => player.getCurrentTime(),
              };
              mediaRef.current = adapter;
              report({ status: "ready", ready: true, error: "" });
            },
            onStateChange: ({ data }) => {
              if (disposed) return;
              if (data === 1 && !projectedPhases.has(currentPhase.current)) {
                player.pauseVideo();
                return;
              }
              const status = {
                1: "playing",
                2: "paused",
                0: "ended",
                3: "buffering",
                5: "ready",
              }[data];
              if (status) report({ status, ready: true, error: "" });
            },
            onAutoplayBlocked: () =>
              report({
                status: "ready",
                ready: true,
                error:
                  "Select Play lecture, or press Esc and use the player on the screen.",
              }),
            onError: () =>
              report({
                status: "error",
                ready: false,
                error:
                  "The YouTube owner may block embeds, or this video is unavailable. Open the normal lesson or select another lecture.",
              }),
          },
        });
      })
      .catch((error) => {
        if (!disposed)
          report({ status: "error", ready: false, error: error.message });
      });
    return () => {
      disposed = true;
      if (playerRef.current) {
        transfer.current = {
          id: lecture.id,
          time: player.getCurrentTime() || 0,
          playing: player.getPlayerState() === 1,
        };
      }
      playerRef.current = null;
      player?.destroy();
      mount.remove();
      if (mediaRef.current === adapter) mediaRef.current = null;
    };
  }, [
    lecture.id,
    lecture.youtubeId,
    mediaRef,
    report,
    destinationKey,
    theaterHost,
  ]);
  useEffect(() => {
    if (phase === "LectureReady") mediaRef.current?.play();
    if (["Waiting", "Ended", "Error"].includes(phase))
      mediaRef.current?.reset();
  }, [phase, mediaRef]);
  useEffect(() => {
    if (preservesFrame)
      placeReadyYouTubeFrame(
        playerRef.current,
        theater ? theaterHost.current : host.current,
      );
  }, [theater, theaterHost, preservesFrame]);
  return (
    <>
      <mesh position={[0, 2, -14.798]}>
        <planeGeometry args={[3.74, 2.104]} />
        <meshBasicMaterial color="#081013" />
      </mesh>
      <Html
        transform
        occlude
        position={[0, 2, -14.78]}
        distanceFactor={1.56}
        zIndexRange={[8, 0]}
      >
        <div
          className="cr-youtube"
          style={{
            visibility: active ? "visible" : "hidden",
            pointerEvents: active ? "auto" : "none",
          }}
          ref={host}
        />
      </Html>
      {!active && <IdleScreen phase={phase} lecture={lecture} />}
    </>
  );
}
export function Projector(props) {
  if (!props.lecture)
    return <IdleScreen phase={props.phase} lecture={props.lecture} />;
  return props.lecture.kind === "file" ? (
    <FileProjector {...props} />
  ) : (
    <YouTubeProjector {...props} />
  );
}
