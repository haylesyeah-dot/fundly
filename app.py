import streamlit as st
import pandas as pd
import requests
import json
from urllib.parse import quote

st.set_page_config(page_title="Fundly", page_icon="💼", layout="wide")

# ── Styling ───────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

html, body, [class*="css"] {
    font-family: 'Sora', sans-serif !important;
    background-color: #D8D8D6;
    color: #111827;
}

.stApp {
    background-color: #D8D8D6;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23noise)' opacity='0.18'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px 200px;
}

section[data-testid="stSidebar"] {
    background-color: #F2F2F0 !important;
    border-right: 1px solid #D4D4D2;
}

section[data-testid="stSidebar"] .stRadio label {
    font-family: 'Sora', sans-serif !important;
}

.fund-banner {
    background: #1E1E2E;
    border-radius: 14px;
    padding: 24px 28px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.fund-metric-label {
    font-size: 10px;
    color: #6B6B8A;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    margin-bottom: 4px;
}
.fund-metric-value {
    font-size: 22px;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: -0.02em;
}
.fund-metric-value.green { color: #6EE7A0; }
.fund-metric-value.purple { color: #A78BFA; }

.metric-card {
    background: #F7F7F5;
    border: 1px solid #D4D4D2;
    border-radius: 12px;
    padding: 20px 22px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.metric-icon { margin-bottom: 14px; }
.metric-value { font-size: 30px; font-weight: 700; color: #111827; line-height: 1; }
.metric-label { font-size: 12px; color: #6B7280; margin-top: 6px; }

.badge {
    border-radius: 5px;
    padding: 3px 9px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    display: inline-block;
}
.badge-consideration { background: #1D4ED8; color: #fff; }
.badge-invested { background: #15803D; color: #fff; }
.badge-pass { background: #B91C1C; color: #fff; }
.badge-watchlist { background: #92400E; color: #fff; }
.badge-review { background: #6D28D9; color: #fff; }
.badge-active { background: #15803D; color: #fff; }
.badge-dead { background: #B91C1C; color: #fff; }
.badge-firstcall { background: #1D4ED8; color: #fff; }
.badge-termsheet { background: #065F46; color: #fff; }
.badge-notstarted { background: #374151; color: #fff; }
.badge-closed { background: #7F1D1D; color: #fff; }
.badge-stage { background: #1E3A5F; color: #fff; }

.stButton > button {
    background: #4F46E5 !important;
    color: #fff !important;
    border: none !important;
    border-radius: 8px !important;
    font-family: 'Sora', sans-serif !important;
    font-weight: 600 !important;
    box-shadow: 0 1px 3px rgba(79,70,229,0.4) !important;
}
.stButton > button:hover { background: #4338CA !important; }

.score-card {
    background: #F7F7F5;
    border: 1px solid #D4D4D2;
    border-radius: 14px;
    padding: 36px 28px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.score-number { font-size: 80px; font-weight: 800; line-height: 1; letter-spacing: -0.04em; }
.score-sublabel { color: #9CA3AF; font-size: 13px; margin-top: 6px; }

.breakdown-card {
    background: #F7F7F5;
    border: 1px solid #D4D4D2;
    border-radius: 14px;
    padding: 24px;
    margin-top: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.ai-card {
    background: #F7F7F5;
    border: 1px solid #D4D4D2;
    border-radius: 14px;
    padding: 24px;
    margin-top: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.valuation-hint {
    background: #EBEBEA;
    border: 1px solid #D4D4D2;
    border-radius: 7px;
    padding: 10px 12px;
    margin-top: 8px;
    font-size: 12px;
    color: #6B7280;
    line-height: 1.6;
}

div[data-testid="stSelectbox"] label,
div[data-testid="stSlider"] label,
div[data-testid="stNumberInput"] label,
div[data-testid="stTextInput"] label {
    font-family: 'Sora', sans-serif !important;
    font-size: 11px !important;
    color: #6B7280 !important;
    font-weight: 500 !important;
}

.stDataFrame { border-radius: 12px; overflow: hidden; }
.stTabs [data-baseweb="tab"] { font-family: 'Sora', sans-serif; font-size: 13px; }
.stTabs [aria-selected="true"] { color: #4F46E5 !important; }
.stTabs [data-baseweb="tab-border"] { background-color: #4F46E5 !important; }
</style>
""", unsafe_allow_html=True)

# ── Google Sheets (optional) ──────────────────────────────────────────────────
COLUMNS = ["Company", "Founders", "Company URL", "Stage", "Investment Status", "Discussion Status"]

def try_connect_sheets():
    try:
        import gspread
        from google.oauth2.service_account import Credentials
        SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
        creds = Credentials.from_service_account_info(st.secrets["gcp_service_account"], scopes=SCOPES)
        client = gspread.authorize(creds)
        return client.open(st.secrets["sheet_name"]).sheet1
    except:
        return None

def load_sheet(sheet):
    records = sheet.get_all_records()
    return pd.DataFrame(records) if records else pd.DataFrame(columns=COLUMNS)

def save_sheet(sheet, df):
    sheet.clear()
    sheet.update([df.columns.tolist()] + df.fillna("").values.tolist())

# ── Session state ─────────────────────────────────────────────────────────────
if "deal_data" not in st.session_state:
    st.session_state.deal_data = pd.DataFrame([
        {"Company": "Anoki", "Founders": "Raghu Kodige", "Company URL": "https://www.anoki.ai/", "Stage": "Pre-Seed", "Investment Status": "Invested", "Discussion Status": "Active"},
        {"Company": "Scope3", "Founders": "Brian O'Kelley", "Company URL": "https://scope3.com/", "Stage": "Pre-Seed", "Investment Status": "Invested", "Discussion Status": "Active"},
        {"Company": "Hypermindz", "Founders": "Mano Pillai", "Company URL": "https://www.hypermindz.ai/", "Stage": "Pre-Seed", "Investment Status": "For Consideration", "Discussion Status": "Active"},
    ])
if "fund" not in st.session_state:
    st.session_state.fund = {"size": 10.0, "deployed": 2.5, "irr": 25.0}

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### Fundly")
    st.caption("VENTURE OS")
    st.divider()
    page = st.radio("", ["Deal Dashboard", "Investment Calculator"], label_visibility="collapsed")

# ── Industry → TAM mapping ────────────────────────────────────────────────────
INDUSTRY_TAM = {
    "AI / ML": "$10B – $100B", "AdTech": "$100B+", "MarTech": "$10B – $100B",
    "FinTech": "$100B+", "HealthTech": "$10B – $100B", "CleanTech": "$10B – $100B",
    "EdTech": "$1B – $10B", "Consumer": "$10B – $100B", "B2B SaaS": "$1B – $10B",
    "DeepTech": "$1B – $10B", "Other": "$1B – $10B",
}
INDUSTRIES = list(INDUSTRY_TAM.keys())
TAM_OPTIONS = ["< $100M", "$100M – $1B", "$1B – $10B", "$10B – $100B", "$100B+"]
TAM_SCORES = {"< $100M": 2, "$100M – $1B": 5, "$1B – $10B": 7, "$10B – $100B": 9, "$100B+": 10}

def status_badge(label, kind="invest"):
    mapping = {
        "For Consideration": "badge-consideration",
        "Invested": "badge-invested",
        "Pass": "badge-pass",
        "Watchlist": "badge-watchlist",
        "Under Review": "badge-review",
        "Active": "badge-active",
        "Dead (needs resuscitation)": "badge-dead",
        "First Call Done": "badge-firstcall",
        "Term Sheet Pending": "badge-termsheet",
        "Not Started": "badge-notstarted",
        "Closed": "badge-closed",
    }
    cls = mapping.get(label, "badge-notstarted")
    return f'<span class="badge {cls}">{label}</span>' if label else "—"

def linkedin_link(name):
    url = f"https://www.linkedin.com/search/results/people/?keywords={quote(name)}"
    return f'<a href="{url}" target="_blank" style="color:#0A66C2;text-decoration:none;font-size:12px;font-weight:500;">{name}</a>'

# ══════════════════════════════════════════════════════════════════════════════
# DEAL DASHBOARD
# ══════════════════════════════════════════════════════════════════════════════
if page == "Deal Dashboard":
    df = st.session_state.deal_data
    sheet = try_connect_sheets()

    # ── Fund Banner ───────────────────────────────────────────────────────────
    f = st.session_state.fund
    remaining = f["size"] - f["deployed"]
    deployed_pct = min(100, round((f["deployed"] / f["size"]) * 100)) if f["size"] > 0 else 0
    num_invested = len(df[df["Investment Status"] == "Invested"]) if "Investment Status" in df.columns else 0

    st.markdown(f"""
    <div class="fund-banner">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
            <div>
                <div class="fund-metric-label">Fund Overview</div>
                <div style="font-size:22px; font-weight:700; color:#fff; letter-spacing:-0.02em;">${f['size']}M Fund</div>
            </div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:0;">
            <div>
                <div class="fund-metric-label">Fund Size</div>
                <div class="fund-metric-value">${f['size']}M</div>
            </div>
            <div style="border-left:1px solid #2E2E42; padding-left:20px;">
                <div class="fund-metric-label">Deployed</div>
                <div class="fund-metric-value">${f['deployed']}M</div>
            </div>
            <div style="border-left:1px solid #2E2E42; padding-left:20px;">
                <div class="fund-metric-label">Remaining</div>
                <div class="fund-metric-value green">${remaining:.1f}M</div>
            </div>
            <div style="border-left:1px solid #2E2E42; padding-left:20px;">
                <div class="fund-metric-label">Investments</div>
                <div class="fund-metric-value">{num_invested}</div>
            </div>
            <div style="border-left:1px solid #2E2E42; padding-left:20px;">
                <div class="fund-metric-label">Target IRR</div>
                <div class="fund-metric-value purple">{f['irr']}%</div>
            </div>
        </div>
        <div style="margin-top:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span style="font-size:10px; color:#6B6B8A; font-weight:600; text-transform:uppercase; letter-spacing:0.08em;">Capital Deployment</span>
                <span style="font-size:10px; color:#9CA3C8; font-weight:600;">{deployed_pct}% deployed</span>
            </div>
            <div style="background:#2E2E42; border-radius:6px; height:6px;">
                <div style="background:linear-gradient(90deg,#6366F1,#8B5CF6); width:{deployed_pct}%; height:6px; border-radius:6px;"></div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    with st.expander("Edit Fund Settings"):
        col1, col2, col3 = st.columns(3)
        with col1:
            st.session_state.fund["size"] = st.number_input("Fund Size ($M)", value=f["size"], min_value=0.1, step=0.5)
        with col2:
            st.session_state.fund["deployed"] = st.number_input("Capital Deployed ($M)", value=f["deployed"], min_value=0.0, step=0.5)
        with col3:
            st.session_state.fund["irr"] = st.number_input("Target IRR (%)", value=f["irr"], min_value=0.0, step=1.0)

    # ── Excel upload ──────────────────────────────────────────────────────────
    with st.expander("Import from Excel"):
        uploaded = st.file_uploader("Upload your deal spreadsheet", type=["xlsx", "xls", "csv"])
        if uploaded:
            try:
                raw = pd.read_csv(uploaded) if uploaded.name.endswith(".csv") else pd.read_excel(uploaded)
                raw.columns = [c.strip() for c in raw.columns]
                col_map = {}
                for col in COLUMNS:
                    matches = [c for c in raw.columns if col.lower().replace(" ", "") in c.lower().replace(" ", "")]
                    if matches:
                        col_map[matches[0]] = col
                imported = raw.rename(columns=col_map)
                valid_cols = [c for c in COLUMNS if c in imported.columns]
                imported = imported[valid_cols]
                st.dataframe(imported, use_container_width=True)
                if st.button("Load into Dashboard"):
                    st.session_state.deal_data = imported
                    if sheet:
                        save_sheet(sheet, imported)
                    st.success("Loaded!")
                    st.rerun()
            except Exception as e:
                st.error(f"Could not read file: {e}")

    # ── Metrics ───────────────────────────────────────────────────────────────
    total = len(df)
    active = len(df[df["Investment Status"] == "Active Interest"]) if "Investment Status" in df.columns else 0
    invested = len(df[df["Investment Status"] == "Invested"]) if "Investment Status" in df.columns else 0
    consideration = len(df[df["Investment Status"] == "For Consideration"]) if "Investment Status" in df.columns else 0

    c1, c2, c3, c4 = st.columns(4)
    for col, val, label in zip(
        [c1, c2, c3, c4],
        [total, invested, consideration, len(df[df["Discussion Status"] == "Active"]) if "Discussion Status" in df.columns else 0],
        ["Total Companies", "Invested", "For Consideration", "Active Discussions"]
    ):
        with col:
            st.markdown(f"""<div class="metric-card">
                <div class="metric-value">{val}</div>
                <div class="metric-label">{label}</div>
            </div>""", unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # ── Filters ───────────────────────────────────────────────────────────────
    cf1, cf2, cf3 = st.columns(3)
    statuses = df["Investment Status"].dropna().unique().tolist() if "Investment Status" in df.columns else []
    discussions = df["Discussion Status"].dropna().unique().tolist() if "Discussion Status" in df.columns else []
    stages = df["Stage"].dropna().unique().tolist() if "Stage" in df.columns else []

    with cf1:
        status_f = st.multiselect("Investment Status", statuses)
    with cf2:
        discuss_f = st.multiselect("Discussion Status", discussions)
    with cf3:
        stage_f = st.multiselect("Stage", stages)

    filtered = df.copy()
    if status_f:
        filtered = filtered[filtered["Investment Status"].isin(status_f)]
    if discuss_f:
        filtered = filtered[filtered["Discussion Status"].isin(discuss_f)]
    if stage_f:
        filtered = filtered[filtered["Stage"].isin(stage_f)]

    # ── Table ─────────────────────────────────────────────────────────────────
    st.markdown(f"<div style='font-size:12px;color:#9CA3AF;margin-bottom:8px;'>{len(filtered)} companies</div>", unsafe_allow_html=True)

    rows_html = ""
    for i, row in filtered.iterrows():
        bg = "#F7F7F5" if i % 2 == 0 else "#F2F2F0"
        company = row.get("Company", "")
        url = row.get("Company URL", "")
        stage = row.get("Stage", "")
        inv_status = row.get("Investment Status", "")
        disc_status = row.get("Discussion Status", "")
        founders_raw = str(row.get("Founders", "")) if pd.notna(row.get("Founders", "")) else ""
        founder_names = [n.strip() for n in founders_raw.split(",") if n.strip()]
        founders_html = "<br>".join([linkedin_link(n) for n in founder_names]) if founder_names else "—"
        url_html = f'<a href="{url}" target="_blank" style="color:#4F46E5;font-size:12px;font-weight:500;text-decoration:none;">{url.replace("https://","").replace("http://","").rstrip("/")}</a>' if url else "—"
        stage_html = f'<span class="badge badge-stage">{stage}</span>' if stage else "—"
        rows_html += f"""<tr style="border-bottom:1px solid #E8E8E6;background:{bg};"><td style="padding:13px 14px;font-weight:600;color:#111827;">{company}</td><td style="padding:13px 14px;">{founders_html}</td><td style="padding:13px 14px;">{url_html}</td><td style="padding:13px 14px;">{stage_html}</td><td style="padding:13px 14px;">{status_badge(inv_status)}</td><td style="padding:13px 14px;">{status_badge(disc_status, 'discuss')}</td></tr>"""

    full_table = f"""<div style="background:#F7F7F5;border:1px solid #D4D4D2;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);"><table style="width:100%;border-collapse:collapse;font-family:'Sora',sans-serif;font-size:13px;"><thead><tr style="background:#EBEBEA;border-bottom:1px solid #D4D4D2;"><th style="padding:11px 14px;text-align:left;font-size:10px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Company</th><th style="padding:11px 14px;text-align:left;font-size:10px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Founders</th><th style="padding:11px 14px;text-align:left;font-size:10px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Website</th><th style="padding:11px 14px;text-align:left;font-size:10px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Stage</th><th style="padding:11px 14px;text-align:left;font-size:10px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Investment Status</th><th style="padding:11px 14px;text-align:left;font-size:10px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Discussion Status</th></tr></thead><tbody>{rows_html}</tbody></table></div>"""
    st.markdown(full_table, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # ── Edit + Save ───────────────────────────────────────────────────────────
    st.markdown("### Edit Pipeline")
    edited = st.data_editor(
        df,
        use_container_width=True,
        num_rows="dynamic",
        column_config={
            "Company URL": st.column_config.LinkColumn("Company URL"),
            "Stage": st.column_config.SelectboxColumn("Stage", options=["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"]),
            "Investment Status": st.column_config.SelectboxColumn("Investment Status", options=["For Consideration", "Invested", "Pass", "Watchlist", "Under Review"]),
            "Discussion Status": st.column_config.SelectboxColumn("Discussion Status", options=["Active", "Not Started", "First Call Done", "Term Sheet Pending", "Closed", "Dead (needs resuscitation)"]),
        },
        hide_index=True,
    )

    col_save, col_refresh = st.columns([1, 4])
    with col_save:
        if st.button("Save Changes"):
            st.session_state.deal_data = edited
            if sheet:
                save_sheet(sheet, edited)
                st.success("Saved to Google Sheets!")
            else:
                st.success("Saved!")

# ══════════════════════════════════════════════════════════════════════════════
# INVESTMENT CALCULATOR
# ══════════════════════════════════════════════════════════════════════════════
else:
    st.markdown("## Investment Calculator")
    st.caption("Score opportunities across key dimensions")
    st.markdown("")

    col_inputs, col_results = st.columns([1.2, 1], gap="large")

    with col_inputs:
        st.markdown("**Company Info**")
        company_name = st.text_input("Company Name", placeholder="e.g. Anoki")
        col_a, col_b = st.columns(2)
        with col_a:
            industry = st.selectbox("Industry", INDUSTRIES)
        with col_b:
            stage = st.selectbox("Stage", ["Pre-Seed", "Seed", "Series A", "Series B"])
        raise_amount = st.slider("Amount Raising ($M)", min_value=0.5, max_value=50.0, value=2.0, step=0.5)

        st.markdown("**Market**")
        default_tam = INDUSTRY_TAM.get(industry, "$1B – $10B")
        tam_index = TAM_OPTIONS.index(default_tam) if default_tam in TAM_OPTIONS else 2
        col_c, col_d = st.columns(2)
        with col_c:
            tam = st.selectbox("TAM Size (auto-set by industry)", TAM_OPTIONS, index=tam_index)
        with col_d:
            timing = st.selectbox("Market Timing", ["Too Early", "Early but Right Direction", "Perfect Timing", "Crowded", "Late"])

        st.markdown("**Team & Traction**")
        founders_score = st.slider("Founder Quality", 1, 10, 7)
        traction_score = st.slider("Traction", 1, 10, 5)
        moat_score = st.slider("Competitive Moat", 1, 10, 6)
        strategic_score = st.slider("Strategic Fit", 1, 10, 7)

        st.markdown("**Valuation**")
        valuation = st.selectbox("Valuation Fairness", ["Very Expensive", "Slightly High", "Fair", "Attractive", "Very Attractive"])
        st.markdown("""<div class="valuation-hint">
            <strong>What is Valuation Fairness?</strong><br>
            Given what the company is asking you to invest at, does the price make sense relative to their stage and traction?<br><br>
            <strong>Very Expensive</strong> — valuation far exceeds fundamentals<br>
            <strong>Fair</strong> — priced in line with stage and traction<br>
            <strong>Very Attractive</strong> — strong upside relative to ask
        </div>""", unsafe_allow_html=True)
        st.markdown("")

        calculate = st.button("Calculate Score", use_container_width=True)

    with col_results:
        if calculate:
            timing_map = {"Too Early": 3, "Early but Right Direction": 7, "Perfect Timing": 10, "Crowded": 4, "Late": 2}
            val_map = {"Very Expensive": 1, "Slightly High": 4, "Fair": 6, "Attractive": 8, "Very Attractive": 10}

            score = (
                founders_score * 0.25 + traction_score * 0.20 + moat_score * 0.15 +
                strategic_score * 0.15 + TAM_SCORES[tam] * 0.10 +
                timing_map[timing] * 0.10 + val_map[valuation] * 0.05
            ) * 10
            score = round(score, 1)

            if score >= 80:
                color, bg, label = "#15803D", "#15803D", "Strong Pass — Move Forward"
            elif score >= 65:
                color, bg, label = "#92400E", "#92400E", "Conditional Interest"
            elif score >= 50:
                color, bg, label = "#92400E", "#92400E", "Watchlist"
            else:
                color, bg, label = "#B91C1C", "#B91C1C", "Pass"

            name_label = company_name if company_name else "Company"

            st.markdown(f"""<div class="score-card" style="border:1px solid #D4D4D2;">
                <div style="font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px;font-weight:600;">{name_label}</div>
                <div class="score-number" style="color:{color};">{score}</div>
                <div class="score-sublabel">out of 100</div>
                <div style="background:{bg};border-radius:8px;padding:10px 20px;margin-top:20px;display:inline-block;">
                    <span style="color:#fff;font-weight:700;font-size:13px;">{label}</span>
                </div>
            </div>""", unsafe_allow_html=True)

            breakdown = {
                "Founder Quality": founders_score * 10,
                "Traction": traction_score * 10,
                "Competitive Moat": moat_score * 10,
                "Strategic Fit": strategic_score * 10,
                "TAM Size": TAM_SCORES[tam] * 10,
                "Market Timing": timing_map[timing] * 10,
                "Valuation": val_map[valuation] * 10,
            }

            bd_html = ""
            for dim, val in breakdown.items():
                bc = "#15803D" if val >= 70 else "#92400E" if val >= 50 else "#B91C1C"
                bd_html += f"""<div style="margin-bottom:14px;">
                    <div style="display:flex;justify-content:space-between;font-size:13px;color:#374151;margin-bottom:6px;">
                        <span>{dim}</span><span style="color:{bc};font-weight:700;">{val}</span>
                    </div>
                    <div style="background:#E4E4E2;border-radius:4px;height:6px;">
                        <div style="background:{bc};width:{val}%;height:6px;border-radius:4px;"></div>
                    </div>
                </div>"""

            st.markdown(f"""<div class="breakdown-card">
                <div style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Score Breakdown</div>
                {bd_html}
            </div>""", unsafe_allow_html=True)

            # ── AI Research ───────────────────────────────────────────────────
            matched = next((d for d in st.session_state.deal_data.itertuples() if str(d.Company).strip().lower() == company_name.strip().lower()), None)
            company_url = getattr(matched, "Company_URL", "") or ""
            url_note = f"Their website is {company_url}." if company_url else "No website URL available."

            with st.spinner(f"Researching {company_name or 'this company'} and the {industry} industry..."):
                try:
                    prompt = f"""You are a venture capital analyst. Research the following and return ONLY a JSON object, no markdown, no backticks.

Company: {company_name or "Unknown"}
Industry: {industry}
Stage: {stage}
{url_note}

Search the web for: 1) what this company does and recent news, 2) current investor trends in {industry}.

Return exactly:
{{
  "companySnapshot": "2-3 sentences on what the company does and notable signals. If unknown say so.",
  "industryContext": "2-3 sentences on current investor sentiment and key trends in {industry}.",
  "investorSignal": "One direct sentence on whether now is an exciting or concerning time to invest here.",
  "signalType": "positive or neutral or negative"
}}"""

                    res = requests.post(
                        "https://api.anthropic.com/v1/messages",
                        headers={"Content-Type": "application/json"},
                        json={
                            "model": "claude-sonnet-4-20250514",
                            "max_tokens": 1000,
                            "tools": [{"type": "web_search_20250305", "name": "web_search"}],
                            "messages": [{"role": "user", "content": prompt}]
                        },
                        timeout=30
                    )
                    data = res.json()
                    text_block = next((b for b in data.get("content", []) if b.get("type") == "text"), None)
                    if text_block:
                        clean = text_block["text"].replace("```json", "").replace("```", "").strip()
                        insight = json.loads(clean)

                        signal_colors = {
                            "positive": ("#EDFAF3", "#A8DFC0", "#15803D"),
                            "negative": ("#FEF2F2", "#FCA5A5", "#B91C1C"),
                            "neutral":  ("#F7F7F5", "#D4D4D2", "#374151"),
                        }
                        sc = signal_colors.get(insight.get("signalType", "neutral"), signal_colors["neutral"])

                        st.markdown(f"""<div class="ai-card">
                            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
                                <div style="background:#4F46E5;border-radius:6px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                </div>
                                <div style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.08em;">AI Research</div>
                            </div>
                            <div style="font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:5px;">Company Snapshot</div>
                            <div style="font-size:13px;color:#374151;line-height:1.6;margin-bottom:14px;">{insight.get("companySnapshot","")}</div>
                            <div style="height:1px;background:#E8E8E6;margin-bottom:14px;"></div>
                            <div style="font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:5px;">Industry Context</div>
                            <div style="font-size:13px;color:#374151;line-height:1.6;margin-bottom:14px;">{insight.get("industryContext","")}</div>
                            <div style="height:1px;background:#E8E8E6;margin-bottom:14px;"></div>
                            <div style="background:{sc[0]};border:1px solid {sc[1]};border-radius:8px;padding:10px 14px;">
                                <div style="font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Investor Signal</div>
                                <div style="font-size:13px;font-weight:600;color:{sc[2]};line-height:1.5;">{insight.get("investorSignal","")}</div>
                            </div>
                        </div>""", unsafe_allow_html=True)
                except requests.Timeout:
                    st.warning("AI research timed out. Try again — web search can be slow.")
                except Exception as e:
                    st.warning("Could not load AI research. Check your connection and try again.")
        else:
            st.markdown("""<div style="background:#F7F7F5;border:1px solid #D4D4D2;border-radius:14px;padding:64px 32px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
                <div style="background:#4F46E5;border-radius:12px;width:48px;height:48px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <div style="color:#374151;font-size:14px;font-weight:600;">Fill in the details</div>
                <div style="color:#9CA3AF;font-size:13px;margin-top:4px;">Hit Calculate Score to see results</div>
            </div>""", unsafe_allow_html=True)
