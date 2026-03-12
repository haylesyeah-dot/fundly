import { useState } from "react";
import { LayoutGrid, Calculator, TrendingUp, Eye, CheckCircle, Plus, X, ExternalLink, Linkedin } from "lucide-react";

const initialDeals = [
  { id: 1,  Company: "Hypermindz", Founders: "Mano Pillai", URL: "https://www.hypermindz.ai/", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" },
  { id: 2,  Company: "Panova", Founders: "Devin Guan", URL: "https://panova.ai/", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" },
  { id: 3,  Company: "Anoki", Founders: "Raghu Kodige", URL: "https://www.anoki.ai/", Stage: "Pre-Seed", InvestmentStatus: "Invested", DiscussionStatus: "Active" },
  { id: 4,  Company: "Samvid", Founders: "Ram Bala", URL: "", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" },
  { id: 5,  Company: "Geminus", Founders: "Karthik Duraisamy", URL: "https://www.geminus.ai/", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" },
  { id: 6,  Company: "Aperiam Fund", Founders: "Joe Zawadzki", URL: "https://www.aperiam.vc", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" },
  { id: 7,  Company: "Deepak Agarwal's NewCo in AI", Founders: "Deepak Agarwal", URL: "", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" },
  { id: 8,  Company: "Srikanth Deshpande's NewCo in AI", Founders: "Srikanth Deshpande", URL: "", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" },
  { id: 9,  Company: "Prithvi's NewCo in AI", Founders: "", URL: "", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" },
  { id: 10, Company: "Scope3", Founders: "Brian O'Kelley", URL: "https://scope3.com/", Stage: "Pre-Seed", InvestmentStatus: "Invested", DiscussionStatus: "Active" },
  { id: 11, Company: "Rill Data", Founders: "Michael Driscoll", URL: "https://www.rilldata.com/", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" },
  { id: 12, Company: "Bluemoon VC", Founders: "Ben Orthlieb", URL: "https://www.blue-moon.vc/", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" },
  { id: 13, Company: "Rakeis AI", Founders: "Rashmi Menon", URL: "", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Dead (needs resuscitation)" },
  { id: 14, Company: "NewCo", Founders: "Janet Chang", URL: "", Stage: "", InvestmentStatus: "", DiscussionStatus: "Dead (needs resuscitation)" },
  { id: 15, Company: "Foothill Ventures", Founders: "Xuhui, Eric Rosenblum", URL: "", Stage: "", InvestmentStatus: "", DiscussionStatus: "" },
  { id: 16, Company: "Aliveo AI", Founders: "Shaunak", URL: "https://www.aliveo.ai/", Stage: "", InvestmentStatus: "", DiscussionStatus: "" },
  { id: 17, Company: "Koireader", Founders: "Ashutosh Prasad", URL: "", Stage: "", InvestmentStatus: "", DiscussionStatus: "" },
];

const statusStyles = {
  "For Consideration": { bg: "#1D4ED8", text: "#fff" },
  "Invested":          { bg: "#15803D", text: "#fff" },
  "Pass":              { bg: "#B91C1C", text: "#fff" },
  "Watchlist":         { bg: "#92400E", text: "#fff" },
  "Under Review":      { bg: "#6D28D9", text: "#fff" },
};
const discussionStyles = {
  "Active":                     { bg: "#15803D", text: "#fff" },
  "Dead (needs resuscitation)": { bg: "#B91C1C", text: "#fff" },
  "First Call Done":            { bg: "#1D4ED8", text: "#fff" },
  "Term Sheet Pending":         { bg: "#065F46", text: "#fff" },
  "Not Started":                { bg: "#374151", text: "#fff" },
  "Closed":                     { bg: "#7F1D1D", text: "#fff" },
};

const stageStyles = {
  "Pre-Seed":  { bg: "#0C4A6E", text: "#fff" },
  "Seed":      { bg: "#164E63", text: "#fff" },
  "Series A":  { bg: "#1E3A5F", text: "#fff" },
  "Series B":  { bg: "#1e1b4b", text: "#fff" },
  "Series C+": { bg: "#1a1a2e", text: "#fff" },
};

const Badge = ({ label, map }) => {
  if (!label) return <span style={{ color: "#D1D5DB" }}>—</span>;
  const c = map[label] || { bg: "#374151", text: "#fff" };
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: "0.02em", display: "inline-block" }}>
      {label}
    </span>
  );
};

const FounderLinks = ({ founders }) => {
  if (!founders) return <span style={{ color: "#D1D5DB" }}>—</span>;
  const names = founders.split(",").map(n => n.trim()).filter(Boolean);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {names.map(name => (
        <a key={name}
          href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}`}
          target="_blank" rel="noreferrer"
          style={{ color: "#0A66C2", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 5, fontWeight: 500 }}
          onMouseEnter={e => e.currentTarget.style.color = "#004182"}
          onMouseLeave={e => e.currentTarget.style.color = "#0A66C2"}
        >
          <Linkedin size={11} strokeWidth={2} /> {name}
        </a>
      ))}
    </div>
  );
};

export default function Fundly() {
  const [page, setPage] = useState("dashboard");
  const [deals, setDeals] = useState(initialDeals);
  const [showForm, setShowForm] = useState(false);
  const [newDeal, setNewDeal] = useState({ Company: "", Founders: "", URL: "", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" });
  const [investFilter, setInvestFilter] = useState("All");
  const [discussFilter, setDiscussFilter] = useState("All");
  const [fundSettings, setFundSettings] = useState({ size: 10, deployed: 2.5, irr: 25 });
  const [editingFund, setEditingFund] = useState(false);
  const industryTAM = {
    "AI / ML":    "$10B – $100B",
    "AdTech":     "$100B+",
    "MarTech":    "$10B – $100B",
    "FinTech":    "$100B+",
    "HealthTech": "$10B – $100B",
    "CleanTech":  "$10B – $100B",
    "EdTech":     "$1B – $10B",
    "Consumer":   "$10B – $100B",
    "B2B SaaS":   "$1B – $10B",
    "DeepTech":   "$1B – $10B",
    "Other":      "$1B – $10B",
  };

  const [calc, setCalc] = useState({ company: "", industry: "AI / ML", stage: "Pre-Seed", raise: 2, tam: "$10B – $100B", timing: "Early but Right Direction", founders: 7, traction: 5, moat: 6, thesis: 7, valuation: "Fair" });
  const [score, setScore] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const filtered = deals.filter(d =>
    (investFilter === "All" || d.InvestmentStatus === investFilter) &&
    (discussFilter === "All" || d.DiscussionStatus === discussFilter)
  );

  const addDeal = () => {
    if (!newDeal.Company) return;
    setDeals([...deals, { ...newDeal, id: Date.now() }]);
    setShowForm(false);
    setNewDeal({ Company: "", Founders: "", URL: "", Stage: "Pre-Seed", InvestmentStatus: "For Consideration", DiscussionStatus: "Active" });
  };

  const calculateScore = async () => {
    const tamMap = { "< $100M": 2, "$100M – $1B": 5, "$1B – $10B": 7, "$10B – $100B": 9, "$100B+": 10 };
    const timingMap = { "Too Early": 3, "Early but Right Direction": 7, "Perfect Timing": 10, "Crowded": 4, "Late": 2 };
    const valMap = { "Very Expensive": 1, "Slightly High": 4, "Fair": 6, "Attractive": 8, "Very Attractive": 10 };
    const s = (calc.founders * 0.25 + calc.traction * 0.20 + calc.moat * 0.15 + calc.thesis * 0.15 + tamMap[calc.tam] * 0.10 + timingMap[calc.timing] * 0.10 + valMap[calc.valuation] * 0.05) * 10;
    setScore(Math.round(s * 10) / 10);
    setAiInsight(null);
    setAiLoading(true);

    // Find the company URL from deal dashboard if it exists
    const matchedDeal = deals.find(d => d.Company.toLowerCase().trim() === calc.company.toLowerCase().trim());
    const companyURL = matchedDeal?.URL || "";
    const urlNote = companyURL ? `Their website is ${companyURL}.` : "No website URL is available.";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const prompt = `You are a venture capital analyst. Research the following company and industry, then give a concise investment context note.

Company: ${calc.company || "Unknown"}
Industry: ${calc.industry}
Stage: ${calc.stage}
${urlNote}

Please search the web for:
1. What this company does (if known) and any recent news
2. Current trends and sentiment in the ${calc.industry} industry for investors

Then return a JSON object (no markdown, no backticks) with exactly these fields:
{
  "companySnapshot": "2-3 sentence summary of what the company does and any notable news or signals. If unknown, say so.",
  "industryContext": "2-3 sentence summary of current investor sentiment and key trends in ${calc.industry}.",
  "investorSignal": "one sentence: is this an exciting or concerning time to invest in this space? Be direct.",
  "signalType": "positive" | "neutral" | "negative"
}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await res.json();
      const textBlock = data.content?.find(b => b.type === "text");
      if (textBlock?.text) {
        const clean = textBlock.text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        setAiInsight(parsed);
      }
    } catch (e) {
      if (e.name === "AbortError") {
        setAiInsight({ timeout: true });
      } else {
        setAiInsight({ error: true });
      }
    } finally {
      clearTimeout(timeout);
      setAiLoading(false);
    }
  };

  const getVerdict = (s) => {
    if (s >= 80) return { color: "#15803D", bg: "#15803D", label: "Strong Pass — Move Forward" };
    if (s >= 65) return { color: "#92400E", bg: "#92400E", label: "Conditional Interest" };
    if (s >= 50) return { color: "#92400E", bg: "#92400E", label: "Watchlist" };
    return { color: "#B91C1C", bg: "#B91C1C", label: "Pass" };
  };

  const breakdown = score !== null ? [
    { label: "Founder Quality", val: calc.founders * 10 },
    { label: "Traction", val: calc.traction * 10 },
    { label: "Competitive Moat", val: calc.moat * 10 },
    { label: "Strategic Fit", val: calc.thesis * 10 },
    { label: "TAM Size", val: { "< $100M": 20, "$100M – $1B": 50, "$1B – $10B": 70, "$10B – $100B": 90, "$100B+": 100 }[calc.tam] },
    { label: "Market Timing", val: { "Too Early": 30, "Early but Right Direction": 70, "Perfect Timing": 100, "Crowded": 40, "Late": 20 }[calc.timing] },
  ] : [];

  const inp = (x = {}) => ({
    background: "#EEEEED", border: "1px solid #D4D4D2", borderRadius: 8,
    color: "#111827", padding: "9px 12px", fontFamily: "'Sora', sans-serif",
    fontSize: 13, width: "100%", boxSizing: "border-box",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)", ...x
  });
  const lbl = { fontSize: 11, color: "#6B7280", letterSpacing: "0.02em", marginBottom: 5, display: "block", fontWeight: 500 };

  const allStatuses = [...new Set(deals.map(d => d.InvestmentStatus).filter(Boolean))];
  const allDiscuss  = [...new Set(deals.map(d => d.DiscussionStatus).filter(Boolean))];

  const metrics = [
    { label: "Total Companies",    icon: <LayoutGrid size={16} />, val: deals.length, color: "#4F46E5" },
    { label: "Invested",           icon: <CheckCircle size={16} />, val: deals.filter(d => d.InvestmentStatus === "Invested").length, color: "#15803D" },
    { label: "For Consideration",  icon: <TrendingUp size={16} />, val: deals.filter(d => d.InvestmentStatus === "For Consideration").length, color: "#1D4ED8" },
    { label: "Active Discussions", icon: <Eye size={16} />, val: deals.filter(d => d.DiscussionStatus === "Active").length, color: "#0369A1" },
  ];

  // Column widths — give Stage and badges more breathing room
  const colWidths = ["18%", "14%", "14%", "10%", "17%", "20%", "3%"];

  return (
    <div style={{ background: "transparent", minHeight: "100vh", display: "flex", fontFamily: "'Sora', sans-serif", color: "#111827" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus { outline: none !important; border-color: #4F46E5 !important; box-shadow: 0 0 0 3px rgba(79,70,229,0.12) !important; }
        select option { background: #fff; color: #111827; }
        input[type=range] { accent-color: #4F46E5; cursor: pointer; width: 100%; }
        tbody tr:hover td { background: #F5F6FF !important; transition: background 0.1s; }
        body, #root { 
          background-color: #D8D8D6;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeBlend in='SourceGraphic' mode='multiply'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23noise)' opacity='0.18'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px 200px;
        }
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23g)' opacity='0.12'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 150px 150px;
          pointer-events: none;
          z-index: 0;
          mix-blend-mode: overlay;
        }
        #root { position: relative; z-index: 1; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 200, background: "#F2F2F0", borderRight: "1px solid #D4D4D2", padding: "32px 12px", flexShrink: 0 }}>
        <div style={{ padding: "0 10px", marginBottom: 40 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>Fundly</div>
          <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Venture OS</div>
        </div>

        <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, padding: "0 10px", marginBottom: 8 }}>Navigation</div>
        {[
          { id: "dashboard", label: "Deal Dashboard", icon: <LayoutGrid size={13} /> },
          { id: "calculator", label: "Investment Calculator", icon: <Calculator size={13} /> },
        ].map(p => (
          <div key={p.id} onClick={() => setPage(p.id)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 10px",
            borderRadius: 8, marginBottom: 2, cursor: "pointer",
            background: page === p.id ? "#EEF2FF" : "transparent",
            color: page === p.id ? "#4F46E5" : "#6B7280",
            fontWeight: page === p.id ? 600 : 400, fontSize: 12,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            <span style={{ flexShrink: 0 }}>{p.icon}</span> {p.label}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Top bar */}
        <div style={{ background: "#F2F2F0", borderBottom: "1px solid #D4D4D2", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
              {page === "dashboard" ? "Deal Dashboard" : "Investment Calculator"}
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              {page === "dashboard" ? "Track and manage your investment pipeline" : "Score opportunities across key dimensions"}
            </div>
          </div>
          {page === "dashboard" && (
            <button onClick={() => setShowForm(!showForm)} style={{
              background: "#4F46E5", color: "#fff", border: "none", borderRadius: 8,
              padding: "9px 18px", cursor: "pointer", fontSize: 13, fontFamily: "'Sora', sans-serif",
              fontWeight: 600, display: "flex", alignItems: "center", gap: 7,
              boxShadow: "0 1px 3px rgba(79,70,229,0.4)"
            }}>
              <Plus size={14} /> Add Company
            </button>
          )}
        </div>

        <div style={{ padding: "32px 40px" }}>

          {/* ── DASHBOARD ── */}
          {page === "dashboard" && (
            <>
              {/* Fund Header Banner */}
              {(() => {
                const remaining = fundSettings.size - fundSettings.deployed;
                const deployedPct = Math.min(100, Math.round((fundSettings.deployed / fundSettings.size) * 100));
                const numInvested = deals.filter(d => d.InvestmentStatus === "Invested").length;
                return (
                  <div style={{ background: "#1E1E2E", borderRadius: 14, padding: "24px 28px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 10, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 4 }}>Fund Overview</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em" }}>${fundSettings.size}M Fund</div>
                      </div>
                      <button onClick={() => setEditingFund(!editingFund)} style={{ background: "#2E2E42", color: "#9CA3C8", border: "1px solid #3E3E58", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 11, fontFamily: "'Sora', sans-serif", fontWeight: 600, letterSpacing: "0.04em" }}>
                        {editingFund ? "Done" : "Edit"}
                      </button>
                    </div>

                    {editingFund ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 4 }}>
                        {[["Fund Size ($M)", "size"], ["Capital Deployed ($M)", "deployed"], ["Target IRR (%)", "irr"]].map(([label, key]) => (
                          <div key={key}>
                            <div style={{ fontSize: 10, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 600 }}>{label}</div>
                            <input
                              type="number"
                              value={fundSettings[key]}
                              onChange={e => setFundSettings({ ...fundSettings, [key]: parseFloat(e.target.value) || 0 })}
                              style={{ background: "#2E2E42", border: "1px solid #3E3E58", borderRadius: 7, color: "#FFFFFF", padding: "8px 12px", fontFamily: "'Sora', sans-serif", fontSize: 13, width: "100%" }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
                        {[
                          { label: "Fund Size", value: `$${fundSettings.size}M` },
                          { label: "Deployed", value: `$${fundSettings.deployed}M` },
                          { label: "Remaining", value: `$${remaining.toFixed(1)}M` },
                          { label: "Investments", value: numInvested },
                          { label: "Target IRR", value: `${fundSettings.irr}%` },
                        ].map((item, i) => (
                          <div key={item.label} style={{ borderLeft: i > 0 ? "1px solid #2E2E42" : "none", paddingLeft: i > 0 ? 20 : 0 }}>
                            <div style={{ fontSize: 10, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 6 }}>{item.label}</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: item.label === "Remaining" ? "#6EE7A0" : item.label === "Target IRR" ? "#A78BFA" : "#FFFFFF", letterSpacing: "-0.02em" }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Deployment progress bar */}
                    {!editingFund && (
                      <div style={{ marginTop: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <div style={{ fontSize: 10, color: "#6B6B8A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Capital Deployment</div>
                          <div style={{ fontSize: 10, color: "#9CA3C8", fontWeight: 600 }}>{deployedPct}% deployed</div>
                        </div>
                        <div style={{ background: "#2E2E42", borderRadius: 6, height: 6 }}>
                          <div style={{ background: "linear-gradient(90deg, #6366F1, #8B5CF6)", width: `${deployedPct}%`, height: 6, borderRadius: 6, transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
                {metrics.map(m => (
                  <div key={m.label} style={{ background: "#F7F7F5", border: "1px solid #D4D4D2", borderRadius: 12, padding: "20px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ background: m.color, borderRadius: 8, padding: 8, color: "#fff", width: "fit-content", marginBottom: 14 }}>{m.icon}</div>
                    <div style={{ fontSize: 30, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{m.val}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                <select style={inp({ width: "auto", fontSize: 12 })} value={investFilter} onChange={e => setInvestFilter(e.target.value)}>
                  <option value="All">All Investment Statuses</option>
                  {allStatuses.map(s => <option key={s}>{s}</option>)}
                </select>
                <select style={inp({ width: "auto", fontSize: 12 })} value={discussFilter} onChange={e => setDiscussFilter(e.target.value)}>
                  <option value="All">All Discussion Statuses</option>
                  {allDiscuss.map(s => <option key={s}>{s}</option>)}
                </select>
                <div style={{ marginLeft: "auto", fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>{filtered.length} companies</div>
              </div>

              {/* Add form */}
              {showForm && (
                <div style={{ background: "#F7F7F5", border: "1px solid #D4D4D2", borderRadius: 12, padding: 22, marginBottom: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 14 }}>New Company</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                    {[["Company", "Company Name"], ["Founders", "Founders (comma separated)"], ["URL", "Website URL"]].map(([k, pl]) => (
                      <div key={k}><span style={lbl}>{pl}</span><input style={inp({})} placeholder={pl} value={newDeal[k]} onChange={e => setNewDeal({ ...newDeal, [k]: e.target.value })} /></div>
                    ))}
                    {[
                      ["Stage", ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"]],
                      ["InvestmentStatus", ["For Consideration", "Invested", "Pass", "Watchlist", "Under Review"]],
                      ["DiscussionStatus", ["Active", "Not Started", "First Call Done", "Term Sheet Pending", "Closed", "Dead (needs resuscitation)"]],
                    ].map(([k, opts]) => (
                      <div key={k}><span style={lbl}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <select style={inp({})} value={newDeal[k]} onChange={e => setNewDeal({ ...newDeal, [k]: e.target.value })}>
                          {opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={addDeal} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>Save Company</button>
                    <button onClick={() => setShowForm(false)} style={{ background: "#F9FAFB", color: "#6B7280", border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "'Sora', sans-serif" }}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div style={{ background: "#F7F7F5", border: "1px solid #D4D4D2", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
                  <colgroup>
                    {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
                  </colgroup>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #D4D4D2", background: "#EBEBEA" }}>
                      {["Company", "Founders", "Website", "Stage", "Investment Status", "Discussion Status", ""].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6B7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Sora', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d, i) => (
                      <tr key={d.id} style={{ borderBottom: "1px solid #E8E8E6", background: i % 2 === 0 ? "#F7F7F5" : "#F2F2F0" }}>
                        <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.Company}</td>
                        <td style={{ padding: "14px 16px" }}><FounderLinks founders={d.Founders} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          {d.URL
                            ? <a href={d.URL} target="_blank" rel="noreferrer" style={{ color: "#4F46E5", fontSize: 12, display: "flex", alignItems: "center", gap: 4, textDecoration: "none", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {d.URL.replace(/https?:\/\//, "").replace(/\/$/, "")} <ExternalLink size={10} style={{ flexShrink: 0 }} />
                              </a>
                            : <span style={{ color: "#D1D5DB", fontSize: 12 }}>—</span>}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <Badge label={d.Stage} map={stageStyles} />
                        </td>
                        <td style={{ padding: "14px 16px" }}><Badge label={d.InvestmentStatus} map={statusStyles} /></td>
                        <td style={{ padding: "14px 16px" }}><Badge label={d.DiscussionStatus} map={discussionStyles} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          <span onClick={() => setDeals(deals.filter(x => x.id !== d.id))}
                            style={{ color: "#D1D5DB", cursor: "pointer", display: "flex" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#EF4444"}
                            onMouseLeave={e => e.currentTarget.style.color = "#D1D5DB"}>
                            <X size={14} />
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No companies match your filters</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── CALCULATOR ── */}
          {page === "calculator" && (
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24 }}>
              <div style={{ background: "#F7F7F5", border: "1px solid #D4D4D2", borderRadius: 14, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                {[
                  ["Company Info", <>
                    <div style={{ marginBottom: 14 }}>
                      <span style={lbl}>Company Name</span>
                      <input style={inp({})} placeholder="e.g. Anoki" value={calc.company} onChange={e => setCalc({ ...calc, company: e.target.value })} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                      <div><span style={lbl}>Industry</span>
                        <select style={inp({})} value={calc.industry} onChange={e => setCalc({ ...calc, industry: e.target.value, tam: industryTAM[e.target.value] || "$1B – $10B" })}>
                          {["AI / ML", "AdTech", "MarTech", "FinTech", "HealthTech", "CleanTech", "EdTech", "Consumer", "B2B SaaS", "DeepTech", "Other"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div><span style={lbl}>Stage</span>
                        <select style={inp({})} value={calc.stage} onChange={e => setCalc({ ...calc, stage: e.target.value })}>
                          {["Pre-Seed", "Seed", "Series A", "Series B"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={lbl}>Amount Raising</span><span style={{ fontSize: 12, color: "#4F46E5", fontWeight: 700 }}>${calc.raise}M</span></div>
                      <input type="range" min="0.5" max="50" step="0.5" value={calc.raise} onChange={e => setCalc({ ...calc, raise: parseFloat(e.target.value) })} />
                    </div>
                  </>],
                  ["Market", <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div><span style={lbl}>TAM Size <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— auto-set by industry</span></span>
                        <select style={inp({})} value={calc.tam} onChange={e => setCalc({ ...calc, tam: e.target.value })}>
                          {["< $100M", "$100M – $1B", "$1B – $10B", "$10B – $100B", "$100B+"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div><span style={lbl}>Market Timing</span>
                        <select style={inp({})} value={calc.timing} onChange={e => setCalc({ ...calc, timing: e.target.value })}>
                          {["Too Early", "Early but Right Direction", "Perfect Timing", "Crowded", "Late"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                  </>],
                  ["Team & Traction", <>
                    {[["founders", "Founder Quality"], ["traction", "Traction"], ["moat", "Competitive Moat"], ["thesis", "Strategic Fit"]].map(([k, l]) => (
                      <div key={k} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={lbl}>{l}</span><span style={{ fontSize: 12, color: "#4F46E5", fontWeight: 700 }}>{calc[k]}/10</span></div>
                        <input type="range" min="1" max="10" value={calc[k]} onChange={e => setCalc({ ...calc, [k]: parseInt(e.target.value) })} />
                      </div>
                    ))}
                  </>],
                  ["Valuation", <>
                    <select style={inp({})} value={calc.valuation} onChange={e => setCalc({ ...calc, valuation: e.target.value })}>
                      {["Very Expensive", "Slightly High", "Fair", "Attractive", "Very Attractive"].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <div style={{ marginTop: 8, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 7, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4 }}>What is Valuation Fairness?</div>
                      <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.6 }}>
                        Given what the company is asking you to invest at, does the price make sense relative to their stage and traction?
                        <br />
                        <span style={{ color: "#9CA3AF", marginTop: 4, display: "block" }}>
                          <strong style={{ color: "#6B7280" }}>Very Expensive</strong> — valuation far exceeds fundamentals<br />
                          <strong style={{ color: "#6B7280" }}>Fair</strong> — priced in line with stage and traction<br />
                          <strong style={{ color: "#6B7280" }}>Very Attractive</strong> — strong upside relative to ask
                        </span>
                      </div>
                    </div>
                  </>],
                ].map(([section, content]) => (
                  <div key={section} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #F3F4F6" }}>{section}</div>
                    {content}
                  </div>
                ))}

                <button onClick={calculateScore} style={{ width: "100%", background: "#4F46E5", color: "#fff", border: "none", borderRadius: 9, padding: "12px", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "'Sora', sans-serif", boxShadow: "0 2px 6px rgba(79,70,229,0.4)", marginTop: 4 }}>
                  Calculate Score
                </button>
              </div>

              <div>
                {score !== null ? (() => {
                  const v = getVerdict(score);
                  return (
                    <>
                      <div style={{ background: "#F7F7F5", border: "1px solid #D4D4D2", borderRadius: 14, padding: "40px 32px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: 600 }}>{calc.company || "Company"}</div>
                        <div style={{ fontSize: 84, fontWeight: 800, color: v.color, lineHeight: 1, letterSpacing: "-0.04em" }}>{score}</div>
                        <div style={{ color: "#9CA3AF", fontSize: 13, marginTop: 6 }}>out of 100</div>
                        <div style={{ background: v.bg, borderRadius: 8, padding: "10px 20px", marginTop: 20, display: "inline-block" }}>
                          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{v.label}</span>
                        </div>
                      </div>
                      <div style={{ background: "#F7F7F5", border: "1px solid #D4D4D2", borderRadius: 14, padding: 24, marginTop: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Score Breakdown</div>
                        {breakdown.map(b => {
                          const bc = b.val >= 70 ? "#15803D" : b.val >= 50 ? "#92400E" : "#B91C1C";
                          return (
                            <div key={b.label} style={{ marginBottom: 14 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#374151", marginBottom: 6 }}>
                                <span>{b.label}</span>
                                <span style={{ color: bc, fontWeight: 700 }}>{b.val}</span>
                              </div>
                              <div style={{ background: "#E4E4E2", borderRadius: 4, height: 6 }}>
                                <div style={{ background: bc, width: `${b.val}%`, height: 6, borderRadius: 4, transition: "width 0.6s ease" }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* AI Research Panel */}
                      <div style={{ background: "#F7F7F5", border: "1px solid #D4D4D2", borderRadius: 14, padding: 24, marginTop: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                          <div style={{ background: "#4F46E5", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Research</div>
                        </div>

                        {aiLoading && (
                          <div style={{ textAlign: "center", padding: "20px 0" }}>
                            <div style={{ display: "inline-block", width: 20, height: 20, border: "2px solid #E5E7EB", borderTopColor: "#4F46E5", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10 }}>Researching {calc.company || "this company"} and the {calc.industry} industry...</div>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                          </div>
                        )}

                        {!aiLoading && aiInsight && !aiInsight.error && !aiInsight.timeout && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Company Snapshot</div>
                              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{aiInsight.companySnapshot}</div>
                            </div>
                            <div style={{ height: 1, background: "#F3F4F6" }} />
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Industry Context</div>
                              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{aiInsight.industryContext}</div>
                            </div>
                            <div style={{ height: 1, background: "#F3F4F6" }} />
                            <div style={{
                              background: aiInsight.signalType === "positive" ? "#EDFAF3" : aiInsight.signalType === "negative" ? "#FEF2F2" : "#F9FAFB",
                              border: `1px solid ${aiInsight.signalType === "positive" ? "#A8DFC0" : aiInsight.signalType === "negative" ? "#FCA5A5" : "#E5E7EB"}`,
                              borderRadius: 8, padding: "10px 14px"
                            }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Investor Signal</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: aiInsight.signalType === "positive" ? "#15803D" : aiInsight.signalType === "negative" ? "#B91C1C" : "#374151", lineHeight: 1.5 }}>{aiInsight.investorSignal}</div>
                            </div>
                          </div>
                        )}

                        {!aiLoading && (aiInsight?.error || aiInsight?.timeout) && (
                          <div style={{ textAlign: "center", padding: "16px 0" }}>
                            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
                              {aiInsight?.timeout
                                ? "Research timed out — web search can be slow. Try again."
                                : "Could not load research. Check your connection and try again."}
                            </div>
                            <button
                              onClick={() => { setAiInsight(null); calculateScore(); }}
                              style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 7, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
                              Retry Research
                            </button>
                          </div>
                        )}

                        {!aiLoading && !aiInsight && (
                          <div style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "12px 0" }}>Research will appear here after scoring.</div>
                        )}
                      </div>
                    </>
                  );
                })() : (
                  <div style={{ background: "#F7F7F5", border: "1px solid #D4D4D2", borderRadius: 14, padding: 64, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ background: "#4F46E5", borderRadius: 12, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <Calculator size={22} color="#fff" />
                    </div>
                    <div style={{ color: "#374151", fontSize: 14, fontWeight: 600 }}>Fill in the details</div>
                    <div style={{ color: "#9CA3AF", fontSize: 13, marginTop: 4 }}>Hit Calculate Score to see results</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
