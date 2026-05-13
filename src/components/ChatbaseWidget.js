'use client';

import { useEffect } from 'react';

const SCRIPT_ID = 'Efug3wT0MWgnrF6McZ3Ah';

export default function ChatbaseWidget() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    let cancelled = false;

    const loadChatbase = () => {
      if (cancelled || document.getElementById(SCRIPT_ID)) return;

      if (!window.chatbase || window.chatbase('getState') !== 'initialized') {
        window.chatbase = (...args) => {
          if (!window.chatbase.q) window.chatbase.q = [];
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === 'q') return target.q;
            return (...args) => target(prop, ...args);
          },
        });
      }

      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.id = SCRIPT_ID;
      script.domain = 'www.chatbase.co';
      script.async = true;
      document.body.appendChild(script);
    };

    // Defer until the page is idle so it doesn't compete with first paint.
    const ric = window.requestIdleCallback;
    const handle = ric
      ? ric(loadChatbase, { timeout: 4000 })
      : setTimeout(loadChatbase, 2500);

    return () => {
      cancelled = true;
      if (ric && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle);
      }
    };
  }, []);

  return null;
}
