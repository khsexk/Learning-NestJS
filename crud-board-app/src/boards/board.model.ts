// board의 구조만 정의 -> 인터페이스 사용

export interface Board {
    id: string;
    title: string;
    description: string;
    status: BoardStatus;   // 공개글인지 비공개글인지 상태
}

export enum BoardStatus {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}