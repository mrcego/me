export interface I18nFaqItem {
  question: string;
  answer: string;
}

export interface I18nSectionContent {
  title: string;
  body: string;
}

export interface I18nTestimonialEntry {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface I18nCertData {
  id: string;
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  url?: string;
  featured?: boolean;
}
