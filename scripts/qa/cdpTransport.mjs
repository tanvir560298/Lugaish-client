export function cdpTransport(socket, { timeoutMs = 30000 } = {}) {
  let id = 0,
    closed = false;
  const pending = new Map();
  const rejectAll = () => {
    closed = true;
    for (const p of pending.values()) {
      clearTimeout(p.timer);
      p.reject(Error("QA browser connection closed."));
    }
    pending.clear();
  };
  socket.addEventListener("close", rejectAll);
  socket.addEventListener("error", rejectAll);
  socket.addEventListener("message", (event) => {
    let result;
    try {
      result = JSON.parse(event.data);
    } catch {
      return;
    }
    const p = pending.get(result.id);
    if (!p) return;
    pending.delete(result.id);
    clearTimeout(p.timer);
    result.error ? p.reject(result.error) : p.resolve(result.result);
  });
  return {
    send(method, params = {}, deadline = timeoutMs) {
      if (closed) return Promise.reject(Error("QA browser connection closed."));
      return new Promise((resolve, reject) => {
        const key = ++id,
          timer = setTimeout(() => {
            pending.delete(key);
            reject(Error("QA browser command timed out: " + method));
          }, deadline);
        pending.set(key, { resolve, reject, timer });
        try {
          socket.send(JSON.stringify({ id: key, method, params }));
        } catch (error) {
          clearTimeout(timer);
          pending.delete(key);
          reject(error);
        }
      });
    },
    close() {
      rejectAll();
      socket.close();
    },
    pending: () => pending.size,
  };
}
