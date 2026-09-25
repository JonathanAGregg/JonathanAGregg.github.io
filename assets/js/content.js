/*
 * SITE CONTENT: edit this file to change what the site says.
 * You don't need to touch index.html or main.js for normal updates.
 *
 * Search for "TODO" to find placeholders you still need to fill in.
 * Keep client names, internal metrics, and anything confidential out of here:
 * this file is public once the site is deployed.
 */
window.SITE = {
  name: "Jonathan Gregg",
  role: "Analytics Engineer",
  location: "Boston, MA",
  availability: "Available now · Boston or remote",

  email: "jonathan.a.gregg@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/jonathan-a-gregg/",
    github: "https://github.com/JonathanAGregg",
  },
  // Put your résumé in assets/files/. A PDF is best for recruiters; export one from Word.
  resume: "assets/files/Jonathan_Gregg_Resume.docx",

  hero: {
    headline: "I build metrics people can trust.",
    intro:
      "Analytics engineer with seven years of turning messy operational data into governed, tested data products, across workforce tech, SaaS, and commercial real estate.",
  },

  glance: [
    { value: "7+", label: "years in data" },
    { value: "50+", label: "governed metrics shipped" },
    { value: "44.5K", label: "production records migrated" },
    { value: "230M", label: "sq ft of portfolio analytics" },
  ],

  // Case studies. `tags` drive the filter buttons; keep them consistent.
  work: [
    {
      id: "recruiter-scorecard",
      title: "An executive scorecard that ended the headcount debate",
      org: "AdeptID",
      year: "2026",
      tags: ["Analytics engineering", "BI"],
      summary:
        "Replaced a hand-built executive workbook with a governed dbt semantic layer measuring recruiter performance against Finance's ramp targets.",
      metrics: [
        { value: "168", label: "dbt builds passing" },
        { value: "3", label: "business lines covered" },
        { value: "1", label: "agreed definition of headcount" },
      ],
      problem:
        "Leadership tracked recruiter ramp in a spreadsheet, and Finance, Operations, and brand leads each counted “on assignment” differently. The same question produced different answers depending on who built the report.",
      approach: [
        "Gathered requirements with Finance and People, then wrote the metric definitions and a decision log before writing any SQL.",
        "Standardized one headcount definition (“as of the most recently completed Saturday”), encoded it in a dbt macro, and announced it to team leads.",
        "Built segmentation, fact, weekly-snapshot, and projection models, plus Sigma views with downside, baseline, and upside scenarios.",
        "Added parity tests against the source workbook, which caught four correctness bugs, including a null-ID headcount undercount and a flipped gap sign.",
      ],
      outcome:
        "Merged to production as the executive recruiter scorecard. Every downstream report now uses the same definition.",
      stack: ["dbt", "Snowflake", "Sigma", "Dagster", "Great Expectations", "pytest"],
    },
    {
      id: "metrics-library",
      title: "One metrics library, and the history to back it",
      org: "AdeptID",
      year: "2026",
      tags: ["Analytics engineering", "Data platform"],
      summary:
        "Took a canonical library of 50+ company metrics into the warehouse, then built the point-in-time history needed to rebuild past periods.",
      metrics: [
        { value: "50+", label: "canonical metrics" },
        { value: "3", label: "snapshot grains (day / week / month)" },
        { value: "1", label: "engine for facts, baselines & targets" },
      ],
      problem:
        "Metric definitions lived in documents and spreadsheets, baselines came up empty in every warehouse view, and funnel metrics silently lost anything that entered and left within the same period.",
      approach: [
        "Designed the warehouse schema and deploy order, with access grants that re-apply themselves on every run so a dropped permission repairs itself.",
        "Moved baseline and target calculations into the same engine that computes the facts, so the warehouse and the workbook can't disagree.",
        "Built an immutable daily snapshot that stores match scores before any threshold is applied, so past dates can be re-evaluated later.",
        "Added accumulate-style weekly and monthly snapshots with idempotent, transactional writes.",
      ],
      outcome:
        "Past marketplace capacity and funnel metrics can now be rebuilt, and the monthly executive dashboard runs on governed views.",
      stack: ["Python", "Dagster", "Snowflake", "dbt", "pytest"],
    },
    {
      id: "safe-automation",
      title: "Production changes that don't wake anyone up",
      org: "AdeptID",
      year: "2026",
      tags: ["Data platform", "Automation"],
      summary:
        "Shipped event-driven AWS automation and large data migrations in a live applicant tracking system (ATS), with every change reversible.",
      metrics: [
        { value: "44.5K", label: "records migrated" },
        { value: "0", label: "failures on the 41K-record load" },
        { value: "1", label: "client canary before go-live" },
      ],
      problem:
        "New client records couldn't be used downstream until someone manually added a contact, and years of historical records needed a newly required field backfilled.",
      approach: [
        "Built an AWS Lambda that runs when a client is created, plus an hourly catch-up, because the source system delivers each event only once.",
        "Guarded against duplicates in two layers, since the source API never dedupes on create.",
        "Shipped dry-run by default, with flags per environment, a single-client canary, and a documented kill switch.",
        "During the dry run, found that 100% of new records were being skipped because of a hidden system-generated record, and fixed it before go-live.",
        "Ran migrations with allowed-value validation, an exceptions file, rollback exports, staging first, and a single-record test before every bulk update.",
      ],
      outcome:
        "Went live with no duplicate records. The 41K-record backfill completed with zero failures, and a separate 977-record update succeeded on every record.",
      stack: ["AWS Lambda", "SAM", "EventBridge", "DynamoDB", "TypeScript", "Python", "REST APIs"],
    },
    {
      id: "match-outcomes",
      title: "Defining “a good match” for an AI product",
      org: "AdeptID",
      year: "2026",
      tags: ["Analytics engineering"],
      summary:
        "Scoped and built the outcome models behind an AI matching product's performance dashboard.",
      metrics: [
        { value: "500K+", label: "candidate-job pairs validated" },
        { value: "7", label: "statuses mapped to outcomes" },
        { value: "0", label: "join fan-out" },
      ],
      problem:
        "No one had agreed on what counted as a successful match, so the product's performance couldn't be measured.",
      approach: [
        "Compared two outcome-labeling methods on real data and published the analysis for Product, Engineering, and Finance.",
        "Mapped seven recruiting statuses to positive, negative, and neutral outcomes, deferring edge cases on purpose.",
        "Split ownership so engineering owned the pipeline and analytics owned the models, then built a Redshift-to-Snowflake sync.",
      ],
      outcome:
        "A validated fact table ready to feed the product dashboard, with labeling rules everyone had signed off on.",
      stack: ["dbt", "Redshift", "Snowflake", "Dagster", "SQL"],
    },
    {
      id: "geospatial-portfolio",
      title: "Geospatial analytics for a 230M sq ft portfolio",
      org: "Cresa",
      year: "2024–2026",
      tags: ["Geospatial", "BI"],
      summary:
        "Turned GIS, lease, asset, and market data into production analytics for acquisitions, site selection, and portfolio strategy.",
      metrics: [
        { value: "230M", label: "sq ft analyzed" },
        { value: "4", label: "data domains integrated" },
        { value: "3", label: "BI and GIS platforms" },
      ],
      problem:
        "Brokers and advisors needed to compare locations, markets, and competitors quickly, but the data sat in separate GIS, lease, and market systems.",
      approach: [
        "Built automated geospatial pipelines in Python, Databricks, and Azure, covering geocoding, spatial joins, and proximity analysis.",
        "Delivered self-service dashboards and GIS apps covering drive times, demographics, and competitive landscapes.",
        "Set data-quality and governance standards across the team's reporting assets.",
      ],
      outcome:
        "Advisors could answer location and market questions directly, without waiting on one-off analysis.",
      stack: ["Python", "SQL", "Databricks", "Azure", "ArcGIS", "Tableau", "Power BI"],
    },
    {
      id: "revenue-reporting",
      title: "Revenue reporting across five business units",
      org: "Quantum Metric",
      year: "2021–2023",
      tags: ["BI"],
      summary:
        "Built the dashboards and production datasets behind partner performance, pipeline health, and revenue forecasting.",
      metrics: [
        { value: "20+", label: "enterprise dashboards" },
        { value: "5", label: "business units" },
        { value: "$12M+", label: "in decisions supported" },
      ],
      problem:
        "Revenue reporting varied by team, and lineage from source data to dashboard was hard to trace.",
      approach: [
        "Managed production SQL and BigQuery datasets that improved the accuracy and lineage of revenue data.",
        "Defined shared metrics with Sales Ops and Customer Success leadership, then standardized reporting on them.",
      ],
      outcome:
        "One set of revenue numbers that leadership across five business units used to make decisions.",
      stack: ["SQL", "BigQuery", "Tableau"],
    },
  ],

  // Side projects. Each gets a large framed image with a write-up beside it.
  // Clicking the image opens a full-screen viewer. Leave a field "" to hide it.
  // Optional: zoomImage (larger file for the viewer) and fullImage (for "Open original").
  projects: [
    {
      id: "commute-impact",
      kicker: "Data application",
      title: "Commute Impact Analysis",
      year: "2026",
      image: "assets/img/commute-impact.svg",
      width: 1600,
      height: 900,
      alt: "Illustrative Commute Impact dashboard comparing commute-time distributions and changes for 46 hypothetical employees across a current office and four potential locations.",
      summary:
        "An open-source Streamlit application for comparing how current and prospective office locations affect employee commute times. The dashboard above uses a clearly labeled hypothetical 46-employee scenario, not client or employee data.",
      why:
        "It is a compact example of the work I enjoy: turning a real location-planning question into a reliable, usable data product with clear inputs, validation, and an export people can act on.",
      facts: [
        { value: "46", label: "hypothetical employees" },
        { value: "4", label: "potential locations" },
        { value: "CSV", label: "exportable report" },
      ],
      tools: ["Python", "Streamlit", "Pandas", "Google Maps API", "Folium"],
      sourceLabel: "Code",
      source: "View source on GitHub",
      sourceUrl: "https://github.com/JonathanAGregg/CommuteImpact_Streamlit_App",
    },
    {
      id: "helsinki",
      kicker: "Cartography",
      title: "The evolution of Helsinki\u2019s built environment",
      year: "", // TODO: the year you made it, e.g. "2025"
      image: "assets/img/helsinki-building-age.jpg",           // 1600px, shown on the page
      zoomImage: "assets/img/helsinki-building-age-2800.jpg",  // shown in the full-screen viewer
      fullImage: "assets/img/helsinki-building-age-full.jpg",  // 5600px, behind "Open original"
      loading: "eager",
      width: 1600,
      height: 1428,
      alt: "Dark basemap of Helsinki with every building colored by construction era, from pale yellow in the 19th-century harbor center through gold and orange to deep blue in the outer suburbs, with a bar chart of building counts by age.",
      summary:
        "A map of every building in Helsinki colored by construction era. The palette runs from pale yellow (the neoclassical center of the 1810s) through gold and orange (industrial and functionalist eras) to deep blue (post-war suburbs and recent development), so you can see the city grow outward from the harbor at a glance.",
      why:
        "It uses the same skills as my day job at a different scale: sourcing open data, cleaning and classifying tens of thousands of records, choosing an encoding that makes one pattern obvious, and crediting the source.",
      facts: [
        { value: "~50K", label: "buildings mapped" },
        { value: "11", label: "construction eras" },
        { value: "1550\u20132020", label: "time span" },
      ],
      tools: [], // TODO: e.g. ["Tableau", "Python", "QGIS"]
      sourceLabel: "Data",
      source: "HSY (Helsinki Region Environmental Services)",
      sourceUrl: "https://www.hsy.fi/",
    },
  ],

  principles: [
    {
      title: "Definitions before dashboards",
      body: "Most reporting fights are really disagreements about a definition. I write the definition down and get sign-off before building the chart.",
    },
    {
      title: "Test against the source of truth",
      body: "Parity checks against the report people already trust, row counts, and fan-out tests. If a number changes, I want to know why before anyone else sees it.",
    },
    {
      title: "Roll out slowly, roll back fast",
      body: "Dry runs, canaries, rollback snapshots, and a single-record test before a bulk update. Boring launches are the goal.",
    },
    {
      title: "Own the mistake, fix the process",
      body: "When I break something, I say so, trace it to the root cause, and change the process so it can't happen again.",
    },
  ],

  experience: [
    {
      role: "Senior Business Intelligence Engineer",
      org: "AdeptID",
      place: "Boston, MA",
      dates: "May 2026 – Sep 2026",
      blurb: "AI talent-matching company operating healthcare staffing brands.",
      points: [
        "Built the executive recruiter-performance scorecard and led the warehouse rollout of a 50+ metric library.",
        "Shipped point-in-time snapshot pipelines, AI product outcome models, and event-driven AWS automation.",
        "Ran production data migrations across about 44,500 records with zero failures on the major loads.",
      ],
    },
    {
      role: "Data Analytics & Visualization Specialist",
      org: "Cresa",
      place: "Boston, MA",
      dates: "Feb 2024 – May 2026",
      blurb: "Commercial real estate advisory.",
      points: [
        "Led analytics for a 230M sq ft portfolio, integrating GIS, lease, asset, and market data.",
        "Automated geospatial pipelines in Python, Databricks, and Azure.",
        "Built self-service dashboards and GIS apps in ArcGIS, Tableau, and Power BI.",
      ],
    },
    {
      role: "Data Solutions Analyst, Revenue Operations",
      org: "Quantum Metric",
      place: "Remote",
      dates: "Oct 2021 – Jun 2023",
      blurb: "Digital analytics SaaS.",
      points: [
        "Designed 20+ enterprise Tableau dashboards supporting $12M+ in decisions.",
        "Managed production SQL and BigQuery datasets across five business units.",
      ],
    },
    {
      role: "Data Implementation Analyst",
      org: "ZoomInfo",
      place: "Waltham, MA",
      dates: "Jun 2019 – Oct 2021",
      blurb: "Go-to-market data platform.",
      points: [
        "Delivered 100+ client-facing analytics and data-implementation projects.",
        "Built custom data solutions that improved retention and helped protect millions in annual recurring revenue.",
      ],
    },
  ],

  toolkit: [
    { group: "Modeling & quality", items: ["SQL", "dbt", "Dimensional modeling", "Semantic layers", "Great Expectations", "pytest"] },
    { group: "Warehouses & compute", items: ["Snowflake", "Redshift", "BigQuery", "Databricks", "Azure"] },
    { group: "Pipelines & cloud", items: ["Python", "Dagster", "AWS Lambda", "SAM", "EventBridge", "DynamoDB", "GitHub Actions"] },
    { group: "BI & geospatial", items: ["Sigma", "Tableau", "Power BI", "ArcGIS", "Geocoding", "Spatial joins"] },
  ],

  about: [
    "I studied geography at UMass Amherst, and I still approach data the way a cartographer approaches a map. It should be accurate, it should be honest about what it leaves out, and someone who wasn't in the room should be able to read it.",
    "My career has moved from client data implementations at ZoomInfo, to revenue analytics at Quantum Metric, to geospatial work at Cresa, to analytics engineering at AdeptID. The common thread is sitting between the people who ask the questions and the systems that hold the answers.",
    "I use AI coding tools every day to move faster, and I check every result myself before it ships.",
  ],
  education: "B.A. Geography (Globalization & International Studies) · GIS Certificate · UMass Amherst, 2018",
};
