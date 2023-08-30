import { Constructor } from "./types";
import { RequiredJSONSchema } from "./json-schema";
import {
  dataIsEqual,
  generateUniqueId,
  isPlainObject,
  removePropsByValue,
  uniq
} from "./util";
import R from "ramda";

/**
 * Entity id type.
 */
export type EntityId = string;

/**
 * Root entity data.
 */
export interface EntityData {
  id: EntityId;
  createdAt: string;
  updatedAt: string;
}

export type EntityCreateData<T extends EntityData> = Omit<
  T,
  "createdAt" | "updatedAt"
> &
  Partial<Pick<T, "createdAt" | "updatedAt">>;

export type EntityUpdateData<T extends EntityData> = Partial<
  Omit<T, "createdAt" | "updatedAt" | "id">
> & { id: EntityId; updatedAt?: string };

export interface Entity<TData extends EntityData = EntityData> {
  /**
   * Get entity data.
   */
  getData(): TData;

  /**
   * Set property value.
   * @param prop Property name
   * @param value Property value
   */
  set<TProp extends keyof TData>(prop: TProp, value: TData[TProp]): this;

  /**
   * Get property value.
   * @param prop Property name
   */
  get<TProp extends keyof TData>(prop: TProp): TData[TProp];

  dataIsEqual(
    b: Partial<TData> | Record<string, unknown>,
    options?: {
      compareOnlyBFields: boolean;
    }
  ): boolean;
}

/**
 * Base entity class.
 * All entities should extend BaseEntity.
 */
export class BaseEntity<TData extends EntityData = EntityData>
  implements Entity<TData>
{
  protected readonly _data: TData;

  public constructor(data: TData) {
    if (!isPlainObject(data)) throw new Error("Data must be a plain object");
    this._data = { ...data };
    // this.setData(data);
  }

  public get id() {
    return this.get("id");
  }
  public set id(value: TData["id"]) {
    this.set("id", value);
  }
  public get createdAt() {
    return this.get("createdAt");
  }
  public set createdAt(value: TData["createdAt"]) {
    this.set("createdAt", value);
  }
  public get updatedAt() {
    return this.get("updatedAt");
  }
  public set updatedAt(value: TData["updatedAt"]) {
    this.set("updatedAt", value);
  }

  public getData() {
    return this._data;
  }

  public setData(data: Partial<TData>) {
    Object.keys(data).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.set(key as keyof TData, data[key as keyof TData] as any);
    });
    return this._data;
  }

  public set<TProp extends keyof TData>(prop: TProp, value: TData[TProp]) {
    if (value === undefined) {
      delete this._data[prop];
    } else {
      this._data[prop] = value;
    }
    return this;
  }

  public get<TProp extends keyof TData>(prop: TProp) {
    return this._data[prop];
  }

  public static createId(_input?: unknown) {
    return generateUniqueId();
  }

  public static readonly jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", pattern: "^[a-z0-9-]{3,40}$" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" }
    },
    required: []
  };

  toJson(): Record<keyof TData, unknown> {
    const data = this.getData();
    const json = { ...data };

    return json;
  }

  public static tableName() {
    return this.name;
  }

  fieldsToOmitOnCompare() {
    return ["createdAt", "updatedAt", "id"];
  }

  dataIsEqual(
    b: Partial<TData> | Record<string, unknown>,
    options: {
      compareOnlyBFields: boolean;
      omit?: string[];
    } = { compareOnlyBFields: true }
  ): boolean {
    const a = this.getData();
    const fieldsToOmit = this.fieldsToOmitOnCompare().concat(
      options.omit || []
    );
    const keys = uniq(Object.keys(a).concat(Object.keys(b)));

    const fields = R.reject<string, string[]>(
      (it) => fieldsToOmit.includes(it),
      keys
    );

    let aData = removePropsByValue(R.pick(fields, a), [undefined]);

    const bData = removePropsByValue(R.pick(fields, b), [undefined]);

    if (options.compareOnlyBFields) {
      const fieldsFromInput = Object.keys(bData);
      aData = R.pick(fieldsFromInput, aData) as never;
    }

    return dataIsEqual(aData, bData);
  }
}

export interface EntityConstructor<D extends EntityData, E extends Entity<D>>
  extends Constructor<E, D> {
  readonly jsonSchema: RequiredJSONSchema;
  tableName(): string;
}
