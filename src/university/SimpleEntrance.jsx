import { Component, useEffect } from 'react';
export class EntranceBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
export function SimpleEntrance({ selection, onArrive, onChoose }) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => { if (!selection) return; const timer = setTimeout(onArrive, reduced ? 0 : 1800); return () => clearTimeout(timer); }, [selection, onArrive, reduced]);
  return <div className={`uni-simple ${selection ? `uni-going-${selection}` : ''}`}><div className="uni-sun" /><div className="uni-building"><div className="uni-pediment">LUGAISH UNIVERSITY<small>LEARN · CONNECT · GROW</small></div><div className="uni-doors">{[['classroom', 'Classroom'], ['study', 'Study Room']].map(([id, label]) => <button key={id} disabled={Boolean(selection)} onClick={() => onChoose(id)}><span>{label}</span><i /></button>)}</div></div><div className="uni-courtyard" /><div className="uni-simple-student" aria-label="Your student avatar"><i className="uni-head" /><i className="uni-body" /><i className="uni-leg uni-leg-left" /><i className="uni-leg uni-leg-right" /></div><div className="uni-planter uni-planter-left">✦</div><div className="uni-planter uni-planter-right">✦</div></div>;
}
