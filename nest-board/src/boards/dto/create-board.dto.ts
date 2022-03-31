// 인터페이스가 아닌 클래스 사용
// 클래스는 인터페이스와 다르게 런타임에서 작동하기 때문에 pipe 같은 기능을 이용할 때 더 유용함

import { IsNotEmpty } from "class-validator"; // validation check

export class CreateBoardDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

}