export const SITE = {
  name: 'Henok Solomon',
  title: 'Henok Solomon · Full-stack developer',
  description:
    'Full-stack developer in Addis Ababa building web apps with React, TypeScript and FastAPI, and adding machine learning where it actually helps.',
  email: 'hhhenoksolomon@gmail.com',
  github: 'https://github.com/HenokInTheStars',
  githubLabel: 'github.com/HenokInTheStars',
  linkedin: 'https://www.linkedin.com/in/henok-solomon-ai',
  location: 'Addis Ababa (UTC+3)',
  /** FormSubmit alias for the email above; keeps the raw address out of the form endpoint. */
  formId: '654be654f596ab445f997f25b36c13fb',
} as const;

export const ROTATING_WORDS = ['think.', 'scale.', 'feel instant.', 'people trust.'];

export const MAIN_TOOLS = ['React', 'TypeScript', 'FastAPI', 'Python', 'scikit-learn', 'Tailwind CSS'];

export const TECH_STRIP = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'FastAPI', 'Python', 'Pydantic', 'WebSockets',
  'Node.js', 'scikit-learn', 'pandas', 'NumPy', 'LightGBM', 'XGBoost', 'Streamlit', 'Git',
];

export interface Skill {
  title: string;
  icon: 'frontend' | 'backend' | 'ml';
  text: string;
  tools: string[];
  proof: { label: string; slug: string };
}

export const SKILLS: Skill[] = [
  {
    title: 'Frontend',
    icon: 'frontend',
    text: 'Interfaces that load fast, respond instantly and work for everyone, keyboard and screen reader users included.',
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Accessibility'],
    proof: { label: 'EthioFoodCast', slug: 'ethiofoodcast' },
  },
  {
    title: 'Backend',
    icon: 'backend',
    text: 'Typed APIs that reject bad data at the door and push updates to the screen in real time.',
    tools: ['FastAPI', 'Python', 'Pydantic v2', 'WebSockets', 'REST'],
    proof: { label: 'Smart Front Desk API', slug: 'front-desk' },
  },
  {
    title: 'Machine learning',
    icon: 'ml',
    text: 'Models chosen by the metric that matters to the person using them, not the one that looks best on a slide.',
    tools: ['scikit-learn', 'pandas', 'LightGBM', 'XGBoost', 'Streamlit'],
    proof: { label: 'SMS Spam Detection', slug: 'spam-detector' },
  },
];

export interface TimelineEntry {
  when: string;
  title: string;
  sub: string;
  text?: string;
}

export const TIMELINE: TimelineEntry[] = [
  {
    when: '2025 – now',
    title: 'Full-stack developer',
    sub: 'Independent and contract projects · Addis Ababa',
    text: 'React, TypeScript and FastAPI apps with real-time features and schema-first validation.',
  },
  {
    when: '2024 – 2025',
    title: 'Machine learning projects',
    sub: 'Open source',
    text: 'Spam detection, flight fare prediction, anomaly detection and customer segmentation.',
  },
];

/**
 * Fill this in to show education in the About timeline.
 * Example: { when: '2024', title: 'B.Sc. Computer Science', sub: 'Addis Ababa University' }
 */
export const EDUCATION: TimelineEntry | null = null;
