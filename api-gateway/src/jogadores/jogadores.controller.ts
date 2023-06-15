/* eslint-disable prettier/prettier */

import {
  Controller,
  Logger,
  Post,
  ValidationPipe,
  Body,
  Get,
  Put,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { AtualizarJogadorDTO } from './dtos/atualizarjogador.dto';
import { AwsService } from '../aws/aws.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
    private readonly awsService: AwsService,
  ) {}

  private logger = new Logger(JogadoresController.name);

  private clientAdminBackend =
    this.clientProxySmartRaking.getClientProxyInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    const jogador = {
      nome: criarJogadorDTO.nome,
      email: criarJogadorDTO.email,
      telefoneCelular: criarJogadorDTO.telefoneCelular,
    };

    const idCategoria = criarJogadorDTO.idCategoria;

    const categoria = await this.clientAdminBackend.send(
      'consultar-categorias',
      idCategoria,
    );

    if (Object.values(categoria).length > 0) {
      await this.clientAdminBackend.emit('criar-jogador', {
        idCategoria,
        jogador,
      });
    } else {
      throw new BadRequestException('Categoria não cadastrada!');
    }
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(@UploadedFile() file, @Param('id') id: string) {
    this.logger.log(`file ${file}`);

    // Verificar se o jogador esta cadastrado
    const jogadorExiste = await this.clientAdminBackend.send(
      'consultar-jogador',
      id,
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

    await this.clientAdminBackend.emit('atualizar-jogador', {
      id,
      jogador: atualizarJogadorDTO,
    });

    // Retornar o jogador atualizado para o cliente
    return this.clientAdminBackend.send('consultar-jogador', id);
  }

  @Get()
  consultarJogadores(): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', '');
  }

  @Get()
  consultarJogador(
    @Query('idJogador', ValidacaoParametrosPipe) _id: string,
  ): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogador', _id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  atualizarJogador(
    @Body() atualizarJogadorDTO: AtualizarJogadorDTO,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-jogador', {
      id: _id,
      jogador: atualizarJogadorDTO,
    });
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    this.clientAdminBackend.emit('deletar-jogador', _id);
  }
}
