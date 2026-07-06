import React, { useState } from "react";
import { Product } from "../data/miningData";
import { X, Trash2, CheckCircle, Compass, FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SatchelCartProps {
  isOpen: boolean;
  onClose: () => void;
  claimedItems: Product[];
  onRemoveItem: (id: string) => void;
  onClearSatchel: () => void;
}

export default function SatchelCart({
  isOpen,
  onClose,
  claimedItems,
  onRemoveItem,
  onClearSatchel
}: SatchelCartProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    minerBondId: "MB-CLAIM-" + Math.floor(1000 + Math.random() * 9000),
    claimNote: ""
  });

  if (!isOpen) return null;

  const totalCost = claimedItems.reduce((acc, item) => acc + item.price, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claimedItems.length === 0) return;
    
    setIsSubmitting(true);
    // Simulate physically pressing and stamping the outback permit
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1800);
  };

  const handleResetCart = () => {
    onClearSatchel();
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      address: "",
      minerBondId: "MB-CLAIM-" + Math.floor(1000 + Math.random() * 9000),
      claimNote: ""
    });
    onClose();
  };

  return (
    <div className="absolute inset-y-0 right-0 z-50 w-full max-w-md bg-[#161616] h-full shadow-[0_0_80px_rgba(0,0,0,0.9)] border-l border-old-leather/50 flex flex-col pointer-events-auto">
      {/* Satchel Header */}
      <div className="bg-old-leather-dark px-5 py-4 flex items-center justify-between border-b border-old-leather relative shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-burnt-earth animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-parchment/70 uppercase font-bold">
            Satchel Inventory Ledger
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-charcoal/40 hover:bg-burnt-earth text-parchment/80 hover:text-parchment flex items-center justify-center transition-colors border border-old-leather/20"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Manifest Content */}
      <div className="flex-1 overflow-y-auto bg-aged-paper text-charcoal p-5 flex flex-col relative select-text">
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-old-leather/15" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-old-leather/15" />

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* ================= MODE A: CART LISTING & MANIFEST FORM ================= */
            <motion.div
              key="cart-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5 flex-1 justify-between"
            >
              <div>
                {/* Header Stamped Label */}
                <div className="border-b-2 border-charcoal/10 pb-3 mb-4 text-left">
                  <span className="font-mono text-[9px] uppercase text-charcoal/40 font-bold block">
                    Transit Form #72
                  </span>
                  <h3 className="font-serif font-black text-2xl text-charcoal uppercase leading-tight">
                    Transport Manifest
                  </h3>
                </div>

                {claimedItems.length === 0 ? (
                  /* Empty state */
                  <div className="py-12 text-center flex flex-col items-center gap-3">
                    <span className="font-typewriter text-charcoal/40 text-xs uppercase block">
                      • Your leather satchel is empty •
                    </span>
                    <p className="font-sans text-[11px] text-charcoal/55 max-w-xs leading-relaxed">
                      Wander the outback map coordinates, click on a field's notebook dispatches, and select raw specimens to claim.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-2 px-4 py-2 border border-old-leather text-old-leather hover:bg-old-leather hover:text-parchment rounded-lg text-xs font-mono font-bold uppercase transition-all"
                    >
                      Return to Map
                    </button>
                  </div>
                ) : (
                  /* Satchel active list */
                  <div className="flex flex-col gap-3">
                    {claimedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-[#eae3d2] border border-[#c8beaa] p-3 rounded-xl shadow-sm relative"
                      >
                        <div className="w-12 h-12 rounded overflow-hidden bg-charcoal border border-[#c8beaa] flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover filter brightness-95"
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <span className="block font-mono text-[8px] uppercase tracking-widest text-burnt-earth font-bold leading-none mb-1">
                            {item.weight !== "N/A" ? item.weight : "Handcrafted"}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-charcoal truncate uppercase leading-none">
                            {item.name}
                          </h4>
                          <span className="block font-sans font-bold text-xs text-charcoal mt-1.5 leading-none">
                            ${item.price.toLocaleString()} AUD
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-200 text-charcoal/50 hover:text-red-700 flex items-center justify-center transition-all border border-transparent hover:border-red-300"
                          title="Discard Claim"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Cost summary bar */}
                    <div className="border-t-2 border-charcoal/10 pt-4 mt-2 text-left">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-charcoal/50 font-bold">
                          Specimen Subtotal
                        </span>
                        <span className="font-sans font-bold text-sm text-charcoal">
                          ${totalCost.toLocaleString()} AUD
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-charcoal/50 font-bold">
                          Frontier Handling
                        </span>
                        <span className="font-mono text-[10px] text-[#2e7d32] font-black">
                          FREE INCLUDED
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-charcoal/20 pt-2.5">
                        <span className="font-serif font-black text-md uppercase text-charcoal-light">
                          Total Valuation
                        </span>
                        <span className="font-serif text-xl font-black text-burnt-earth-dark">
                          ${totalCost.toLocaleString()} AUD
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Checkout shipping manifest form */}
              {claimedItems.length > 0 && (
                <form onSubmit={handleSubmit} className="border-t border-[#c8beaa]/60 pt-4 text-left">
                  <div className="mb-4">
                    <span className="font-mono text-[10px] text-burnt-earth uppercase tracking-widest font-black block mb-3">
                      ✓ Register Transit Consignee
                    </span>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block font-mono text-[8px] uppercase tracking-widest text-charcoal/60 font-semibold mb-1">
                          Full Name / Claimholder *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="e.g. Samuel Jameson"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-[#eae3d2] border border-[#c8beaa] focus:border-burnt-earth rounded-lg px-3 py-2 text-xs font-sans placeholder-charcoal/30 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[8px] uppercase tracking-widest text-charcoal/60 font-semibold mb-1">
                          Consignee Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="consignee@mookaboys.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-[#eae3d2] border border-[#c8beaa] focus:border-burnt-earth rounded-lg px-3 py-2 text-xs font-sans placeholder-charcoal/30 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[8px] uppercase tracking-widest text-charcoal/60 font-semibold mb-1">
                          Physical Shipping Destination *
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          placeholder="e.g. 104 Flinders St, Melbourne VIC"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full bg-[#eae3d2] border border-[#c8beaa] focus:border-burnt-earth rounded-lg px-3 py-2 text-xs font-sans placeholder-charcoal/30 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[8px] uppercase tracking-widest text-charcoal/60 font-semibold mb-1">
                          Custom Transport Instructions
                        </label>
                        <textarea
                          name="claimNote"
                          rows={2}
                          placeholder="e.g. Deliver via standard post. Safe place if not home."
                          value={formData.claimNote}
                          onChange={handleInputChange}
                          className="w-full bg-[#eae3d2] border border-[#c8beaa] focus:border-burnt-earth rounded-lg px-3 py-2 text-xs font-sans placeholder-charcoal/30 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA button styled like a vintage official mining transit permit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-[#b85028] hover:bg-[#8c3513] disabled:bg-[#8c3513]/50 text-[#faf7f0] border border-[#8c3513] font-serif font-black text-sm tracking-widest uppercase hover:scale-[1.01] active:scale-95 transition-all shadow-xl rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 animate-pulse">
                        <FileText className="w-4 h-4 animate-spin" />
                        Stamping Permit Lease...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Register & finalise claim
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          ) : (
            /* ================= MODE B: SUCCESS PERMIT RECEIPT ================= */
            <motion.div
              key="success-receipt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-6 py-4 flex-1 justify-between text-left select-text"
            >
              {/* Stamped Government Permit Style Receipt */}
              <div className="bg-[#faf7f0] border-[3px] border-double border-burnt-earth-dark p-6 rounded-2xl shadow-xl relative overflow-hidden">
                {/* Visual Watermark diagonal stamp */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] select-none pointer-events-none opacity-[0.08] text-center w-full">
                  <span className="font-typewriter text-5xl font-black text-burnt-earth border-8 border-burnt-earth border-double px-4 py-2 uppercase">
                    APPROVED
                  </span>
                </div>

                <div className="flex flex-col items-center text-center border-b border-charcoal/10 pb-4 mb-4">
                  <div className="w-12 h-12 bg-burnt-earth/15 rounded-full flex items-center justify-center mb-2.5">
                    <CheckCircle className="w-6 h-6 text-burnt-earth-dark" />
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-charcoal/40 font-black">
                    Official Lease Document
                  </span>
                  <h3 className="font-serif font-black text-xl text-charcoal uppercase leading-none mt-1">
                    Transit Permit Approved
                  </h3>
                  <span className="font-mono text-[9px] font-bold text-burnt-earth-dark bg-[#eae3d2] px-2 py-0.5 rounded mt-2 uppercase tracking-widest">
                    Claim ID: {formData.minerBondId}
                  </span>
                </div>

                {/* Receipt Table */}
                <div className="flex flex-col gap-3 font-sans text-xs">
                  <div className="flex justify-between border-b border-charcoal/5 pb-1">
                    <span className="font-mono text-[8px] uppercase text-charcoal/40 font-bold">Claimholder</span>
                    <span className="font-bold text-charcoal">{formData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-charcoal/5 pb-1">
                    <span className="font-mono text-[8px] uppercase text-charcoal/40 font-bold">Transit Destination</span>
                    <span className="font-bold text-charcoal max-w-[200px] text-right truncate">{formData.address}</span>
                  </div>
                  <div className="flex justify-between border-b border-charcoal/5 pb-1">
                    <span className="font-mono text-[8px] uppercase text-charcoal/40 font-bold">Authorized Dispatch</span>
                    <span className="font-bold text-[#2e7d32]">✓ Mooka Boys HQ</span>
                  </div>

                  <div className="mt-2 text-left">
                    <span className="font-mono text-[8px] uppercase text-charcoal/40 font-bold block mb-1">Claimed Specimens</span>
                    <div className="flex flex-col gap-1.5 pl-2 border-l border-burnt-earth/30">
                      {claimedItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-[11px]">
                          <span className="text-charcoal-light font-medium uppercase truncate max-w-[180px]">{item.name}</span>
                          <span className="font-mono font-bold text-charcoal-dark">${item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-charcoal/20 pt-3 mt-1 flex justify-between items-center">
                    <span className="font-serif font-black uppercase text-xs text-charcoal-light">Permit Bond Total</span>
                    <span className="font-serif text-lg font-black text-burnt-earth-dark">${totalCost.toLocaleString()} AUD</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-dashed border-charcoal/10 pt-4 text-center">
                  <p className="font-typewriter text-[9px] leading-relaxed text-charcoal/70">
                    "We have logged your claim at Cozza's hut. A certificate of provenance dossier has been bundled with your stone package. Transit dispatch details have been generated and sent to {formData.email}."
                  </p>
                </div>
              </div>

              {/* Reset trigger button */}
              <button
                onClick={handleResetCart}
                className="w-full py-4 bg-charcoal hover:bg-burnt-earth text-[#faf7f0] hover:text-parchment border border-old-leather font-serif font-bold text-sm tracking-widest uppercase transition-all shadow-lg rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Return to Surface Map
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-[#eae3d2] text-charcoal-light py-2 px-5 border-t border-[#c8beaa] flex justify-between items-center text-[9px] font-mono select-none">
        <span>EST. 1972 • ANDAMOOKA</span>
        <span>SATCHEL INVOICE SHEET</span>
      </div>
    </div>
  );
}
