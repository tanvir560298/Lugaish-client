import { Component } from 'react';
export class RoomBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onState({ active: false, seated: false, controlling: true }); }
  render() {
    return this.state.failed ? <p className="ls-preview-note" role="status">Shared rooms could not load. Your personal desk, timer, and notebook are still available. Refresh when you’re ready to reconnect.</p> : this.props.children;
  }
}
