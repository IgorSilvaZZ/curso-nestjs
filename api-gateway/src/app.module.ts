import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [JogadoresModule, CategoriasModule],
  controllers: [],
})
export class AppModule {}
