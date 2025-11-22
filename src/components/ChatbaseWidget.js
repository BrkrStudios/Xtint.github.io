'use client';

import { useEffect } from 'react';

export default function ChatbaseWidget() {
  useEffect(() => {
    // Initialize Chatbase
    if (!window.chatbase) {
      window.chatbase = function(...args) {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === 'q') {
            return target.q;
          }
          return (...args) => target(prop, ...args);
        }
      });
    }

    // Load the Chatbase embed script
    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.id = 'Efug3wT0MWgnrF6McZ3Ah';
    script.domain = 'www.chatbase.co';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
      const existingScript = document.getElementById('Efug3wT0MWgnrF6McZ3Ah');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}
