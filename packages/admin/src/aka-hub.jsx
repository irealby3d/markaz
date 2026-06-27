import { useState } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

/* ════════════════════════ MOCK DATA ════════════════════════ */
const EMP = [
  { id:1, name:"Abdulloh Toshmatov", pos:"Ishchi",   sal:2500000, adv:500000,  st:"active"   },
  { id:2, name:"Bobur Yusupov",      pos:"Operator", sal:3000000, adv:0,       st:"active"   },
  { id:3, name:"Dilnoza Karimova",   pos:"Menejer",  sal:4500000, adv:1000000, st:"active"   },
  { id:4, name:"Eldor Nazarov",      pos:"Ishchi",   sal:2200000, adv:200000,  st:"active"   },
  { id:5, name:"Feruza Xoliqova",    pos:"Hisobchi", sal:3800000, adv:0,       st:"active"   },
  { id:6, name:"G'ayrat Mirzayev",   pos:"Ishchi",   sal:2500000, adv:300000,  st:"inactive" },
  { id:7, name:"Hamid Sultonov",     pos:"Ustoz",    sal:3200000, adv:0,       st:"active"   },
];
const MAT = [
  { id:1, name:"LDSP 16mm Oq",      dims:"2800×2070", qty:45,  min:10,  unit:"varaq", px:85000  },
  { id:2, name:"LDSP 18mm Yog'och", dims:"2800×2070", qty:12,  min:8,   unit:"varaq", px:95000  },
  { id:3, name:"LDSP 25mm Buk",     dims:"3000×600",  qty:8,   min:5,   unit:"varaq", px:110000 },
  { id:4, name:"Arka plyonka",       dims:"0.4mm",     qty:3,   min:10,  unit:"rol",   px:45000  },
  { id:5, name:"Vint-bolt komplekt", dims:"M6×30",     qty:450, min:100, unit:"dona",  px:1200   },
  { id:6, name:"Shlif qog'ozi",      dims:"230×280",   qty:80,  min:30,  unit:"dona",  px:2500   },
];
const ORD_INIT = {
  new:         [{ id:"001", cl:"Karimov A.",  pr:"3-qavatli shkaf",     dl:"2026-07-15", amt:4500000 },
                { id:"006", cl:"Rahimov B.",  pr:"TV stendi",            dl:"2026-07-20", amt:1800000 }],
  in_progress: [{ id:"002", cl:"Yusupov C.", pr:"Ofis stoli x3",        dl:"2026-07-10", amt:3200000 },
                { id:"003", cl:"Tosheva D.",  pr:"Yotoqxona garnitury",  dl:"2026-07-08", amt:8900000 }],
  ready:       [{ id:"004", cl:"Mirzayev E.",pr:"Oshxona garnitury",    dl:"2026-07-05", amt:12000000}],
  delivered:   [{ id:"005", cl:"Nazarov F.", pr:"Kichik shkaf",          dl:"2026-06-30", amt:2100000 }],
};
const FILES_INIT = [
  { id:1, name:"Shkaf_Karimov_001.xml",     tp:"xml",    sz:"245 KB", dt:"2026-07-01", ord:"#001" },
  { id:2, name:"Stol_komplekt_003.xml",     tp:"xml",    sz:"189 KB", dt:"2026-07-02", ord:"#002" },
  { id:3, name:"Garnitur_yotoq.nc",         tp:"nc",     sz:"423 KB", dt:"2026-07-03", ord:"#003" },
  { id:4, name:"merged_output_2026_06.xml", tp:"merged", sz:"834 KB", dt:"2026-06-30", ord:"—"    },
];
const USR = [
  { id:1, name:"Abdulloh Toshmatov", tg:"@abdulloh_t", role:"worker",      ls:"2 soat oldin"   },
  { id:2, name:"Bobur Yusupov",      tg:"@bobur_y",    role:"operator",    ls:"5 daqiqa oldin" },
  { id:3, name:"Dilnoza Karimova",   tg:"@dilnoza_k",  role:"manager",     ls:"1 kun oldin"    },
  { id:4, name:"Admin User",         tg:"@admin_aka",  role:"super_admin", ls:"Hozir"          },
];
const WEEKLY = [
  { d:"Du", m:120 },{ d:"Se", m:250 },{ d:"Ch", m:180 },
  { d:"Pa", m:310 },{ d:"Ju", m:400 },{ d:"Sh", m:190 },
];
const PIE_D = [
  { n:"AI Model (VRAM)", v:45, c:"#ff5722" },
  { n:"ERP Bazasi",      v:20, c:"#2ecc71" },
  { n:"GiblabMerger",    v:15, c:"#f1c40f" },
  { n:"Bo'sh xotira",    v:20, c:"#2d2d2d" },
];
const KB_COLS = [
  { id:"new",        lbl:"Yangi",      col:"#4fc3f7" },
  { id:"in_progress",lbl:"Jarayonda",  col:"#ffb74d" },
  { id:"ready",      lbl:"Tayyor",     col:"#2ecc71" },
  { id:"delivered",  lbl:"Yetkazildi", col:"#888"    },
];
const R_LBL = { super_admin:"Super Admin", manager:"Menejer", operator:"Operator", worker:"Xodim" };

/* ════════════════════════ HELPERS ════════════════════════ */
const fm  = n => n >= 1e6 ? (n/1e6).toFixed(1)+" mln" : (n/1e3).toFixed(0)+" ming";
const fms = n => n.toLocaleString("en-US")+" so'm";

/* ════════════════════════ CSS ════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.root{height:700px;display:flex;overflow:hidden;position:relative;border-radius:12px;
  background:#0a0a0a;
  background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size:30px 30px;color:#fff;font-family:'Inter',sans-serif}
.sb{border-right:1px solid #1c1c1c;display:flex;flex-direction:column;background:rgba(6,6,6,.98);transition:width .25s;flex-shrink:0;overflow:hidden}
.tb{background:rgba(6,6,6,.95);border-bottom:1px solid #1c1c1c;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.ms{flex:1;overflow-y:auto;overflow-x:hidden;padding:18px}
.ms::-webkit-scrollbar{width:3px}.ms::-webkit-scrollbar-thumb{background:#222;border-radius:2px}
.card{background:rgba(14,14,14,.97);border:1px solid #1e1e1e;border-radius:10px;transition:border-color .2s}
.ch:hover{border-color:rgba(255,87,34,.3)}
.nb{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:7px;cursor:pointer;border:none;background:transparent;color:#555;font-size:13px;width:100%;text-align:left;transition:all .2s;white-space:nowrap;overflow:hidden}
.nb:hover{background:rgba(255,87,34,.07);color:#ccc}
.nb.ac{background:rgba(255,87,34,.13);color:#ff5722}
.bdg{padding:2px 8px;border-radius:4px;font-size:11px;font-family:'Fira Code',monospace;display:inline-block;white-space:nowrap}
.bg{background:rgba(46,204,113,.1);color:#2ecc71;border:1px solid rgba(46,204,113,.2)}
.by{background:rgba(241,196,15,.1);color:#f1c40f;border:1px solid rgba(241,196,15,.2)}
.br{background:rgba(231,76,60,.1);color:#e74c3c;border:1px solid rgba(231,76,60,.2)}
.bb{background:rgba(79,195,247,.1);color:#4fc3f7;border:1px solid rgba(79,195,247,.2)}
.bp{background:rgba(206,147,216,.1);color:#ce93d8;border:1px solid rgba(206,147,216,.2)}
.bo{background:rgba(255,183,77,.1);color:#ffb74d;border:1px solid rgba(255,183,77,.2)}
.btn{padding:6px 13px;border-radius:6px;font-size:12px;cursor:pointer;border:none;font-family:'Inter',sans-serif;display:inline-flex;align-items:center;gap:5px;font-weight:500;transition:all .18s;white-space:nowrap}
.ba{background:#ff5722;color:#fff}.ba:hover{background:#e64a19}
.bg2{background:transparent;color:#666;border:1px solid #282828}.bg2:hover{border-color:#ff5722;color:#ddd}
.bs{padding:4px 9px;font-size:11px}
.inp{background:rgba(255,255,255,.04);border:1px solid #282828;color:#fff;border-radius:6px;padding:8px 11px;font-size:13px;font-family:'Inter',sans-serif;outline:none;width:100%;transition:border-color .18s}
.inp:focus{border-color:#ff5722}.inp::placeholder{color:#3a3a3a}
.il{font-size:11px;color:#555;margin-bottom:5px;display:block}
.tbl{border-collapse:collapse;width:100%}
.tbl th{color:#444;font-size:10px;text-transform:uppercase;letter-spacing:.5px;padding:9px 13px;text-align:left;font-weight:600;border-bottom:1px solid #1c1c1c}
.tbl td{padding:10px 13px;font-size:12px;border-bottom:1px solid rgba(255,255,255,.03);vertical-align:middle}
.tbl tr:hover td{background:rgba(255,255,255,.015)}
.dot{width:7px;height:7px;border-radius:50%;display:inline-block}
.dg{background:#2ecc71;animation:pg 2s infinite}.do{background:#f1c40f;animation:po 2s infinite}.dr{background:#e74c3c}
@keyframes pg{0%,100%{box-shadow:0 0 0 0 rgba(46,204,113,.5)}50%{box-shadow:0 0 0 4px rgba(46,204,113,0)}}
@keyframes po{0%,100%{box-shadow:0 0 0 0 rgba(241,196,15,.5)}50%{box-shadow:0 0 0 4px rgba(241,196,15,0)}}
@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fu .28s ease}
.mog{position:absolute;inset:0;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;z-index:50;backdrop-filter:blur(3px)}
.mox{background:#0f0f0f;border:1px solid #2a2a2a;border-radius:12px;padding:22px;min-width:370px;max-width:460px;width:90%;animation:fu .2s ease}
.kpig{display:grid;gap:12px;margin-bottom:18px}
.g4{grid-template-columns:repeat(4,1fr)}.g3{grid-template-columns:repeat(3,1fr)}.g2{grid-template-columns:repeat(2,1fr)}
.kpi{padding:17px}
.kpi-t{color:#444;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center}
.kpi-v{font-family:'Fira Code',monospace;font-size:22px;font-weight:600;margin-bottom:5px}
.kpi-d{color:#444;font-size:11px}
.kbc{background:rgba(255,255,255,.015);border:1px dashed #1e1e1e;border-radius:9px;padding:10px;min-height:160px}
.kbk{background:rgba(14,14,14,.98);border:1px solid #242424;border-radius:7px;padding:11px;margin-bottom:8px;cursor:pointer;transition:all .18s}
.kbk:hover{border-color:rgba(255,87,34,.3);transform:translateY(-1px)}
.mono{font-family:'Fira Code',monospace}
.dz{border:1.5px dashed #242424;border-radius:10px;padding:26px 20px;text-align:center;cursor:pointer;transition:all .25s;margin-bottom:16px}
.dz:hover,.dz.ov{border-color:#ff5722;background:rgba(255,87,34,.04)}
.twa-ov{position:absolute;inset:0;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;z-index:60;backdrop-filter:blur(4px)}
.twa-ph{width:340px;height:620px;background:#0a0a0a;border:1.5px solid #2a2a2a;border-radius:36px;overflow:hidden;display:flex;flex-direction:column;position:relative}
.twa-h{background:#0d0d0d;border-bottom:1px solid #1c1c1c;padding:11px 16px;display:flex;align-items:center;justify-content:space-between}
.twa-c{flex:1;overflow-y:auto;padding:14px}.twa-c::-webkit-scrollbar{width:2px}
.twa-n{border-top:1px solid #1c1c1c;display:flex;background:#0a0a0a}
.twa-nb{flex:1;padding:9px 4px;background:none;border:none;color:#444;font-size:10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;font-family:'Inter',sans-serif;transition:color .18s}
.twa-nb.ac{color:#ff5722}
.twb{display:block;width:100%;padding:13px;background:rgba(255,87,34,.08);border:1px solid rgba(255,87,34,.18);border-radius:9px;color:#ff5722;font-size:13px;cursor:pointer;margin-bottom:9px;text-align:left;transition:all .18s}
.twb:hover{background:rgba(255,87,34,.16)}
.twc{background:rgba(255,255,255,.04);border:1px solid #1c1c1c;border-radius:9px;padding:12px;margin-bottom:9px}
.sh{position:absolute;bottom:0;left:0;right:0;background:#111;border-top:1px solid #2a2a2a;border-radius:14px 14px 0 0;padding:18px;animation:fu .2s ease}
select option{background:#111;color:#fff}
`;

/* ════════════════════════ MICRO COMPONENTS ════════════════════════ */
function Dot({ c="g" }) { return <span className={`dot d${c}`} />; }
function B({ t, children }) {
  const m = { g:"bg", y:"by", r:"br", b:"bb", p:"bp", o:"bo" };
  return <span className={`bdg ${m[t]||"bb"}`}>{children}</span>;
}
function KPI({ t, v, d, dot="g", vc="#fff" }) {
  return (
    <div className="card ch kpi">
      <div className="kpi-t">{t}<Dot c={dot} /></div>
      <div className="kpi-v" style={{ color:vc }}>{v}</div>
      <div className="kpi-d">{d}</div>
    </div>
  );
}
function Modal({ title, onClose, children }) {
  return (
    <div className="mog" onMouseDown={e => e.target===e.currentTarget && onClose()}>
      <div className="mox">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <span style={{ fontSize:14, fontWeight:600 }}>{title}</span>
          <button className="btn bg2 bs" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Field({ label, ...p }) {
  return (
    <div>
      <label className="il">{label}</label>
      <input className="inp" {...p} />
    </div>
  );
}
function Sep() { return <div style={{ height:1, background:"#1c1c1c", margin:"8px 0" }} />; }

/* ════════════════════════ SIDEBAR ════════════════════════ */
const NAV = [
  { id:"dash",   ico:"⊞", lbl:"Dashboard"             },
  { id:"salary", ico:"₿", lbl:"Ish Haqi",    cl:"#4fc3f7" },
  { id:"ldsp",   ico:"▦", lbl:"LDSP",         cl:"#a5d6a7" },
  { id:"orders", ico:"≡", lbl:"Buyurtmalar",  cl:"#ffb74d" },
  { id:"merger", ico:"⊕", lbl:"GiblabMerger", cl:"#ce93d8" },
  { id:"users",  ico:"◎", lbl:"Foydalanuvchilar"       },
];
function Sidebar({ pg, setPg, col, setCol }) {
  const w = col ? 54 : 196;
  return (
    <div className="sb" style={{ width:w }}>
      <div style={{ padding:"15px 11px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid #1c1c1c" }}>
        <div style={{ width:27, height:27, background:"#ff5722", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 }}>A</div>
        {!col && <div><div style={{ fontSize:12, fontWeight:600 }}>AKA HUB</div><div className="mono" style={{ fontSize:9, color:"#3a3a3a" }}>v1.0.0-beta</div></div>}
      </div>
      <nav style={{ flex:1, padding:"10px 5px", display:"flex", flexDirection:"column", gap:2 }}>
        {NAV.map(n => (
          <button key={n.id} className={`nb${pg===n.id?" ac":""}`} onClick={() => setPg(n.id)} title={col ? n.lbl : ""} style={{ justifyContent:col ? "center" : "flex-start" }}>
            <span style={{ fontSize:15, color:pg===n.id ? "#ff5722" : n.cl||"#555", flexShrink:0 }}>{n.ico}</span>
            {!col && <span>{n.lbl}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding:"8px 5px", borderTop:"1px solid #1c1c1c" }}>
        <button className="nb" onClick={() => setCol(!col)} style={{ justifyContent:col ? "center" : "flex-start" }}>
          <span style={{ fontSize:12 }}>{col ? "→" : "←"}</span>
          {!col && <span style={{ fontSize:11, color:"#444" }}>Yig'ish</span>}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════ TOPBAR ════════════════════════ */
const PT = { dash:"Umumiy Ko'rinish", salary:"Ish Haqi Boshqaruvi", ldsp:"LDSP Inventar", orders:"Buyurtmalar", merger:"GiblabMerger", users:"Foydalanuvchilar" };
function Topbar({ pg, onTWA }) {
  return (
    <div className="tb">
      <div>
        <div className="mono" style={{ fontSize:9, color:"#ff5722", letterSpacing:2, textTransform:"uppercase", marginBottom:2 }}>SYSTEM DASHBOARD</div>
        <div style={{ fontSize:16, fontWeight:600 }}>{PT[pg]}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <button className="btn bg2 bs" onClick={onTWA}>📱 User (TWA)</button>
        <div style={{ width:1, height:22, background:"#1e1e1e" }} />
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <div style={{ width:27, height:27, background:"#ff5722", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>A</div>
          <div><div style={{ fontSize:12, fontWeight:600 }}>Admin</div><div className="mono" style={{ fontSize:9, color:"#444" }}>super_admin</div></div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════ DASHBOARD ════════════════════════ */
function TTP({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:6, padding:"6px 11px" }}>
      <div className="mono" style={{ fontSize:10, color:"#555", marginBottom:2 }}>{label}</div>
      <div className="mono" style={{ fontSize:13, color:"#ff5722" }}>{payload[0].value} m²</div>
    </div>
  );
}
function Dashboard({ setPg }) {
  return (
    <div className="fu">
      <div className="kpig g4">
        <KPI t="AI Server (AM5/RTX)" v="64%"      d="Ollama VRAM yuklamasi"   dot="g" />
        <KPI t="ERP Haftalik"        v="1,450 m²"  d="Ishbay ishlab chiqarish" dot="g" vc="#4fc3f7" />
        <KPI t="GiblabMerger"        v="124 ta"    d="Birlashtirilgan fayllar"  dot="o" vc="#ce93d8" />
        <KPI t="Tizim Uptime"        v="99.8%"     d="30 kunlik barqarorlik"   dot="g" vc="#2ecc71" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:18 }}>
        <div className="card" style={{ padding:17 }}>
          <div style={{ fontSize:11, color:"#555", marginBottom:13 }}>ERP: Ishlab chiqarish dinamikasi (m²)</div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={WEEKLY}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5722" stopOpacity={0.35}/>
                  <stop offset="100%" stopColor="#ff5722" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
              <XAxis dataKey="d" tick={{ fill:"#555", fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#555", fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<TTP/>}/>
              <Area type="monotone" dataKey="m" stroke="#ff5722" strokeWidth={2} fill="url(#g1)"
                dot={{ fill:"#0a0a0a", stroke:"#ff5722", strokeWidth:2, r:4 }}
                activeDot={{ r:5, fill:"#ff5722" }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding:17 }}>
          <div style={{ fontSize:11, color:"#555", marginBottom:10 }}>Server Resurslari Taqsimoti</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={PIE_D} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="v" paddingAngle={3}>
                {PIE_D.map((e,i) => <Cell key={i} fill={e.c}/>)}
              </Pie>
              <Tooltip formatter={(v,n)=>[v+"%",n]} contentStyle={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:6, fontSize:11 }}/>
            </PieChart>
          </ResponsiveContainer>
          {PIE_D.map((e,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, marginTop:5 }}>
              <div style={{ width:7, height:7, borderRadius:2, background:e.c, flexShrink:0 }}/>
              <span style={{ color:"#555", flex:1 }}>{e.n}</span>
              <span className="mono">{e.v}%</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize:12, color:"#555", marginBottom:12, borderBottom:"1px solid #1c1c1c", paddingBottom:8 }}>Aktiv Modullar</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:11 }}>
        {[
          { id:"salary", ico:"💰", t:"Ish Haqi",    d:"Maosh va avans boshqaruvi",     cl:"#4fc3f7", st:"g" },
          { id:"ldsp",   ico:"🪵", t:"LDSP",         d:"Material inventar kuzatuvi",    cl:"#a5d6a7", st:"g" },
          { id:"orders", ico:"📋", t:"Buyurtmalar",  d:"Mijoz buyurtmalari va holatlar", cl:"#ffb74d", st:"g" },
          { id:"merger", ico:"🔧", t:"GiblabMerger", d:"CNC uchun XML birlashtirish",   cl:"#ce93d8", st:"o" },
        ].map(m => (
          <div key={m.id} className="card ch" style={{ padding:15, cursor:"pointer" }} onClick={() => setPg(m.id)}>
            <div style={{ fontSize:22, marginBottom:9 }}>{m.ico}</div>
            <div style={{ fontSize:12, fontWeight:600, color:m.cl, marginBottom:5 }}>{m.t}</div>
            <div style={{ fontSize:11, color:"#444", lineHeight:1.5, marginBottom:11 }}>{m.d}</div>
            <B t={m.st}>{m.st==="g" ? "Faol" : "Kutishda"}</B>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════ ISH HAQI ════════════════════════ */
function Salary() {
  const [emps, setEmps] = useState(EMP);
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({});
  const active = emps.filter(e => e.st === "active");
  const f = k => v => setForm(p => ({ ...p, [k]:v }));

  return (
    <div className="fu">
      <div className="kpig g3">
        <KPI t="Jami xodimlar"   v={emps.length}            d={`${active.length} ta faol`}  dot="g" vc="#4fc3f7" />
        <KPI t="Oylik maosh jami" v={fm(active.reduce((s,e)=>s+e.sal,0))} d="Barcha faol xodimlar" dot="g" vc="#4fc3f7" />
        <KPI t="Joriy avanslar"  v={fm(emps.reduce((s,e)=>s+e.adv,0))} d="Bu oy berilgan" dot="o" vc="#f1c40f" />
      </div>
      <div className="card">
        <div style={{ padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #1c1c1c" }}>
          <span style={{ fontWeight:600, fontSize:13 }}>Xodimlar Ro'yxati</span>
          <button className="btn ba bs" onClick={() => { setForm({}); setModal("new"); }}>+ Yangi xodim</button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table className="tbl">
            <thead><tr>
              <th>#</th><th>Ism Familiya</th><th>Lavozim</th>
              <th>Oylik</th><th>Avans</th><th>Qoldiq</th><th>Holat</th><th>Amal</th>
            </tr></thead>
            <tbody>
              {emps.map((e,i) => (
                <tr key={e.id}>
                  <td className="mono" style={{ color:"#444" }}>{String(i+1).padStart(2,"0")}</td>
                  <td style={{ fontWeight:500 }}>{e.name}</td>
                  <td style={{ color:"#555" }}>{e.pos}</td>
                  <td className="mono" style={{ color:"#4fc3f7" }}>{fms(e.sal)}</td>
                  <td className="mono" style={{ color:e.adv>0?"#f1c40f":"#444" }}>{fms(e.adv)}</td>
                  <td className="mono" style={{ color:"#2ecc71" }}>{fms(e.sal-e.adv)}</td>
                  <td><B t={e.st==="active"?"g":"r"}>{e.st==="active"?"Faol":"Nofaol"}</B></td>
                  <td>
                    <button className="btn bg2 bs" onClick={() => { setSel(e); setForm({}); setModal("adv"); }}>
                      + Avans
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal === "adv" && sel && (
        <Modal title={`Avans: ${sel.name}`} onClose={() => setModal(null)}>
          <div style={{ background:"rgba(79,195,247,.06)", border:"1px solid rgba(79,195,247,.15)", borderRadius:7, padding:"10px 13px", marginBottom:14, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"#555" }}>Oylik maosh:</span>
            <span className="mono" style={{ fontSize:12, color:"#4fc3f7" }}>{fms(sel.sal)}</span>
          </div>
          <Field label="Avans miqdori (so'm)" type="number" placeholder="500000" value={form.a||""} onChange={e=>f("a")(e.target.value)} />
          <div style={{ marginTop:10 }}>
            <Field label="Izoh (ixtiyoriy)" placeholder="Sabab..." value={form.n||""} onChange={e=>f("n")(e.target.value)} />
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
            <button className="btn bg2" onClick={() => setModal(null)}>Bekor</button>
            <button className="btn ba" onClick={() => {
              const amt = Number(form.a)||0;
              if (!amt) return;
              setEmps(p => p.map(x => x.id===sel.id ? { ...x, adv:x.adv+amt } : x));
              setModal(null);
            }}>✓ Tasdiqlash</button>
          </div>
        </Modal>
      )}

      {modal === "new" && (
        <Modal title="Yangi Xodim Qo'shish" onClose={() => setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
            <Field label="Ism Familiya" placeholder="Abdulloh Toshmatov" value={form.nm||""} onChange={e=>f("nm")(e.target.value)} />
            <Field label="Lavozim"      placeholder="Ishchi, Operator..." value={form.ps||""} onChange={e=>f("ps")(e.target.value)} />
            <Field label="Oylik maosh (so'm)" type="number" placeholder="2500000" value={form.sl||""} onChange={e=>f("sl")(e.target.value)} />
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:4 }}>
              <button className="btn bg2" onClick={() => setModal(null)}>Bekor</button>
              <button className="btn ba" onClick={() => {
                if (!form.nm || !form.sl) return;
                setEmps(p => [...p, { id:Date.now(), name:form.nm, pos:form.ps||"Ishchi", sal:Number(form.sl), adv:0, st:"active" }]);
                setModal(null);
              }}>Saqlash ✓</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ════════════════════════ LDSP ════════════════════════ */
function LDSP() {
  const [mats, setMats] = useState(MAT);
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({});
  const low = mats.filter(m => m.qty <= m.min);
  const f = k => v => setForm(p => ({ ...p, [k]:v }));

  return (
    <div className="fu">
      <div className="kpig g3">
        <KPI t="Jami material turlari"  v={mats.length} d="Katalogda" vc="#a5d6a7" />
        <KPI t="Inventar qiymati" v={fm(mats.reduce((s,m)=>s+m.qty*m.px,0))} d="Joriy baholash" dot="g" vc="#a5d6a7" />
        <KPI t="Kam qolganlar" v={`${low.length} ta`} d="Minimal darajadan past" dot={low.length?"o":"g"} vc={low.length?"#f1c40f":"#2ecc71"} />
      </div>
      {low.length > 0 && (
        <div style={{ background:"rgba(241,196,15,.07)", border:"1px solid rgba(241,196,15,.2)", borderRadius:9, padding:"11px 15px", marginBottom:16, display:"flex", alignItems:"center", gap:9 }}>
          <span style={{ fontSize:16 }}>⚠️</span>
          <span style={{ fontSize:12, color:"#f1c40f" }}>
            <strong>{low.length} ta material</strong> minimal darajadan past: {low.map(m=>m.name).join(", ")}
          </span>
        </div>
      )}
      <div className="card">
        <div style={{ padding:"13px 17px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #1c1c1c" }}>
          <span style={{ fontWeight:600, fontSize:13 }}>Inventar Holati</span>
          <button className="btn ba bs" onClick={() => { setForm({}); setModal("new"); }}>+ Material qo'shish</button>
        </div>
        <table className="tbl">
          <thead><tr>
            <th>Material</th><th>O'lcham</th><th>Mavjud</th><th>Min.</th><th>Holat</th><th>Amal</th>
          </tr></thead>
          <tbody>
            {mats.map(m => (
              <tr key={m.id}>
                <td style={{ fontWeight:500 }}>{m.name}</td>
                <td className="mono" style={{ color:"#555", fontSize:11 }}>{m.dims}</td>
                <td className="mono" style={{ color:m.qty<=m.min?"#f1c40f":"#a5d6a7", fontWeight:600 }}>{m.qty} {m.unit}</td>
                <td className="mono" style={{ color:"#444", fontSize:11 }}>{m.min} {m.unit}</td>
                <td><B t={m.qty<=m.min?"y":"g"}>{m.qty<=m.min?"Kam qoldi":"Normal"}</B></td>
                <td>
                  <div style={{ display:"flex", gap:5 }}>
                    <button className="btn bs" style={{ background:"rgba(46,204,113,.1)", color:"#2ecc71", border:"1px solid rgba(46,204,113,.2)" }}
                      onClick={() => { setSel(m); setForm({}); setModal("add"); }}>+ Kirim</button>
                    <button className="btn bs" style={{ background:"rgba(231,76,60,.1)", color:"#e74c3c", border:"1px solid rgba(231,76,60,.2)" }}
                      onClick={() => { setSel(m); setForm({}); setModal("use"); }}>- Chiqim</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal==="add"||modal==="use") && sel && (
        <Modal title={modal==="add" ? `Kirim: ${sel.name}` : `Chiqim: ${sel.name}`} onClose={() => setModal(null)}>
          <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid #222", borderRadius:7, padding:"9px 13px", marginBottom:13, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"#555" }}>Joriy miqdor:</span>
            <span className="mono" style={{ fontSize:12, color:"#a5d6a7" }}>{sel.qty} {sel.unit}</span>
          </div>
          <Field label={`Miqdor (${sel.unit})`} type="number" placeholder="0" value={form.q||""} onChange={e=>f("q")(e.target.value)} />
          <div style={{ marginTop:10 }}>
            <Field label="Izoh" placeholder={modal==="add"?"Yetkazuvchi nomi...":"Buyurtma raqami..."} value={form.n||""} onChange={e=>f("n")(e.target.value)} />
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:15 }}>
            <button className="btn bg2" onClick={() => setModal(null)}>Bekor</button>
            <button className="btn" style={{ background:modal==="add"?"#2ecc71":"#e74c3c", color:"#fff" }}
              onClick={() => {
                const d = Number(form.q)||0; if (!d) return;
                setMats(p => p.map(x => x.id===sel.id ? { ...x, qty:modal==="add"?x.qty+d:Math.max(0,x.qty-d) } : x));
                setModal(null);
              }}>✓ {modal==="add"?"Kirim Qayd":"Chiqim Qayd"}</button>
          </div>
        </Modal>
      )}

      {modal==="new" && (
        <Modal title="Yangi Material" onClose={() => setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <Field label="Nomi"      placeholder="LDSP 18mm Oq"  value={form.nm||""} onChange={e=>f("nm")(e.target.value)} />
            <Field label="O'lcham"   placeholder="2800×2070"     value={form.dm||""} onChange={e=>f("dm")(e.target.value)} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              <Field label="Miqdor"  type="number" placeholder="0"     value={form.q||""} onChange={e=>f("q")(e.target.value)} />
              <Field label="Min."    type="number" placeholder="5"     value={form.mn||""} onChange={e=>f("mn")(e.target.value)} />
              <Field label="Birlik"  placeholder="varaq"  value={form.u||""} onChange={e=>f("u")(e.target.value)} />
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:4 }}>
              <button className="btn bg2" onClick={() => setModal(null)}>Bekor</button>
              <button className="btn ba" onClick={() => {
                if (!form.nm) return;
                setMats(p => [...p, { id:Date.now(), name:form.nm, dims:form.dm||"—", qty:Number(form.q)||0, min:Number(form.mn)||5, unit:form.u||"dona", px:0 }]);
                setModal(null);
              }}>Saqlash ✓</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ════════════════════════ ORDERS (KANBAN) ════════════════════════ */
function Orders() {
  const [ords, setOrds] = useState(ORD_INIT);
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({});
  const [view, setView] = useState("kb");
  const all = KB_COLS.flatMap(c => ords[c.id].map(o => ({ ...o, status:c.id })));
  const total = all.reduce((s,o)=>s+o.amt,0);
  const f = k => v => setForm(p => ({ ...p, [k]:v }));

  const moveOrd = (ord, from, to) => {
    setOrds(p => ({
      ...p,
      [from]: p[from].filter(o => o.id!==ord.id),
      [to]:   [...p[to], ord],
    }));
  };

  return (
    <div className="fu">
      <div className="kpig g4">
        {KB_COLS.map(c => (
          <KPI key={c.id} t={c.lbl} v={ords[c.id].length} d="ta buyurtma" dot={c.id==="delivered"?"g":c.id==="ready"?"g":"o"} vc={c.col} />
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ display:"flex", gap:7 }}>
          <button className={`btn bs ${view==="kb"?"ba":"bg2"}`} onClick={() => setView("kb")}>⊞ Kanban</button>
          <button className={`btn bs ${view==="ls"?"ba":"bg2"}`} onClick={() => setView("ls")}>≡ Jadval</button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, color:"#555" }}>Jami: <span className="mono" style={{ color:"#ffb74d" }}>{fm(total)} so'm</span></span>
          <button className="btn ba bs" onClick={() => { setForm({}); setModal("new"); }}>+ Yangi buyurtma</button>
        </div>
      </div>

      {view==="kb" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {KB_COLS.map(col => (
            <div key={col.id}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:col.col }} />
                <span style={{ fontSize:12, fontWeight:600, color:col.col }}>{col.lbl}</span>
                <span style={{ marginLeft:"auto", background:"rgba(255,255,255,.05)", border:"1px solid #222", borderRadius:4, padding:"1px 7px", fontSize:11, color:"#555" }}>{ords[col.id].length}</span>
              </div>
              <div className="kbc">
                {ords[col.id].map(o => (
                  <div key={o.id} className="kbk" onClick={() => { setSel({ ...o, status:col.id }); setModal("det"); }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span className="mono" style={{ fontSize:10, color:col.col }}>#{o.id}</span>
                    </div>
                    <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{o.pr}</div>
                    <div style={{ fontSize:11, color:"#555", marginBottom:9 }}>👤 {o.cl}</div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span className="mono" style={{ fontSize:10, color:"#444" }}>📅 {o.dl}</span>
                      <span className="mono" style={{ fontSize:11, color:"#ffb74d" }}>{fm(o.amt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view==="ls" && (
        <div className="card">
          <table className="tbl">
            <thead><tr><th>#</th><th>Mijoz</th><th>Mahsulot</th><th>Muddat</th><th>Narx</th><th>Holat</th><th>Amal</th></tr></thead>
            <tbody>
              {all.map(o => {
                const col = KB_COLS.find(c => c.id===o.status);
                return (
                  <tr key={o.id}>
                    <td className="mono" style={{ color:"#555" }}>#{o.id}</td>
                    <td style={{ fontWeight:500 }}>{o.cl}</td>
                    <td>{o.pr}</td>
                    <td className="mono" style={{ color:"#555", fontSize:11 }}>{o.dl}</td>
                    <td className="mono" style={{ color:"#ffb74d" }}>{fm(o.amt)}</td>
                    <td><span className="bdg" style={{ background:col.col+"18", color:col.col, border:`1px solid ${col.col}33` }}>{col.lbl}</span></td>
                    <td><button className="btn bg2 bs" onClick={() => { setSel({ ...o, status:o.status }); setModal("det"); }}>Ko'rish</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal==="det" && sel && (
        <Modal title={`#${sel.id} — ${sel.pr}`} onClose={() => setModal(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:14 }}>
            {[
              { l:"Mijoz",  v:sel.cl },
              { l:"Narx",   v:fms(sel.amt), m:true, c:"#ffb74d" },
              { l:"Muddat", v:sel.dl, m:true },
              { l:"Holat",  v:KB_COLS.find(c=>c.id===sel.status)?.lbl },
            ].map(it => (
              <div key={it.l} style={{ padding:"9px 12px", background:"rgba(255,255,255,.03)", borderRadius:7, border:"1px solid #222" }}>
                <div style={{ fontSize:10, color:"#555", marginBottom:3 }}>{it.l}</div>
                <div className={it.m?"mono":""} style={{ fontSize:13, fontWeight:500, color:it.c||"#fff" }}>{it.v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11, color:"#555", marginBottom:8 }}>Holatni o'zgartirish:</div>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:14 }}>
            {KB_COLS.map(c => (
              <button key={c.id} className="btn bs" disabled={sel.status===c.id}
                style={{ borderColor:c.col+"44", color:c.col, background:"transparent", border:"1px solid", opacity:sel.status===c.id?.4:1 }}
                onClick={() => { moveOrd(sel, sel.status, c.id); setModal(null); }}>
                {c.lbl}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end" }}>
            <button className="btn bg2" onClick={() => setModal(null)}>Yopish</button>
          </div>
        </Modal>
      )}

      {modal==="new" && (
        <Modal title="Yangi Buyurtma" onClose={() => setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <Field label="Mijoz ismi"     placeholder="Karimov A."    value={form.cl||""} onChange={e=>f("cl")(e.target.value)} />
            <Field label="Mahsulot"       placeholder="3-qavatli shkaf..." value={form.pr||""} onChange={e=>f("pr")(e.target.value)} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
              <Field label="Narx (so'm)" type="number" placeholder="4500000" value={form.am||""} onChange={e=>f("am")(e.target.value)} />
              <Field label="Muddat" type="date" value={form.dl||""} onChange={e=>f("dl")(e.target.value)} />
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:4 }}>
              <button className="btn bg2" onClick={() => setModal(null)}>Bekor</button>
              <button className="btn ba" onClick={() => {
                if (!form.cl||!form.pr) return;
                const n = { id:String(Date.now()).slice(-4), cl:form.cl, pr:form.pr, dl:form.dl||"2026-07-31", amt:Number(form.am)||0 };
                setOrds(p => ({ ...p, new:[...p.new, n] }));
                setModal(null);
              }}>Yaratish ✓</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ════════════════════════ MERGER ════════════════════════ */
function Merger() {
  const [files, setFiles] = useState(FILES_INIT);
  const [sel, setSel] = useState([]);
  const [merging, setMerging] = useState(false);
  const [drag, setDrag] = useState(false);
  const TC = { xml:"#4fc3f7", nc:"#ffb74d", gcode:"#a5d6a7", merged:"#ce93d8" };
  const tog = id => setSel(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);

  const merge = () => {
    if (sel.length<2) return;
    setMerging(true);
    setTimeout(() => {
      setFiles(p => [...p, { id:Date.now(), name:`merged_${Date.now().toString().slice(-5)}.xml`, tp:"merged", sz:"1.1 MB", dt:new Date().toISOString().slice(0,10), ord:"—" }]);
      setSel([]);
      setMerging(false);
    }, 2200);
  };

  return (
    <div className="fu">
      <div className="kpig g3">
        <KPI t="Jami fayllar"   v={files.length} d="Yuklangan" vc="#ce93d8" />
        <KPI t="Merged fayllar" v={files.filter(f=>f.tp==="merged").length} d="Operatsiyalar" vc="#ce93d8" />
        <KPI t="XML fayllar"    v={files.filter(f=>f.tp==="xml").length} d="Ishga tayyor" dot="g" vc="#4fc3f7" />
      </div>
      <div className={`dz${drag?" ov":""}`}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{
          e.preventDefault(); setDrag(false);
          Array.from(e.dataTransfer.files).forEach(file => {
            setFiles(p=>[...p,{ id:Date.now()+Math.random(), name:file.name, tp:file.name.split(".").pop(), sz:(file.size/1024).toFixed(0)+" KB", dt:new Date().toISOString().slice(0,10), ord:"—" }]);
          });
        }}>
        <div style={{ fontSize:28, marginBottom:8 }}>📁</div>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>XML / NC / G-code fayllarni shu yerga tashlang</div>
        <div style={{ fontSize:12, color:"#555" }}>yoki bosib fayl tanlang</div>
      </div>
      {sel.length>0 && (
        <div style={{ background:"rgba(206,147,216,.07)", border:"1px solid rgba(206,147,216,.2)", borderRadius:9, padding:"11px 15px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:12, color:"#ce93d8" }}>{sel.length} ta fayl tanlandi</span>
          <button className="btn bs" disabled={merging} style={{ background:"#ce93d8", color:"#0a0a0a", fontWeight:600 }} onClick={merge}>
            {merging?"⏳ Birlashtirilmoqda...":"⊕ Birlashtirish"}
          </button>
        </div>
      )}
      <div className="card">
        <div style={{ padding:"13px 17px", fontWeight:600, fontSize:13, borderBottom:"1px solid #1c1c1c" }}>Fayllar Ro'yxati</div>
        <table className="tbl">
          <thead><tr><th></th><th>Fayl nomi</th><th>Turi</th><th>Hajm</th><th>Buyurtma</th><th>Sana</th><th>Amal</th></tr></thead>
          <tbody>
            {files.map(file => (
              <tr key={file.id}>
                <td><input type="checkbox" checked={sel.includes(file.id)} onChange={()=>tog(file.id)} style={{ cursor:"pointer", accentColor:"#ff5722" }} /></td>
                <td className="mono" style={{ fontSize:12 }}>{file.name}</td>
                <td><span className="bdg" style={{ background:(TC[file.tp]||"#888")+"18", color:TC[file.tp]||"#888", border:`1px solid ${(TC[file.tp]||"#888")}33` }}>.{file.tp}</span></td>
                <td className="mono" style={{ color:"#555", fontSize:11 }}>{file.sz}</td>
                <td className="mono" style={{ color:"#555", fontSize:11 }}>{file.ord}</td>
                <td className="mono" style={{ color:"#444", fontSize:11 }}>{file.dt}</td>
                <td>
                  <div style={{ display:"flex", gap:5 }}>
                    <button className="btn bg2 bs" style={{ color:"#4fc3f7" }}>⬇ Yuklash</button>
                    <button className="btn bg2 bs" style={{ color:"#e74c3c" }} onClick={()=>setFiles(p=>p.filter(f=>f.id!==file.id))}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ════════════════════════ USERS ════════════════════════ */
function Users() {
  const [users, setUsers] = useState(USR);
  const [modal, setModal] = useState(null);
  const RC = { super_admin:"r", manager:"o", operator:"p", worker:"b" };

  return (
    <div className="fu">
      <div className="kpig g4">
        {Object.entries(R_LBL).map(([r,l]) => (
          <KPI key={r} t={l} v={users.filter(u=>u.role===r).length} d="foydalanuvchi" dot="g" />
        ))}
      </div>
      <div className="card">
        <div style={{ padding:"13px 17px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #1c1c1c" }}>
          <span style={{ fontWeight:600, fontSize:13 }}>Foydalanuvchilar</span>
          <button className="btn ba bs" onClick={()=>setModal("inv")}>+ Taklif qilish</button>
        </div>
        <table className="tbl">
          <thead><tr><th>Ism</th><th>Telegram</th><th>Rol</th><th>So'nggi faollik</th><th>Rolni o'zgartirish</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <div style={{ width:27, height:27, background:"#ff5722", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{u.name[0]}</div>
                    <span style={{ fontWeight:500 }}>{u.name}</span>
                  </div>
                </td>
                <td className="mono" style={{ color:"#4fc3f7", fontSize:11 }}>{u.tg}</td>
                <td><B t={RC[u.role]}>{R_LBL[u.role]}</B></td>
                <td style={{ color:"#555", fontSize:11 }} className="mono">{u.ls}</td>
                <td>
                  <select className="inp" style={{ padding:"4px 8px", fontSize:11, width:"auto" }} value={u.role}
                    onChange={e=>setUsers(p=>p.map(x=>x.id===u.id?{...x,role:e.target.value}:x))}>
                    {Object.entries(R_LBL).map(([r,l])=><option key={r} value={r}>{l}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal==="inv" && (
        <Modal title="Foydalanuvchi Taklif Qilish" onClose={()=>setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
            <Field label="Telegram Username" placeholder="@username" />
            <div>
              <label className="il">Rol</label>
              <select className="inp">
                {Object.entries(R_LBL).map(([r,l])=><option key={r} value={r}>{l}</option>)}
              </select>
            </div>
            <div style={{ background:"rgba(79,195,247,.06)", border:"1px solid rgba(79,195,247,.15)", borderRadius:7, padding:"9px 13px", fontSize:11, color:"#4fc3f7" }}>
              ℹ️ Telegram orqali taklif havolasi jo'natiladi
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:4 }}>
              <button className="btn bg2" onClick={()=>setModal(null)}>Bekor</button>
              <button className="btn ba" onClick={()=>setModal(null)}>Havolani jo'natish ✓</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ════════════════════════ TWA OVERLAY ════════════════════════ */
function TWA({ onClose }) {
  const [pg, setPg] = useState("home");
  const [sheet, setSheet] = useState(false);
  const [avAmt, setAvAmt] = useState("");
  const [avOk, setAvOk] = useState(false);

  return (
    <div className="twa-ov">
      <div>
        <div style={{ textAlign:"center", marginBottom:8 }}>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.1)", border:"none", color:"#aaa", borderRadius:20, padding:"5px 16px", cursor:"pointer", fontSize:12 }}>✕ Yopish</button>
          <div style={{ fontSize:11, color:"#555", marginTop:5 }}>📱 Telegram Web App ko'rinishi (Foydalanuvchi interfeysi)</div>
        </div>
        <div className="twa-ph">
          <div style={{ background:"#000", padding:"5px 16px", display:"flex", justifyContent:"space-between", fontSize:10, color:"#666" }}>
            <span className="mono">9:41</span><span>●●● 🔋</span>
          </div>
          <div className="twa-h">
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>🤖 AKA HUB</div>
              <div style={{ fontSize:10, color:"#2ecc71" }}>● online</div>
            </div>
            <span className="mono" style={{ fontSize:10, color:"#ff5722" }}>AKA CENTRAL</span>
          </div>
          <div className="twa-c">
            {pg==="home" && (
              <div>
                <div style={{ paddingBottom:14, borderBottom:"1px solid #1c1c1c", marginBottom:14 }}>
                  <div className="mono" style={{ fontSize:9, color:"#ff5722", marginBottom:3, letterSpacing:1 }}>SALOM,</div>
                  <div style={{ fontSize:20, fontWeight:700 }}>Abdulloh 👋</div>
                  <div style={{ fontSize:11, color:"#555", marginTop:3 }}>Xodim | ID: #001</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:14 }}>
                  {[
                    { l:"Bu oy maoshi", v:"2.5 mln",  c:"#4fc3f7" },
                    { l:"Avans",        v:"500 ming",  c:"#f1c40f" },
                    { l:"Buyurtmalar",  v:"2 ta aktiv",c:"#ffb74d" },
                    { l:"Qoldiq",       v:"2.0 mln",   c:"#2ecc71" },
                  ].map(s => (
                    <div key={s.l} className="twc">
                      <div style={{ fontSize:10, color:"#555", marginBottom:4 }}>{s.l}</div>
                      <div className="mono" style={{ fontSize:15, fontWeight:700, color:s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>Tezkor amallar</div>
                {[
                  { ico:"💰", t:"Avans so'rash",     sub:"Maoshdan oldindan olish", fn:()=>setSheet(true) },
                  { ico:"📋", t:"Buyurtmalarim",      sub:"2 ta bajarilmagan",      fn:()=>setPg("ord") },
                  { ico:"🪵", t:"LDSP qoldiqlari",    sub:"1 ta material kam qoldi",fn:()=>setPg("ldsp") },
                  { ico:"💼", t:"Ish haqi tarixi",    sub:"Oxirgi 3 oy",            fn:()=>setPg("sal") },
                ].map(it => (
                  <button key={it.t} className="twb" onClick={it.fn}>
                    <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                      <span style={{ fontSize:20 }}>{it.ico}</span>
                      <div><div style={{ fontSize:13, fontWeight:600 }}>{it.t}</div><div style={{ fontSize:10, color:"#666", marginTop:2 }}>{it.sub}</div></div>
                      <span style={{ marginLeft:"auto", color:"#444" }}>›</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {pg==="ord" && (
              <div>
                <button style={{ background:"none", border:"none", color:"#ff5722", cursor:"pointer", fontSize:16, marginBottom:13 }} onClick={()=>setPg("home")}>← Orqaga</button>
                <div style={{ fontWeight:600, marginBottom:13 }}>Mening Buyurtmalarim</div>
                {[{ id:"002", pr:"Ofis stoli x3", dl:"2026-07-10" }, { id:"003", pr:"Yotoqxona garnitury", dl:"2026-07-08" }].map(o => (
                  <div key={o.id} className="twc">
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span className="mono" style={{ fontSize:10, color:"#ffb74d" }}>#{o.id}</span>
                      <B t="o">Jarayonda</B>
                    </div>
                    <div style={{ fontWeight:600, fontSize:13, marginBottom:5 }}>{o.pr}</div>
                    <div style={{ fontSize:11, color:"#555", marginBottom:11 }}>📅 {o.dl}</div>
                    <button className="btn ba bs" style={{ width:"100%", justifyContent:"center" }}
                      onClick={() => alert(`✅ #${o.id} — "Tayyor" deb belgilandi!`)}>
                      ✓ Bajarildi deb belgilash
                    </button>
                  </div>
                ))}
              </div>
            )}

            {pg==="ldsp" && (
              <div>
                <button style={{ background:"none", border:"none", color:"#ff5722", cursor:"pointer", fontSize:16, marginBottom:13 }} onClick={()=>setPg("home")}>← Orqaga</button>
                <div style={{ fontWeight:600, marginBottom:13 }}>LDSP Materiallar</div>
                {[
                  { n:"LDSP 16mm Oq",      q:45,  u:"varaq", ok:true },
                  { n:"LDSP 18mm Yog'och", q:12,  u:"varaq", ok:true },
                  { n:"Arka plyonka",       q:3,   u:"rol",   ok:false },
                ].map(m => (
                  <div key={m.n} className="twc" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:12, marginBottom:4 }}>{m.n}</div>
                      <div className="mono" style={{ fontSize:14, color:m.ok?"#a5d6a7":"#f1c40f", fontWeight:700 }}>{m.q} {m.u}</div>
                    </div>
                    <B t={m.ok?"g":"y"}>{m.ok?"Normal":"Kam qoldi"}</B>
                  </div>
                ))}
              </div>
            )}

            {pg==="sal" && (
              <div>
                <button style={{ background:"none", border:"none", color:"#ff5722", cursor:"pointer", fontSize:16, marginBottom:13 }} onClick={()=>setPg("home")}>← Orqaga</button>
                <div style={{ fontWeight:600, marginBottom:13 }}>Ish Haqi Tarixi</div>
                {[
                  { m:"Iyun 2026", sal:2500000, adv:500000 },
                  { m:"May 2026",  sal:2500000, adv:300000 },
                  { m:"Aprel 2026",sal:2500000, adv:0 },
                ].map(r => (
                  <div key={r.m} className="twc">
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:9 }}>
                      <span style={{ fontWeight:600, fontSize:13 }}>{r.m}</span>
                      <B t="g">to'langan</B>
                    </div>
                    {[["Maosh", fms(r.sal), "#4fc3f7"], ["Avans", "- "+fms(r.adv), "#f1c40f"]].map(([l,v,c])=>(
                      <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                        <span style={{ color:"#555" }}>{l}:</span>
                        <span className="mono" style={{ color:c }}>{v}</span>
                      </div>
                    ))}
                    <Sep />
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                      <span style={{ color:"#555" }}>Qo'lga tegdi:</span>
                      <span className="mono" style={{ color:"#2ecc71", fontWeight:700 }}>{fms(r.sal-r.adv)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sheet && (
              <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.7)", display:"flex", alignItems:"flex-end", zIndex:10 }}>
                <div className="sh" style={{ width:"100%" }}>
                  {!avOk ? (
                    <div>
                      <div style={{ fontWeight:600, fontSize:15, marginBottom:5 }}>💰 Avans So'rash</div>
                      <div style={{ fontSize:11, color:"#555", marginBottom:12 }}>Mavjud: <span className="mono" style={{ color:"#4fc3f7" }}>2,000,000 so'm</span></div>
                      <input className="inp" type="number" placeholder="Miqdor kiriting..." value={avAmt} onChange={e=>setAvAmt(e.target.value)} style={{ marginBottom:10 }} />
                      <button className="btn ba" style={{ width:"100%", justifyContent:"center", marginBottom:7 }} onClick={()=>{ if(avAmt) setAvOk(true); }}>Yuborish</button>
                      <button className="btn bg2 bs" style={{ width:"100%", justifyContent:"center" }} onClick={()=>{ setSheet(false); setAvAmt(""); }}>Bekor qilish</button>
                    </div>
                  ) : (
                    <div style={{ textAlign:"center", padding:"14px 0" }}>
                      <div style={{ fontSize:40, marginBottom:10 }}>✅</div>
                      <div style={{ fontWeight:700, fontSize:15, color:"#2ecc71", marginBottom:6 }}>So'rov yuborildi!</div>
                      <div style={{ fontSize:12, color:"#555", marginBottom:14 }}>Admin tasdiqlashi kutilmoqda</div>
                      <button className="btn bg2 bs" style={{ margin:"0 auto" }} onClick={()=>{ setSheet(false); setAvOk(false); setAvAmt(""); }}>Yopish</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="twa-n">
            {[
              { id:"home", ico:"⌂", l:"Bosh" },
              { id:"sal",  ico:"₿", l:"Maosh" },
              { id:"ord",  ico:"≡", l:"Buyurtma" },
              { id:"ldsp", ico:"▦", l:"Material" },
            ].map(n => (
              <button key={n.id} className={`twa-nb${pg===n.id?" ac":""}`} onClick={()=>setPg(n.id)}>
                <span style={{ fontSize:18 }}>{n.ico}</span>
                <span>{n.l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════ APP ════════════════════════ */
export default function App() {
  const [pg, setPg] = useState("dash");
  const [col, setCol] = useState(false);
  const [twa, setTwa] = useState(false);

  const PAGES = {
    dash:   <Dashboard setPg={setPg} />,
    salary: <Salary />,
    ldsp:   <LDSP />,
    orders: <Orders />,
    merger: <Merger />,
    users:  <Users />,
  };

  return (
    <div className="root">
      <style>{CSS}</style>
      <Sidebar pg={pg} setPg={setPg} col={col} setCol={setCol} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Topbar pg={pg} onTWA={() => setTwa(true)} />
        <div className="ms">{PAGES[pg]}</div>
      </div>
      {twa && <TWA onClose={() => setTwa(false)} />}
    </div>
  );
}
