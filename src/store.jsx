import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { initialState } from './data/sample';
import { now } from './lib';

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [toast, setToast] = useState(null);
  const timer = useRef();

  // update(draft => { ...mutate draft... }) — works on a fresh copy, so React sees a new object.
  const update = useCallback((fn) => setState((s) => { const n = structuredClone(s); fn(n); return n; }), []);

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  return <Ctx.Provider value={{ state, update, notify, toast }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
export const log = (n, actor, text) => n.audit.unshift({ t: now(), a: actor, x: text });
export const aiact = (n, agent, text) => n.aiLog.unshift({ t: now(), agent, x: text });
export const agentOn = (state, id) => state.agents.find((a) => a.id === id).on;
