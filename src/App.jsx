import { useEffect, useState } from 'react';
import { useStore } from './store';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Portal from './pages/Portal';

// Tiny hash router: #/ (home), #/login, #/app
const read = () => (window.location.hash.replace('#', '') || '/');

export default function App() {
  const { state, toast } = useStore();
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const on = () => {
      const r = read();
      setRoute(r);
      if (r.startsWith('/')) window.scrollTo(0, 0); // in-page anchors (#portals) keep native scrolling
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  let page;
  if (route.startsWith('/app')) page = state.session ? <Portal key={state.session.role} /> : <Login />;
  else if (route.startsWith('/login')) page = state.session ? <Portal key={state.session.role} /> : <Login />;
  else page = <Landing />;

  return (
    <>
      {page}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
