/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';
import { AtualizarCategoriaDTO } from './dtos/atualizarCategoria.dto';
import { CriaCategoriaDTO } from './dtos/criarCategoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
  ) {}

  private logger = new Logger(CategoriasService.name);

  private clientAdminBackend =
    this.clientProxySmartRaking.getClientProxyInstance();

  criarCategoria(criarCategoriaDTO: CriaCategoriaDTO) {
    this.clientAdminBackend.emit('criar-categoria', criarCategoriaDTO);
  }

  async consultarCategorias() {
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-categorias', ''),
    );
  }

  async consultarCategoriaPeloId(idCategoria: string) {
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-categoria', idCategoria),
    );
  }

  async atualizarCategoria(
    _id: string,
    atualizarCategoriaDTO: AtualizarCategoriaDTO,
  ) {
    const categoriaEncontrada = await lastValueFrom(
      this.clientAdminBackend.send('consultar-categoria', _id),
    );

    if (!categoriaEncontrada) {
      throw new BadRequestException(`Categoria com id: ${_id} não encontrada!`);
    }

    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoriaDTO,
    });
  }
}
