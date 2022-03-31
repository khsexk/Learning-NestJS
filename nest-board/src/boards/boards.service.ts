import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';


// uuid 모듈을 이용하여 유니크한 id값 전달 (v1 버전 사용)
import { v1 as uuid} from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ){}
    
    createBoard(createBoardDto: CreateBoardDto) : Promise<Board> {
        return this.boardRepository.createBoard(createBoardDto);
    }

    async getBoardById(id: number): Promise <Board> {
        const found = await this.boardRepository.findOne(id);

        if(!found){
            throw new NotFoundException(`Cannot find Board with id: ${id}`)
        }
        return found;
    }

    async getAllBoards(): Promise<Board[]> {
        return this.boardRepository.find();
    }

    // remove와 delete의 차이
    // remove는 삭제하려는 데이터가 없으면 404 에러 발생
    // delete는 삭제하려는 데이터가 없으면 동작 X
    async deleteBoard(id: number): Promise <void> {
        const result = await this.boardRepository.delete(id);

        if(result.affected === 0){
            throw new NotFoundException(`Cannot find Board with id ${id}`);
        }

        console.log('result', result);
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise <Board>{
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);
        
        return board;
    }
}
