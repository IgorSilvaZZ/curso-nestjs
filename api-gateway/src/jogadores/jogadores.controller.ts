/* eslint-disable prettier/prettier */

import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import {
  Delete,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { AtualizarJogadorDTO } from './dtos/atualizarjogador.dto';

import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    await this.jogadoresService.criarJogador(criarJogadorDTO);
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(@UploadedFile() file, @Param('id') id: string) {
    const uploadArquivo = await this.jogadoresService.uploadArquivo(file, id);

    return uploadArquivo;
  }

  @Get()
  async consultarJogadores() {
    return await this.jogadoresService.consultarJogadores();
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  async consultarJogador(@Param('id', ValidacaoParametrosPipe) id: string) {
    return await this.jogadoresService.consultarJogador(id);
  }

  @Put('/:idJogador')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDTO: AtualizarJogadorDTO,
    @Param('idJogador', ValidacaoParametrosPipe) idJogador: string,
  ) {
    await this.jogadoresService.atualizarJogador(
      atualizarJogadorDTO,
      idJogador,
    );
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    await this.jogadoresService.deletarJogador(_id);
  }
}
