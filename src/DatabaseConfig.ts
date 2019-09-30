import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export default function getDatabaseConfig(): TypeOrmModuleOptions {
    const config = {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3307,
        username: 'root',
        password: 'verySecure123',
        database: 'csv_import',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        keepAlive: true
    };

    if (process.env.NODE_ENV === 'test') {
        config.database = 'csv_import_test';
    }

    // @ts-ignore
    return config;
}
