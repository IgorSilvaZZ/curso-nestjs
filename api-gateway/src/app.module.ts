import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [JogadoresModule, CategoriasModule, AwsModule],
  controllers: [],
})
export class AppModule {}
