import Image from "next/image";
import { useId, type ReactNode } from "react";
import { Layers, Search, Plus, Minus, Compass, ArrowUpRight, MessageSquare, SlidersHorizontal, Wheat, Send } from "lucide-react";
import "./project-concepts.css";

const captions: Record<string, string> = {
  geovista: "Illustrative concept · fictional geometry",
  kaushaliq: "Illustrative concept · sample chart data",
  halo: "Illustrative concept · AI features planned",
  agrozyro: "Illustrative concept · sample listings, not live prices",
};
const descriptions: Record<string, string> = {
  geovista: "Isometric terrain study with extruded buildings, parcel outlines, layers and decorative map controls. Not a capture of GeoVISTA.",
  kaushaliq: "Labour-market dashboard composition with illustrative skill demand, workforce supply and a forecast chart. Not measured labour-market data.",
  halo: "Planned assistant workspace with a conversation layout and source-backed Spidey prototype artwork. No AI response is being generated.",
  agrozyro: "Marketplace composition using crop photos and static listing prices from AgroZyro's source. No live inventory, orders or payments.",
};

export function ProjectConcept({ id, name, companion }: { id: string; name: string; companion?: ReactNode }) {
  return (
    <figure className={`project-concept concept-${id}`}>
      <div className="concept-interface" role="img" aria-label={descriptions[id] ?? `${name} illustrative project concept`}>
        {/* These are visual studies, not interactive or connected application controls. */}
        <div className="concept-window" aria-hidden="true"><span className="concept-window-dots">•••</span><strong>{name}</strong><span>Design study</span></div>
        <div className="concept-scene" aria-hidden="true">
          {id === "geovista" ? <GeospatialScene /> : id === "kaushaliq" ? <IntelligenceScene /> : id === "halo" ? <AssistantScene companion={companion} /> : id === "agrozyro" ? <MarketplaceScene /> : <strong>{name}</strong>}
        </div>
      </div>
      <figcaption>{captions[id] ?? "Illustrative concept"}</figcaption>
    </figure>
  );
}

function Building({ x, y, w, d, h, selected = false }: { x: number; y: number; w: number; d: number; h: number; selected?: boolean }) {
  const a = [x, y], b = [x + w, y - w * .42], c = [x + w + d, y - w * .42 + d * .48], e = [x + d, y + d * .48];
  const roof = [a, b, c, e].map(([px, py]) => [px, py - h]);
  const points = (vertices: number[][]) => vertices.map(p => p.join(",")).join(" ");
  return <g className={selected ? "map-building is-selected" : "map-building"}>
    <polygon className="building-footprint" points={points([a,b,c,e])} />
    <polygon className="building-side" points={points([e,c,roof[2],roof[3]])} />
    <polygon className="building-front" points={points([a,e,roof[3],roof[0]])} />
    <polygon className="building-roof" points={points(roof)} />
    {[.33,.66].map(fraction => <path key={fraction} className="building-floor" d={`M${x},${y-h*fraction} L${e[0]},${e[1]-h*fraction} L${c[0]},${c[1]-h*fraction}`} />)}
  </g>;
}
function GeospatialScene() {
  const terrainClip = useId();
  return <div className="map-study">
    <div className="map-toolbar"><span><Search /> Explore a parcel</span><b>3D view</b></div>
    <svg className="terrain-study" viewBox="0 0 600 430" preserveAspectRatio="xMidYMid meet">
      <defs><clipPath id={terrainClip}><path d="M28 230 290 108 575 243 316 374Z" /></clipPath></defs>
      <path className="terrain-edge" d="M28 230 290 108 575 243 316 390 28 251Z" />
      <path className="terrain-plane" d="M28 230 290 108 575 243 316 374Z" />
      <g clipPath={`url(#${terrainClip})`}>
      {[0,1,2,3,4,5].map(i=><path key={i} className="terrain-contour" d={`M${55+i*27} ${225-i*12} Q${180+i*17} ${140+i*15} ${300+i*28} ${195+i*19} T${535-i*22} ${265+i*12}`} />)}
      <path className="map-road" d="M94 202 382 338 M201 151 488 280 M101 270 364 143 M205 322 471 192" />
      <g className="map-parcels"><path d="m112 225 61-29 59 28-61 31Z m105-51 60-28 59 28-60 29Z m-2 104 60-30 61 29-60 33Z m109-53 62-30 61 28-62 34Z m-9 108 65-35 58 29-63 37Z" /></g>
      </g>
      <Building x={234} y={173} w={27} d={28} h={34} />
      <Building x={124} y={225} w={30} d={29} h={48} />
      <Building x={343} y={228} w={29} d={27} h={54} />
      <Building x={232} y={283} w={32} d={30} h={80} selected />
      <Building x={336} y={334} w={27} d={25} h={32} />
      <path className="map-guide" d="M270 212 322 161 397 161" /><circle className="map-pin" cx="270" cy="212" r="4" />
      <text x="401" y="165" className="map-annotation">Selected footprint</text>
    </svg>
    <div className="map-layers"><Layers /><span>Terrain</span><span>Buildings</span><span>Parcels</span></div>
    <div className="map-controls"><Plus /><Minus /><Compass /></div>
    <div className="map-readout"><strong>Space, in context.</strong><span>Terrain / footprints / boundaries</span></div>
  </div>;
}
function IntelligenceScene() {
  return <div className="intelligence-study">
    <div className="concept-heading"><span>WORKFORCE INTELLIGENCE</span><strong>Where skills meet opportunity.</strong></div>
    <div className="insight-tabs"><b>Overview</b><span>Demand</span><span>Supply</span><span>Forecast</span></div>
    <div className="insight-grid">
      <div className="insight-chart"><span className="chart-title">Skill demand <small>Illustrative index</small></span>
        <div className="demand-bars">{[["Python",72],["SQL",57],["React",43],["Cloud",64]].map(([label,value])=><div key={label}><div style={{height:`${value}%`}} /><span>{label}</span></div>)}</div>
      </div>
      <div className="insight-chart"><span className="chart-title">Demand & supply</span><div className="supply-rings"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38"/><circle className="ring-sample" cx="50" cy="50" r="38" strokeDasharray="160 239"/><circle className="ring-inner" cx="50" cy="50" r="26" strokeDasharray="95 164"/></svg><span>Skill<br/>gaps</span></div><small>Sample relationship</small></div>
    </div>
    <div className="forecast-chart"><span className="chart-title">Trend & forecast <small>Concept projection</small></span><svg viewBox="0 0 400 76" preserveAspectRatio="none"><path className="chart-grid" d="M0 20H400M0 45H400M0 70H400"/><path className="forecast-fill" d="M0 65 45 54 90 58 135 35 180 43 230 24 275 30 325 15 370 18 400 5V76H0Z"/><path className="forecast-line" d="M0 65 45 54 90 58 135 35 180 43 230 24"/><path className="forecast-line projected" d="M230 24 275 30 325 15 370 18 400 5"/></svg><div className="chart-axis"><span>Past</span><span>Present</span><span>Outlook</span></div></div>
  </div>;
}
function AssistantScene({ companion }: { companion?: ReactNode }) {
  return <div className="assistant-study">
    <aside className="assistant-rail"><MessageSquare /><span>Chats</span><SlidersHorizontal /><span>Setup</span></aside>
    <div className="assistant-workspace"><div className="concept-heading"><span>YOUR DESKTOP, A LITTLE MORE PERSONAL</span><strong>A space to think.</strong></div>
      <div className="assistant-message user-message">Compare local and cloud models.</div>
      <div className="assistant-message"><span className="assistant-sigil">H.</span><div><strong>Conversation layout study</strong><p>AI responses and provider connections are planned.</p><div className="message-lines"><i/><i/><i/></div></div></div>
      <div className="companion-dock"><div>{companion ?? <span>Spidey artwork unavailable</span>}</div><span>Spidey<small>Prototype companion artwork</small></span></div>
      <div className="assistant-composer"><span>Ask a question…</span><Send /></div><div className="assistant-provider">Planned providers · Ollama / optional cloud</div>
    </div>
  </div>;
}
const crops = [
  { name: "Wheat", image: "wheat", price: "₹2,150", location: "Uttar Pradesh" },
  { name: "Rice", image: "rice", price: "₹3,980", location: "Chhattisgarh" },
  { name: "Mustard Seeds", image: "mustard", price: "₹5,850", location: "Madhya Pradesh" },
];
function MarketplaceScene() {
  return <div className="market-study">
    <div className="market-intro"><span>FROM FIELD TO MARKET</span><strong>A better place<br/>to grow together.</strong><Wheat /></div>
    <div className="market-search"><Search /><span>Explore agricultural produce</span><SlidersHorizontal /></div>
    <div className="market-categories"><b>All produce</b><span>Grains</span><span>Oilseeds</span><span>KG / Quintal</span></div>
    <div className="crop-grid">{crops.map(crop=><div className="crop-card" key={crop.name}><div className="crop-image"><Image src={`/assets/project-previews/${crop.image}.jpg`} alt="" fill sizes="(max-width: 800px) 25vw, 15vw" /></div><strong>{crop.name}</strong><small>{crop.location}</small><div className="crop-price">{crop.price}<small>/ quintal</small></div></div>)}</div>
    <div className="market-note"><span>Sample listings from project source</span><ArrowUpRight /></div>
  </div>;
}
