// lib/categorizer.js
const keywords = {
  project: {
    campaign: [/campaign/i, /launch/i, /q[1-4]/i],
    brand: [/brand.?guideline/i, /logo/i, /visual.?identity/i],
    social: [/instagram/i, /tiktok/i, /facebook/i, /linkedin/i],
    email: [/newsletter/i, /mailchimp/i, /klaviyo/i],
    event: [/webinar/i, /summit/i, /conference/i],
  },
  team: {
    design: [/design/i, /creative/i, /figma/i, /photoshop/i],
    content: [/blog/i, /copy/i, /script/i, /writer/i],
    performance: [/analytics/i, /roi/i, /kpi/i, /dashboard/i],
    strategy: [/strategy/i, /planning/i, /roadmap/i],
  },
  topics: [
    /ai\b|artificial.?intelligence|machine.?learning|ml|deep.?learning/i,
    /sustainability|sustainable|green|eco.?friendly|carbon/i,
    /growth|scale|revenue|conversion|cro/i,
    /seo|search.?engine|organic.?traffic|keyword/i,
    /ppc|paid.?search|google.?ads|adwords|sem/i,
    /blockchain|crypto|web3|nft/i,
    /data.?privacy|gdpr|compliance/i,
  ],
};

export function categorize(filename, content) {
  let project = "General";
  let team = "General";
  let topics = [];

  const text = `${filename} ${content}`.toLowerCase();

  // === PROJECT ===
  for (const [key, patterns] of Object.entries(keywords.project)) {
    if (patterns.some((p) => p.test(text))) {
      project = key.charAt(0).toUpperCase() + key.slice(1);
      break;
    }
  }

  // === TEAM ===
  for (const [key, patterns] of Object.entries(keywords.team)) {
    if (patterns.some((p) => p.test(text))) {
      team = key.charAt(0).toUpperCase() + key.slice(1);
      break;
    }
  }

  // === TOPICS (NOW INSIDE FUNCTION!) ===
  const topicMap = ["AI", "Sustainability", "Growth", "SEO", "PPC"];
  keywords.topics.forEach((regex, i) => {
    if (regex.test(text)) {
      topics.push(topicMap[i]);
    }
  });

  // Fallback
  if (topics.length === 0) topics = ["General"];

  return { project, team, topics };
}
