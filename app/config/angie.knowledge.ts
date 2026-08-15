export interface AngieAction {
  id: string;
  type: 'navigate' | 'download_cv' | 'open_terminal' | 'contact_form';
  target?: string;
  labelKey: string;
}

export interface AngieKnowledgeEntry {
  id: string;
  category:
    | 'about'
    | 'stack'
    | 'case_study'
    | 'hiring'
    | 'contact'
    | 'cv'
    | 'certs'
    | 'pricing'
    | 'general';
  keywords: {
    en: string[];
    es: string[];
  };
  title: {
    en: string;
    es: string;
  };
  content: {
    en: string;
    es: string;
  };
  actions?: AngieAction[];
}

export const ANGIE_KNOWLEDGE_BASE: AngieKnowledgeEntry[] = [
  {
    id: 'bio_summary',
    category: 'about',
    keywords: {
      en: [
        'who is',
        'about',
        'cesar',
        'gomez',
        'bio',
        'profile',
        'summary',
        'background',
        'engineer',
      ],
      es: [
        'quien es',
        'sobre',
        'cesar',
        'gomez',
        'biografia',
        'perfil',
        'resumen',
        'trayectoria',
        'ingeniero',
      ],
    },
    title: {
      en: 'About César Gómez',
      es: 'Sobre César Gómez',
    },
    content: {
      en: 'César Gómez is a Senior Fullstack Engineer & Frontend Architect with 13+ years of experience building high-scale, production-grade applications. He specializes in Vue 3 / Nuxt 4 enterprise ecosystems, TypeScript contracts, reactive performance (60 FPS), and AI-Augmented Engineering with human oversight. Founding member at LingoQuesto and lead architect for multiple multi-tenant cloud platforms.',
      es: 'César Gómez es un Ingeniero Fullstack Senior y Arquitecto Frontend con más de 13 años de experiencia construyendo aplicaciones escalables en producción. Se especializa en ecosistemas empresariales Vue 3 / Nuxt 4, contratos TypeScript, rendimiento reactivo (60 FPS) e Ingeniería Aumentada por IA con control de calidad humano. Miembro fundador en LingoQuesto y arquitecto líder en plataformas cloud multi-inquilino.',
    },
    actions: [
      { id: 'act_about', type: 'navigate', target: '#about', labelKey: 'angie.actions.viewAbout' },
      {
        id: 'act_contact',
        type: 'contact_form',
        target: '#contact',
        labelKey: 'angie.actions.contactCesar',
      },
    ],
  },
  {
    id: 'tech_stack_core',
    category: 'stack',
    keywords: {
      en: [
        'stack',
        'technologies',
        'tools',
        'vue',
        'nuxt',
        'typescript',
        'node',
        'tailwind',
        'framework',
        'vitest',
        'playwright',
      ],
      es: [
        'stack',
        'tecnologias',
        'herramientas',
        'vue',
        'nuxt',
        'typescript',
        'node',
        'tailwind',
        'framework',
        'vitest',
        'playwright',
      ],
    },
    title: {
      en: 'Core Technical Stack',
      es: 'Stack Técnico Principal',
    },
    content: {
      en: "César's battle-tested stack includes:\n• Frontend: Vue 3 (Composition API), Nuxt 4 (SSG & SSR), TypeScript (Strict Mode), Vite, Nitro Engine.\n• UI & Styling: Tailwind CSS v4, PrimeVue 4, Motion-v, Custom Design Systems (Dark IDE Sanctuary).\n• State & Data: Pinia, VueUse, Web Workers, H3 Server Handlers, Reactive Streams.\n• Backend: Node.js, Express, Nitro Server Routes, REST APIs, JSON Schema Contracts.\n• Quality & Testing: Vitest, Playwright E2E, ESLint, Husky Pre-commit/Pre-push quality gates.",
      es: 'El stack de producción de César incluye:\n• Frontend: Vue 3 (Composition API), Nuxt 4 (SSG y SSR), TypeScript (Modo Estricto), Vite, Nitro Engine.\n• UI y Estilos: Tailwind CSS v4, PrimeVue 4, Motion-v, Design Systems a medida (Dark IDE Sanctuary).\n• Estado y Datos: Pinia, VueUse, Web Workers, Handlers de Servidor H3, Streams Reactivos.\n• Backend: Node.js, Express, Rutas de Servidor Nitro, APIs REST, Contratos JSON Schema.\n• Calidad y Pruebas: Vitest, Playwright E2E, ESLint, Husky Pre-commit/Pre-push quality gates.',
    },
    actions: [
      {
        id: 'act_stack',
        type: 'navigate',
        target: '#tech-stack',
        labelKey: 'angie.actions.viewTechStack',
      },
      { id: 'act_term', type: 'open_terminal', labelKey: 'angie.actions.runTelemetry' },
    ],
  },
  {
    id: 'case_colegium',
    category: 'case_study',
    keywords: {
      en: [
        'colegium',
        'case study',
        'school',
        'education',
        'modules',
        'migration',
        'vue 2',
        'vue 3',
      ],
      es: [
        'colegium',
        'caso de estudio',
        'escuela',
        'educacion',
        'modulos',
        'migracion',
        'vue 2',
        'vue 3',
      ],
    },
    title: {
      en: 'Colegium Case Study',
      es: 'Caso de Estudio Colegium',
    },
    content: {
      en: 'Colegium is a comprehensive educational SaaS ecosystem in Latin America. César architected and migrated 30+ mission-critical frontend modules from legacy architectures to modern Vue 3 / Nuxt, improving Core Web Vitals, reducing bundle sizes by ~42%, and introducing unified design system components used daily by thousands of educational institutions.',
      es: 'Colegium es un ecosistema SaaS educativo integral en Latinoamérica. César diseñó y migró más de 30 módulos frontend de misión crítica a Vue 3 / Nuxt, optimizando los Core Web Vitals, reduciendo los paquetes en un ~42% e introduciendo componentes de design system unificados utilizados diariamente por miles de instituciones.',
    },
    actions: [
      {
        id: 'act_case_col',
        type: 'navigate',
        target: '/case-studies/colegium',
        labelKey: 'angie.actions.viewColegium',
      },
    ],
  },
  {
    id: 'case_lingoquesto',
    category: 'case_study',
    keywords: {
      en: ['lingoquesto', 'ai platform', 'nlp', 'conversational', 'languages', 'edtech'],
      es: ['lingoquesto', 'plataforma ia', 'nlp', 'conversacional', 'idiomas', 'edtech'],
    },
    title: {
      en: 'LingoQuesto Case Study',
      es: 'Caso de Estudio LingoQuesto',
    },
    content: {
      en: 'LingoQuesto is an AI-powered conversational language platform. As a founding engineer, César built the real-time dialogue simulation interface with WebSockets, audio streaming, LLM prompt pipelines, and responsive micro-interactions that boosted user retention by 65%.',
      es: 'LingoQuesto es una plataforma conversacional para el aprendizaje de idiomas impulsada por IA. Como ingeniero fundador, César construyó la interfaz de simulación de diálogo en tiempo real con WebSockets, streaming de audio, pipelines LLM y micro-interacciones que aumentaron la retención de usuarios en un 65%.',
    },
    actions: [
      {
        id: 'act_case_lq',
        type: 'navigate',
        target: '/case-studies/lingoquesto',
        labelKey: 'angie.actions.viewLingoQuesto',
      },
    ],
  },
  {
    id: 'case_tissini',
    category: 'case_study',
    keywords: {
      en: ['tissini', 'ecommerce', 'app', 'sales', 'cart', 'mobile'],
      es: ['tissini', 'comercio electronico', 'ecommerce', 'ventas', 'carrito', 'movil'],
    },
    title: {
      en: 'TISSINI Case Study',
      es: 'Caso de Estudio TISSINI',
    },
    content: {
      en: 'TISSINI empowers Hispanic micro-entrepreneurs. César optimized the digital catalog, checkout funnel, and mobile responsive experiences, drastically decreasing checkout latency and stabilizing Core Web Vitals across high-traffic sales events.',
      es: 'TISSINI impulsa a microempresarias hispanas. César optimizó el catálogo digital, el embudo de checkout y la experiencia móvil, reduciendo drásticamente la latencia en compras y estabilizando los Core Web Vitals durante eventos de alta demanda.',
    },
    actions: [
      {
        id: 'act_case_tis',
        type: 'navigate',
        target: '/case-studies/tissini',
        labelKey: 'angie.actions.viewTissini',
      },
    ],
  },
  {
    id: 'hiring_availability',
    category: 'hiring',
    keywords: {
      en: [
        'hire',
        'availability',
        'contract',
        'rate',
        'consulting',
        'fulltime',
        'remote',
        'timezone',
      ],
      es: [
        'contratar',
        'disponibilidad',
        'contrato',
        'tarifa',
        'consultoria',
        'remoto',
        'zona horaria',
        'tiempo completo',
      ],
    },
    title: {
      en: 'Availability & Hiring Options',
      es: 'Disponibilidad y Modalidades de Contratación',
    },
    content: {
      en: 'César is currently AVAILABLE for new senior engineering engagements:\n• Modalities: Senior Contract, Frontend Architecture Consulting, or Full-Time Engineering Leadership.\n• Focus: Vue 3 / Nuxt 4 Architecture, Core Web Vitals optimization, and AI-Augmented Engineering workflows.\n• Timezone: UTC-5 (EST / COT) with high overlap across US and European timezones.\n• Languages: Fully bilingual in English and Spanish.',
      es: 'César está actualmente DISPONIBLE para nuevos desafíos de ingeniería senior:\n• Modalidades: Contrato Senior, Consultoría en Arquitectura Frontend o Liderazgo Técnico Full-Time.\n• Especialidad: Arquitectura Vue 3 / Nuxt 4, optimización de Core Web Vitals y flujos de Ingeniería con IA.\n• Zona horaria: UTC-5 (EST / COT) con amplia cobertura para equipos en EE. UU., LATAM y Europa.\n• Idiomas: 100% bilingüe en inglés y español.',
    },
    actions: [
      {
        id: 'act_hire_contact',
        type: 'contact_form',
        target: '#contact',
        labelKey: 'angie.actions.discussProject',
      },
      {
        id: 'act_hire_profiles',
        type: 'navigate',
        target: '#hire-profiles',
        labelKey: 'angie.actions.viewProfiles',
      },
    ],
  },
  {
    id: 'cv_download',
    category: 'cv',
    keywords: {
      en: ['cv', 'resume', 'curriculum', 'download cv', 'pdf', 'credentials'],
      es: ['cv', 'resume', 'curriculum', 'descargar cv', 'pdf', 'hoja de vida'],
    },
    title: {
      en: 'Download Résumé / CV',
      es: 'Descargar Hoja de Vida / CV',
    },
    content: {
      en: "You can download César's verified CV directly. It is available in English and Spanish and summarizes his 13+ years of production engineering leadership, architecture accomplishments, and full credential history.",
      es: 'Puedes descargar el CV verificado de César directamente. Está disponible en inglés y español y resume sus más de 13 años de liderazgo en ingeniería de producción, logros de arquitectura y credenciales.',
    },
    actions: [{ id: 'act_dl_cv', type: 'download_cv', labelKey: 'angie.actions.downloadCvNow' }],
  },
  {
    id: 'certifications_info',
    category: 'certs',
    keywords: {
      en: ['certifications', 'licenses', 'credentials', 'linkedin learning', 'platzi', 'new relic'],
      es: [
        'certificaciones',
        'licencias',
        'credenciales',
        'linkedin learning',
        'platzi',
        'new relic',
      ],
    },
    title: {
      en: 'Certifications & Continuous Learning',
      es: 'Certificaciones y Aprendizaje Continuo',
    },
    content: {
      en: 'César holds 18+ verified credentials covering:\n• Advanced TypeScript (Enterprise Patterns, Scalable Monorepos, OOP).\n• AI Programming for JavaScript Developers & Custom GPT Architecture.\n• Observability Practitioner (New Relic Certified).\n• Data Structures in JavaScript (BSTs, Queues, Stacks).\n• Advanced Vue.js & Modern Build Tooling (Vite, Package Management).',
      es: 'César cuenta con más de 18 credenciales verificadas en:\n• TypeScript Avanzado (Patrones Empresariales, Monorepos Escalables, POO).\n• Programación con IA para Desarrolladores JS y Arquitectura GPT.\n• Observabilidad Práctica (Certificado por New Relic).\n• Estructuras de Datos en JavaScript (BSTs, Colas, Pilas).\n• Vue.js Avanzado y Herramientas de Compilación Modernas (Vite, NPM).',
    },
    actions: [
      {
        id: 'act_certs',
        type: 'navigate',
        target: '#certifications',
        labelKey: 'angie.actions.viewAllCerts',
      },
    ],
  },
  {
    id: 'contact_channels',
    category: 'contact',
    keywords: {
      en: ['contact', 'email', 'linkedin', 'github', 'reach', 'schedule', 'talk', 'message'],
      es: [
        'contacto',
        'email',
        'correo',
        'linkedin',
        'github',
        'hablar',
        'agendar',
        'mensaje',
        'escribir',
      ],
    },
    title: {
      en: 'Contact Channels',
      es: 'Canales de Contacto',
    },
    content: {
      en: 'You can reach César directly through multiple channels:\n• Direct Email: cesargomezh90@gmail.com\n• LinkedIn: linkedin.com/in/mrcego\n• GitHub: github.com/mrcego\n• Or submit a project briefing through the high-fidelity transmission form on this portfolio.',
      es: 'Puedes comunicarte directamente con César a través de:\n• Email Directo: cesargomezh90@gmail.com\n• LinkedIn: linkedin.com/in/mrcego\n• GitHub: github.com/mrcego\n• O enviar una consulta a través del formulario de transmisión en este portafolio.',
    },
    actions: [
      {
        id: 'act_contact_form',
        type: 'contact_form',
        target: '#contact',
        labelKey: 'angie.actions.openContactForm',
      },
    ],
  },
];
