// Platform definitions for Doctor Portfolio Intake Suite
export const PLATFORMS = [
  {
    id: 'instagram',
    number: 45,
    name: 'Instagram',
    category: 'social',
    tag: 'Visual / Patient Ed',
    color: '#E1306C',
    bgLight: 'rgba(225, 48, 108, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
    placeholder: 'https://instagram.com/drrahulsharma',
    prefix: 'https://instagram.com/',
    example: 'https://instagram.com/drrahulsharma',
    helperText: 'Share patient education reels, surgical case highlights, and clinic milestones.',
    pattern: '^https?:\\/\\/(www\\.)?instagram\\.com\\/[a-zA-Z0-9._]+'
  },
  {
    id: 'facebook',
    number: 46,
    name: 'Facebook',
    category: 'social',
    tag: 'Community & Practice',
    color: '#1877F2',
    bgLight: 'rgba(24, 119, 242, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`,
    placeholder: 'https://facebook.com/drrahulsharma',
    prefix: 'https://facebook.com/',
    example: 'https://facebook.com/drrahulsharma',
    helperText: 'Doctor practice page or professional healthcare profile for patient outreach.',
    pattern: '^https?:\\/\\/(www\\.)?facebook\\.com\\/'
  },
  {
    id: 'linkedin',
    number: 47,
    name: 'LinkedIn',
    category: 'social',
    tag: 'Medical Network',
    color: '#0A66C2',
    bgLight: 'rgba(10, 102, 194, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
    placeholder: 'https://linkedin.com/in/drrahulsharma',
    prefix: 'https://linkedin.com/in/',
    example: 'https://linkedin.com/in/drrahulsharma',
    helperText: 'Fellowships, hospital associations, clinical publications, and peer credentials.',
    pattern: '^https?:\\/\\/(www\\.)?linkedin\\.com\\/'
  },
  {
    id: 'youtube',
    number: 48,
    name: 'YouTube',
    category: 'social',
    tag: 'Video & Vlogs',
    color: '#FF0000',
    bgLight: 'rgba(255, 0, 0, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`,
    placeholder: 'https://youtube.com/@drrahulsharma',
    prefix: 'https://youtube.com/@',
    example: 'https://youtube.com/@drrahulsharma',
    helperText: 'Patient testimonials, procedure explanations, wellness talks, and surgical demonstrations.',
    pattern: '^https?:\\/\\/(www\\.)?youtube\\.com\\/'
  },
  {
    id: 'twitter',
    number: 49,
    name: 'X / Twitter',
    category: 'social',
    tag: 'Medical Discourse',
    color: '#0F1419',
    bgLight: 'rgba(15, 20, 25, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>`,
    placeholder: 'https://x.com/drrahulsharma',
    prefix: 'https://x.com/',
    example: 'https://x.com/drrahulsharma',
    helperText: 'Medical conferences, clinical commentary, healthcare advocacy, and research updates.',
    pattern: '^https?:\\/\\/(www\\.)?(x|twitter)\\.com\\/'
  },
  {
    id: 'google_business',
    number: 50,
    name: 'Google Business Profile',
    category: 'medical',
    tag: 'Maps & Patient Reviews',
    color: '#4285F4',
    bgLight: 'rgba(66, 133, 244, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    placeholder: 'https://maps.google.com/?cid=... or https://g.page/...',
    prefix: 'https://maps.google.com/',
    example: 'https://maps.app.goo.gl/xy123 or https://g.page/dr-sharma-clinic',
    helperText: 'Paste your Google Maps / Google Business Profile link so patients can see real 5-star reviews and direct clinic navigation.',
    pattern: '^https?:\\/\\/'
  },
  {
    id: 'practo',
    number: 51,
    name: 'Practo',
    category: 'medical',
    tag: 'Appointments & Consultations',
    color: '#14BEF0',
    bgLight: 'rgba(20, 190, 240, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"></rect><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>`,
    placeholder: 'https://www.practo.com/hyderabad/doctor/dr-rahul-sharma',
    prefix: 'https://www.practo.com/',
    example: 'https://www.practo.com/delhi/doctor/dr-rahul-sharma-orthopedist',
    helperText: 'Enables a direct "Book on Practo" button and displays your verified patient satisfaction score.',
    pattern: '^https?:\\/\\/(www\\.)?practo\\.com\\/'
  },
  {
    id: 'lybrate',
    number: 52,
    name: 'Lybrate',
    category: 'medical',
    tag: 'Telehealth & Consultations',
    color: '#EA1B25',
    bgLight: 'rgba(234, 27, 37, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
    placeholder: 'https://www.lybrate.com/doctor/dr-rahul-sharma',
    prefix: 'https://www.lybrate.com/doctor/',
    example: 'https://www.lybrate.com/doctor/dr-rahul-sharma',
    helperText: 'Syncs your Lybrate doctor badges and online audio/video consultation link.',
    pattern: '^https?:\\/\\/(www\\.)?lybrate\\.com\\/'
  },
  {
    id: 'google_scholar',
    number: 53,
    name: 'Google Scholar',
    category: 'academic',
    tag: 'Citations & H-Index',
    color: '#4D90FE',
    bgLight: 'rgba(77, 144, 254, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
    placeholder: 'https://scholar.google.com/citations?user=xyz12345',
    prefix: 'https://scholar.google.com/citations?user=',
    example: 'https://scholar.google.com/citations?user=ABCD1234EFGH',
    helperText: 'Showcases your peer-reviewed medical publications, research metrics, and citation impact.',
    pattern: '^https?:\\/\\/scholar\\.google\\.com\\/'
  },
  {
    id: 'researchgate',
    number: 54,
    name: 'ResearchGate',
    category: 'academic',
    tag: 'Medical Papers',
    color: '#00CCBB',
    bgLight: 'rgba(0, 204, 187, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9 16V8h4a2 2 0 0 1 0 4H9"></path><path d="M12 12l3 4"></path></svg>`,
    placeholder: 'https://www.researchgate.net/profile/Rahul-Sharma-12',
    prefix: 'https://www.researchgate.net/profile/',
    example: 'https://www.researchgate.net/profile/Rahul-Sharma-45',
    helperText: 'Connects clinical peers, co-authors, and highlights published full-text surgical papers.',
    pattern: '^https?:\\/\\/(www\\.)?researchgate\\.net\\/'
  },
  {
    id: 'orcid',
    number: 55,
    name: 'ORCID',
    category: 'academic',
    tag: 'Researcher ID',
    color: '#A6CE39',
    bgLight: 'rgba(166, 206, 57, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8.5" y1="8" x2="8.5" y2="16"></line><circle cx="8.5" cy="5.5" r="0.75" fill="currentColor"></circle><path d="M11.5 8h2.5a3 3 0 0 1 0 6h-2.5z"></path></svg>`,
    placeholder: 'https://orcid.org/0000-0002-1825-0097',
    prefix: 'https://orcid.org/',
    example: 'https://orcid.org/0000-0002-1825-0097',
    helperText: 'Your 16-character global unique identifier for scientific journals and medical grant bodies.',
    pattern: '^https?:\\/\\/orcid\\.org\\/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]'
  },
  {
    id: 'hospital_profile',
    number: 56,
    name: 'Hospital / Clinic Profile Link',
    category: 'medical',
    tag: 'Institutional Affiliation',
    color: '#0D9488',
    bgLight: 'rgba(13, 148, 136, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>`,
    placeholder: 'https://apollohospitals.com/doctors/dr-rahul-sharma',
    prefix: 'https://',
    example: 'https://www.maxhealthcare.in/doctor/dr-rahul-sharma',
    helperText: 'Paste your official doctor profile page on your hospital or clinical institution website.',
    pattern: '^https?:\\/\\/'
  },
  {
    id: 'personal_website',
    number: 57,
    name: 'Personal Website',
    category: 'custom',
    tag: 'Existing Domain',
    color: '#6366F1',
    bgLight: 'rgba(99, 102, 241, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    placeholder: 'https://drrahulsharma.com',
    prefix: 'https://',
    example: 'https://drrahulsharma.com',
    helperText: 'Your current website, blog, or domain name if you already own one.',
    pattern: '^https?:\\/\\/'
  },
  {
    id: 'other',
    number: 58,
    name: 'Other Professional / Social Profile',
    category: 'custom',
    tag: 'Threads / Telegram / Association',
    color: '#475569',
    bgLight: 'rgba(71, 85, 105, 0.08)',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    placeholder: 'Telegram — https://t.me/drsharma\nThreads — https://threads.net/@drsharma\nIndian Orthopedic Association — https://...',
    isParagraph: true,
    example: `Telegram — https://t.me/drsharmaclinic\nThreads — https://threads.net/@drrahulsharma\nState Medical Council Directory — https://smc.gov.in/registry/94821`,
    helperText: 'Enter platform name and link (one per line). Perfect for specialized associations, Telegram channels, or WhatsApp community links.',
    pattern: '.*'
  }
];

export const PLACEMENT_OPTIONS = [
  {
    id: 'header',
    label: 'Header / Navigation Bar',
    desc: 'Sleek, subtle icon badges in the top navigation header for rapid patient access.',
    icon: '📌'
  },
  {
    id: 'hero',
    label: 'Hero Section',
    desc: 'Prominent social proof badges positioned right beside your credentials and consultation CTA.',
    icon: '🌟'
  },
  {
    id: 'about',
    label: 'About Doctor Section',
    desc: 'Contextual badges embedded alongside your clinical journey and degrees.',
    icon: '👨‍⚕️'
  },
  {
    id: 'contact',
    label: 'Contact & Clinic Section',
    desc: 'Direct quick-access links next to your clinic address, telephone, and OPD hours.',
    icon: '📞'
  },
  {
    id: 'footer',
    label: 'Footer',
    desc: 'Comprehensive directory of all your verified channels at the base of every page.',
    icon: '⚓'
  },
  {
    id: 'social_hub',
    label: 'Dedicated Social & Media Section',
    desc: 'A dedicated interactive media feed or card grid highlighting your patient education videos.',
    icon: '📱'
  },
  {
    id: 'designer_decides',
    label: 'Only where appropriate — Designer can decide',
    desc: 'Recommended: Our design team will place badges in high-converting, optimal visual locations.',
    icon: '🎨',
    isRecommended: true
  }
];

export const CONSENT_OPTIONS = [
  {
    id: 'yes_public',
    value: 'yes',
    title: 'Yes, display them publicly',
    badge: 'Recommended for Maximum Reach',
    badgeClass: 'badge-success',
    icon: '✅',
    desc: 'Show all provided links prominently across the portfolio website so patients, peers, and conference organizers can discover and connect with you easily.'
  },
  {
    id: 'only_selected',
    value: 'selected',
    title: 'Display only the profiles I selected above',
    badge: 'Curated Access',
    badgeClass: 'badge-warning',
    icon: '🔧',
    desc: 'Only publish verified profiles from this specific list. Any other channels or private platforms will be omitted from public display.'
  },
  {
    id: 'no_private',
    value: 'no',
    title: "No, don't display them publicly",
    badge: 'Internal Agency Record Only',
    badgeClass: 'badge-neutral',
    icon: '❌',
    desc: 'Keep these links strictly in our design/SEO files for medical schema verification only. Do not render public clickable buttons on the final website.'
  }
];
