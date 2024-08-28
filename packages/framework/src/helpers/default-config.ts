export class DefaultConfig {
    private static portConfigs: {[databaseName: string]: number} = {
        'postgres':5432,
        'mysql': 3306,
        'mariadb': 3306, 
    }
    public static getPortDatabase(database: string): number {
        const databasePort = this.portConfigs[database];
        if (!databasePort) {
            throw new Error('This database is not support');
        }
        return databasePort;
    }
}

export default DefaultConfig;