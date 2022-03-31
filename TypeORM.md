# 1. TypeORM이란?

### ✎ 정의
: node js에서 실행되고 TypeScript로 작성된 객체 관계형 매퍼 라이브러리

### ✎ 지원 DB
- MySQL
- PostgreSQL
- MariaDB
- SQLite
- MS SQL Server
- Oracle
- SAP Hana 및 WebSQL  
과 같은 여러 DB 지원

### 📝 ORM(; Object Relational Mapping)이란?
: 객체와 관계형 DB의 데이터를 자동으로 변형 및 연결하는 작업  
→ 객체와 DB의 변형에 유연하게 사용 가능  

- Pure JS code
```javascript
db.query('SELECT * FROM boards WHERE title="Hello" AND status="PUBLIC", (err, result) => {
    if(err){
        throw new Error("Error");
    }
    boards = result.rows;
});
```  
- TypeORM
```javascript
const boards = Board.find({
    title: "Hello",
    status: "PUBLIC",
});
```

### ✎ TypeORM 특징과 이점
- ***특징***
    - model을 기반으로 DB table 체계를 자동으로 생성
    - DB에서 개체를 쉽게 CRUD 할 수 있음
    - table 간의 매핑(1:1, 1:N, N:M)을 만듦
    - 간단한 CLI 명령 제공  
- ***이점***
    - 간단한 코딩으로 ORM framework 사용이 쉬움
    - 다른 모듈과 쉽게 통합됨  

### ✎ TypeORM을 사용하기 위해 설치해야 하는 모듈
```terminal
npm install pg typeorm @nestjs/typeorm
```
- **@nestjs/typeorm**: Nest js에서 TypeORM을 사용하기 위해 연동시켜주는 모듈
- **typeorm**: TypeORM 모듈
- **pg**: Postgres 모듈 (실습 DB를 PostgreSQL 사용)

#### [Document](https://docs.nestjs.com/techniques/database)

 ### 📝 TypeORM을 application에 연결하기
 **1. TypeORM 설정파일 생성**  
 <img src='./img/typeormConfig.png' width=384>  

 **2. TypeORM 설정파일 작성**  
 ```typescript

 ```
 - **synchronize**: true 값을 주면 application을 다시 실행할 때, 엔티티 안에 수정된 컬럼의 값이 타입 변경값 등을 해당 테이블을 Drop한 후 다시 생성해줌   

 **3. root Module에서 Import** 
```typescript
@Module({
    imports: [
        TypeOrmModule.forRoot(typeORMConfig),
        BoardsModule
    ],
})
export class AppModule {}
```  
- forRoot 안에 넣어준 설정(configuration)은 모든 Sub-Module 부수적인 모듈들에 다 적용됨  
  
# 2. Entity
→ TypeORM을 사용할 때는 DB 테이블로 변환되는 class이기 때문에 클래스를 생성한 후 그 안에 컬럼들을 정의해줘야 함  

- **@Entity()** : 클래스가 엔티티임을 나타내는 데 사용
- **@PrimaryGeneratedColumn()** : 지정된 열이 엔티티의 기본 키 열임을 표현
- **@Column** : 엔티티의 기본 키가 아닌 열  
```typescript
import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BoardStatus } from "./board.model";

export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: BoardStatus;
}
```

# 3. Repository
: Entity 개체와 함께 작동하며 Entity 찾기, 삽입, 업데이트, 삭제 등을 처리  
→ DB와 관련된 일은 Service가 아닌 Repository에서 해줌 : **Repository Pattern**  
#### [Document](https://typeorm.delightful.studio/classes/_repository_repository_.repository.html)

### 📝 Repository 생성하기
- 1. Repository 파일 생성
- 2. 생성한 파일에 Repository를 위한 클래스 생성
    - 생성 시 Repository 클래스를 Extends 해줌
    - **@EntityRepository()**
        - 클래스를 사용자 정의 저장소로 선언하는 데 사용됨
        - 사용자 지정 저장소는 일부 특정 엔티티를 관리하거나 일반 저장소일 수 있음
- 3. 생성한 Repository를 다른 곳에서도 사용할 수 있게 module에서 import해줌  
```typescript
```
