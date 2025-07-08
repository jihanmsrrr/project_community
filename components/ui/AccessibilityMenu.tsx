// components/ui/AccessibilityMenu.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Settings, X } from "lucide-react";

const FAB_SIZE = 52;
const MENU_PANEL_OFFSET_Y = 10;
const MENU_PANEL_WIDTH = 320;
const MENU_PANEL_MAX_HEIGHT_CSS = "calc(100vh - 12rem)";

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const defaultSettings = {
    fontSizeMultiplier: 1,
    contrastMode: "default" as "default" | "high-contrast" | "grayscale",
    animationsDisabled: false,
  };

  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(
    defaultSettings.fontSizeMultiplier
  );
  const [contrastMode, setContrastMode] = useState(
    defaultSettings.contrastMode
  );
  const [animationsDisabled, setAnimationsDisabled] = useState(
    defaultSettings.animationsDisabled
  );

  interface Position {
    x: number;
    y: number;
  }
  const [fabPosition, setFabPosition] = useState<Position | null>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef<Position | null>(null);
  const fabInitialPosRef = useRef<Position | null>(null);

  const applyFontSize = useCallback((multiplier: number) => {
    document.documentElement.style.fontSize = `${multiplier * 100}%`;
    localStorage.setItem(
      "accessibility-fontSizeMultiplier",
      multiplier.toString()
    );
  }, []);

  const applyContrastMode = useCallback(
    (mode: "default" | "high-contrast" | "grayscale") => {
      document.documentElement.dataset.contrastMode = mode;
      localStorage.setItem("accessibility-contrastMode", mode);
    },
    []
  );

  const applyAnimationSetting = useCallback((disabled: boolean) => {
    if (disabled) {
      document.documentElement.style.setProperty(
        "transition",
        "none",
        "important"
      );
      document.documentElement.classList.add("animations-disabled");
    } else {
      document.documentElement.style.removeProperty("transition");
      document.documentElement.classList.remove("animations-disabled");
    }
    localStorage.setItem(
      "accessibility-animationsDisabled",
      disabled.toString()
    );
  }, []);

  useEffect(() => {
    setMounted(true);
    setFontSizeMultiplier(
      parseFloat(
        localStorage.getItem("accessibility-fontSizeMultiplier") || "1"
      )
    );
    setContrastMode(
      (localStorage.getItem(
        "accessibility-contrastMode"
      ) as typeof contrastMode) || "default"
    );
    setAnimationsDisabled(
      localStorage.getItem("accessibility-animationsDisabled") === "true"
    );

    const savedPos = localStorage.getItem("accessibility-fabPosition");
    if (savedPos) {
      setFabPosition(JSON.parse(savedPos));
    } else {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = fabRef.current?.offsetWidth || FAB_SIZE;
      setFabPosition({ x: vw - size - 16, y: vh - size - 16 });
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyFontSize(fontSizeMultiplier);
    applyContrastMode(contrastMode);
    applyAnimationSetting(animationsDisabled);
  }, [
    mounted,
    fontSizeMultiplier,
    contrastMode,
    animationsDisabled,
    applyFontSize,
    applyContrastMode,
    applyAnimationSetting,
  ]);

  const handleFabClick = () => {
    if (!isDraggingRef.current) setIsOpen((prev) => !prev);
  };

  const onFabDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = false;
    const evt = "touches" in e ? e.touches[0] : e;
    dragStartPosRef.current = { x: evt.clientX, y: evt.clientY };
    const rect = fabRef.current?.getBoundingClientRect();
    fabInitialPosRef.current = rect
      ? { x: rect.left, y: rect.top }
      : fabPosition;

    document.addEventListener("mousemove", onFabDragMove);
    document.addEventListener("touchmove", onFabDragMove, { passive: false });
    document.addEventListener("mouseup", onFabDragEnd);
    document.addEventListener("touchend", onFabDragEnd);
  };

  const onFabDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragStartPosRef.current || !fabInitialPosRef.current) return;
    if (e.cancelable && e.type === "touchmove") e.preventDefault();

    const evt = "touches" in e ? e.touches[0] : e;
    const dx = evt.clientX - dragStartPosRef.current.x;
    const dy = evt.clientY - dragStartPosRef.current.y;

    if (!isDraggingRef.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isDraggingRef.current = true;
      setIsOpen(false);
    }

    if (isDraggingRef.current) {
      const size = fabRef.current?.offsetWidth || FAB_SIZE;
      const newX = Math.max(
        16,
        Math.min(fabInitialPosRef.current.x + dx, window.innerWidth - size - 16)
      );
      const newY = Math.max(
        16,
        Math.min(
          fabInitialPosRef.current.y + dy,
          window.innerHeight - size - 16
        )
      );
      setFabPosition({ x: newX, y: newY });
    }
  }, []);

  const onFabDragEnd = () => {
    if (isDraggingRef.current && fabPosition) {
      localStorage.setItem(
        "accessibility-fabPosition",
        JSON.stringify(fabPosition)
      );
    }
    setTimeout(() => (isDraggingRef.current = false), 0);

    document.removeEventListener("mousemove", onFabDragMove);
    document.removeEventListener("touchmove", onFabDragMove);
    document.removeEventListener("mouseup", onFabDragEnd);
    document.removeEventListener("touchend", onFabDragEnd);
  };

  const getMenuPanelStyle = (): React.CSSProperties => {
    if (!fabPosition || !fabRef.current)
      return { position: "fixed", bottom: "5rem", right: "1rem" };

    const rect = fabRef.current.getBoundingClientRect();
    const estHeight = Math.min(350, window.innerHeight * 0.6);
    let top = rect.top - estHeight - MENU_PANEL_OFFSET_Y;
    let left = rect.left + rect.width / 2 - MENU_PANEL_WIDTH / 2;

    if (top < 16 && rect.bottom + estHeight < window.innerHeight) {
      top = rect.bottom + MENU_PANEL_OFFSET_Y;
    } else if (top < 16) {
      top = 16;
    }

    left = Math.max(
      16,
      Math.min(left, window.innerWidth - MENU_PANEL_WIDTH - 16)
    );

    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${MENU_PANEL_WIDTH}px`,
      maxHeight: MENU_PANEL_MAX_HEIGHT_CSS,
    };
  };

  return (
    <>
      <button
        ref={fabRef}
        onClick={handleFabClick}
        onMouseDown={onFabDragStart}
        onTouchStart={onFabDragStart}
        style={
          fabPosition
            ? { position: "fixed", left: fabPosition.x, top: fabPosition.y }
            : undefined
        }
        className="p-3 rounded-full shadow-lg z-[9999] bg-brand-primary text-text-on-brand"
        aria-label={
          isOpen ? "Tutup Menu Aksesibilitas" : "Buka Menu Aksesibilitas"
        }
      >
        {isOpen ? <X size={24} /> : <Settings size={24} />}
      </button>

      {isOpen && (
        <div
          style={getMenuPanelStyle()}
          className="bg-surface-card shadow-2xl rounded-lg p-4 z-[9998] border border-ui-border text-text-primary overflow-y-auto"
        >
          {/* Menu Content Here */}
        </div>
      )}
    </>
  );
};

export default AccessibilityMenu;
