"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Aparición suave al entrar en pantalla (IntersectionObserver). */
export default function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/** Contador animado (de 0 al valor) cuando entra en pantalla. */
export function Contador({ valor, sufijo = "" }: { valor: number; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      if (reducido) return setN(valor);
      const t0 = performance.now(), dur = 1200;
      const paso = (t: number) => { const p = Math.min(1, (t - t0) / dur); setN(Math.round(valor * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(paso); };
      requestAnimationFrame(paso);
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [valor]);
  return <span ref={ref}>{n}{sufijo}</span>;
}
