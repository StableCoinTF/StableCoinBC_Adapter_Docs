# StableCoin BC Adapter - Kafka API 문서

> **⚠️ 이 저장소는 다른 프로젝트와 동일하게 로컬에서 commit & push 로 관리합니다. GitHub 웹 UI에서 직접 편집 ❌**

## 작업 가이드

1. **작업 전 파트원에게 공유** — 같은 파일 동시 수정 시 충돌 위험
2. **로컬에서 페이지 정상 로딩 확인** (`npx -y @asyncapi/generator asyncapi.yaml @asyncapi/html-template -o docs --force-write && npx http-server docs -p 8081`)
3. **branch에서 commit & push**
4. **PR 생성 후 셀프 merge**

## 파일 구조

| 파일 | 역할 |
|------|------|
| `asyncapi.yaml` | 메인 스펙 (info, channels `$ref`, operations, components) |
| `channels.yaml` | 전체 채널/메시지 정의 |

## 신규 카테고리(사이드바 그룹) 추가

사이드바 그룹은 `channels.yaml`의 요청 채널에 지정하는 `x-group` 값으로 자동 생성됩니다.
기존 그룹: `계정 관리` / `거래` / `조회 & 대사` / `설정 & 이벤트`

새 카테고리를 만들려면 요청 채널의 `x-group`에 새 이름을 쓰면 됩니다:

```yaml
# channels.yaml
myNewRequest:
  address: adapter.mynew.request
  title: 새 기능 요청
  description: Core → Adapter
  x-group: 모니터링          # ← 새 카테고리명 (사이드바에 자동 추가)
  messages:
    ...
```

> **규칙:** `x-group`은 요청 채널에만 지정. 응답 채널은 `reply`로 연결된 요청 채널의 그룹을 자동 상속합니다.

---

## 토픽 추가 가이드

### 1. `channels.yaml`에 채널 추가 — 요청 채널에 `x-group` 필수

```yaml
# 요청 채널 — x-group 필수 (사이드바 그룹 지정)
myNewRequest:
  address: adapter.mynew.request
  title: 새 기능 요청
  description: Core → Adapter
  x-group: 거래              # 사이드바 그룹명 (계정 관리 / 거래 / 조회 & 대사 / 설정 & 이벤트 등)
  messages:
    MyNewRequest:
      name: MyNewRequest
      title: 새 기능 요청
      payload:
        type: object
        required: [requestId]
        properties:
          requestId:
            type: string
            description: 요청 고유 ID
            examples: ["REQ001"]
      examples:
        - name: 요청 예시
          payload:
            requestId: "REQ001"

# 응답 채널 — x-group 불필요 (요청 채널의 그룹을 자동 상속)
myNewResult:
  address: adapter.mynew.result
  title: 새 기능 결과
  description: Adapter → Core
  messages:
    MyNewResponse:
      name: MyNewResponse
      title: 새 기능 결과
      payload:
        type: object
        required: [requestId, status]
        properties:
          requestId:
            type: string
            description: 요청 고유 ID
          status:
            $ref: "asyncapi.yaml#/components/schemas/TransactionStatus"
      examples:
        - name: 성공
          payload:
            requestId: "REQ001"
            status: "TXCF"
```

### 2. `asyncapi.yaml`에 `$ref`와 operation 추가

```yaml
# channels 섹션에 추가
channels:
  myNewRequest:
    $ref: './channels.yaml#/myNewRequest'
  myNewResult:
    $ref: './channels.yaml#/myNewResult'

# operations 섹션에 추가
operations:
  receiveMyNewRequest:
    action: receive
    channel:
      $ref: "#/channels/myNewRequest"
    title: 새 기능 요청 수신
    summary: 새 기능 요청 수신
    reply:                          # 응답 없으면 reply 블록 삭제
      channel:
        $ref: "#/channels/myNewResult"

  sendMyNewResult:
    action: send
    channel:
      $ref: "#/channels/myNewResult"
    title: 새 기능 결과 발행
    summary: 새 기능 결과 발행
```

> **뱃지 자동 부여:** `action: receive` → `RECEIVE`, `action: send` → `SEND`

### 3. 로컬 확인 후 PR

```bash
git checkout -b feature/새-기능-토픽-추가
git add asyncapi.yaml channels.yaml
git commit -m "feat: 새 기능 토픽 추가"
git push origin feature/새-기능-토픽-추가
```

GitHub에서 `main` 브랜치로 PR 생성 → 머지 시 자동 배포됩니다.
