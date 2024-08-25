import knex ,{ Knex } from "knex";
export class Connector {
    private static instances: {[key: string]:Knex} = {}
    public static getInstance (instanceName: string = 'default'): Knex {
        const connectorInstance = this.instances[instanceName];
        if (!connectorInstance) {
            throw new Error(`Not found connector with this instance name: ${instanceName}. Init before use it.`);
        }
        return connectorInstance;
    }

    public static initConnection(instanceName:string = 'default', config: Knex.Config): Knex {
       if(!this.instances[instanceName]) {
            this.instances[instanceName] = knex(config);
       }
       return this.instances[instanceName];
    }

    public static urlToConfig(connectionURL: string): Knex.Config {
        const url = new URL(connectionURL);
        return {
            client: url.protocol.replace(/[:]/gi,''),
            connection: {
                host: url.hostname,
                port: parseInt(url.port) ?? 5432, // default using postgres
                user: url.username,
                password: url.password,
                database: url.pathname.replace(/[/\s]/gi, '')
            }
        }
    }


}