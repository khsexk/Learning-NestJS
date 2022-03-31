# 🔐 Nest로 인증 시스템 만들기

## 1. auth 모듈, 컨트롤러, 서비스 생성
```terminal
npm g module auth
npm g controller auth --no-spec
npm g service auth --no-spec
```

## 2. User를 위한 Entity 생성
: 유저에 대한 인정을 하는 것이기 때문에 유저 엔티티 생성  
```text
1. user.entity.ts 생성
2. 파일 소스 코드 작성
```

## 3. Repository 생성
: User Entity를 생성, 수정, 삭제 등의 로직을 처리하기 위해 Repository 생성  
```text
1. user.repository.ts 생성
2. 소스 코드 작성
```

## 4. User Repository 등록
: 생성된 UserRepository를 다른 곳에서 사용하기 위해 auth module에서 imports 안에 UserRepository를 넣어줌  

## 5. Repository Injection
: User Repository를 auth Service 안에서 사용하기 위해서 UserRepository를 넣어줌  

## 📝 유니크한 필드값 주기
- 1. repository에서 findOne 메서드를 이용해 이미 같은 유저 이름을 가진 id가 있는지 확인 후 없을 때 데이터 저장하는 방법
- 2. DB 레벨에서 만약 같은 이름을 가진 유저가 있다면 에러를 던져주는 방법 (✓)  
    - Entity에 **@Unique(['필드명'])** 데코레이터로 표시해주면 끝
    - **try ~ catch** 구문을 통해 원하는 에러를 던질 수도 있음

## 📝 Password 데이터 저장하는 방법
- 1. 원본 비밀번호 저장
    - 보안이 아예 없음 (최악)
- 2. 비밀번호를 암호화 키와 함께 암호화 
    - 암호화 키가 노출되면 알고리즘은 대부분은 오픈돼 있기 때문에 복호화 가능 (위험도 up!)
- 3. SHA 256 등을 이용한 Hash로 암호화해서 저장 (단방향)
    - 레인보우 테이블을 만들어서 암호화된 비밀번호를 비교해서 비밀번호를 알아냄
- 4. salt + password 를 Hash로 암호화해서 저장  