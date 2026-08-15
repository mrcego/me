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
        'who is cesar',
        'about cesar',
        'bio',
        'profile',
        'summary',
        'background',
        'experience overview',
      ],
      es: [
        'quien es',
        'quien es cesar',
        'sobre cesar',
        'biografia',
        'perfil',
        'resumen',
        'trayectoria',
        'experiencia general',
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
        'colegium case study',
        'colegium cloud',
        'education',
        'edtech',
        'modules',
        'web components',
        'hackathon',
        'school platform',
      ],
      es: [
        'colegium',
        'caso colegium',
        'colegium cloud',
        'educacion',
        'edtech',
        'modulos',
        'web components',
        'hackathon',
        'plataforma educativa',
      ],
    },
    title: {
      en: 'Colegium Case Study',
      es: 'Caso de Estudio Colegium',
    },
    content: {
      en: 'At Colegium (a large-scale educational SaaS platform serving 100,000+ active students across Latin America), César worked as a Senior Frontend Developer:\n• Developed 12 next-generation educational modules, 3 internal tools for school administrators, and 3 shared libraries in Colegium Cloud.\n• Engineered Vue 3 Web Components and hybrid architectures that eliminated redundant code across teams.\n• Contributed to the enterprise Design System, standardizing navigation, forms, and data visualization patterns.\n• Awarded 4th place at the Colegium Hackathon 2024 with an AI chatbot for helpdesk ticketing and administrative automation.',
      es: 'En Colegium (plataforma SaaS educativa que atiende a más de 100.000 estudiantes en Latinoamérica), César se desempeñó como Desarrollador Frontend Senior:\n• Desarrolló 12 módulos educativos de próxima generación, 3 herramientas internas para administradores escolares y 3 bibliotecas compartidas en Colegium Cloud.\n• Implementó Web Components en Vue.js 3 y modelos híbridos que redujeron la duplicación de código entre equipos.\n• Contribuyó al ecosistema del Design System institucional, garantizando consistencia en navegación, formularios y visualización de datos.\n• Obtuvo el 4.º puesto en la Colegium Hackathon 2024 con un chatbot de IA para ticketing y automatización de helpdesk.',
    },
    actions: [
      {
        id: 'act_case_col',
        type: 'navigate',
        target: '/case-studies/colegium',
        labelKey: 'angie.actions.viewColegium',
      },
      {
        id: 'act_col_contact',
        type: 'contact_form',
        target: '#contact',
        labelKey: 'angie.actions.contactCesar',
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
        'availability',
        'available',
        'current availability',
        'is he available',
        'start date',
        'hire',
        'hiring',
        'work with',
        'job offer',
        'modalities',
        'full time',
        'contract',
        'remote',
        'timezone',
        'rate',
        'services',
        'consulting',
      ],
      es: [
        'disponibilidad',
        'disponible',
        'disponibilidad actual',
        'esta disponible',
        'cuando puede empezar',
        'contratar',
        'contratacion',
        'trabajar',
        'oferta laboral',
        'modalidad',
        'tiempo completo',
        'full time',
        'part time',
        'remoto',
        'zona horaria',
        'tarifa',
        'consultoria',
        'servicios',
        'freelance',
      ],
    },
    title: {
      en: 'Availability & Engagement Options',
      es: 'Disponibilidad y Modalidades de Contratación',
    },
    content: {
      en: 'César is currently AVAILABLE for new senior engineering opportunities:\n• Modalities: Senior Contract, Frontend Architecture Consulting, or Full-Time Remote Engineering.\n• Focus: Vue 3 / Nuxt 4 Architecture, Core Web Vitals optimization, and AI-Augmented Engineering workflows.\n• Timezone: UTC-5 (EST / COT) with strong timezone overlap for US, LATAM, and European teams.\n• Languages: B1 English proficiency (intermediate technical communication & async documentation) and native Spanish.\n• How to coordinate: You can download his verified CV or head directly to the Contact section (#contact) to find his direct channels (Email: cesargomezh90@gmail.com, LinkedIn, WhatsApp) and submit a project briefing through the interactive form.',
      es: 'César está actualmente DISPONIBLE para asumir nuevos roles como Ingeniero Fullstack Senior o Arquitecto Frontend:\n• Modalidades: Contrato Senior, Consultoría en Arquitectura Frontend o Tiempo Completo Remoto (Full-Time).\n• Especialidad: Arquitectura Vue 3 / Nuxt 4, optimización de Core Web Vitals y flujos de Ingeniería Aumentada con IA.\n• Zona horaria: UTC-5 (EST / COT) con alta cobertura horaria para equipos en EE. UU., LATAM y Europa.\n• Idiomas: Nivel de inglés B1 (comunicación técnica fluida y colaboración asíncrona) y español nativo.\n• Para coordinar: Puedes descargar su CV actualizado o ir directamente a la sección de Contacto (#contact) para ver sus canales directos (Email: cesargomezh90@gmail.com, LinkedIn, WhatsApp) y enviar una propuesta mediante el formulario interactivo.',
    },
    actions: [
      {
        id: 'act_hire_contact',
        type: 'contact_form',
        target: '#contact',
        labelKey: 'angie.actions.discussProject',
      },
      { id: 'act_dl_cv', type: 'download_cv', labelKey: 'angie.actions.downloadCvNow' },
      {
        id: 'act_hire_profiles',
        type: 'navigate',
        target: '#hire-profiles',
        labelKey: 'angie.actions.viewProfiles',
      },
    ],
  },
  {
    id: 'languages_proficiency',
    category: 'about',
    keywords: {
      en: [
        'english',
        'english level',
        'language',
        'languages',
        'b1',
        'spanish',
        'bilingual',
        'speak english',
        'fluency',
        'communication',
      ],
      es: [
        'ingles',
        'nivel de ingles',
        'idioma',
        'idiomas',
        'b1',
        'espanol',
        'bilingue',
        'habla ingles',
        'fluidez',
        'comunicacion',
      ],
    },
    title: {
      en: 'Languages & English Level',
      es: 'Idiomas y Nivel de Inglés',
    },
    content: {
      en: "César's English proficiency is B1 (intermediate professional for technical discussions, reading and writing architecture specs, tickets, documentation, and agile async collaboration in distributed teams). His native language is Spanish. He is available for global remote distributed teams.",
      es: 'El nivel de inglés de César es B1 (intermedio profesional para comunicación técnica, lectura y redacción de especificaciones, tickets, documentación y colaboración ágil en equipos remotos distribuidos). Su idioma nativo es el español. Trabaja habitualmente con equipos remotos globales.',
    },
    actions: [
      { id: 'act_lang_cv', type: 'download_cv', labelKey: 'angie.actions.downloadCvNow' },
      {
        id: 'act_lang_contact',
        type: 'contact_form',
        target: '#contact',
        labelKey: 'angie.actions.contactCesar',
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
      en: "You can download César's verified CV directly in English or Spanish summarizing his 13+ years of production experience, architecture achievements, and credentials. You can also visit the Contact section to connect via Email, LinkedIn, WhatsApp, or submit the contact form.",
      es: 'Puedes descargar el CV verificado de César directamente en inglés y español con el resumen de sus más de 13 años de experiencia en producción, arquitectura y credenciales. Además, puedes dirigirte a la sección de Contacto para comunicarte por Email, LinkedIn, WhatsApp o enviar un mensaje a través del formulario.',
    },
    actions: [
      { id: 'act_dl_cv', type: 'download_cv', labelKey: 'angie.actions.downloadCvNow' },
      {
        id: 'act_contact_form',
        type: 'contact_form',
        target: '#contact',
        labelKey: 'angie.actions.openContactForm',
      },
    ],
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
      en: [
        'contact',
        'how to contact',
        'contact channels',
        'contact details',
        'reach',
        'reach cesar',
        'coordinate',
        'email',
        'linkedin',
        'github',
        'whatsapp',
        'form',
        'talk',
        'schedule',
        'message',
        'phone',
      ],
      es: [
        'contacto',
        'contactar',
        'como contactar',
        'canales de contacto',
        'datos de contacto',
        'coordinar',
        'coordinacion',
        'email',
        'correo',
        'linkedin',
        'github',
        'whatsapp',
        'formulario',
        'hablar',
        'agendar',
        'mensaje',
        'escribir',
        'telefono',
      ],
    },
    title: {
      en: 'Contact & Coordination Channels',
      es: 'Canales de Contacto y Coordinación',
    },
    content: {
      en: 'To coordinate a project or discuss an engineering role with César, you have two direct options:\n1. Visit the Contact section (#contact) on this page: you will find his direct channels (Email: cesargomezh90@gmail.com, LinkedIn: linkedin.com/in/mrcego, WhatsApp: @mrcego.fsdev, GitHub: github.com/mrcego) along with the interactive briefing form.\n2. Download his verified Résumé / CV in English or Spanish to review his complete track record and credential history.',
      es: 'Para coordinar una oportunidad o conversar sobre un proyecto con César, tienes dos opciones directas:\n1. Ir a la sección de Contacto (#contact) en esta página: allí encontrarás sus canales directos (Email: cesargomezh90@gmail.com, LinkedIn: linkedin.com/in/mrcego, WhatsApp: @mrcego.fsdev, GitHub: github.com/mrcego) y el formulario interactivo de transmisión.\n2. Descargar su Hoja de Vida / CV verificado en inglés o español para revisar su historial completo de experiencia y certificaciones.',
    },
    actions: [
      {
        id: 'act_contact_form',
        type: 'contact_form',
        target: '#contact',
        labelKey: 'angie.actions.openContactForm',
      },
      { id: 'act_dl_cv', type: 'download_cv', labelKey: 'angie.actions.downloadCvNow' },
    ],
  },
];
