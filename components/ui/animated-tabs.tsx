"use client";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
export function AnimatedTabs({items,selected,label,onNavigate}:{items:{href:string;label:string}[];selected:string;label:string;onNavigate?:(href:string)=>void}) {
  const nav=useRef<HTMLElement>(null);
  const indicator=useRef<HTMLSpanElement>(null);
  useLayoutEffect(()=>{
    const container=nav.current!;
    const measure=()=>{
      const active=container.querySelector<HTMLElement>('[aria-current="page"]');
      const line=indicator.current;
      if(!active||!line)return;
      line.style.width=`${active.offsetWidth}px`;
      line.style.transform=`translateX(${active.offsetLeft}px)`;
      line.style.opacity="1";
    };
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(container);
    container.querySelectorAll("a").forEach(a=>observer.observe(a));
    return ()=>observer.disconnect();
  },[selected]);
  return <nav className="tabs animated-tabs" ref={nav} aria-label={label}>{items.map(item=><Link key={item.href} href={item.href} aria-current={selected===item.href?"page":undefined} className={selected===item.href?"selected":""} onClick={e=>{if(onNavigate&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();onNavigate(item.href);}}}>{item.label}</Link>)}<span className="tab-indicator" ref={indicator} aria-hidden="true"/></nav>;
}
