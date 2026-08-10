export interface CapabilityItem {
  key: string;
  icon: string;
  to?: string;
  linkLabelKey?: string;
}

export interface HireProfileItem {
  key: string;
  titleKey: string;
  blurbKey: string;
  icon: string;
  to: string;
}

export interface CaseStudyItem {
  slug: string;
  icon: string;
  periodKey: string;
  to: string;
}

export interface TechStackItem {
  name: string;
  years: string;
  level: string;
  icon: string;
  descKey: string;
}
