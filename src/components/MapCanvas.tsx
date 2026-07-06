import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MINING_NODES, MiningNode } from "../data/miningData";
import { Compass, Eye, MapPin, School, Home, Tent, Building } from "lucide-react";

// Import the real SVG logo/assets dynamically to ensure Vite maps them correctly
import presentMap from "../assets/images/Mooka High 45 3D.png";
import historicalMap from "../assets/images/EromangaAnda.png";
import digitalMap from "../assets/images/DigitalMine.png";

interface MapCanvasProps {
  onNodeSelect: (node: MiningNode) => void;
  selectedNode: MiningNode | null;
  activeFilter: string; // "all" | "fields" | "destinations"
  zoomToTrigger: { nodeId: string; timestamp: number } | null;
  isHistoricalView?: boolean;
  isDigitalView?: boolean;
}

export default function MapCanvas({
  onNodeSelect,
  selectedNode,
  activeFilter,
  zoomToTrigger,
  isHistoricalView = false,
  isDigitalView = false
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);

  // Pan and Zoom States
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  // Hover States
  const [hoveredNode, setHoveredNode] = useState<MiningNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Handle zooming to a specific node when triggered externally (e.g., from PDP "Origin Waypoint" link)
  useEffect(() => {
    if (zoomToTrigger && containerRef.current) {
      if (zoomToTrigger.nodeId === "reset") {
        setScale(1);
        setPan({ x: 0, y: 0 });
        return;
      }
      const node = MINING_NODES.find((n) => n.id === zoomToTrigger.nodeId);
      if (node) {
        // Calculate viewport width/height
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Map dimensions (ideal 16:9 ratio matches image aspect ratio)
        // Convert node x% and y% back into the map sheet pixel coordinates
        // At scale = 2.2, center the node in the viewport
        const targetScale = 2.2;
        setScale(targetScale);

        // Position calculations to center the node
        // x and y are % coordinates (0-100) on the map sheet
        // We want: viewportCenter - (nodePosPercent * mapWidthAtScale)
        const mapWidth = width * targetScale;
        const mapHeight = height * targetScale;

        const targetX = width / 2 - (node.x / 100) * mapWidth;
        const targetY = height / 2 - (node.y / 100) * mapHeight;

        // Apply with a smooth clamp
        setPan({
          x: Math.max(-mapWidth + width, Math.min(0, targetX)),
          y: Math.max(-mapHeight + height, Math.min(0, targetY))
        });
      }
    }
  }, [zoomToTrigger]);

  // Reset View function
  const handleReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  // Pointer event handlers for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentMapWidth = rect.width * scale;
      const currentMapHeight = rect.height * scale;

      // Allow panning but clamp so map sheet doesn't drag completely out of viewport bounds
      const minX = -(currentMapWidth - rect.width);
      const minY = -(currentMapHeight - rect.height);

      let newX = panStart.current.x + dx;
      let newY = panStart.current.y + dy;

      // Clamping limits (with small elastic buffer if fully fitted)
      if (scale === 1) {
        newX = 0;
        newY = 0;
      } else {
        newX = Math.max(minX, Math.min(0, newX));
        newY = Math.max(minY, Math.min(0, newY));
      }

      setPan({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    const target = e.currentTarget as HTMLElement;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignored if target went uncaptured
    }
  };

  // Zoom handler using mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const zoomIntensity = 0.1;
    const rect = containerRef.current.getBoundingClientRect();

    // Mouse coordinates relative to container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate mouse position relative to the map sheet before zoom
    const mapMouseX = (mouseX - pan.x) / scale;
    const mapMouseY = (mouseY - pan.y) / scale;

    // Determine new scale
    const delta = e.deltaY < 0 ? 1 : -1;
    let newScale = scale + delta * zoomIntensity;
    newScale = Math.max(1, Math.min(4, newScale));

    // Calculate new pans so that zooming centers on mouse coordinates
    const newPanX = mouseX - mapMouseX * newScale;
    const newPanY = mouseY - mapMouseY * newScale;

    // Clamping bounds for the new pan
    const mapWidth = rect.width * newScale;
    const mapHeight = rect.height * newScale;
    const minX = -(mapWidth - rect.width);
    const minY = -(mapHeight - rect.height);

    setScale(newScale);
    setPan({
      x: newScale === 1 ? 0 : Math.max(minX, Math.min(0, newPanX)),
      y: newScale === 1 ? 0 : Math.max(minY, Math.min(0, newPanY))
    });
  };

  // Filter nodes based on active HUD filters
  const filteredNodes = MINING_NODES.filter((node) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "fields") return node.type === "field";
    if (activeFilter === "destinations") return node.type === "destination";
    return true;
  });

  return (
    <div
      id="map-viewport"
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="map-canvas-container relative w-full h-full overflow-hidden bg-charcoal-dark select-none"
    >
      {/* Background Heat Haze & Parallax Atmosphere overlay */}
      <div className={`absolute inset-0 pointer-events-none z-10 mix-blend-multiply transition-colors duration-1000 ${
        isDigitalView
          ? "bg-radial-[circle_at_center,transparent_40%,rgba(6,78,59,0.7)_90%] opacity-90"
          : isHistoricalView 
            ? "bg-radial-[circle_at_center,transparent_40%,rgba(8,47,73,0.7)_90%] opacity-90"
            : "bg-radial-[circle_at_center,transparent_40%,rgba(0,0,0,0.65)_90%] opacity-80"
      }`} />
      
      {/* Cinematic Map Frame Sheet */}
      <motion.div
        id="map-sheet"
        style={{
          x: pan.x,
          y: pan.y,
          scale: scale,
          transformOrigin: "0 0"
        }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="absolute inset-0 w-full h-full origin-top-left"
      >
        {/* Present Map Layer */}
        <img
          ref={mapImageRef}
          src={presentMap}
          alt="Andamooka Outback Cinematic Map"
          referrerPolicy="no-referrer"
          style={{ opacity: (!isHistoricalView && !isDigitalView) ? 1 : 0 }}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none shadow-2xl transition-opacity duration-1000 filter brightness-[0.88] contrast-[1.05] sepia-[0.1]"
        />

        {/* Prehistoric Eromanga Sea Map Layer (100 million years ago) */}
        <img
          src={historicalMap}
          alt="Andamooka Eromanga Sea 100M Yo Map"
          referrerPolicy="no-referrer"
          style={{ opacity: isHistoricalView ? 1 : 0 }}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none shadow-2xl transition-opacity duration-1000 filter brightness-[0.9] contrast-[1.05] saturate-[1.1]"
        />

        {/* Digital Mining Map Layer */}
        <img
          src={digitalMap}
          alt="Digital Mining Map"
          referrerPolicy="no-referrer"
          style={{ opacity: isDigitalView ? 1 : 0 }}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none shadow-2xl transition-opacity duration-1000 filter brightness-[0.95] contrast-[1.15] saturate-[1.1]"
        />

        {/* Bioluminescent Ancient Sea Atmosphere Overlay */}
        {isHistoricalView && (
          <div className="absolute inset-0 pointer-events-none z-10 sea-ripple overflow-hidden">
            {/* Ambient drifting bioluminescent particulate gems */}
            <div className="absolute top-[20%] left-[30%] w-2.5 h-2.5 rounded-full bg-cyan-400/40 blur-[1px] underwater-particle" />
            <div className="absolute top-[60%] left-[75%] w-4 h-4 rounded-full bg-cyan-400/20 blur-[2px] underwater-particle" style={{ animationDelay: "1.5s" }} />
            <div className="absolute top-[45%] left-[15%] w-2 h-2 rounded-full bg-cyan-300/35 blur-[0.5px] underwater-particle" style={{ animationDelay: "3s" }} />
            <div className="absolute top-[80%] left-[45%] w-3 h-3 rounded-full bg-cyan-300/25 blur-[1px] underwater-particle" style={{ animationDelay: "0.5s" }} />
          </div>
        )}

        {/* Digital Mining Particles Overlay */}
        {isDigitalView && (
          <div className="absolute inset-0 pointer-events-none z-10 digital-grid overflow-hidden">
            {/* Ambient glowing digital green/blue particles */}
            <div className="absolute top-[20%] left-[40%] w-2 h-2 bg-emerald-400/50 shadow-[0_0_8px_#34d399] animate-pulse rounded-sm" />
            <div className="absolute top-[65%] left-[15%] w-1.5 h-1.5 bg-cyan-400/50 shadow-[0_0_8px_#22d3ee] animate-pulse rounded-sm" style={{ animationDelay: "1s" }} />
            <div className="absolute top-[45%] left-[80%] w-2 h-2 bg-emerald-300/40 shadow-[0_0_6px_#34d399] animate-pulse rounded-sm" style={{ animationDelay: "2s" }} />
            <div className="absolute top-[85%] left-[55%] w-1 h-1 bg-cyan-300/40 shadow-[0_0_6px_#22d3ee] animate-pulse rounded-sm" style={{ animationDelay: "0.5s" }} />
          </div>
        )}

        {/* Render Interactive Nodes */}
        {filteredNodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const isField = node.type === "field";

          return (
            <button
              key={node.id}
              id={`node-${node.id}`}
              onClick={(e) => {
                e.stopPropagation();
                // Prevent trigger when dragging slightly
                if (isDragging) return;
                onNodeSelect(node);
              }}
              onPointerOver={(e) => {
                setHoveredNode(node);
                // Calculate position relative to container
                if (mapImageRef.current) {
                  const xPercent = node.x;
                  const yPercent = node.y;
                  setTooltipPos({ x: xPercent, y: yPercent });
                }
              }}
              onPointerOut={() => setHoveredNode(null)}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 outline-none select-none focus:outline-none"
            >
              {isField ? (
                // Mining Field Hotspot: Styled as a crossed pickaxe marker or rugged circle with cross
                <div className="relative flex items-center justify-center">
                  {/* Glowing Amber Fire Ember Aura / Bioluminescent Aqua Aura / Digital Matrix Aura */}
                  <div className={`absolute rounded-full blur-md group-hover:scale-150 transition-all duration-500 animate-pulse ${
                    isDigitalView
                      ? "w-14 h-14 bg-emerald-500/30"
                      : isHistoricalView 
                        ? "w-14 h-14 bg-cyan-500/40" 
                        : "w-10 h-10 bg-burnt-earth/10"
                  }`} />
                  
                  {/* Node Icon */}
                  {(!isHistoricalView && !isDigitalView) ? (
                    // PRESENT DAY: No circle container, hand-scribbled "X" in black colour!
                    <span className={`font-serif italic font-black text-4xl select-none leading-none -translate-y-[2px] rotate-3 text-black transition-all duration-300 ${
                      isSelected ? "scale-125 drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]" : "opacity-85 hover:opacity-100 hover:scale-110"
                    }`}>
                      X
                    </span>
                  ) : (
                    // HISTORICAL or DIGITAL: Beautiful glowing circle
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? isDigitalView
                          ? "bg-emerald-600 border-emerald-100 scale-125 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                          : "bg-cyan-600 border-cyan-100 scale-125 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                        : isDigitalView
                          ? "bg-charcoal/90 border-emerald-500/80 group-hover:border-emerald-200 group-hover:scale-110 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                          : "bg-charcoal/90 border-cyan-500/80 group-hover:border-cyan-200 group-hover:scale-110 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                    }`}>
                      {/* Hand-scrawled X marks the spot */}
                      <span className={`font-serif italic font-extrabold text-2xl select-none leading-none -translate-y-[1px] ${
                        isSelected 
                          ? "text-parchment" 
                          : isDigitalView
                            ? "text-emerald-400 group-hover:text-emerald-100"
                            : "text-cyan-400 group-hover:text-cyan-100"
                      }`}>
                        X
                      </span>
                    </div>
                  )}

                  {/* Field Label */}
                  <span className={`absolute top-12 px-2.5 py-1 rounded text-[11px] sm:text-xs font-serif-medium uppercase tracking-wider whitespace-nowrap shadow-xl transition-all border ${
                    isDigitalView
                      ? "bg-charcoal-dark/95 border-emerald-950 text-emerald-300/90 group-hover:text-emerald-100 group-hover:border-emerald-400"
                      : isHistoricalView
                        ? "bg-charcoal-dark/95 border-cyan-950 text-cyan-200/90 group-hover:text-cyan-100 group-hover:border-cyan-400"
                        : "bg-burnt-earth-dark/45 border-burnt-earth/60 hover:border-parchment text-parchment/90 group-hover:text-parchment backdrop-blur-md" // Translucent orange like the satchel box!
                  }`}>
                    {node.name}
                  </span>
                </div>
              ) : (
                // Key Destination: Warm Campfire Ember / Sea Depths Biolum / Cyber Node Marker
                <div className="relative flex items-center justify-center">
                  {/* Campfire / Aquamarine / Emerald pulse rings */}
                  <div className={`absolute rounded-full border animate-ping opacity-25 ${
                    isDigitalView 
                      ? "w-20 h-20 border-emerald-500/40"
                      : isHistoricalView 
                        ? "w-20 h-20 border-cyan-500/40" 
                        : "w-12 h-12 border-burnt-earth/20"
                  }`} />
                  <div className={`absolute rounded-full blur-sm group-hover:scale-150 transition-all duration-500 animate-pulse ${
                    isDigitalView
                      ? "w-14 h-14 bg-emerald-500/30"
                      : isHistoricalView 
                        ? "w-14 h-14 bg-cyan-500/30" 
                        : "w-8 h-8 bg-burnt-earth/10"
                  }`} />
                  
                  {/* Icon Block */}
                  {(!isHistoricalView && !isDigitalView) ? (
                    // PRESENT DAY: No circle container, render icon directly in black!
                    <div className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                      isSelected ? "scale-125 text-black drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]" : "text-[#1a1a1a] hover:scale-110 hover:text-black"
                    }`}>
                      {(() => {
                        const iconClass = "w-6 h-6 transition-all duration-300";
                        if (node.id === "learn-centre") {
                          return <School className={iconClass} />;
                        } else if (node.id.endsWith("-hut")) {
                          return <Home className={iconClass} />;
                        } else if (node.id === "the-shed") {
                          return <Building className={iconClass} />;
                        } else if (node.id === "trading-post") {
                          return <Tent className={iconClass} />;
                        } else {
                          return <Building className={iconClass} />;
                        }
                      })()}
                    </div>
                  ) : (
                    // HISTORICAL or DIGITAL: Beautiful rounded-xl border block
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? isDigitalView
                          ? "bg-emerald-600 border-emerald-100 scale-125 shadow-[0_0_15px_rgba(52,211,153,0.9)]"
                          : "bg-cyan-600 border-cyan-100 scale-125 shadow-[0_0_15px_rgba(6,182,212,0.9)]"
                        : isDigitalView
                          ? "bg-charcoal/95 border-emerald-700/80 group-hover:border-emerald-400 group-hover:scale-110 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                          : "bg-charcoal/95 border-cyan-700/80 group-hover:border-cyan-400 group-hover:scale-110 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                    }`}>
                      {(() => {
                        const iconClass = `w-5 h-5 transition-all duration-300 ${
                          isSelected 
                            ? "text-parchment" 
                            : isDigitalView
                              ? "text-emerald-400 group-hover:text-emerald-100"
                              : "text-cyan-400 group-hover:text-cyan-100"
                        }`;
                        if (node.id === "learn-centre") {
                          return <School className={iconClass} />;
                        } else if (node.id.endsWith("-hut")) {
                          return <Home className={iconClass} />;
                        } else if (node.id === "the-shed") {
                          return <Building className={iconClass} />;
                        } else if (node.id === "trading-post") {
                          return <Tent className={iconClass} />;
                        } else {
                          return <Building className={iconClass} />;
                        }
                      })()}
                    </div>
                  )}

                  {/* Destination Label */}
                  <span className={`absolute top-12 px-2.5 py-1 rounded text-[11px] sm:text-xs font-serif-medium uppercase tracking-wider whitespace-nowrap shadow-xl transition-all border ${
                    isDigitalView
                      ? "bg-charcoal/95 border-emerald-950 text-emerald-200/90 group-hover:text-emerald-100 group-hover:border-emerald-400"
                      : isHistoricalView
                        ? "bg-charcoal/95 border-cyan-950 text-cyan-200/90 group-hover:text-cyan-100 group-hover:border-cyan-400"
                        : "bg-burnt-earth-dark/45 border-burnt-earth/60 hover:border-parchment text-parchment/90 group-hover:text-parchment backdrop-blur-md" // Translucent orange like the satchel box!
                  }`}>
                    {node.name}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Map Controls HUD (Bottom Left inside viewport) */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
        <button
          onClick={() => setScale(Math.min(4, scale + 0.3))}
          className="w-10 h-10 bg-charcoal/90 hover:bg-burnt-earth border border-old-leather hover:border-parchment rounded-lg flex items-center justify-center text-parchment hover:text-parchment transition-all shadow-lg text-lg font-bold cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => {
            const newScale = Math.max(1, scale - 0.3);
            setScale(newScale);
            if (newScale === 1) setPan({ x: 0, y: 0 });
          }}
          className="w-10 h-10 bg-charcoal/90 hover:bg-burnt-earth border border-old-leather hover:border-parchment rounded-lg flex items-center justify-center text-parchment hover:text-parchment transition-all shadow-lg text-lg font-bold cursor-pointer"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={handleReset}
          className="px-3 h-10 bg-charcoal/90 hover:bg-burnt-earth border border-old-leather hover:border-parchment rounded-lg flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono text-parchment hover:text-parchment transition-all shadow-lg cursor-pointer"
          title="Reset View"
        >
          <Compass className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Floating Tooltip Layer (Z-3) */}
      <AnimatePresence>
        {hoveredNode && !selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              // Tooltip is placed dynamically based on coordinates inside viewport
              left: `calc(${tooltipPos.x}% * ${scale} + ${pan.x}px)`,
              top: `calc(${tooltipPos.y}% * ${scale} + ${pan.y}px - 40px)`
            }}
            className="absolute z-30 -translate-x-1/2 -translate-y-full pointer-events-none min-w-[260px] max-w-[340px]"
          >
            {/* Torn aged paper styled container */}
            <div className="bg-[#faf7f0] text-charcoal border border-[#d6cca9] p-5 rounded-md shadow-2xl relative">
              {/* Corner decor */}
              <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-old-leather/30" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-old-leather/30" />
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-old-leather/30" />
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-old-leather/30" />
              
              <div className="flex items-center justify-between border-b border-old-leather/10 pb-2 mb-2">
                <span className="font-serif font-bold text-sm sm:text-base uppercase tracking-wider text-burnt-earth-dark flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {hoveredNode.name}
                </span>
                <span className="font-mono text-[10px] tracking-wider text-charcoal-light/75 uppercase">
                  {hoveredNode.type}
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm leading-relaxed italic text-charcoal-light/90">
                "{hoveredNode.tagline}"
              </p>
              
              <div className="mt-3 flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-burnt-earth uppercase tracking-widest font-semibold">
                <Eye className="w-3.5 h-3.5" />
                Click to explore
              </div>

              {/* Speech bubble beak */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#faf7f0]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[7px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#d6cca9] -z-10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
