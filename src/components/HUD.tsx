import React from "react";
import { ShoppingBag, Map, Briefcase, RotateCcw, Compass } from "lucide-react";
import { MiningNode } from "../data/miningData";

import mbmcLogo from "../assets/images/MBMCLogoWhite.svg";

interface HUDProps {
  activeFilter: string;
  onFilterChange: (filter: "all" | "fields" | "destinations") => void;
  onResetView: () => void;
  onOpenSatchel: () => void;
  satchelCount: number;
  selectedNode: MiningNode | null;
  isHistoricalView?: boolean;
  onToggleHistoricalView?: () => void;
  isDigitalView?: boolean;
  onToggleDigitalView?: () => void;
}

export default function HUD({
  activeFilter,
  onFilterChange,
  onResetView,
  onOpenSatchel,
  satchelCount,
  selectedNode,
  isHistoricalView = false,
  onToggleHistoricalView,
  isDigitalView = false,
  onToggleDigitalView
}: HUDProps) {
  const isAnySpecialView = isHistoricalView || isDigitalView;

  return (
    <div
      id="hud-overlay"
      className={`absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 transition-all duration-700 ${
        selectedNode ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100"
      }`}
    >
      {/* TOP HEADER ROW */}
      <header className="w-full flex items-center justify-between pointer-events-auto gap-4">
        {/* Top Left: Logo & Toggles sitting side-by-side as square blocks */}
        <div className="flex items-center gap-3">
          {/* Logo Box (Square!) */}
          <button
            onClick={onResetView}
            className="group w-[110px] h-[110px] flex flex-col items-center justify-center bg-charcoal-dark/70 hover:bg-charcoal-dark/95 border border-old-leather/30 hover:border-burnt-earth p-2.5 rounded-xl transition-all duration-300 backdrop-blur-md shadow-2xl outline-none focus:outline-none cursor-pointer"
            title="Reset View"
          >
            <img
              src={mbmcLogo}
              alt="Mooka Boys Logo"
              className="w-24 h-auto group-hover:scale-105 transition-all duration-300 drop-shadow-[0_0_6px_rgba(238,138,37,0.3)]"
            />
          </button>

          {/* Time Travel Square Button */}
          {onToggleHistoricalView && (
            <button
              onClick={onToggleHistoricalView}
              className={`w-[110px] h-[110px] rounded-xl flex flex-col items-center justify-center text-center p-2.5 transition-all duration-300 shadow-2xl border backdrop-blur-md cursor-pointer outline-none focus:outline-none ${
                isHistoricalView
                  ? "bg-cyan-950/90 hover:bg-cyan-900 text-cyan-200 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                  : "bg-charcoal-dark/80 hover:bg-charcoal text-parchment/70 border-old-leather/40 hover:border-burnt-earth"
              }`}
              title="Toggle Prehistoric Eromanga Sea Layer"
            >
              <span className={`w-2 h-2 rounded-full mb-2 ${isHistoricalView ? "bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" : "bg-burnt-earth"}`} />
              <div className="font-mono text-[10px] font-bold leading-tight uppercase tracking-wider">
                <div>Time</div>
                <div>Travel</div>
              </div>
            </button>
          )}

          {/* Digital Mining Square Button */}
          {onToggleDigitalView && (
            <button
              onClick={onToggleDigitalView}
              className={`w-[110px] h-[110px] rounded-xl flex flex-col items-center justify-center text-center p-2.5 transition-all duration-300 shadow-2xl border backdrop-blur-md cursor-pointer outline-none focus:outline-none ${
                isDigitalView
                  ? "bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.35)]"
                  : "bg-charcoal-dark/80 hover:bg-charcoal text-parchment/70 border-old-leather/40 hover:border-burnt-earth"
              }`}
              title="Toggle Digital Mining Mode"
            >
              <span className={`w-2 h-2 rounded-full mb-2 ${isDigitalView ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" : "bg-burnt-earth"}`} />
              <div className="font-mono text-[10px] font-bold leading-tight uppercase tracking-wider">
                <div>Digital</div>
                <div>Mining</div>
              </div>
            </button>
          )}
        </div>

        {/* Top Right: Elegant Header Navbar (Translucent and matching the other blocks) */}
        <nav className="hidden md:flex items-center gap-6 sm:gap-8 bg-charcoal-dark/45 backdrop-blur-md border border-old-leather/25 px-6 sm:px-8 py-3.5 rounded-xl shadow-2xl">
          <button className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-parchment/80 hover:text-burnt-earth hover:scale-105 transition-all duration-300 cursor-pointer">
            Shop
          </button>
          <button className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-parchment/80 hover:text-burnt-earth hover:scale-105 transition-all duration-300 cursor-pointer">
            Learn
          </button>
          <button className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-parchment/80 hover:text-burnt-earth hover:scale-105 transition-all duration-300 cursor-pointer">
            Contact
          </button>
          <button className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-parchment/80 hover:text-burnt-earth hover:scale-105 transition-all duration-300 cursor-pointer">
            History
          </button>
        </nav>
      </header>

      {/* BOTTOM CONTROL FOOTER ROW */}
      <footer className="w-full flex items-end justify-between gap-4">
        {/* Bottom Left: Coordinates & Weather/Era Status (Enlarged and enhanced!) */}
        <div className={`backdrop-blur-md border-2 p-5 rounded-2xl pointer-events-auto shadow-2xl text-left transition-all duration-1000 ${
          isDigitalView
            ? "bg-emerald-950/60 border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
            : isHistoricalView 
              ? "bg-cyan-950/60 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              : "bg-charcoal-dark/85 border-old-leather/50 shadow-[0_0_20px_rgba(184,80,40,0.15)]"
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              isDigitalView ? "bg-emerald-400" : isHistoricalView ? "bg-cyan-400" : "bg-burnt-earth"
            }`} />
            <span className={`font-serif-medium text-xs sm:text-sm uppercase tracking-wider font-bold transition-colors duration-1000 ${
              isDigitalView ? "text-emerald-400" : isHistoricalView ? "text-cyan-400" : "text-burnt-earth"
            }`}>
              {isDigitalView ? "Quantum Digital Grid" : isHistoricalView ? "Eromanga Basin Bed" : "Andamooka Station"}
            </span>
          </div>
          <div className="font-mono text-xs sm:text-sm text-parchment/90 leading-relaxed space-y-1">
            <div>LOC: 30.4501° S, 137.1643° E</div>
            <div className={`transition-colors duration-1000 ${
              isDigitalView ? "text-emerald-300" : isHistoricalView ? "text-cyan-300" : "text-parchment/60"
            }`}>
              {isDigitalView
                ? "GRID STATUS: ACTIVE • RESOLUTION: 4K HIGH RES • COZZA DEEP SCAN"
                : isHistoricalView 
                  ? "ERA: LOWER CRETACEOUS (100M YO) • WATER TEMP: 18°C"
                  : "OUTBACK TEMPERATURE: 34°C • COZZA ONLINE"
              }
            </div>
          </div>
        </div>

        {/* Bottom Center: The Stamped "DIG DEEP" Tag */}
        <div className={`hidden md:flex flex-col items-center select-none rotate-[-4deg] opacity-25 hover:opacity-50 transition-all duration-1000 transform translate-y-2 ${
          isDigitalView ? "text-emerald-400 hover:opacity-70" : isHistoricalView ? "text-cyan-400 hover:opacity-70" : "text-burnt-earth"
        }`}>
          <div className={`border-[3px] border-dashed px-5 py-1.5 rounded transition-all duration-1000 ${
            isDigitalView ? "border-emerald-400" : isHistoricalView ? "border-cyan-400" : "border-burnt-earth"
          }`}>
            <span className={`font-typewriter text-lg tracking-[0.25em] font-black leading-none uppercase transition-colors duration-1000 ${
              isDigitalView ? "text-emerald-400" : isHistoricalView ? "text-cyan-400" : "text-burnt-earth"
            }`}>
              {isDigitalView ? "Digital Claims" : isHistoricalView ? "Sea Depths" : "Dig Deep"}
            </span>
          </div>
          <span className={`font-typewriter text-[7px] uppercase tracking-[0.4em] mt-1 font-bold transition-colors duration-1000 ${
            isDigitalView ? "text-emerald-400/80" : isHistoricalView ? "text-cyan-400/80" : "text-burnt-earth"
          }`}>
            {isDigitalView ? "• SCAN PROTOCOL •" : isHistoricalView ? "• 100M BC •" : "• EST 1972 •"}
          </span>
        </div>

        {/* Bottom Right: Handcrafted Leather Satchel (Cart) Trigger (More prominent!) */}
        <button
          onClick={onOpenSatchel}
          className="group relative flex items-center gap-4 bg-burnt-earth-dark/45 hover:bg-burnt-earth border-2 border-burnt-earth/80 hover:border-parchment px-6 py-4 rounded-2xl pointer-events-auto shadow-[0_0_25px_rgba(238,138,37,0.3)] hover:shadow-[0_0_35px_rgba(238,138,37,0.6)] transition-all duration-300 backdrop-blur-md outline-none focus:outline-none cursor-pointer"
        >
          {/* Cart Icon representing a rugged explorer satchel */}
          <div className="relative">
            <ShoppingBag className="w-7 h-7 text-parchment group-hover:scale-110 transition-transform" />
            {satchelCount > 0 && (
              <span className="absolute -top-3.5 -right-3.5 bg-burnt-earth text-parchment text-[11px] font-serif font-bold w-6 h-6 rounded-full border-2 border-parchment flex items-center justify-center animate-bounce shadow-xl">
                {satchelCount}
              </span>
            )}
          </div>

          <div className="text-left hidden sm:block">
            <span className="block font-mono text-[9px] uppercase tracking-widest text-parchment group-hover:text-parchment/80 font-bold leading-none">
              Leather Satchel
            </span>
            <span className="block font-serif font-bold text-sm text-parchment mt-1 leading-none">
              {satchelCount === 0 ? "Empty satchel" : `${satchelCount} Claimed`}
            </span>
          </div>
        </button>
      </footer>
    </div>
  );
}
