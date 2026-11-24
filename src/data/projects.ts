export type CoverKind = 'spam' | 'flight' | 'desk' | 'food';

export interface Metric {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  year: string;
  category: string;
  inProgress?: boolean;
  feature?: boolean;
  cover: CoverKind;
  lede: string;
  stack: string[];
  metrics: Metric[];
  problem: string;
  built: string;
  decision: string;
  results: string;
  next: string;
  repo?: string;
  /** Live version of the project, if there is one. */
  live?: string;
  /** For team projects: the team size and Henok's part in it. */
  team?: { size: number; role: string };
  /** Shown in "Selected work" and the hero fan. Unselected projects keep their case-study page. */
  selected?: boolean;
  /** Interactive widget shown on the case-study page. */
  interactive?: 'threshold';
}

export const PROJECTS: Project[] = [
  {
    slug: 'ethiofoodcast',
    title: 'EthioFoodCast',
    year: '2026',
    category: 'Full-stack · Machine learning · Team project',
    selected: true,
    feature: true,
    cover: 'food',
    lede: 'Finds the Ethiopian farming households most likely to face food insecurity, so field teams know whom to visit first.',
    stack: ['Next.js 15', 'React 19', 'TypeScript', 'FastAPI', 'Docker', 'Graph neural network', 'scikit-learn', 'LightGBM'],
    metrics: [
      { value: 78.4, decimals: 1, suffix: '%', label: 'Accuracy (5 test splits)' },
      { value: 84.4, decimals: 1, suffix: '%', label: 'Food-insecure households found' },
      { value: 80.2, decimals: 1, suffix: '%', label: 'Precision' },
      { value: 0.86, decimals: 2, suffix: '', label: 'ROC-AUC' },
    ],
    problem:
      'Programme staff cannot visit every farming household, and food insecurity often shows up only after it has already happened. They need a fair way to decide whom to see first.',
    built:
      'A web app that scores a household from a 14-question interview and the area it was surveyed in, explains what moved the score, and ranks households into a planning list. It includes regional risk maps, batch scoring from a CSV, an offline-capable interface for field use, and a knowledge centre whose AI answers cite a source for every sentence. I worked on the data and the frontend in a team of three.',
    decision:
      'The score supports a human assessment and never decides who receives help. Every AI-written sentence must cite a source and the server rejects answers whose citations do not check out; no household identifiers or coordinates are shipped, and the AI never sees interview answers.',
    results:
      'Trained on 4,837 households in 427 survey areas of the World Bank Ethiopia panel and tested on households the model never saw, it reaches 78.4% accuracy (±1.9) and finds 84.4% of food-insecure households, against a 61% baseline. The graph neural network beat extra trees, LightGBM and logistic regression in a like-for-like comparison.',
    next: 'Retrain when the next survey round is published, and cover the regions that do not yet have enough data to score reliably.',
    repo: 'https://github.com/HenokInTheStars/EthioFoodCast',
    live: 'https://ethio-food-cast.vercel.app',
    team: { size: 3, role: 'Data and frontend' },
  },
  {
    slug: 'spam-detector',
    title: 'SMS Spam Detection',
    year: '2025',
    category: 'Machine learning · Open source',
    cover: 'spam',
    lede: 'A text classifier tuned to almost never flag a real message as spam.',
    stack: ['Python', 'scikit-learn', 'TF-IDF', 'Naive Bayes', 'pandas'],
    metrics: [
      { value: 98.21, decimals: 2, suffix: '%', label: 'Accuracy' },
      { value: 99.24, decimals: 2, suffix: '%', label: 'Precision' },
      { value: 87.25, decimals: 2, suffix: '%', label: 'Recall' },
      { value: 92.86, decimals: 2, suffix: '%', label: 'F1 score' },
    ],
    problem:
      'Aggressive spam filters bury real messages. One lost bank code or family text costs more trust than a few spam texts that slip through.',
    built:
      'A scikit-learn pipeline: TF-IDF over unigrams and bigrams (3,000 features) feeding Multinomial Naive Bayes (α = 0.5), trained on 5,572 labelled SMS messages.',
    decision:
      'I tuned for precision over recall. Missing about 13% of spam is acceptable; sending a genuine message to the spam folder is not.',
    results:
      'Evaluated on an 80/20 stratified split of the 5,572 messages. Precision of 99.24% means almost every message the model flags really is spam.',
    next: 'Try character n-grams and DistilBERT embeddings to catch obfuscated spam without giving up precision.',
    repo: 'https://github.com/HenokInTheStars/Spam-Detector',
    interactive: 'threshold',
  },
  {
    slug: 'flight-fares',
    selected: true,
    title: 'Flight Fare Predictor',
    year: '2025',
    category: 'Machine learning · Streamlit app',
    cover: 'flight',
    lede: 'Estimates Ethiopian Airlines ticket prices in birr from route, cabin, timing and aircraft.',
    stack: ['Python', 'Streamlit', 'LightGBM', 'XGBoost'],
    metrics: [
      { value: 11, decimals: 0, suffix: '', label: 'Models benchmarked' },
      { value: 18, decimals: 0, suffix: '', label: 'Engineered features' },
    ],
    problem: 'Seasonal fare swings make it hard for travellers to tell whether a price is fair or when to book.',
    built: 'A Streamlit app with controls for route, cabin class and dates that returns a fare estimate in ETB instantly.',
    decision:
      'Benchmark 11 regression models before reaching for deep learning. LightGBM gave the best balance of accuracy and fast CPU inference for an interactive app.',
    results:
      '18 engineered features, including sine and cosine encoding of dates so the model sees December and January as neighbours, served as live interactive predictions.',
    next: 'Scheduled scraping to keep the training data current with real fares.',
    repo: 'https://github.com/HenokInTheStars/flight-price-prediction',
  },
  {
    slug: 'front-desk',
    selected: true,
    title: 'Smart Front Desk',
    year: '2026',
    category: 'Full-stack · In progress',
    inProgress: true,
    cover: 'desk',
    lede: 'A visitor check-in kiosk with a live receptionist dashboard and instant host notifications.',
    stack: ['React', 'Tailwind CSS', 'FastAPI', 'Pydantic v2', 'WebSockets'],
    metrics: [],
    problem: 'Paper visitor logs in busy offices cause lobby queues, late host alerts and loosely handled personal data.',
    built:
      'A check-in kiosk paired with a real-time receptionist dashboard and a background worker that notifies hosts the moment their visitor arrives.',
    decision:
      'Validate every submission with Pydantic v2 schemas at the API boundary and move each visit through an explicit state machine, so malformed check-ins are rejected before anyone is notified.',
    results:
      'In active development. The core check-in flow, schema validation tests and WebSocket broadcasts pass in the local test suite.',
    next: 'QR-code visitor badges and self-service badge printing.',
  },
];

/** Order of the three covers in the hero fan (last one sits on top). */
export const FAN_ORDER = ['flight-fares', 'front-desk', 'ethiofoodcast'] as const;

export const SELECTED = () => PROJECTS.filter((p) => p.selected);

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export type PreviewKind = 'spam' | 'anomaly' | 'segments' | 'chat';

export interface SideProject {
  name: string;
  line: string;
  stack: string;
  type: string;
  /** Case-study page on this site, or the GitHub repository. */
  href: string;
  external: boolean;
  preview: PreviewKind;
}

export const MORE_PROJECTS: SideProject[] = [
  {
    name: 'SMS Spam Detection',
    line: 'A text classifier tuned to almost never flag a real message as spam: 99.24% precision on 1,115 test messages.',
    stack: 'Python · scikit-learn · TF‑IDF',
    type: 'NLP',
    href: '/work/spam-detector/',
    external: false,
    preview: 'spam',
  },
  {
    name: 'Anomaly Detection',
    line: 'Finds unusual days in two years of daily sales, using median-based scores where standard deviation hides the outliers.',
    stack: 'Python · pandas · NumPy',
    type: 'Time series',
    href: 'https://github.com/HenokInTheStars/anomaly-detection',
    external: true,
    preview: 'anomaly',
  },
  {
    name: 'Customer Segmentation',
    line: 'Groups mall shoppers into five marketing personas by income and spending, checked with silhouette analysis.',
    stack: 'Python · scikit-learn · pandas',
    type: 'Clustering',
    href: 'https://github.com/HenokInTheStars/mall-customer-segmentation',
    external: true,
    preview: 'segments',
  },
  {
    name: 'KeywordSense',
    line: 'A command-line chatbot that matches intents by keyword and falls back on sentiment when nothing matches.',
    stack: 'Python · TextBlob',
    type: 'Chatbot',
    href: 'https://github.com/HenokInTheStars/keywordsense-chatbot',
    external: true,
    preview: 'chat',
  },
];
