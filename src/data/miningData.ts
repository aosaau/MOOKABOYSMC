export interface Product {
  id: string;
  name: string;
  fieldId: string;
  price: number;
  description: string;
  weight: string;
  dimensions: string;
  baseColor: string;
  fireColor: string;
  matrixType: string;
  narrative: string;
  image: string;
  characteristics: { label: string; value: string }[];
}

export interface MiningNode {
  id: string;
  name: string;
  type: "field" | "destination";
  x: number; // Percent coordinates for positioning on the map (0 to 100)
  y: number;
  tagline: string;
  history: string;
  theDirt: string;
  minersNote?: string;
  products?: string[]; // IDs of products associated with this node
}

export const PRODUCTS: Record<string, Product> = {
  "mb-094": {
    id: "mb-094",
    name: "The Bloodline",
    fieldId: "gun-gully",
    price: 4250,
    description: "A magnificent collector's piece with blood-red and emerald fire flashing like raw outback lightning. Found in the clay seams at 20 feet under.",
    weight: "5.4 Carats",
    dimensions: "14.2mm x 9.8mm x 4.1mm",
    baseColor: "N1 (Jet Black)",
    fireColor: "Crimson Red & Electric Green",
    matrixType: "Seam Clay Matrix",
    image: "/src/assets/images/opal_bloodline_1783260519968.jpg",
    narrative: "It was a searing Tuesday in Gun Gully. The hydraulic jack was acting up, and Cozza had been picking at the clay face for four hours straight. Just before giving up for a cold beer, a glint of absolute crimson caught the beam of his headlamp. It looked like a lit match embedded in the gray clay. We carved it out with surgical precision, leaving just a tiny whisper of the original clay backing to prove its provenance.",
    characteristics: [
      { label: "Stone ID", value: "MB-094" },
      { label: "Opal Type", value: "Solid Black Opal" },
      { label: "Body Tone", value: "N1 Jet Black" },
      { label: "Brightness", value: "5/5 (Exceptional)" },
      { label: "Date Unearthed", value: "May 14, 2026" },
      { label: "Miner", value: "Cozza" }
    ]
  },
  "mb-112": {
    id: "mb-112",
    name: "The Sunspit",
    fieldId: "lunatic",
    price: 1800,
    description: "Rugged and beautiful, hosting a deep matrix pattern with fiery orange and gold sparkles like campfire embers floating in the night sky.",
    weight: "12.8 Carats",
    dimensions: "22.4mm x 15.1mm x 6.2mm",
    baseColor: "Dark Brown Ironstone",
    fireColor: "Deep Sunset Orange & Gold Sparks",
    matrixType: "Ironstone Matrix",
    image: "/src/assets/images/opal_matrix_1783260538469.jpg",
    narrative: "Found at Lunatic—a field named after the mad bastards who first dug there under the blazing summer heat. This boulder piece survived millions of years of pressure inside a deep ironstone shelf. We trimmed and polished the raw matrix just enough to reveal the liquid-gold fire flashing beneath, while preserving the heavy ironstone character that gives it its rugged weight.",
    characteristics: [
      { label: "Stone ID", value: "MB-112" },
      { label: "Opal Type", value: "Boulder Matrix Opal" },
      { label: "Body Tone", value: "N4 Dark Ironstone" },
      { label: "Brightness", value: "4.5/5 (Highly Vibrant)" },
      { label: "Date Unearthed", value: "June 2, 2026" },
      { label: "Miner", value: "Matt" }
    ]
  },
  "mb-wallet": {
    id: "mb-wallet",
    name: "Frontier Leather Bifold",
    fieldId: "trading-post",
    price: 145,
    description: "Handcrafted from heavy, full-grain bovine leather. Hand-stitched and branded with the iconic M-crown to handle outback grit.",
    weight: "80 Grams",
    dimensions: "110mm x 90mm x 15mm",
    baseColor: "Vintage Ochre / Old Leather",
    fireColor: "N/A",
    matrixType: "Hand-stitched Full-grain Bovine Leather",
    image: "/src/assets/images/wallet_frontier_1783260554451.jpg",
    narrative: "Designed out of pure frustration. Standard commercial wallets fell apart inside of six months under the abrasive, ultra-fine red dust of Andamooka. Cozza sourced direct full-grain cowhide, waxed the threads himself, and hand-punched the design. This wallet is double-stitched for lifetime structural endurance, holds 8 cards comfortably, and features a raw, unlined sleeve for cash or rough stone satchels.",
    characteristics: [
      { label: "Gear ID", value: "MB-W-CLASSIC" },
      { label: "Material", value: "100% Full-grain Bovine" },
      { label: "Stitching", value: "Waxed Heavy Polyester" },
      { label: "Branding", value: "Debossed M-Crown Mark" },
      { label: "Origin", value: "Andamooka Workshop" },
      { label: "Durability", value: "Built for Life" }
    ]
  }
};

export const MINING_NODES: MiningNode[] = [
  // Key Destinations
  {
    id: "cozzas-hut",
    name: "Cozza's Hut",
    type: "destination",
    x: 32,
    y: 48,
    tagline: "Campfires, strong tea, and drawers of rough opal.",
    history: "A rugged humpy assembled in the late 70s using discarded corrugated iron sheets, cedar poles, and red outback earth. This is the operational center of the Mooka Boys. The ceiling is lined with old newspaper clippings from local opal strikes.",
    theDirt: "Surrounded by a small collection of vintage drilling rigs and mounds of old pickings. Inside, Cozza keeps his legendary collection of rough specimen stones that will never be sold.",
    minersNote: "'Drop in for a cuppa. Knock twice, if the dog doesn't bite, we'll talk stones.'"
  },
  {
    id: "matts-hut",
    name: "Matt's Hut",
    type: "destination",
    x: 48,
    y: 54,
    tagline: "Where raw clay is sliced open to reveal light.",
    history: "Matt's workshop and sanctuary. It houses a state-of-the-art diamond-tip cutting wheel system and macro-photography rig, balanced beside old diesel drums and iron filing dust.",
    theDirt: "The floor is permanently layered in a super-fine, brilliant white silica dust—the signature of cutting raw Andamooka stones.",
    minersNote: "'Cutting opal is a game of millimeters. One bad turn of the wheel and thousands of dollars of fire disappears into white powder.'"
  },
  {
    id: "trading-post",
    name: "Trading Post",
    type: "destination",
    x: 65,
    y: 42,
    tagline: "Quality gear built to endure the frontier.",
    history: "The physical exchange where miners trade diesel fuel, heavy shovels, and handcrafted leather accessories.",
    theDirt: "A rustic outpost smelling of tanned cowhide, steel grease, and strong outback tobacco.",
    minersNote: "'If your gear can't survive a month in the Andamooka wind, it isn't worth bringing.'",
    products: ["mb-wallet"]
  },
  {
    id: "the-shed",
    name: "The Shed",
    type: "destination",
    x: 52,
    y: 32,
    tagline: "Old machinery, heavy machinery, and broken LandCruisers.",
    history: "A colossal rusted iron hangar where the heavy mining equipment lives—jackhammers, backhoes, and our beloved, perpetually-broken 1982 Toyota LandCruiser.",
    theDirt: "Thick oil leaks on red dirt, iron scrap piles, and the echo of clanging spanners.",
    minersNote: "'We spend more time fixing the old diesel motors than actually digging. But that's the outback tax.'"
  },
  {
    id: "learn-centre",
    name: "School",
    type: "destination",
    x: 22,
    y: 28,
    tagline: "The absolute truth of Australia's opal heritage.",
    history: "A curated archive of Andamooka's geological timeline, mapping the ancient inland sea that covered this desert 100 million years ago, depositing the silica that became opal.",
    theDirt: "Preserved marine fossils, fossilized dinosaur wood embedded with opal flash, and old survey maps.",
    minersNote: "'You are walking on an ancient seabed. The stone in your satchel was formed when plesiosaurs swam over this very red soil.'"
  },
  {
    id: "partners-zone",
    name: "Partners Zone",
    type: "destination",
    x: 78,
    y: 62,
    tagline: "Our camp partners and fellow frontier searchers.",
    history: "A tribute to the local independent families, fuel suppliers, and authentic outback merchants who keep our mining engines fueled.",
    theDirt: "A visual registry of frontier brands, handcrafted stamps, and historic mining lease certificates.",
    minersNote: "'Mining isn't a solo game. Out here, you are only as strong as the neighbors who'd pull your truck out of a clay bog.'"
  },

  // Mining Fields
  {
    id: "gun-gully",
    name: "Gun Gully",
    type: "field",
    x: 42,
    y: 38,
    tagline: "Where the famous Bloodline stone lay in wait.",
    history: "First opened in the 1960s. Known for having incredibly tough, cement-like conglomerate capping that requires heavy-duty explosives or hours of pneumatic hammering to break through.",
    theDirt: "Deep grey clay seams layered beneath heavy ironstone boulders. The stones found here are famous for their unmatched N1 jet-black body tone.",
    minersNote: "'Gun Gully takes your sweat and breaks your back, but when she pays, she pays in pure liquid fire.'",
    products: ["mb-094"]
  },
  {
    id: "lunatic",
    name: "Lunatic",
    type: "field",
    x: 58,
    y: 26,
    tagline: "A field named after the mad bastards who first dug here.",
    history: "Named in 1948 after a pair of greenhorn miners dug in 45-degree heat on an unshaded rise, while everyone else slept. They struck a pocket of absolute brilliant green matrix opal within three feet of the surface.",
    theDirt: "Shallow, crumbly white sandstone containing pockets of premium ironstone boulder matrix.",
    minersNote: "'The smart blokes laughed at them. By nightfall, the laughed-at blokes had filled a tin can with green crystal.'",
    products: ["mb-112"]
  },
  {
    id: "christmas",
    name: "Christmas",
    type: "field",
    x: 28,
    y: 68,
    tagline: "Where Christmas came early in the winter of '72.",
    history: "Named after a massive multi-million-dollar pocket of crystal opal discovered on Christmas Eve. The miners celebrated with warm beers and cooked wild emu over a campfire.",
    theDirt: "Very deep, moist white clay level. Hard to shaft but famous for glassy, translucent crystal opals with broad-flash play.",
    minersNote: "'A field of pure hope. Even when the shaft is dry, you keep digging because of the legend of '72.'"
  },
  {
    id: "boundary-rider",
    name: "Boundary Rider",
    type: "field",
    x: 15,
    y: 52,
    tagline: "On the outermost fence line of the lease.",
    history: "Originally prospected by an old boundary rider who found color chips in a rabbit hole. It is extremely remote, requiring a 40-minute bumpy ride through sandstone ridges.",
    theDirt: "Gravelly red surface scree hiding deep horizontal seams of semi-black opal.",
    minersNote: "'Isolated, quiet, and hot. It's just you, the flies, and the constant hum of the generator.'"
  },
  {
    id: "tea-tree-flat",
    name: "Tea Tree Flat",
    type: "field",
    x: 38,
    y: 80,
    tagline: "Ancient washouts and waterholes turned to gemstone.",
    history: "Located in a flat, sandy wash where desert Tea Trees gather water. Heavy rain occasionally washes away the topsoil, exposing raw opal floaters on the surface.",
    theDirt: "Loose sandy loam over a soft, porous sandstone level. Easy digging, but stones require careful curing to prevent crazing.",
    minersNote: "'Always look down after a heavy storm. Sometimes the desert washes the dirt off the gems for you.'"
  },
  {
    id: "triangle",
    name: "The Triangle",
    type: "field",
    x: 82,
    y: 20,
    tagline: "A three-cornered lease of rich, pocketed ground.",
    history: "Formed by three overlapping claims that were disputed for a decade before being merged. Famous for producing intensely bright blue-green seam opal.",
    theDirt: "Distinctive yellow ironstone bands sandwiched between grey clay layers.",
    minersNote: "'The clay bands here are thin but incredibly rich. Keep your eyes on the yellow streaks.'"
  },
  {
    id: "four-nations",
    name: "Four Nations",
    type: "field",
    x: 72,
    y: 30,
    tagline: "Prospectors from four corners of the globe.",
    history: "Established by a German, an Italian, a Greek, and an Aussie miner who pooled their last dry pennies to sink a collective shaft in 1955. They struck a spectacular seam of glass opal.",
    theDirt: "Dense conglomerates mixed with heavy gypsum. Difficult to cut but exceptionally stable stones.",
    minersNote: "'They couldn't speak each other's languages, but they all understood the sound of a pick hitting glass.'"
  },
  {
    id: "german-gully",
    name: "German Gully",
    type: "field",
    x: 88,
    y: 45,
    tagline: "Precision shafts and engineering excellence.",
    history: "A highly organized field containing deep, meticulously braced shafts. Renowned for yielding massive boulder specimens.",
    theDirt: "Stiff grey clay with hard ironstone pebbles. Exceptional opal stability.",
    minersNote: "'No short-cuts here. If your timbering is sloppy, German Gully will reclaim your shaft within a week.'"
  }
];
