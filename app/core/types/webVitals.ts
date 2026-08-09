export interface GtagWindow extends Window {
  dataLayer?: Array<IArguments | Record<string, unknown> | unknown>;
  gtag?: (...args: unknown[]) => void;
}
