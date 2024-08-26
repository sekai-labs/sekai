import {createClient} from 'redis';

export type TRedisConnectionConfig  = {
    username: string;
    password: string;
    host: string;
    port: number;
}

export class RedisDatabase {
    private static redisInstance: {[instanceName: string]: any} = {}
    
    public static connect(instanceName: string = 'redis-default', config?: TRedisConnectionConfig) {
        if(!this.redisInstance[instanceName] && config) {
            this.redisInstance[instanceName] = this.initConnection(config);
        }else {
            return this.redisInstance[instanceName];
        }
        throw new Error('This connection is not valid');
    }

    public static initConnection(config: TRedisConnectionConfig) {
        const connect = createClient({
            username: config.username,
            password: config.password,
            socket: {
                host: config.host,
                port: 6379,
                tls: true,
                reconnectStrategy(retries, cause) {
                    if (retries > 20) {
                        return new Error(`Many retries, terminated`);
                    } else {
                        return Math.min(retries * 50, 1000);
                    }
                },
                connectTimeout: 3000
            },
        });
        return connect;
    }

    public static parseURL(connectionURL: string): TRedisConnectionConfig {
        const url = new URL(connectionURL);
        return {
            username: url.username,
            password: url.password,
            host: url.host,
            port: parseInt(url.port) || 6379,
        }
    }
}
