# Nest에서 JWT 사용하기

## 1. 필요 모듈 설치
```shell
npm install @nestjs/jwt @nestjs/passport passport passport-jwt --save
```
- **@nestjs/jwt** : nest js에서 jwt를 사용하기 위해 필요한 모듈
- **@nestjs/passport** : nestjs에서 passport를 사용하기 위해 필요한 모듈
- **passport** : passport 모듈
- **passport-jwt** : jwt 모듈

## 2. 모듈 등록
```typescript
// auth.moudule.ts
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),    // ii
        JwtModule.register({    // i
            secret: 'Secret1234',
            signOptions: {
                expiresIn: 60 * 60,
            }
        }),
        TypeOrmModule.forFeature([UserRepository])
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
```  
- i) auth 모듈에 JWT 모듈 등록
    - secret: secret text
    - expiresIn: 토큰 유효시간
- ii) auth 모듈에 passport 모듈 등록

## 3. 로그인 시 토큰 생성
```typescript
// auth.service.ts
async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne( { username } );

    if(user && (await bcrypt.compare(password, user.password))){
        // 유저 토큰 생성 (Secret + Payload)
        const Payload = { username }; // payload에 중요 정보는 넣으면 안됨
        const accessToken = await this.jwtService.sign(Payload);

        return { accessToken};
    } else {
        throw new UnauthorizedException('login failed');
    }
}
```

## 4. Passport와 JWT를 이용해 토큰 인증 후 유저 정보 가져오기
> ***Passport의 역할***  
> 토큰이 유효한 토큰인지 서버에서 secret text를 이용해 알아내면 payload 안 유저 이름을 이용해서 DB에서 해당 유저 정보를 가져오는 등의 처리를 쉽게 해줌  

```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ){
        super({
            secretOrKey: 'Secret1234',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload){
        const { username } = payload;
        const user: User = await this.userRepository.findOne({ username });

        if(!user){
            throw new UnauthorizedException();
        } 

        return user;
    }
}
```  

- i) **@types/passport-jwt** 모듈 설치 (passport-jwt 모듈을 위한 타입 정의 모듈)
- ii) **jwt.strategy.ts** 모듈 생성
    - PassportStrategy 상속 
        - → ***extends PassportStrategy(Strategy)***
        - Strategy가 import 되는 곳은 Passport/JWT
    - 생성자에 UserRepository 주입
        - 토큰이 유효한지 인증을 위해 유저 이름으로 유저 객체를 DB에서 가져오기 위해 필요
        - **super({})** 안에 secretOrKey와 jwtFromRequest 작성
            - secretOrKey: 암호 해독 방식을 사용하기 위해서는 랜덤키
            - jwtFromRequest: header에 지정된 스키마에 담겨온 토큰 해석할 것 (bearer 스키마를 많이 사용)
    - 유효성 체크를 위한 **validate 함수** 작성
        - UserRepository 사용
- iii) JwtStrategy를 사용하기 위해 
    - AuthModule Providers 항목에 넣어주고,
    - 다른 곳에서도 JwtStrategy와 PassportModule도 사용해야 하기 때문에 exports 항목에 넣어줌  
```typescript
// auth.modules.ts
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'Secret1234',
      signOptions: {
        expiresIn: 60 * 60,
      }
    }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],    // 현재 auth 모듈에서 사용하기 위해 넣어줌
  exports: [JwtModule, PassportModule]  // 다른 곳에서도 사용하기 위해 넣어줌
})
```

### But! JwtStrategy에서 작성한 'return user'만으로 유저 객체를 가져올 수 없다.
**→ @UseGuards(AuthGuard)를 이용해 request 안에 유저 정보를 넣어주자**
- **✎ Guards란?** 인증 미들웨어로, 지정된 경로로 통과할 수 있는 사람과 허용되지 않는 사람을 Server에 알려줌
- **✎ AuthGuard란?** nestjs/Passport에서 가져온 Guard  
```typescript
// auth.controller.ts
// 1. @UseGaurd를 사용하지 않은 경우 → 객체 정보를 가져오지 못한다
@Post('/test')
test(@Req() req){
    console.log('req', req);
}

// 2. @UseGaurd를 사용한 경우 → 토큰 인증 후 객체 정보를 가져오거나 오류를 던짐
@Post('/test')
@UseGuards(AuthGuard())
test(@Req() req){
    console.log('req', req);
}
``` 
## 5. 커스텀 데코레이터
&nbsp; 위까지의 과정을 통해 토큰 인증 후 user 객체를 가져왔다. 하지만 controller의 데코레이터에서 알 수 있듯이 user는 req.user를 통해 얻어온 것이다. req.user가 아닌 바로 user라는 파라미터로 가져올 수 있는, user 객체의 정보만 가져올 수 있는 방법이 있을까?  
### 커스텀 데코레이터를 사용해보자.
: 아래와 같이 작성하고, controller의 param을 바꿔주면 된다.
```typescript
// get-user.decorator.ts
export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
})
```

## 6. 인증된 유저만 게시물을 보고 쓸 수 있게 만들기
