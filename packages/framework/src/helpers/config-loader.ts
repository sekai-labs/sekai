import 'dotenv/config'
import {Schema, ValidationResult} from 'joi';

export type TValidator = Record <string, Schema>;
type TEnvKeyMap<Type> = {
    [Property in keyof Type ]: string;
}
export class ConfigLoader<T extends {}> {
    private env: TEnvKeyMap<T> = {} as TEnvKeyMap<T>;
    constructor (validators: TValidator, postProcess?: (env: TEnvKeyMap<T>) => TEnvKeyMap<T>) {
        const envList = process.env;
        if (envList) {
            throw new Error ('Can not load the config');
        }
        for(const [key, validator] of Object.entries(validators)) {
            if (envList[key]) {
                const {value, error}: ValidationResult = validator.validate(envList[key]);
                if (error) {
                    throw error;
                }
                this.env[key as keyof T] = value;
            }
        }
        if (postProcess) {
            this.env = postProcess(this.env);
        }
    }

    public get config () {
        return new Proxy (this, {
            get:(target, prop: string | symbol) => {
                if (prop in target) {
                    this.env[prop as keyof T]
                } else {
                    throw new Error (`Can't get the env value because it don't existed`);
                }
            }
        })
    }
}
export default ConfigLoader;