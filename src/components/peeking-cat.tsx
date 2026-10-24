"use client";

import { useRef, useState } from "react";
import { asset } from "@/content/site";

const EAR_VISIBLE = 0.13;
const EAR_SHIFT = 62;
const PULL_THRESHOLD = 0.65;

export function PeekingCat() {
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ id: -1, startY: 0, startProgress: 0, distance: 1 });

  const hiddenY = (1 - EAR_VISIBLE) * (1 - progress) * 100;
  const shiftX = EAR_SHIFT * (1 - progress);

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const height = event.currentTarget.getBoundingClientRect().height;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // The pointer can already be gone if the gesture ends immediately.
    }
    drag.current = {
      id: event.pointerId,
      startY: event.clientY,
      startProgress: progress,
      distance: height * (1 - EAR_VISIBLE),
    };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (drag.current.id !== event.pointerId) return;
    const delta = drag.current.startY - event.clientY;
    const next = drag.current.startProgress + delta / drag.current.distance;
    setProgress(Math.min(1, Math.max(0, next)));
  };

  const finish = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (drag.current.id !== event.pointerId) return;
    drag.current.id = -1;
    setDragging(false);
    setProgress((current) => (current >= PULL_THRESHOLD ? 1 : 0));
  };

  return (
    <div
      className={`absolute right-2 bottom-0 z-20 hidden w-44 sm:right-6 sm:w-52 md:right-10 md:w-72 lg:block ${
        dragging
          ? ""
          : "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      }`}
      style={{ transform: `translate(${shiftX}%, ${hiddenY}%)` }}
    >
      <button
        type="button"
        aria-label="Cat"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finish}
        onPointerCancel={finish}
        className="block w-full cursor-grab touch-none appearance-none border-0 bg-transparent p-0 select-none active:cursor-grabbing"
      >
        <img src={asset("/cat.png")} alt="" width={267} height={350} draggable={false} className="pointer-events-none block h-auto w-full" />
      </button>
    </div>
  );
}
