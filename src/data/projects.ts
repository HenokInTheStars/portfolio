export type CoverKind = 'spam' | 'flight' | 'desk';

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
  demo?: 'threshold';
}

export const PROJECTS: Project[] = [
  {
    slug: 'spam-detector',
    title: 'SMS Spam Detection',
    year: '2025',
    category: 'Machine learning · Open source',
    feature: true,
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
    demo: 'threshold',
  },
  {
    slug: 'flight-fares',
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
export const FAN_ORDER = ['flight-fares', 'front-desk', 'spam-detector'] as const;

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export type PreviewKind = 'anomaly' | 'segments' | 'chat';

export interface SideProject {
  name: string;
  line: string;
  stack: string;
  type: string;
  repo: string;
  preview: PreviewKind;
}

export const MORE_PROJECTS: SideProject[] = [
  {
    name: 'Anomaly Detection',
    line: 'Finds unusual days in two years of daily sales, using median-based scores where standard deviation hides the outliers.',
    stack: 'Python · pandas · NumPy',
    type: 'Time series',
    repo: 'https://github.com/HenokInTheStars/anomaly-detection',
    preview: 'anomaly',
  },
  {
    name: 'Customer Segmentation',
    line: 'Groups mall shoppers into five marketing personas by income and spending, checked with silhouette analysis.',
    stack: 'Python · scikit-learn · pandas',
    type: 'Clustering',
    repo: 'https://github.com/HenokInTheStars/mall-customer-segmentation',
    preview: 'segments',
  },
  {
    name: 'KeywordSense',
    line: 'A command-line chatbot that matches intents by keyword and falls back on sentiment when nothing matches.',
    stack: 'Python · TextBlob',
    type: 'Chatbot',
    repo: 'https://github.com/HenokInTheStars/keywordsense-chatbot',
    preview: 'chat',
  },
];
