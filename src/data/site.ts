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
  /**
   * Web3Forms access key for the contact form (get one free at web3forms.com).
   * It is public by design: it can only send mail to the inbox it was created for.
   */
  formKey: '',
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

/** Experience section, kept in step with the CV (public/resume.pdf). Newest first. */
export interface ExperienceEntry {
  when: string;
  role: string;
  org: string;
  meta: string;
  current?: boolean;
  points: string[];
  tools?: string[];
  link?: { label: string; href: string };
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    when: 'Jul 2026 – Present',
    role: 'Full-Stack Developer & AI Engineer',
    org: 'Matrix Technology',
    meta: 'Addis Ababa · Joined as an intern, moved to full-time',
    current: true,
    points: [
      'Designed and built an end-to-end RAG system (ingestion, chunking, embeddings, retrieval, LLM generation) that lets staff search internal documents in plain language.',
      'Built a smart front desk management application end to end with Next.js, TypeScript, FastAPI and PostgreSQL, from UI to API to database design.',
      'Developed and optimized REST APIs and PostgreSQL schemas for reliable, fast data handling, testing endpoints with Postman.',
    ],
    tools: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'RAG', 'Postman'],
  },
];

export interface EducationEntry {
  when: string;
  title: string;
  org: string;
}

export const EDUCATION: EducationEntry[] = [
  { when: 'June 2025', title: 'B.Sc. in Computer Science', org: 'Debre Tabor University' },
  { when: 'June 2024', title: 'Level V Diploma, Industrial Automation & PLC Programming', org: 'Debre Tabor Polytechnic College' },
];
