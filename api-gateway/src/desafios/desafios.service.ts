/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { CriarDesafioDTO } from './dtos/criarDesafio.dto';
import { IJogador } from '../jogadores/interfaces/jogador.interface';
import { IDesafioStatusEnum } from './interfaces/desafio-status.enum';
import { AtribuirDesafioPartidaDTO } from './dtos/atribuirDesafioPartida.dto';
import { IDesafio } from './interfaces/desafio.interface';
import { IPartida } from './interfaces/partida.interface';
import { AtualizarDesafioDTO } from './dtos/atualizarDesafio.dto';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';

@Injectable()
export class DesafiosService {
  constructor(
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
  ) {}

  private logger = new Logger(DesafiosService.name);

  private clientAdminBackend =
    this.clientProxySmartRaking.getClientProxyInstance();

  private clientChallenges =
    this.clientProxySmartRaking.getClientProxyInstanceChallenges();

  async consultarDesafiosJogador(idJogador: string) {
    const jogadorCadastrado = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogador', idJogador),
    );

    if (!jogadorCadastrado) {
      throw new BadRequestException(
        `O Jogador com id: ${idJogador}, não está cadastrado!`,
      );
    }

    const desafiosJogador = await lastValueFrom(
      this.clientChallenges.send('consultar-desafios-jogador', idJogador),
    );

    return desafiosJogador;
  }

  async criarDesafio(criarDesafioDTO: CriarDesafioDTO) {
    // Verificar se os jogadores estao cadastrados
    const jogadoresCadastrados: IJogador[] = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', ''),
    );

    const jogadoresNaoCadastrados = criarDesafioDTO.jogadores.filter(
      (jogadorCadastrado) =>
        !jogadoresCadastrados.some(
          (jogador) => jogador._id === jogadorCadastrado._id,
        ),
    );

    if (jogadoresNaoCadastrados.length > 0) {
      throw new BadRequestException(
        `Jogadore(s) ${jogadoresNaoCadastrados
          .map((item) => item._id)
          .join(', ')} não cadastrado(s)!`,
      );
    }

    // Verificar se a categoria esta cadastrada
    await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categoria',
        criarDesafioDTO.categoria,
      ),
    );

    // Verificando se o solicitante é um jogador da partida
    const solicitanteFazParteDesafio = criarDesafioDTO.jogadores.find(
      (jogador) => jogador._id === criarDesafioDTO.solicitante,
    );

    if (!solicitanteFazParteDesafio) {
      throw new BadRequestException(
        `O Solicitante com id ${criarDesafioDTO.solicitante}, não faz parte do desafio! Informe um ID solicitante que faça parte do desafio!`,
      );
    }

    // Verificando se os jogadores realmente pertencem a categoria que foi informada no body da requisição
    const jogadorCategoriaNaoCorrespondente = criarDesafioDTO.jogadores.filter(
      (jogador) =>
        jogadoresCadastrados.some(
          (jogadorCadastrado) =>
            jogador._id == jogadorCadastrado._id &&
            jogadorCadastrado.categoria !== criarDesafioDTO.categoria,
        ),
    );

    if (jogadorCategoriaNaoCorrespondente.length > 0) {
      throw new BadRequestException(
        `Jogadore(s) com id: (${jogadorCategoriaNaoCorrespondente
          .map((item) => item._id)
          .join(', ')}), não está com a categoria correspondente!`,
      );
    }

    const dataCriarDesafio = {
      ...criarDesafioDTO,
      status: IDesafioStatusEnum.PENDENTE,
    };

    return await lastValueFrom(
      this.clientChallenges.emit('criar-desafio', dataCriarDesafio),
    );
  }

  async atribuirDesafioPartida(
    idDesafio: string,
    atribuirDesafioPartidaDTO: AtribuirDesafioPartidaDTO,
  ) {
    const desafioCadastrado: IDesafio = await lastValueFrom(
      this.clientChallenges.send('consultar-desafio', idDesafio),
    );

    if (!desafioCadastrado) {
      throw new BadRequestException(
        `Desafio com id ${idDesafio}, não está cadastrado!`,
      );
    }

    if (desafioCadastrado.status === IDesafioStatusEnum.REALIZADO) {
      throw new BadRequestException(
        `Desafio com status REALIZADO não pode ser atribuido a nenhuma partida!`,
      );
    }

    if (desafioCadastrado.status !== IDesafioStatusEnum.ACEITO) {
      throw new BadRequestException(
        `Desafio informado contem status invalido!! Apenas desafios com status ACEITO podem ser atribuidos a uma partida!`,
      );
    }

    if (!desafioCadastrado.jogadores.includes(atribuirDesafioPartidaDTO.def)) {
      throw new BadRequestException(
        `Jogador vencedor com id ${atribuirDesafioPartidaDTO.def}, não faz parte do desafio!`,
      );
    }

    const novaPartida: IPartida = {
      categoria: desafioCadastrado.categoria,
      def: atribuirDesafioPartidaDTO.def,
      resultado: atribuirDesafioPartidaDTO.resultado,
      jogadores: desafioCadastrado.jogadores,
      desafio: desafioCadastrado._id,
    };

    return this.clientChallenges.emit('criar-partida', novaPartida);
  }

  async atualizarDesafio(
    idDesafio: string,
    atualizarDesafioDTO: AtualizarDesafioDTO,
  ) {
    const desafioCadastrado = await lastValueFrom(
      this.clientChallenges.send('consultar-desafio', idDesafio),
    );

    if (!desafioCadastrado) {
      throw new BadRequestException(
        `Desafio com id: ${idDesafio}, não esta cadastrado!`,
      );
    }

    if (desafioCadastrado.status !== IDesafioStatusEnum.PENDENTE) {
      throw new BadRequestException(
        `O Desafio está com status invalido! Status Pendente apenas pode ser atualizado!!`,
      );
    }

    const desafioAtualizar = {
      desafio: {
        ...desafioCadastrado,
        status: atualizarDesafioDTO.status,
      },
      idDesafio,
    };

    const desafioAtualizado = await lastValueFrom(
      this.clientChallenges.emit('atualizar-desafio', desafioAtualizar),
    );

    return desafioAtualizado;
  }

  async deletarDesafio(idDesafio: string) {
    const desafioCadastrado = await lastValueFrom(
      this.clientChallenges.send('consultar-desafio', idDesafio),
    );

    if (!desafioCadastrado) {
      throw new BadRequestException(
        `Desafio com id: ${idDesafio} não esta cadastrado!`,
      );
    }

    await lastValueFrom(
      this.clientChallenges.emit('deletar-desafio', idDesafio),
    );
  }
}
