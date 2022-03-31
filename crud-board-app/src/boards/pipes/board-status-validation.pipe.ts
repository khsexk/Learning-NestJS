import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board.model"

// BoardStatus update 시 유효성 체크
export class BoardStatusValidationPipe implements PipeTransform{
    readonly StatusOptions = [
        BoardStatus.PRIVATE,
        BoardStatus.PUBLIC
    ]
    
    transform(value: any){
        value = value.toUpperCase();

        if(!this.isStatusValid(value)){
            throw new BadRequestException(`${value} is not in the status options`)
        }
        return value;
    }

    private isStatusValid(status: any){
        const index = this.StatusOptions.indexOf(status);
        return index !== -1;
    }
}