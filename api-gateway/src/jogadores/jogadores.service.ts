/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { CriarJogadorDTO } from './dtos/criarJogador.dto';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';
import { AtualizarJogadorDTO } from './dtos/atualizarjogador.dto';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class JogadoresService {
  constructor(
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
    private readonly awsService: AwsService,
  ) {}

  private logger = new Logger(JogadoresService.name);

  private clientAdminBackend =
    this.clientProxySmartRaking.getClientProxyInstance();

  async criarJogador(criarJogadorDTO: CriarJogadorDTO) {
    const jogador = {
      nome: criarJogadorDTO.nome,
      email: criarJogadorDTO.email,
      telefoneCelular: criarJogadorDTO.telefoneCelular,
    };

    const jogadorExistente = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogador-email', jogador.email),
    );

    if (jogadorExistente) {
      throw new BadRequestException(
        `Jogador com email ${jogador.email} já cadastrado!`,
      );
    }

    const categoria = criarJogadorDTO.categoria;

    const categoriaExistente = await lastValueFrom(
      this.clientAdminBackend.send('consultar-categoria', categoria),
    );

    if (Object.values(categoriaExistente).length > 0) {
      this.clientAdminBackend.emit('criar-jogador', {
        categoria,
        jogador,
      });
    } else {
      throw new BadRequestException('Categoria não cadastrada!');
    }
  }

  async uploadArquivo(file: any, id: string) {
    this.logger.log(`file ${file}`);

    // Verificar se o jogador esta cadastrado
    const jogadorExiste = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogador', id),
    );

    if (!jogadorExiste) {
      throw new BadRequestException(`Jogador não encontrado!`);
    }

    // Enviar o arquivo para S3
    // Recuperar a URL de acesso
    const { url: urlFotoJogador } = await this.awsService.uploadArquivo(
      file,
      id,
    );

    // Atualizar o atributo URL da entidade de jogador
    const atualizarJogadorDTO: AtualizarJogadorDTO = {};
    atualizarJogadorDTO.urlFotoJogador = urlFotoJogador;

    this.clientAdminBackend.emit('atualizar-jogador', {
      id,
      jogador: atualizarJogadorDTO,
    });

    // Retornar o jogador atualizado para o cliente
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogador', id),
    );
  }

  async consultarJogadores() {
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', ''),
    );
  }

  async consultarJogador(id: string) {
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogador', id),
    );
  }

  async atualizarJogador(
    atualizarJogadorDTO: AtualizarJogadorDTO,
    idJogador: string,
  ) {
    const jogadorExistente = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogador', idJogador),
    );

    if (!jogadorExistente) {
      throw new BadRequestException(
        `Jogador com id: ${idJogador}, não encontrado!`,
      );
    }

    this.clientAdminBackend.emit('atualizar-jogador', {
      id: idJogador,
      jogador: atualizarJogadorDTO,
    });
  }

  async deletarJogador(_id: string) {
    const jogadorExistente = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogador', _id),
    );

    if (!jogadorExistente) {
      throw new BadRequestException(`Jogador com id: ${_id}, não encontrado!`);
    }

    this.clientAdminBackend.emit('deletar-jogador', _id);
  }
}
