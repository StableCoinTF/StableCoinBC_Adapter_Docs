# StableCoin BC Adapter - Kafka API 문서

StableCoin 블록체인 어댑터의 Kafka 메시지 스펙 문서입니다.

## 배포 URL

https://kp10834.github.io/StableCoinBC_Adapter_Docs/

## 프로젝트 구조

```
asyncapi.yaml        # AsyncAPI 스펙 (메시지 정의 원본)
custom.css           # 커스텀 UI 스타일
custom.js            # 사이드바 active 상태 관리
docs/                # 빌드된 HTML 문서
.github/workflows/   # GitHub Pages 자동 배포
```

## 자동 배포

`asyncapi.yaml`, `custom.css`, `custom.js` 수정 후 `main` 브랜치에 push하면 GitHub Actions가 자동으로:

1. AsyncAPI HTML 생성
2. 한글 치환 적용
3. 커스텀 CSS/JS 주입
4. GitHub Pages 배포

## 로컬 실행

```bash
npm run build    # HTML 생성 (Docker 필요)
npm run serve    # http://localhost:8081/docs 에서 확인
```

## 커스텀 스타일 수정

`custom.css`에서 사이드바, 뱃지, 레이아웃 등을 수정할 수 있습니다.
