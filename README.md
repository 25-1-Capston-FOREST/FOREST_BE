# 2024-capston
24-2 졸업프로젝트

## Team 29
|항목|내용|
|---|---|
| 팀명칭 | 컴세마리 |
| 프로젝트명 | 바쁜 일상 속 현대인의 여가 시간 고민을 줄여주는 일정 & 취향 맞춤형 여가 추천 서비스 |
| 키워드 | AI, 공공 데이터, 맞춤형 여가 추천 |
| 무엇을 만들고자 하는가 | 사용자의 취향과 위치, 일정을 분석하여 최적의 여가 활동을 제안하는 AI 기반 사용자 맞춤형 여가 추천 서비스입니다. <br>이 서비스는 최신 영화, 공연, 전시의 다양한 정보를 한 곳에서 조회할 수 있는 통합 플랫폼의 양상을 띠며, 추천 알고리즘을 통해 해당 서비스 내에서 핵심 기능인 사용자 맞춤형 여가 추천 기능을 수행합니다. 추천 알고리즘은 사용자들이 경험한 여가에 남긴 평점 데이터가 축적될수록 더욱 정교해집니다.|
| 고객 | 주요 타겟 고객은 자신의 취향에 맞는 실시간 여가 활동을 찾을 시간이나 여유가 없어 결정을 내리기 어려운 현대인입니다. 구체적으로 설정한 고객 페르소나는 IT 계열 회사에 근무하는 30대 초반 미혼 여성 개발자 김이화씨입니다. 김이화 씨는 평일 근무시간이 바빠서 여가 시간을 계획할 시간이 부족하며, 혼자 뮤지컬이나 영화를 관람하는 것을 좋아하지만 현재 공연이나 상영 중 정보를 찾을 여유가 없어 관람에 어려움을 겪고 있습니다. 계획적이고 체계적인 성격을 가진 그녀는 서울에서 혼자 거주하며, 여가 계획 수립에 있어 간편한 솔루션을 필요로 합니다. |
| Pain Point | 선택지의 과다로 인해 어떤 여가 활동을 즐길지 결정을 내리지 못해 시간이 낭비되는 경우가 많습니다. 또한, 여가 활동에 대한 정보가 여러 플랫폼에 분산되어 있어서 필요한 정보를 탐색하는 데 많은 시간이 소요되어 불편함을 느끼는 사용자들이 많습니다. <br>하지만 개개인의 위치와 일정을 반영하여 여가 활동을 추천해주는 서비스가 부족하여, 사용자들은 적합한 여가 활동을 발견하고 예약하는 데 어려움을 겪고 있습니다. |
| 솔루션 | [FE]<br>- Language : CSS, Html, TypeScript<br>- Library : React native https://reactnative.dev/<br><br>[BE]<br>- Language : JavaScript <br>- Framework : Node.js (https://nodejs.org/ko)<br>- DB : MySQL https://www.mysql.com/<br>- Server: AWS EC2 https://aws.amazon.com/ko/ec2/<br><br>[API]<br>- 네이버 지도API  [Maps - Application Services - NAVER Cloud Platform 네이버 클라우드 플랫폼 (ncloud.com)](https://www.ncloud.com/product/applicationService/maps#overview)<br><br>[Data]<br>- 영화 상영 정보 API <br>(영화진흥위원회): https://www.kobis.or.kr/kobisopenapi/homepg/apiservice/searchServiceInfo.do<br>(KMDb 한국영화데이터베이스): https://www.kmdb.or.kr/info/api/apiDetail/6<br>(영상물등급위원회 영화 등급분류정보 조회 서비스): https://www.data.go.kr/data/15127668/openapi.do#/tab_layer_prcuse_exam<br>- 공연전시 정보 API (한국문화정보원): https://www.data.go.kr/data/15000120/openapi.do<br><br>[AI Algorithm]<br>- 협업 필터링: Surprise Library SVD 모델 https://github.com/NicolasHug/Surprise <br>- 콘텐츠 기반 추천 :<br>-scikit-learn의 pairwise 모듈의 cosine similarity https://scikit-learn.org/stable/modules/metrics.html#metrics<br>- sklearn.feature_extraction.text 모듈의 TfidfVectorizer https://scikit-learn.org/1.5/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html <br>- 추천 알고리즘 : surprise library https://github.com/NicolasHug/Surprise |
| 오래 축적한 데이타의 잠재적 가치 | 서비스를 통해 다양한 성별과 연령대의 사용자 데이터가 축적되며, 이를 통해 특정 계층의 선호도를 분석하여 추천 알고리즘의 정확도를 높일 수 있습니다. 사용자가 남긴 평가 데이터는 새로운 여가 활동에 대한 선호도를 예측하거나 유사한 취향을 가진 사용자의 활동 추천에 활용될 수 있습니다. 이러한 데이터를 바탕으로 여가 활동 소비 패턴을 분석하여 더개인화된 맞춤형 서비스를 강화할 수 있습니다.  |
| 기대성과 | 여가 활동의 소비자가 증가하고 여가 산업의 규모가 확장되어, 더욱 다채로운 예술 문화를 경험할 수 있는 기회를 제공할 것입니다. 사용자의 취향, 위치, 일정에 따른 여가 활동을 추천하기 때문에, 주류 중심의 공연 예술 시장에서 비주류 여가 활동도 알려지는 기회를 제공하여 다양한 여가 문화 형성에 기여합니다. 또한, 많은 사람들이 여가 활동을 즐기면서 스트레스를 해소하여 삶의 질을 높이게 되고, 정신 건강 개선에 따른 사회적 비용 절감과 같은 효과도 기대할 수 있습니다. 경제적 관점에서는 여가 제공 업체와의 협력을 통해 업체 홍보와 수수료 기반의 수익 구조를 구축함으로써 사업적 가치를 창출할 수 있습니다. |
| 팀 그라운드룰 | https://github.com/dxxrjh/2024-capston/blob/main/GROUND_RULES.md |
