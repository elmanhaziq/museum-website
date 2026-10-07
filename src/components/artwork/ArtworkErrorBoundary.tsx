'use client';

import React, { Component, ReactNode } from 'react';

type Props = { name: string; children: ReactNode; fallback: ReactNode };
type State = { failed: boolean };

export default class ArtworkErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch(error: Error) { console.error(`Artwork could not be rendered: ${this.props.name}`, error); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
