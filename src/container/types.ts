// import { Knex } from "knex";
import { DomainContext } from "../domain/base/usecase";

export type ApiServicesInput = {
  // db?: Knex;
};

export type ApiUserData = Pick<
  DomainContext,
  "isAuthenticated" | "ip" | "language"
>;

export type ApiContextInput = ApiUserData & { services?: ApiServicesInput };
