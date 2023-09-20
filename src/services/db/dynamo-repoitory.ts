import {
  EntityData,
  EntityId,
  EntityCreateData,
  EntityUpdateData,
  BaseEntity,
  EntityConstructor
} from "../../domain/base/entity";
import {
  RepositoryEvents,
  BaseRepository,
  RepositoryOptions
} from "../../domain/base/repository";
import { NotFoundError, ValidationError } from "../../domain/base/errors";
import { JsonValidator } from "../../domain/base/validator";
import dynamoClient from "./dynamo-client";
import {
  AttributeValue,
  DeleteItemCommand,
  PutItemCommand,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand
} from "@aws-sdk/client-dynamodb";
import { Converter } from "aws-sdk/clients/dynamodb";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DynamoRepositoryOptions<
  TData extends EntityData,
  TCreate extends EntityCreateData<TData> = EntityCreateData<TData>,
  TUpdate extends EntityUpdateData<TData> = EntityUpdateData<TData>
> extends RepositoryOptions<TCreate, TUpdate> {}

export abstract class DynamoRepository<
  TData extends EntityData,
  TEntity extends BaseEntity<TData> = BaseEntity<TData>,
  TCreate extends EntityCreateData<EntityData> = EntityCreateData<TData>,
  TUpdate extends EntityUpdateData<EntityData> = EntityUpdateData<TData>,
  Events extends RepositoryEvents<TData, TEntity> = RepositoryEvents<
    TData,
    TEntity
  >
> extends BaseRepository<TData, TEntity, TCreate, TUpdate, Events> {
  protected tableName: string;
  constructor(
    private entityBuilder: EntityConstructor<TData, TEntity>,
    tableName?: string
  ) {
    super({
      createValidator: new JsonValidator(entityBuilder.jsonSchema),
      updateValidator: new JsonValidator({
        ...entityBuilder.jsonSchema,
        required: ["id"]
      })
    });

    this.tableName = tableName || entityBuilder.tableName();
  }

  transaction<T>(_scope: (trx: unknown) => void | Promise<T>): Promise<T> {
    throw new Error("Method not implemented.");
  }

  getEntityName(): string {
    return this.tableName;
  }

  override toEntity(data: TData): TEntity {
    return new this.entityBuilder(data);
  }

  abstract getKeyFromId(id: EntityId): Record<string, AttributeValue>;

  async deleteByIds(_ids: EntityId[]): Promise<number> {
    throw new Error("Method not implemented.");
    // if (ids.length === 0) return 0;
    // const query = new DeleteItemCommand({ TableName: this.tableName,
    // Key: {
    //   id:""
    // } });
    // return query;
    // const query = this.query();
    // query.input.Limit = ids.length;
    //   .whereIn("id", ids)
    //   .delete()
    //   .returning("*");
    // return this.onDeletedItems(items);
  }

  protected attributesToData(attributes: Record<string, AttributeValue>) {
    return Converter.unmarshall(attributes);
  }

  protected attributesToEntity(
    attributes: Record<string, AttributeValue>
  ): TEntity {
    return this.toEntity(Converter.unmarshall(attributes) as never);
  }

  protected dataToAttributes(data: object): Record<string, AttributeValue> {
    return Converter.marshall(data) as never;
  }

  protected async innerDelete(id: EntityId): Promise<TEntity | null> {
    const query = new DeleteItemCommand({
      TableName: this.tableName,
      Key: this.getKeyFromId(id),
      ReturnConsumedCapacity: "NONE",
      ReturnValues: "ALL_OLD"
    });
    const response = await dynamoClient.send(query);
    return response.Attributes
      ? this.attributesToEntity(response.Attributes)
      : null;
  }

  protected async innerCreate(data: TCreate): Promise<TEntity> {
    const query = new PutItemCommand({
      TableName: this.tableName,
      Item: this.dataToAttributes(data),
      ReturnValues: "NONE"
    });

    await dynamoClient.send(query);

    return this.toEntity(data as never);
  }

  protected async innerUpdate(data: TUpdate): Promise<TEntity> {
    const { id, ...rest } = data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData = rest as any;
    const updateAt = updateData["updatedAt"];
    delete updateData["createdAt"];
    delete updateData["updatedAt"];

    if (Object.keys(updateData).length === 0)
      throw new ValidationError(`Update data is empty!`, { data });

    updateData["updatedAt"] = updateAt || new Date().toISOString();

    const Key = this.getKeyFromId(id);

    const updateAttributes = this.dataToAttributes(updateData);

    const query = new UpdateItemCommand({
      TableName: this.tableName,
      Key,
      UpdateExpression: `SET ${Object.keys(updateData)
        .map((key) => `#${key} = :${key}`)
        .join(", ")}`,
      ExpressionAttributeNames: Object.keys(updateData).reduce(
        (acc, key) => ({ ...acc, [`#${key}`]: key }),
        {}
      ),
      ExpressionAttributeValues: Object.keys(updateData).reduce(
        (acc, key) => ({ ...acc, [`:${key}`]: updateAttributes[key] }),
        {}
      ),
      ReturnValues: "ALL_NEW"
    });

    const response = await dynamoClient.send(query);

    if (!response.Attributes) {
      throw new NotFoundError(
        `Entity ${this.tableName} with id ${id} not found!`
      );
    }

    return this.attributesToEntity(response.Attributes);
  }

  public async findOrCreate(data: TCreate): Promise<TEntity> {
    const existingEntity = await this.findUnique(data);
    return existingEntity ? existingEntity : this.create(data);
  }

  /**
   * Find unique item.
   */
  public async findUnique(data: TCreate): Promise<TEntity | null> {
    return this.findById(data.id);
  }

  public async createOrUpdate(data: TCreate): Promise<TEntity> {
    const exists = await this.findUnique(data);
    if (exists && !exists.dataIsEqual(data))
      return this.update({ ...data, id: exists.id } as never);

    return this.create(data);
  }

  public async findById(id: EntityId): Promise<TEntity | null> {
    const data = this.getKeyFromId(id);
    const keys = Object.keys(data);
    const values = Object.values(data);
    const input: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: keys
        .map((key) => `#${key} = :${key}`)
        .join(" AND "),
      ExpressionAttributeNames: keys.reduce(
        (acc, key) => ({ ...acc, [`#${key}`]: key }),
        {}
      ),
      ExpressionAttributeValues: keys.reduce(
        (acc, key, i) => ({ ...acc, [`:${key}`]: values[i] }),
        {}
      ),
      Limit: 1
    };

    const query = new QueryCommand(input);

    const response = await dynamoClient.send(query);

    return response.Items && response.Items.length > 0
      ? this.attributesToEntity(response.Items[0])
      : null;
  }

  abstract formatQueryFindByIdsInput(ids: EntityId[]): QueryCommandInput;

  public async findByIds(ids: EntityId[]): Promise<TEntity[]> {
    if (ids.length === 0) return [];

    const query = new QueryCommand(this.formatQueryFindByIdsInput(ids));

    query.input.Limit = ids.length;
    const response = await dynamoClient.send(query);

    return response.Items && response.Items.length > 0
      ? response.Items.map((item) => this.attributesToEntity(item))
      : [];
  }

  public async deleteAll(): Promise<number> {
    throw new Error("Method not implemented.");
  }

  public async totalCount(): Promise<number> {
    throw new Error("Method not implemented.");
  }

  public async getAllIds(): Promise<EntityId[]> {
    throw new Error("Method not implemented.");
  }

  protected async onDeletedItems(items: TEntity[]) {
    await Promise.all(items.map((item) => this.onDeleted(item)));
    return items.length;
  }
}
