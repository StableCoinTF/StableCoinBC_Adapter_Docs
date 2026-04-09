# StableCoin BC Adapter - Kafka API 문서

> **⚠️ 이 저장소는 다른 프로젝트와 동일하게 로컬에서 commit & push 로 관리합니다. GitHub 웹 UI에서 직접 편집 ❌**

## 토픽 추가 가이드

### 1. `asyncapi.yaml`에 channel 추가

```yaml
channels:
  # 요청 채널
  myNewRequest:
    address: adapter.mynew.request
    title: 새 기능 요청
    description: Core → Adapter
    messages:
      MyNewRequest:
        name: MyNewRequest
        title: 새 기능 요청
        payload:
          type: object
          required:
            - requestId
          properties:
            requestId:
              type: string
              description: 요청 고유 ID
              examples:
                - "REQ001"
        examples:
          - name: 새 기능 요청 예시
            payload:
              requestId: "REQ001"

  # 결과 채널
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
          required:
            - requestId
            - status
          properties:
            requestId:
              type: string
              description: 요청 고유 ID
            status:
              $ref: "#/components/schemas/TransactionStatus"
        examples:
          - name: 새 기능 성공
            payload:
              requestId: "REQ001"
              status: "SUCCESS"
```

### 2. `asyncapi.yaml`에 operation 추가

```yaml
operations:
  receiveMyNewRequest:
    action: receive
    channel:
      $ref: "#/channels/myNewRequest"
    title: 새 기능 요청 수신
    summary: 새 기능 요청 수신
    reply:
      channel:
        $ref: "#/channels/myNewResult"

  sendMyNewResult:
    action: send
    channel:
      $ref: "#/channels/myNewResult"
    title: 새 기능 결과 발행
    summary: 새 기능 결과 발행
```

### 3. `.github/workflows/deploy-docs.yml`에 한글 치환 추가

`docs/index.html` sed 블록에 추가:
```bash
-e 's/>receiveMyNewRequest</>새 기능 요청 수신</g' \
-e 's/>sendMyNewResult</>새 기능 결과 발행</g' \
-e 's|font-mono text-base">adapter.mynew.request<|font-mono text-base">새 기능 요청 (adapter.mynew.request)<|g' \
-e 's|font-mono text-base">adapter.mynew.result<|font-mono text-base">새 기능 결과 (adapter.mynew.result)<|g' \
```

`docs/js/app.js` sed 블록에 추가:
```bash
-e 's/receiveMyNewRequest/새 기능 요청 수신/g' \
-e 's/sendMyNewResult/새 기능 결과 발행/g' \
```

### 4. PR 생성 후 머지하면 자동 배포

```bash
git checkout -b feature/새-기능-토픽-추가
git add asyncapi.yaml .github/workflows/deploy-docs.yml
git commit -m "새 기능 토픽 추가"
git push origin feature/새-기능-토픽-추가
```

GitHub에서 `main` 브랜치로 PR 생성 → 리뷰 → 머지 시 자동 배포됩니다.
