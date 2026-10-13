export type Animation = 'idle' | 'walk' | 'run';
export type Snapshot = { x: number; z: number; yaw: number; animation: Animation; timestamp: number };
export type MediaState = { lectureId: string; positionSeconds: number; playing: boolean; updatedAt: number };
export type Payloads = {
  'player.join': { displayName: string };
  'player.leave': Record<string, never>;
  'player.snapshot': Snapshot;
  'player.emote': { emote: 'wave' };
  'class.start': { lectureId: string };
  'class.stop': Record<string, never>;
  'lecture.select': { lectureId: string };
  'media.state': MediaState;
};
export type SessionEvent<T extends keyof Payloads = keyof Payloads> = {
  version: 1; sessionId: string; entityId: string; sequence: number;
  timestamp: number; type: T; payload: Payloads[T];
};
// Server-derived command context for a future transport; never accept roles in client payloads.
export interface AuthorityContext { authenticatedUserId: string; serverRole: string; entitledLectureIds: Set<string> }
export interface SessionTransport {
  emit<T extends keyof Payloads>(type: T, payload: Payloads[T]): SessionEvent<T>;
  subscribe(listener: (event: SessionEvent) => void): () => void;
  dispose(): void;
}
