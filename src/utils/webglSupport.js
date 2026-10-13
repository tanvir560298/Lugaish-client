// Check before importing a full 3D scene on a device that cannot create it.
export function supportsWebGL2(doc = globalThis.document) {
  try {
    const context = doc.createElement('canvas').getContext('webgl2');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
}
