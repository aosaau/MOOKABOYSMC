import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import MapCanvas from "./components/MapCanvas";
import HUD from "./components/HUD";
import JournalOverlay from "./components/JournalOverlay";
import SatchelCart from "./components/SatchelCart";
import mbmcLogoWhite from "./assets/images/MBMCLogoWhite.svg";
import { MiningNode, Product, PRODUCTS, MINING_NODES } from "./data/miningData";
import { Compass, Gift, Landmark, ShieldAlert, Sparkles, Volume2, VolumeX } from "lucide-react";

export default function App() {
  // Application State Orchestration
  const [hasEntered, setHasEntered] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "fields" | "destinations">("all");
  const [selectedNode, setSelectedNode] = useState<MiningNode | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [isSatchelOpen, setIsSatchelOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isHistoricalView, setIsHistoricalView] = useState(false);
  const [isDigitalView, setIsDigitalView] = useState(false);

  // Trigger camera zoom/pan to a specific node programmatically
  const [zoomToTrigger, setZoomToTrigger] = useState<{ nodeId: string; timestamp: number } | null>(null);

  // Ambient sound or simple tactile click audio feedback
  const playTactileClick = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      // Simple organic "click / stamp" low frequency physical thumb pop
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (err) {
      // Audio permission or browser restriction fallback
    }
  };

  const playClaimChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      // High end crystal strike frequency representing finding an opal
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.35);
      
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (err) {
      // Audio permission error catch
    }
  };

  const playTimeTravelWhoosh = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gain = audioCtx.createGain();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      // Deep, mystical low frequency sweeping whoosh that goes upwards and opens up with resonance
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.8);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(120, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1800, audioCtx.currentTime + 0.8);
      filter.Q.setValueAtTime(8, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (err) {
      // Audio fallback
    }
  };

  const handleToggleHistoricalView = () => {
    playTimeTravelWhoosh();
    setIsHistoricalView((prev) => !prev);
    setIsDigitalView(false);
  };

  const handleToggleDigitalView = () => {
    playTimeTravelWhoosh();
    setIsDigitalView((prev) => !prev);
    setIsHistoricalView(false);
  };

  // Keyboard accessibility listeners (e.g., ESC closes detailed journals/drawers)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedNode(null);
        setSelectedProduct(null);
        setIsSatchelOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handler: User clicks a hotspot node on the map
  const handleNodeSelect = (node: MiningNode) => {
    playTactileClick();
    setSelectedNode(node);
    setSelectedProduct(null); // Reset product mode, show journal dispatches
    setIsSatchelOpen(false); // Close satchel sidebar if open
  };

  // Handler: Fly to specific node coordinate (Origin Link)
  const handleFlyToNode = (nodeId: string) => {
    playTactileClick();
    const targetNode = MINING_NODES.find((n) => n.id === nodeId);
    if (targetNode) {
      setSelectedNode(targetNode);
      setSelectedProduct(null); // Go to main dispatcher view for this node
      // Trigger camera fly-to on MapCanvas
      setZoomToTrigger({ nodeId, timestamp: Date.now() });
    }
  };

  // Handler: Adds a unique item to the leather satchel cart list
  const handleClaimItem = (product: Product) => {
    playClaimChime();
    if (!claimedIds.includes(product.id)) {
      setClaimedIds((prev) => [...prev, product.id]);
    }
  };

  // Handler: Discards an item from the claimed satchel list
  const handleRemoveItem = (id: string) => {
    playTactileClick();
    setClaimedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClearSatchel = () => {
    playTactileClick();
    setClaimedIds([]);
  };

  // Reset Map View (and closes all overlays back to surface map overview)
  const handleResetView = () => {
    playTactileClick();
    setSelectedNode(null);
    setSelectedProduct(null);
    setIsSatchelOpen(false);
    setZoomToTrigger({ nodeId: "reset", timestamp: Date.now() });
  };

  // Map claiming product IDs back to full Product objects
  const claimedProducts = claimedIds
    .map((id) => PRODUCTS[id])
    .filter(Boolean) as Product[];

  return (
    <div className="w-screen h-screen relative bg-charcoal-dark select-none overflow-hidden font-sans text-parchment">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          /* ================= LANDING ENTRANCE TITLE SCREEN (CINEMATIC INTRO) ================= */
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-charcoal-dark flex flex-col justify-between items-center p-8 z-50 overflow-hidden"
          >
            {/* Cinematic background dust/scratch texture */}
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(184,80,40,0.06)_10%,transparent_75%] pointer-events-none" />
            
            {/* Ambient Audio Toggle */}
            <div className="self-end pointer-events-auto">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-2 border border-old-leather/30 hover:border-burnt-earth bg-charcoal/60 px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all duration-300"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-burnt-earth animate-pulse" />
                    Audio On
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-parchment/40" />
                    Audio Muted
                  </>
                )}
              </button>
            </div>

            {/* Core Brand Header */}
            <div className="flex flex-col items-center max-w-xl text-center select-none translate-y-12">
              {/* Correct White Logo with Orange Brand Mark */}
              <img
                src={mbmcLogoWhite}
                alt="Mooka Boys Mining Co. Logo"
                className="w-72 sm:w-[350px] h-auto drop-shadow-[0_0_20px_rgba(238,138,37,0.35)] mb-2 transition-all duration-300"
              />

              <p className="font-sans text-xs sm:text-sm text-parchment/65 leading-relaxed mt-6 max-w-md">
                Wander through the coordinate fieldbooks of Australia's premier opal claims. Discover deep-seam geological data, stories of the pick-hammer grind, and claim bespoke specimens directly from the clay face.
              </p>

              {/* Enter Button */}
              <button
                onClick={() => {
                  playClaimChime();
                  setHasEntered(true);
                }}
                className="mt-8 px-8 py-4 bg-[#b85028] hover:bg-[#8c3513] text-[#faf7f0] border border-[#8c3513] hover:border-parchment font-serif font-black text-xs sm:text-sm tracking-[0.25em] uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
              >
                ENTER MOOKA BOYS HQ
              </button>
            </div>

            {/* Footer station coordinates */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-parchment/30">
                Andamooka Station • South Australia
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-burnt-earth/50">
                30.4501° S, 137.1643° E
              </span>
            </div>
          </motion.div>
        ) : (
          /* ================= MAIN INTERACTIVE HQ VIEW ================= */
          <motion.div
            key="main-hq"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-stretch"
          >
            {/* MAP LAYERS (Z-0 Base map, Z-1 VFX, Z-2 Markers, Z-3 Tooltips) */}
            <div className="flex-1 relative w-full h-full overflow-hidden">
              <MapCanvas
                onNodeSelect={handleNodeSelect}
                selectedNode={selectedNode}
                activeFilter={activeFilter}
                zoomToTrigger={zoomToTrigger}
                isHistoricalView={isHistoricalView}
                isDigitalView={isDigitalView}
              />

              {/* Persistent HUD framing overlay (Z-4) */}
              <HUD
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                onResetView={handleResetView}
                onOpenSatchel={() => {
                  playTactileClick();
                  setIsSatchelOpen(true);
                  setSelectedNode(null); // Close main journal overlay if open
                }}
                satchelCount={claimedIds.length}
                selectedNode={selectedNode}
                isHistoricalView={isHistoricalView}
                onToggleHistoricalView={handleToggleHistoricalView}
                isDigitalView={isDigitalView}
                onToggleDigitalView={handleToggleDigitalView}
              />

              {/* SLIDING JOURNAL DEEP DIVE OVERLAY (Z-5) */}
              <AnimatePresence>
                {selectedNode && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 200 }}
                    className="absolute inset-y-0 right-0 z-50 w-full max-w-2xl h-full"
                  >
                    <JournalOverlay
                      node={selectedNode}
                      onClose={() => {
                        playTactileClick();
                        setSelectedNode(null);
                        setSelectedProduct(null);
                      }}
                      onClaimItem={handleClaimItem}
                      claimedIds={claimedIds}
                      onFlyToNode={handleFlyToNode}
                      selectedProduct={selectedProduct}
                      setSelectedProduct={setSelectedProduct}
                      onProductSelectDirect={setSelectedProduct}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SLIDING SATCHEL CART OVERLAY (Z-5) */}
              <AnimatePresence>
                {isSatchelOpen && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 200 }}
                    className="absolute inset-y-0 right-0 z-50 w-full max-w-md h-full"
                  >
                    <SatchelCart
                      isOpen={isSatchelOpen}
                      onClose={() => {
                        playTactileClick();
                        setIsSatchelOpen(false);
                      }}
                      claimedItems={claimedProducts}
                      onRemoveItem={handleRemoveItem}
                      onClearSatchel={handleClearSatchel}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Background ambient outback audio controller */}
              <div className="absolute top-6 left-6 z-30 pointer-events-auto flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-10 h-10 rounded-lg bg-charcoal/90 hover:bg-burnt-earth border border-old-leather/40 hover:border-parchment flex items-center justify-center text-parchment hover:text-parchment transition-all shadow-lg"
                  title={soundEnabled ? "Mute sound" : "Enable tactile sound"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-parchment animate-pulse" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-parchment/40" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
