import React, { useState } from "react";
import { motion } from "motion/react";
import { MiningNode, Product, PRODUCTS, MINING_NODES } from "../data/miningData";
import { X, MapPin, Compass, ShieldCheck, HelpCircle, PackageOpen, Tag } from "lucide-react";

interface JournalOverlayProps {
  node: MiningNode | null;
  onClose: () => void;
  onClaimItem: (product: Product) => void;
  claimedIds: string[];
  onFlyToNode: (nodeId: string) => void;
  onProductSelectDirect: (product: Product) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

export default function JournalOverlay({
  node,
  onClose,
  onClaimItem,
  claimedIds,
  onFlyToNode,
  selectedProduct,
  setSelectedProduct
}: JournalOverlayProps) {
  if (!node) return null;

  // Track if we are showing a product detail or the field/destination journal overview
  const isProductView = selectedProduct !== null;

  // Retrieve products unearthed at this node
  const nodeProducts = (node.products || [])
    .map((id) => PRODUCTS[id])
    .filter(Boolean) as Product[];

  // Close product detail to return to node journal view
  const handleReturnToNode = () => {
    setSelectedProduct(null);
  };

  // Flying back to map coordinate waypoint from a product card
  const handleOriginWaypointClick = (fieldId: string) => {
    onFlyToNode(fieldId);
  };

  return (
    <div className="absolute inset-y-0 right-0 z-50 w-full max-w-2xl bg-charcoal h-full shadow-[0_0_80px_rgba(0,0,0,0.85)] border-l border-old-leather/40 flex flex-col pointer-events-auto">
      {/* Heavy leather-bound notebook header */}
      <div className="bg-old-leather-dark px-6 py-4 flex items-center justify-between border-b border-old-leather relative shadow-md">
        {/* Subtle physical notebook stitch details */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-radial-[ellipse_at_top,rgba(255,255,255,0.15),transparent]" />
        
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-burnt-earth shadow-[0_0_8px_#b85028]" />
          <span className="font-mono text-[10px] tracking-widest text-parchment/60 uppercase font-bold">
            {isProductView ? "Provenance Ledger" : `Field Notebook // ${node.type}`}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-charcoal/40 hover:bg-burnt-earth text-parchment/80 hover:text-parchment flex items-center justify-center transition-colors border border-old-leather/20"
          title="Close Journal"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* JOURNAL BODY - Styled like high-end aged explorer parchment paper */}
      <div className="flex-1 overflow-y-auto bg-aged-paper text-charcoal flex flex-col relative">
        {/* Corner decors representing bound ledger papers */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-old-leather/15" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-old-leather/15" />

        {/* ----------------- MODE A: PRODUCT DETAIL (THE STORY OBJECT) ----------------- */}
        {isProductView && selectedProduct ? (
          <div className="p-6 md:p-8 flex flex-col gap-6 select-text">
            {/* Nav path return */}
            <button
              onClick={handleReturnToNode}
              className="self-start font-mono text-[10px] text-burnt-earth-dark hover:text-burnt-earth uppercase tracking-wider flex items-center gap-1 border-b border-burnt-earth/30 pb-0.5"
            >
              ← Back to {node.name} Dispatches
            </button>

            {/* Title & Moniker Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] uppercase bg-charcoal text-[#faf7f0] px-2 py-0.5 rounded tracking-widest font-bold">
                  {selectedProduct.characteristics.find((c) => c.label === "Stone ID" || c.label === "Gear ID")?.value || "PRODUCT"}
                </span>
                <span className="font-mono text-[10px] text-burnt-earth uppercase tracking-widest font-semibold">
                  {selectedProduct.price === 145 ? "Frontier Utility" : "Unearthed Gemstone"}
                </span>
              </div>
              <h2 className="font-serif font-black text-3xl md:text-4xl text-charcoal tracking-tight leading-tight uppercase">
                {selectedProduct.name}
              </h2>
            </div>

            {/* The Origin Link Waypoint */}
            <button
              onClick={() => handleOriginWaypointClick(selectedProduct.fieldId)}
              className="flex items-center gap-2 self-start bg-[#eae3d2] hover:bg-[#b85028] hover:text-[#faf7f0] px-3.5 py-2 rounded-lg border border-[#c8beaa] hover:border-parchment transition-all group shadow-sm text-left"
            >
              <Compass className="w-4 h-4 text-burnt-earth-dark group-hover:text-parchment group-hover:animate-spin" />
              <div>
                <span className="block font-mono text-[8px] uppercase tracking-widest text-charcoal/50 group-hover:text-parchment/70 font-semibold leading-none">
                  Origin Waypoint
                </span>
                <span className="block font-sans font-bold text-xs uppercase tracking-wide leading-none mt-1">
                  Mined At [{MINING_NODES.find((n) => n.id === selectedProduct.fieldId)?.name || "Andamooka"}]
                </span>
              </div>
            </button>

            {/* Editorial Macro Image Frame */}
            <div className="w-full aspect-square relative rounded-xl overflow-hidden shadow-2xl border border-[#c8beaa]/60 group bg-[#111]">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 select-none pointer-events-none filter brightness-95 contrast-105"
              />
              {/* Image caption decor */}
              <div className="absolute bottom-3 left-3 right-3 bg-charcoal/90 text-[#faf7f0] p-2.5 rounded-lg border border-old-leather/30 backdrop-blur-md flex items-center justify-between text-[10px] font-mono uppercase tracking-widest pointer-events-none">
                <span>Field Specimen Photo</span>
                <span className="text-burnt-earth">Macro View • 10x</span>
              </div>
            </div>

            {/* The Exchange Section (Price & CTA Button) - Visual Anchoring */}
            <div className="bg-[#eae3d2] border-2 border-dashed border-[#c8beaa] p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-charcoal/50 leading-none mb-1 font-bold">
                  Acquisition Cost
                </span>
                <span className="block font-serif text-3xl font-black text-charcoal leading-none">
                  ${selectedProduct.price.toLocaleString()} AUD
                </span>
                <span className="block font-sans text-[10px] text-charcoal/60 mt-1 leading-none">
                  Includes full certificate of origin and historical dossier.
                </span>
              </div>

              {claimedIds.includes(selectedProduct.id) ? (
                <button
                  disabled
                  className="px-6 py-4 rounded-xl bg-charcoal-light text-[#faf7f0]/60 border border-charcoal font-serif font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-inner w-full md:w-auto"
                >
                  <ShieldCheck className="w-4 h-4 text-burnt-earth" />
                  Claim Secured
                </button>
              ) : (
                <button
                  onClick={() => onClaimItem(selectedProduct)}
                  className="px-6 py-4 rounded-xl bg-[#b85028] hover:bg-[#8c3513] text-[#faf7f0] border border-[#8c3513] hover:border-parchment font-serif font-bold text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
                >
                  <PackageOpen className="w-4 h-4 animate-pulse" />
                  Add to Satchel
                </button>
              )}
            </div>

            {/* Narrative - The Emotional Core */}
            <article className="border-t border-[#c8beaa]/50 pt-5 text-left">
              <h3 className="font-serif font-bold text-xl text-charcoal mb-3 italic flex items-center gap-2">
                <Tag className="w-4 h-4 text-burnt-earth-dark" />
                The Recovery Story
              </h3>
              <p className="font-sans text-sm text-charcoal/90 leading-relaxed first-letter:text-4xl first-letter:font-serif first-letter:font-black first-letter:text-burnt-earth-dark first-letter:float-left first-letter:mr-2.5 first-letter:mt-1">
                {selectedProduct.narrative}
              </p>
            </article>

            {/* Assayer's Log Table (Technical Specs) */}
            <div className="border border-[#c8beaa] bg-[#faf7f0] p-4 rounded-xl shadow-inner mt-4 text-left">
              <div className="flex items-center justify-between border-b border-[#c8beaa] pb-2 mb-3">
                <h4 className="font-serif font-black text-xs uppercase tracking-widest text-charcoal-light">
                  Assayer's Official Report
                </h4>
                <span className="font-mono text-[8px] text-charcoal/50 uppercase">
                  LEIDEN STATE LAB #A22-MB
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedProduct.characteristics.map((spec, idx) => (
                  <div key={idx} className="border-b border-charcoal/10 pb-1.5">
                    <span className="block font-mono text-[8px] uppercase tracking-widest text-charcoal/40 font-semibold leading-none mb-1">
                      {spec.label}
                    </span>
                    <span className="block font-sans font-bold text-[11px] text-charcoal leading-none">
                      {spec.value}
                    </span>
                  </div>
                ))}
                <div className="border-b border-charcoal/10 pb-1.5">
                  <span className="block font-mono text-[8px] uppercase tracking-widest text-charcoal/40 font-semibold leading-none mb-1">
                    Authenticity
                  </span>
                  <span className="block font-sans font-bold text-[11px] text-[#2e7d32] leading-none flex items-center gap-1">
                    ✓ Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Related Seam Items Carousel */}
            {selectedProduct.fieldId !== "trading-post" && (
              <div className="border-t border-[#c8beaa]/50 pt-5 text-left">
                <h4 className="font-serif font-bold text-md text-charcoal mb-3 uppercase tracking-wider">
                  Mined in the Same Seam
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(PRODUCTS)
                    .filter((p) => p.fieldId === selectedProduct.fieldId && p.id !== selectedProduct.id)
                    .map((relatedProd) => (
                      <button
                        key={relatedProd.id}
                        onClick={() => setSelectedProduct(relatedProd)}
                        className="flex items-center gap-3 bg-[#eae3d2] hover:bg-[#faf7f0] border border-[#c8beaa] hover:border-burnt-earth p-3 rounded-lg transition-all text-left group"
                      >
                        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-charcoal border border-[#c8beaa]">
                          <img
                            src={relatedProd.image}
                            alt={relatedProd.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover filter brightness-95"
                          />
                        </div>
                        <div>
                          <span className="block font-mono text-[8px] uppercase tracking-widest text-burnt-earth font-bold">
                            {relatedProd.weight}
                          </span>
                          <span className="block font-serif font-bold text-xs text-charcoal group-hover:text-burnt-earth transition-colors">
                            {relatedProd.name}
                          </span>
                          <span className="block font-sans text-[10px] text-charcoal/60 mt-0.5 font-bold">
                            ${relatedProd.price.toLocaleString()} AUD
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ----------------- MODE B: NODE GENERAL JOURNAL OVERVIEW ----------------- */
          <div className="p-6 md:p-8 flex flex-col gap-6 text-left select-text">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] uppercase bg-burnt-earth text-[#faf7f0] px-2 py-0.5 rounded tracking-widest font-bold">
                  {node.type}
                </span>
                <span className="font-mono text-[9px] text-charcoal/50 uppercase tracking-widest">
                  Andamooka Mining Claims
                </span>
              </div>
              <h2 className="font-serif font-black text-3xl md:text-4xl text-charcoal tracking-tight uppercase">
                {node.name}
              </h2>
              <p className="font-serif italic text-sm text-burnt-earth-dark/90 mt-1">
                "{node.tagline}"
              </p>
            </div>

            {/* Main historical summary dispatch */}
            <section className="flex flex-col gap-3">
              <h3 className="font-mono text-xs uppercase tracking-widest text-charcoal border-b border-old-leather/10 pb-1 font-bold">
                1. Historic Overview
              </h3>
              <p className="font-sans text-sm text-charcoal/95 leading-relaxed">
                {node.history}
              </p>
            </section>

            {/* Geographical Context / "The Dirt" */}
            <section className="flex flex-col gap-3">
              <h3 className="font-mono text-xs uppercase tracking-widest text-charcoal border-b border-old-leather/10 pb-1 font-bold">
                2. Geological Soil Profile // The Dirt
              </h3>
              <p className="font-sans text-sm text-charcoal/95 leading-relaxed">
                {node.theDirt}
              </p>
            </section>

            {/* Miner's personal scribbled quote block */}
            {node.minersNote && (
              <blockquote className="bg-[#eae3d2] border-l-4 border-burnt-earth p-4 rounded-r-xl italic font-mono text-xs text-charcoal-light leading-relaxed my-2 relative">
                <HelpCircle className="absolute top-2.5 right-2.5 w-4 h-4 text-charcoal/10" />
                <span className="block font-semibold uppercase text-[8px] tracking-widest text-burnt-earth-dark mb-1 font-mono">
                  Miner's Hand Dispatch:
                </span>
                "{node.minersNote}"
              </blockquote>
            )}

            {/* SECTION: UNEARTHED STONES & GEAR (PRODUCTS AT THIS FIELD) */}
            <section className="flex flex-col gap-4 mt-2">
              <h3 className="font-mono text-xs uppercase tracking-widest text-charcoal border-b border-old-leather/10 pb-1 font-bold flex items-center justify-between">
                <span>3. Unearthed Ledger Specimens</span>
                <span className="text-[9px] bg-[#eae3d2] px-1.5 py-0.5 rounded text-burnt-earth-dark font-bold font-mono">
                  {nodeProducts.length} Specimens
                </span>
              </h3>

              {nodeProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {nodeProducts.map((product) => {
                    const isClaimed = claimedIds.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="flex flex-col sm:flex-row bg-[#eae3d2]/60 hover:bg-[#eae3d2] border border-[#c8beaa] hover:border-burnt-earth rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer text-left"
                      >
                        {/* Image Thumb */}
                        <div className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-auto overflow-hidden bg-charcoal border-r border-[#c8beaa]/40">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        {/* Summary details */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-mono text-[8px] uppercase tracking-widest text-burnt-earth font-bold">
                                {product.weight !== "N/A" ? product.weight : "Handcrafted Gear"}
                              </span>
                              {isClaimed && (
                                <span className="text-[8px] font-mono font-bold text-charcoal border border-charcoal/20 px-1 py-0.2 rounded uppercase bg-parchment">
                                  Claim Secured
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-black text-lg text-charcoal group-hover:text-burnt-earth transition-colors leading-tight uppercase">
                              {product.name}
                            </h4>
                            <p className="font-sans text-xs text-charcoal-light/95 leading-relaxed mt-1.5 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between border-t border-[#c8beaa]/30 pt-2">
                            <span className="font-serif font-black text-sm text-charcoal leading-none">
                              ${product.price.toLocaleString()} AUD
                            </span>
                            <span className="font-mono text-[9px] text-burnt-earth uppercase tracking-widest group-hover:translate-x-1 transition-transform font-bold">
                              Read Provenance →
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#eae3d2]/30 border border-[#c8beaa]/40 p-6 rounded-xl text-center flex flex-col items-center gap-2">
                  <span className="font-typewriter text-xs text-charcoal-light/60 uppercase">
                    • Current excavations yield no loose specimens •
                  </span>
                  <p className="font-sans text-[11px] text-charcoal-light/60 max-w-sm">
                    Our team is currently pick-hammering this lease's grey clay bands. Subscribe or check Cozza's hut for future strikes.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* physical bound footer page details */}
      <div className="bg-[#eae3d2] text-charcoal-light py-2 px-6 border-t border-[#c8beaa] flex justify-between items-center text-[9px] font-mono select-none">
        <span>© MOOKA BOYS LEASING CORP</span>
        <span className="animate-pulse">• PRESS ESC TO EXIT DETAILED LOGS •</span>
        <span>PAGE {isProductView ? "14" : "07"} / 22</span>
      </div>
    </div>
  );
}
