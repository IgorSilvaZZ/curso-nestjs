import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { ClientProxyAdminBackend } from './common/providers/ClientProxyAdminBackend.provider';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [],
  controllers: [CategoriasModule, JogadoresModule],
  providers: [ClientProxyAdminBackend],
  exports: [ClientProxyAdminBackend],
})
export class AppModule {}
