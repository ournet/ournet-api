export function uniq<T>(items: T[]) {
  return [...new Set(items)];
}

export const SECONDS_24H = 3600 * 24;
export const SECONDS_12H = 3600 * 12;
export const SECONDS_6H = 3600 * 6;
export const SECONDS_3H = 3600 * 3;
export const SECONDS_2H = 3600 * 2;
export const SECONDS_1H = 3600 * 1;
export const SECONDS_30M = 3600 / 2;

export const SECONDS_1D = SECONDS_24H;
export const SECONDS_2D = SECONDS_1D * 2;
export const SECONDS_3D = SECONDS_1D * 3;
export const SECONDS_7D = SECONDS_1D * 7;
export const SECONDS_14D = SECONDS_1D * 14;
export const SECONDS_30D = SECONDS_1D * 30;
export const SECONDS_60D = SECONDS_1D * 60;
export const SECONDS_90D = SECONDS_1D * 90;
export const SECONDS_180D = SECONDS_1D * 180;
export const SECONDS_365D = SECONDS_1D * 365;
