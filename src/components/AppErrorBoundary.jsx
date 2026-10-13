import { Component } from "react";
import { reportOperationalEvent } from "../utils/operations.js";
export class AppErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    reportOperationalEvent("frontend_exception");
  }
  render() {
    return this.state.failed ? (
      <main className="platform-page">
        <section className="campus-card">
          <h1>This page could not load.</h1>
          <p>
            Your saved study work stays on this device. Reload to try again.
          </p>
          <button className="campus-button" onClick={() => location.reload()}>
            Reload
          </button>
          <a href="/support">Get help</a>
        </section>
      </main>
    ) : (
      this.props.children
    );
  }
}
