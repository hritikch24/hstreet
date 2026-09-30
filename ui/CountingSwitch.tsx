'use client';

import { useSyncExternalStore } from 'react';
import { OPT_OUT_KEY } from '@/ui/Beacon';

function read(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** Lets a visitor stop their visits being counted, in this browser. */
export function CountingSwitch() {
  const off = useSyncExternalStore(subscribe, read, () => false);
  const toggle = () => {
    try {
      if (off) localStorage.removeItem(OPT_OUT_KEY);
      else localStorage.setItem(OPT_OUT_KEY, '1');
    } catch {
      // Storage blocked: nothing is counted from this browser anyway.
    }
    listeners.forEach((fn) => fn());
  };
  return (
    <button type="button" onClick={toggle} className="btn btn-plain">
      {off ? 'Your visits are not counted. Count them again' : 'Don’t count my visits'}
    </button>
  );
}
