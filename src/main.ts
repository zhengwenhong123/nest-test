import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from "@nestjs/config";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configServer = app.get(ConfigService);

    // 启动服务器

    // 配置Swagger
    const configSwagger = new DocumentBuilder()
        .setTitle('Spotify Clone')
        .setDescription('Clone Api document')
        .setVersion('1.0')
        .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: "JWT",
                description: '输入jwt令牌',
            }, 'jwt-auth') //我们将在控制器函数上使用这个带有 JWT-auth 名称的 Bearer Auth
        .build();
    const document = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('api', app, document);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }

    await app.listen(configServer.get<number>('port'));

}

bootstrap();