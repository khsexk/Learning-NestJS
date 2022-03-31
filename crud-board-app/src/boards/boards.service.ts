import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';


// uuid 모듈을 이용하여 유니크한 id값 전달 (v1 버전 사용)
import { v1 as uuid} from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
    private boards: Board[] = [];  // 다른 컴포넌트에서 배열을 수정하지 못하게 private으로 지정

    getAllBoards(): Board[] {
        return this.boards;
    }

    createBoard(createBoardDto: CreateBoardDto) {
        const {title, description} = createBoardDto;
        const board: Board = {
            id: uuid(), // unique한 id 
            title,
            description,
            status: BoardStatus.PUBLIC,
        }

        this.boards.push(board);
        return board;
    }

    getBoardById(id: string): Board {
        const found = this.boards.find((board) => board.id === id);
        
        // 찾을 수 없는 게시물 처리
        if(!found) {
            throw new NotFoundException(`cannot found id: ${id}`);
        }
        return found;
    }

    // filter:  주어진 함수의 테스트를 통과하는 모든 요소를 모아 새로운 배열로 반환
    deleteBoard(id: string): void {
        // getBoardById의 유효성 체크로 없는 게시물 삭제에 대한 처리
        const found = this.getBoardById(id);

        this.boards = this.boards.filter((board) => board.id !== found.id); // 같은 것만 삭제
    }

    updateBoardStatus(id: string, status: BoardStatus): Board {
        const board = this.getBoardById(id);
        board.status = status;
        return board;
    }
}
