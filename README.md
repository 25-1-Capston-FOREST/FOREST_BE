# FOREST_BE

## Team-29 컴세마리 🧸🧸🧸
| **(1) 과제명** | 빠른 여가 선택을 도와주는 1:1 맞춤형 영화/공연/전시 추천 서비스 |
|:---|:---|
| **(2) 팀 번호 / 팀 이름** | 29-컴세마리 |
| **(3) 팀 구성원** | 김민수(2130005): 리더, 프론트엔드  <br> 문지현(2276108): 팀원, 백엔드 <br> 서혜지(2171019): 팀원, AI |
| **(4) 팀 지도교수** | 심재형 교수님 |
| **(5) 과제 분류** | 산학 |
| **(6) 과제 키워드** | AI, 공공 데이터, 맞춤형 여가 추천 |
| **(7) 과제 내용 요약** | 사용자의 취향을 분석하여 최적의 여가 활동을 제안하는 1:1 맞춤형 영화/공연/전시 추천 서비스입니다. <br>최신 영화, 공연, 전시의 다양한 정보를 한 곳에서 조회할 수 있는 기능을 제공합니다. 사용자와 챗봇 간의 대화를 통해 사용자의 취향 데이터를 수집하고, 추천 알고리즘을 통해 해당 서비스 내에서 핵심 기능인 사용자 맞춤형 여가 추천 기능을 수행합니다. 추천 알고리즘은 사용자들이 경험한 여가에 남긴 평점 데이터가 축적될수록 더욱 정교해집니다. |


## 🛠 사용 기술 스택
| 영역  | 기술                            |
| --- | ----------------------------- |
| 서버  | Node.js (Express)             |
| DB  | MySQL (AWS RDS)               |
| ORM | Prisma                        |
| 배포  | AWS EC2 (Ubuntu), pm2         |
| 인증  | JWT                           |
| 기타  | dotenv, bcrypt, cors, axios 등 |

## 📁 디렉토리 구조
```
FOREST_BE/
├── github/ # Github 관련 파일
│ └── workflows/ # Github Action Workflow 관련 파일
│     └── deploy.yml  # Github Action CD 파일
├── prisma/ # Prisma 스키마 및 마이그레이션
│ └── schema.prisma
├── src/
│ ├── controllers/ # 각 API 라우트 핸들러
│ ├── services/ # 비즈니스 로직
│ ├── repositories/ # DB 접근 로직
│ ├── dtos/ # 응답 구조화
│ ├── middlewares/ # JWT 인증 미들웨어
│ ├── scheduler/ # 크론 스케줄링
│ └── index.js # 서버 진입점
├── .env # 환경변수 설정 파일
├── package.json # 프로젝트 메타 정보 및 의존성
├── db.config.js # 데이터베이스 연결 설정
├── auth.config.js # 인증 관련 설정
├── swagger.yaml # Swagger API 명세서
├── README.md # 프로젝트 설명서
└── ...
```

## ⚙️ 설치 및 실행 방법
#### 1. 프로젝트 클론
```
git clone https://github.com/25-1-Capston-FOREST/FOREST_BE.git
cd FOREST_BE
```

#### 2. 패키지 설치
```
npm install
```
#### 3. 환경변수 설정
```
DB_HOST=db-forest.ch44iq6y0ulb.ap-northeast-2.rds.amazonaws.com
PORT=3001
GOOGLE_CLIENT_ID="구글 클라우드 콘솔에서 발급 후 삽입"
GOOGLE_CLIENT_SECRET="구글 클라우드 콘솔에서 발급 후 삽입"
JWT_SECRET="JWT 토큰 지정 후 삽입"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"
DATABASE_URL="mysql://admin:comthreeinthehouse@db-forest.ch44iq6y0ulb.ap-northeast-2.rds.amazonaws.com:3306/DB_FOREST"
KOBIS_API_KEY="267c3346743815442f2129abc1ba2f12"
KOPIS_API_KEY=b47a469166554c1591deee9ecf13dacb
```
#### 4. 데이터베이스 설정
Prisma 스키마 기반으로 MySQL에 테이블을 생성합니다.
```
npx prisma db pull
npx prisma generate
```

#### 5. 로컬 서버 실행
```
npm run start
```


## 서버 주소
https://capston-forest.duckdns.org

## 개발자 정보
https://github.com/dxxrjh
