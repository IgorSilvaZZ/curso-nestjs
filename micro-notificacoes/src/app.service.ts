/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { lastValueFrom } from 'rxjs';

import { IDesafio } from './interfaces/desafio.interface';
import { IJogador } from './interfaces/jogador.interface';

import { ClientProxySmartRanking } from './proxymq/client-proxy';
import { HTML_NOTIFICACAO_ADVERSARIO } from './static/html-notificacao-adversatio';

@Injectable()
export class AppService {
  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private readonly mailerService: MailerService,
  ) {}

  logger = new Logger(AppService.name);

  private clientAdminBackEnd =
    this.clientProxySmartRanking.getClientProxyInstanceAdminBackEnd();

  async enviarEmailParaAdversario(desafio: IDesafio) {
    //Identificando o ID do adversario
    const idAdversario = desafio.jogadores.find(
      (jogador) => jogador._id !== desafio.solicitante,
    );

    // Consultando as informações adicionais do adversario
    const adversario: IJogador = await lastValueFrom(
      this.clientAdminBackEnd.send('consultar-jogador', idAdversario),
    );

    // Consultando as informações adicionais do solicitante
    const solicitante: IJogador = await lastValueFrom(
      this.clientAdminBackEnd.send('consultar-jogador', desafio.solicitante),
    );

    let markup = HTML_NOTIFICACAO_ADVERSARIO;

    markup = markup.replace('#NOME_ADVERSARIO', adversario.nome);

    markup = markup.replace('#NOME_SOLICITANTE', solicitante.nome);

    // Enviando mensagem com service do nodeMailer (Testar com SES local)
    this.logger.log('Email sendo enviado...');

    this.mailerService
      .sendMail({
        to: adversario.email,
        from: `"SMART RANKING" <api.smartranking@gmail.com>`,
        subject: 'Notificação de Desafio',
        html: markup,
      })
      .then((success) => {
        this.logger.log('Email enviada com sucesso!');
        this.logger.log(success);
      })
      .catch((error) => {
        this.logger.error('Erro ao enviar email!');
        this.logger.error(error);
      });
  }
}
