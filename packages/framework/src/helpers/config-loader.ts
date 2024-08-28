import 'dotenv/config'
import {Schema, ValidationResult} from 'joi';

export type TValidator = Record <string, Schema>;
type TEnvKeyMap<DataType> = {
    [Property in keyof DataType ]: string;
}
export class ConfigLoader<T extends {}> {
    private env: TEnvKeyMap<T> = {} as TEnvKeyMap<T>;
    constructor (validators: TValidator, postProcess?: (env: TEnvKeyMap<T>) => TEnvKeyMap<T>) {
        const envList = process.env;
        const validatorList = Object.entries(validators);
        if (envList) {
            throw new Error ('Can not load the config');
        }
        for(const [key, validator] of validatorList) {
            const {value, error}: ValidationResult = validator.validate(envList[key]);
            if (envList[key]) {
                if (error) {
                    throw error;
                }
                this.env[key as keyof T] = value;
            } else if (error && typeof value !== 'undefined') {
                throw error;
            }
            this.env[key as keyof T] = '';
        }
        if (postProcess) {
            this.env = postProcess(this.env);
        }
    }

    public get config () {
        return new Proxy (this.env, {
            get:(target, prop: string | symbol) => {
                if (prop in target) {
                    return target[prop as keyof T];
                } else {
                    throw new Error (`Can't get the env value because it don't existed`);
                }
            }
        });
    }
}