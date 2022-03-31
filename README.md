# about "Nest js Framework"

## 1. NestJS란?
def) 효율적이고 확장 가능한 Node js 서버 측 애플리케이션을 구축하기 위한 framework  
- progressive한 JavaScript를 사용하고, TypeScript로 빌드 
- OOP, FP, FRP 요소를 사용할 수 있게 해줌

### ❖ 내부 구성
- Express(기본값)와 같은 강력한 HTTP 서버 프레임 워크를 사용하며 선택적으로 Fastify를 사용하도록 구성 가능  
    - (📝 Fastify: Node js를 위한 빠르면서도 오버헤드가 적은 Web Framework)  
- Node js Framework(Express or Fastify) 위에 추상화 수준을 제공하지만, API를 개발자에게 직접 노출하고, 이를 통해 개발자는 기본 플랫폼에서 사용할 수 잇는 수많은 타사 모듈을 자유롭게 사용할 수 있음

### ❖ 철학
: 개발자와 팀이 고도로 테스트 가능하고, 확장 가능하며, 느슨하게 결합되고 유지 관리가 쉬운 애플리케이션을 만들 수 있는 즉시 사용 가능한 애플리케이션 아키텍처를 제공함

### ❖ 공식문서: [Nest JS 공식문서](https://docs.nestjs.com/)

## 2. NestJS 시작하기
- Nest CLI를 이용하여 프로젝트 시작
```shell
$ npm i -g @nestjs/cli
$ nest new project-name
```  

- **.eslintrc.js**
    - 개발자들이 특정한 규칙을 가지고 코드를 깔끔하게 짤 수 있게 도와주는 라이브러리
    - ts를 쓰는 가이드 라인 제시
    - 문법에 오류가 나면 알려주는 역할, etc
- **.prettierrc**
    - 코드의 형식을 맞춰줌
    - 작은 따옴표를 사용할지, 큰 따옴표를 사용할지
    - Indent 값을 2로 줄지, 4로 줄지 등
    - 코드 포맷터 역할
- **nest-cli.json**
    - nest js 프로젝트 자체에 필요한 설정
- src/**main.js**
    - application 생성
    - 프로젝트 실행 시작점  

**☛ 프로젝트를 시작할 때는 " $ npm run start:dev " → (package.json 참고)**  

## 3. Nest 로직 흐름

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000); // 포트 설정
}
bootstrap();
```
- app.module.ts에 등록돼 있는 모듈을 main.ts에서 create해줌
- 포트 설정 후 실행
- app.controller.ts에서 모듈 실행  

<img src='./img/usecase.png' width=512>  

## 4. NestJS 모듈
: 게시판 Application을 만든다면 Root 모듈 안에 Board 모듈, Auth 모듈이 포함돼 있고, 각 모듈 안에는 controller, service, repository, entity 등이 있다.  

- **Nest JS 모듈**: @Module () 데코레이터로 주석이 달린 클래스
- **@Module () 데코레이터**: Nest가 application 구조를 구성하는 데 사용하는 메타 데이터를 제공
- 각 응용 프로그램에는 하나 이상의 모듈(root module)이 있음
- root module: Nest가 사용하는 시작점
- 같은 기능에 해당하는 것들은 하나의 모듈 폴더 안에 넣어서 사용
- 모듈은 기본적으로 Single-tone → 여러 모듈 간 쉽게 공급자의 동일한 인스턴스 공유 가능  

### ❖ Module 생성 명령어
```shell
$ nest g module 모듈이름
```  
- nest: nest-cli 사용
- g: generate  

## 5. NestJS 컨트롤러
: 들어오는 request를 처리하고 클라이언트에 response를 반환  

- **@Controller() 데코레이터**: 컨트롤러 클래스 정의  
- **Handler**: @Get, @Post, @Delete 등과 같은 데코레이터로 장신 된 컨트롤러 클래스 내의 단순한 메서드

### ❖ Controller 생성 명령어
```shell
$ nest g controller 컨트롤러이름 --no-spec
```  
- --no-spec: 테스트를 위한 소스 코드를 생성하지 않는 옵션  

## 6. NestJS 서비스
: Controller에서 데이터의 유효성 체크를 하거나 DB에 item을 생성하는 등의 작업 처리  
→ **@Injectable** 데코레이터로 감싸져서 모듈에 제공되며, 이 Service Instance는 application 전체에서 사용 가능  
```shell
$ nest g service 서비스이름 --no-spec
```  
- 생성된 Service에는 Injectable 데코레이터가 있음
- **Injectable** → 다른 컴포넌트에서 이 서비스를 사용할 수 있게 만듦  

### ❖ Service를 Controller에서 이용할 수 있게 해주기
: Nest JS에서 Dependency Injection은 클래스의 Constructor 안에서 이루어 짐
**☛ Dependency Injection**  

- 📝 Typescript의 도움을 받아 접근 제한자 사용 가능  

<img src='./img/dependencyInjection.png'>    

→ 접근 제한자를 생성자 파라미터에 선언하면 접근 제한자가 사용된 생성자 파라미터는 암묵적으로 class property로 선언됨  

### Provider란?
: Nest의 기본 개념으로, 대부분의 Nest 클래스는 service, repository, factory, helper 등 provider로 취급될 수 있음  
→ 종속성 주입 가능 (필요한 서비스를 컨트롤러에 넣어주는 것)  
#### 객체는 서로 다양한 관계를 만들 수 있으며, 객체의 instance를 연결하는 기능은 대부분 Nest 런타임 시스템에 위임될 수 있음
→ Provider를 사용하기 위해서 **module** 파일에 providers 항목 안에 해당 module에서 사용하고자 하는 Provider를 넣어주면 됨  


## 7. DTO(; Data Transfer Object)
: 객체간 데이터 교환을 위한 객체  
: DB에서 데이터를 얻어 Service나 Controller 등으로 보낼 떄 사용하는 객체  
: 데이터가 Network를 통해 전송되는 방법을 정의하는 객체  
  
- 데이터 유효성을 체크하는 데 효율적
- 더 안정적인 코드로 만들어 줌 (TS의 타입으로도 사용됨)
- 많은 Property를 갖고 여러 군데에서 사용하다가 name 수정 시 용이
    - ☛ application 유지보수 용이  

## 8. Pipe 
: @Injectable() 데코레이터로 주석이 달린 클래스
- data transformation과 data validation을 위해 사용
- controller 경로 처리기에 의해 처리되는 인수에 대해 작동
- Nest는 메서드가 호출되기 직전에 파이프를 삽입하고, pipe는 메서드로 향하는 인수를 수신하고 이에 대해 작동함    

### ❖ Data Transformation
: 입력 데이터를 원하는 방식으로 변환  
ex) integer를 받길 원했는데 string 형식으로 온다면 파이프에서 자동으로 변환  

### ❖ Data Validation
: 입력 데이터를 평가하고 유효한 경우 변경되지 않은 상태로 전달하고, 데이터가 올바르지 않을 때 예외 발생  

#### ☛ 파이프는 위에 두 경우에서 Route Handler가 처리하는 인수에 대해서 작동한다. 그리고 메서드를 바로 직전에 작동해서 메서드로 향하는 인수에 대해서 변환할 것이 있으면 변환하고 유효성 체크를 위해서도 호출된다.

### ❖ Pipe 사용법 (Binding Pipes)
- **Handler-Level Pipes**
    - 핸들러 레벨에서 @UsePipes() 데코레이터를 이용해서 사용할 수 있음
    - 모든 Parameter에 적용됨   
```typescript
@Post()
@UsePipes(pipe)
createBoard(
    @Body('title') title,
    @Body('description') description
) {
    // ...
}
```  

- **Parameter-Level Pipes**
    - 특정한 Parameter에게만 적용되는 파이프  
```typescript
@Post()
createBoard(
    @Body('title', ParameterPipe) title,
    @Body('description') description
) {
    // ...
}
```  

- **Global Pipes**
    - application 레벨의 파이프
    - client의 모든 request에 적용
    - 최상단 영역인 main.ts에 넣어줌
```typescript
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(GlobalPipes);
    await app.listen(3000);
}

bootstrap();
```  

### ❖ Pipe를 이용한 유효성 체크

- **필요한 모듈 설치**
```terminal
npm install class-validator class-transformer --save
```
- **[Document](https://github.com/typestack/class-validator#manual-validation)**  

- DTO에서 **@IsNotEmpty()** 데코레이터 사용
- controller에서 **@UsePipes(ValidationPipe)** 데코레이터 사용

### ❖ 커스텀 파이프 구현 방법

- **PipeTransform** 인터페이스를 새롭게 만들 커스텀 파이프에 구현해줘야 함
    - **PipeTransform** : 모든 파이프에서 구현해줘야 하는 인터페이스
- PipeTransform 인터페이스와 함께 모든 파이프는 **transform()** 메서드가 필요
    - **transform()** : NestJS가 인자(arguments)를 처리하기 위해 사용  

```javascript

```  
> ***예제에서 커스텀 할 파이프: BoardStatusValidationPipe***
> 기능: Status는 PUBLIC과 PRIVATE만 올 수 있기 때문에 이외의 값이 올 예외 처리
> readonly class property
    > 접두사 **readonly**는 속성을 읽기 전용으로 만드는 데 사용
    > 읽기 전용 멤버는 클래스 외부에서 access 할 수 있지만 해당 값은 변결 불가능  

#### ✎ transform() 메서드
- 첫 번째 파라미터: 처리가 된 인자의 값(value)
- 두 번째 파라미터: 인자에 대한 메타 데이터를 포함한 객체  
- 리턴된 값이 Route 핸들러로 전해짐
- 만약 예외 발생 시 Client에 바로 전해짐 

* * *

참고 영상 및 이미지 출처: [John Ahn님 강의](https://www.inflearn.com/course/따라하는-네스트-제이에스#curriculum)