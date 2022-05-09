import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Hot Reload
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`listening on port ${port}`);

  // Hot Reload 세팅
  if(module.hot){
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
