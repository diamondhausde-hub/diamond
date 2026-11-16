"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { getDirection } from "@/i18n/config";
import { GlassScene } from "@/components/glass-lab/GlassScene";

type Props = {
  className?: string;
  compact?: boolean;
};

export function CompareSlider({ className, compact }: Props) {
  const { locale, messages } = useLocale();
  const rtl = getDirection(locale) === "rtl";
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function updateFromClientX(clientX: number) {
    const element = containerRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const ratio = rtl ? (rect.right - clientX) / rect.width : (clientX - rect.left) / rect.width;
    setPosition(Math.min(100, Math.max(0, ratio * 100)));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updateFromClientX(event.clientX);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    updateFromClientX(event.clientX);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 2;
    let delta = 0;
    if (event.key === "ArrowLeft") delta = rtl ? step : -step;
    if (event.key === "ArrowRight") delta = rtl ? -step : step;
    if (event.key === "Home") {
      event.preventDefault();
      setPosition(rtl ? 100 : 0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setPosition(rtl ? 0 : 100);
      return;
    }
    if (delta !== 0) {
      event.preventDefault();
      setPosition((current) => Math.min(100, Math.max(0, current + delta)));
    }
  }

  const style = { "--compare-pos": `${position}%` } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`compare ${className ?? ""}`}
      data-dragging={dragging}
      style={style}
      role="slider"
      tabIndex={0}
      aria-label={messages.glassLab.sliderLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      aria-valuetext={`${Math.round(position)}%`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
    >
      <div className="compare__layer compare__before" aria-hidden="true">
        <GlassScene dirty idPrefix="before" />
      </div>
      <div className="compare__layer compare__after" aria-hidden="true">
        <GlassScene idPrefix="after" />
      </div>

      <span className="compare__label compare__label--before">{messages.glassLab.before}</span>
      <span className="compare__label compare__label--after">{messages.glassLab.after}</span>

      <div className="compare__handle" aria-hidden="true">
        <span className="compare__knob">
          {compact ? (
            <ChevronsLeftRight size={17} strokeWidth={1.7} />
          ) : (
            <ChevronsLeftRight size={19} strokeWidth={1.7} />
          )}
        </span>
      </div>
    </div>
  );
}
