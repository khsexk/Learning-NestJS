import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
export class BoardsController {
    constructor(private boardsService: BoardsService){}

    @Get()
    getAllBoard(): Board[] {
        // Service에서 요청 처리
        return this.boardsService.getAllBoards();
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(
        // express js에서 req.body에 해당하는 부분
        /*@Body('title') title: string,
        @Body('description') description: string*/
        @Body() createBoardDto: CreateBoardDto

    ): Board {
        return this.boardsService.createBoard(createBoardDto);
    }

    // Get 방식일 때는 @Param 사용
    /*
        여러개를 가져올 때: @Param() params: string[]
          id만 가져올 때: @Param('id') id: string
    */
    @Get('/:id')
    getBoardById(@Param('id') id: string): Board{
        return this.boardsService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(@Param('id') id: string): void {
        this.boardsService.deleteBoard(id);
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id') id: string,
        @Param('status', BoardStatusValidationPipe) status: BoardStatus
    ) {
        return this.boardsService.updateBoardStatus(id, status);
    }
}
