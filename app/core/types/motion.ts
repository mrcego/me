export type MotionState = Record<
  string,
  string | number | boolean | Record<string, string | number>
>;

export interface MotionTransitionOptions {
  duration?: number;
  delay?: number;
  ease?: string | number[];
}
