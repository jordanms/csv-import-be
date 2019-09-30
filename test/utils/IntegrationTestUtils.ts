import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {AppModule} from "../../src/app.module";
import {HttpServer, INestApplication} from "@nestjs/common";

export default class IntegrationTestUtils {

    private app: INestApplication;
    private module: TestingModule;

    async startApp(): Promise<void> {
        await this.initModule();
        this.app = this.module.createNestApplication();
        await this.app.init();
    }

    stopApp(): Promise<void> {
        return this.app.close();
    }

    getRepository<T>(type: Function) {
        return this.module.get(getRepositoryToken(type)) as T;
    }

    getHttpServer(): HttpServer {
        return this.app.getHttpServer();
    }

    private async initModule(): Promise<void> {
        if (!this.module) {
            this.module = await this.createModule();
        }
    }

    private createModule(): Promise<TestingModule> {
        return Test.createTestingModule({
            imports: [AppModule],
        }).compile();
    }
}
