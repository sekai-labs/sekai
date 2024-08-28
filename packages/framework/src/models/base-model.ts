import { Knex } from "knex";
import { Connector } from "./connector.js";


export class BaseModel <T extends {}> {
    public tableName: string;
    public knexInstance: Knex;
    constructor (tableName: string, instanceName: string) {
        this.tableName = tableName;
        this.knexInstance = Connector.getInstance(instanceName);
    }
    public get knex () {
        return this.knexInstance;
    }

    public get query (): Knex.QueryBuilder<T, T[]> {
        return this.knex<T,T[]>(this.tableName);
    }
}