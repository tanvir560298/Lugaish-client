import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';

const Trial = lazy(() => import('./InteractiveTrialWidget.jsx').then(module => ({ default: module.InteractiveTrialWidget })));
class PreviewBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div role="alert"><p>The practice preview could not load.</p><button className="campus-button campus-button-secondary" onClick={() => window.location.reload()}>Reload to try again</button></div> : this.props.children;
  }
}

export function DeferredPracticePreview({ onStartPathway }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (visible) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '240px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [visible]);
  return <div ref={host} className="deferred-practice-preview">
    {visible ? <PreviewBoundary><Suspense fallback={<p role="status">Opening practice preview…</p>}><Trial onStartPathway={onStartPathway}/></Suspense></PreviewBoundary>
      : <button className="campus-button campus-button-secondary" onClick={() => setVisible(true)}>Open practice preview</button>}
  </div>;
}
