import { CursorPageParams } from "./pagination";

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export type SortBy<T> = {
  name: T;
  direction?: SortDirection;
};

export enum SqlOperator {
  EQ = "=",
  NEQ = "<>",
  GT = ">",
  GTE = ">=",
  LT = "<",
  LTE = "<=",
  CONTAINS = "CONTAINS",
}

export type FilterFieldValue = string | number | string[] | number[] | null;

export type FilterField<T extends string = string> = {
  name: T;
  op?: SqlOperator;
  value: FilterFieldValue;
};

export interface PaginationParams extends CursorPageParams {
  offset?: number;
}
