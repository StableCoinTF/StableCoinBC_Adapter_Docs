# Monitor Worker 설계서

> BC Adapter 내 독립 프로세스로 실행되는 모니터링 + 관리 Worker

---

## 1. 개요

### 1.1 목적

관리자 페이지에서 블록체인 네트워크 상태 모니터링 및 스마트 컨트랙트/EntryPoint 관리 기능을 제공하기 위해,
BC Adapter에서 **독립 프로세스**로 체인 메트릭을 수집하고 관리 명령을 처리하는 Worker를 신규 개발한다.

### 1.2 위치

```
StableCoinBC_Adapter/
├── src/index.ts          ← 메인 Adapter (기존)
├── src/reconcile.ts      ← 대사 Worker (기존)
└── src/monitor.ts        ← 모니터링 Worker (NEW)
```

### 1.3 실행

```bash
# PM2 / systemd 등으로 독립 프로세스 실행
node dist/monitor.js
```

---

## 2. 아키텍처

### 2.1 전체 흐름

```
                         ┌────────────────┐
                         │   Admin Web    │
                         │   (차트/관리)   │
                         └───────┬────────┘
                                 │ 요청
                                 ▼
                         ┌────────────────┐
                         │   Admin BE     │
                         └───────┬────────┘
                                 │ Kafka 요청
                                 ▼
                    ┌─────────────────────┐
                    │     Kafka Broker     │
                    └──────────┬──────────┘
                               │ RECEIVE
                               ▼
┌──────────────────────────────────────────────────────┐
│                   Monitor Worker                     │
│                   (node dist/monitor.js)             │
│                   Consumer Group: bc-monitor         │
│                                                      │
│  ┌───────────────────────────────────────────────┐   │
│  │            Kafka Consumer (모든 요청 수신)      │   │
│  │                                               │   │
│  │  • 메트릭 조회   → blockNumber / latency /     │   │
│  │                   pollRate / txPool(56357)    │   │
│  │  • EntryPoint    → 잔액 조회 / 충전 / 회수     │   │
│  │  • Contract      → 목록 조회 / 상태 조회       │   │
│  └───────────────────┬───────────────────────────┘   │
│                      │ RPC 조회 / TX 제출              │
│                      ▼                               │
│           각 체인 RPC 프로바이더                        │
│           (K-Mainnet, ETH Sepolia, FUJI)             │
│                      │                               │
│                      ▼                               │
│  ┌───────────────────────────────────────────────┐   │
│  │            Kafka Producer (결과 발행)           │   │
│  └───────────────────┬───────────────────────────┘   │
└─────────────────────┼────────────────────────────────┘
                       │ SEND
                       ▼
                ┌─────────────────┐
                │   Kafka Broker   │ ──→ Admin BE → Admin Web
                └─────────────────┘
```

### 2.2 기존 프로세스와 비교

| 항목 | 메인 Adapter | 대사 Worker | Monitor Worker |
|------|-------------|------------|---------------|
| 진입점 | `index.ts` | `reconcile.ts` | `monitor.ts` |
| Consumer Group | `bc-adapter` | `bc-reconcile` | `bc-monitor` |
| Kafka Consumer | ✅ (10개 토픽) | ✅ (1개 토픽) | ✅ (메트릭 + 관리 모두) |
| Kafka Producer | ✅ | ✅ | ✅ |
| RPC 호출 | ✅ | ✅ | ✅ |
| TX 제출 | ✅ (Bundler) | ❌ | ✅ (Bundler 경유 — `/api/entrypoint`) |
| setInterval | ❌ | ❌ | ❌ (요청 기반) |
| Config DB | ✅ | ✅ (읽기) | ✅ (읽기) |
| Account DB | ✅ | ✅ (읽기) | ❌ |
| Outbox DB | ✅ | ❌ | ❌ |

---

## 3. 기능 상세

### 3.1 메트릭 조회 (요청 기반 — Kafka Consumer)

Admin BE가 Kafka로 조회 요청을 보내면 Monitor Worker가 해당 시점의 온체인 데이터를 조회하여 응답한다.

| 기능 | 요청 토픽 | 응답 토픽 | 설명 |
|------|----------|----------|------|
| 네트워크 메트릭 조회 | `adapter.board.metric.request` | `adapter.board.metric.result` | 전체/특정 체인 메트릭 원본값 반환 |

> **Monitor Worker는 조회한 원본값(raw)을 그대로 반환** — 변환/계산은 모두 Admin BE에서 처리

| # | 메트릭 | 설명 | RPC 메서드 | 대상 체인 |
|---|--------|------|-----------|----------|
| 1 | Last Accepted Height | 최신 블록 번호 | `eth_blockNumber` | 전체 |
| 2 | Avg Block Accept Latency | 최근 블록 간 평균 시간 간격 (초) | `eth_getBlockByNumber` × 2 | 전체 |
| 3 | TPS | 최근 10블록 기준 초당 트랜잭션 수 | `eth_getBlockByNumber` × 10 | 전체 |
| 4 | Tx Pool Slots | 트랜잭션 풀 대기 건수 | `txpool_status` | **K-Mainnet(56357) 전용** |
| 5 | Tx Pool Valid | pending vs queued 비율 | `txpool_status` | **K-Mainnet(56357) 전용** |
| 6 | Avg Gas Price | 현재 평균 가스비 (wei) | `eth_gasPrice` | 전체 |
| 7 | Peer Count | P2P 피어 수 | `net_peerCount` | **K-Mainnet(56357) 전용** |

> `rpcEndpoint`, `network` (체인명) 은 Config DB에서 읽어오는 설정값이며, 응답에 포함됨

#### 메트릭별 RPC 처리 상세

**1번 — Last Accepted Height**
```
요청: eth_blockNumber
반환: 16진 문자열 원본 그대로 (예: "0xf4240")
→ Admin BE에서 parseInt("0xf4240", 16) = 1000000 변환
```

**2번 + 3번 — Avg Block Latency / TPS (최근 10블록)**
```
요청: eth_getBlockByNumber × 10 (병렬)
반환: 블록별 { number, timestamp, txCount } 배열 원본 그대로

→ Admin BE에서 계산:
   latency = blocks[0].timestamp - blocks[1].timestamp  (초)
   tps     = sum(txCount) / (blocks[0].timestamp - blocks[9].timestamp)
```

**4번 + 5번 — Tx Pool Slots / Valid (K-Mainnet 전용)**
```
요청: txpool_status (JSON-RPC non-standard)
반환: { "pending": "0xf", "queued": "0x3" } 원본 그대로

→ Admin BE에서 계산:
   pending = parseInt("0xf", 16) = 15
   queued  = parseInt("0x3", 16) = 3
   total   = 18
   valid_ratio = pending / total = 0.833

⚠️ K-Mainnet 노드: geth --http.api "eth,net,web3,txpool" 활성화 필요
```

**6번 — Avg Gas Price**
```
요청: eth_gasPrice
반환: 가스비 원본 16진 문자열 (예: "0x5d21dba00")
→ Admin BE에서 parseInt("0x5d21dba00", 16) = 25000000000 (wei)
```

**7번 — Peer Count (K-Mainnet 전용)**
```
요청: net_peerCount
반환: 원본 16진 문자열 (예: "0x12")
→ Admin BE에서 parseInt("0x12", 16) = 18
⚠️ 공개 RPC (ETH Sepolia, FUJI): 차단됨 → null 반환
```

#### 체인별 메트릭 가용성

| 메트릭 | K-Mainnet (56357) | ETH Sepolia (11155111) | FUJI (43113) |
|--------|:-----------------:|:---------------------:|:------------:|
| 1. Last Accepted Height | ✅ | ✅ | ✅ |
| 2. Avg Block Latency | ✅ | ✅ | ✅ |
| 3. TPS (10블록) | ✅ | ✅ | ✅ |
| 4. Tx Pool Slots | ✅ (자체 노드) | — (미제공) | — (미제공) |
| 5. Tx Pool Valid | ✅ (자체 노드) | — (미제공) | — (미제공) |
| 6. Avg Gas Price | ✅ | ✅ | ✅ |
| 7. Peer Count | ✅ (자체 노드) | — (차단) | — (차단) |
| rpcEndpoint / network | ✅ (config) | ✅ (config) | ✅ (config) |

#### 노드 전용 API 제약사항

```
⚠️ K-Mainnet(56357) geth 노드 실행 옵션 필요:
   --http.api "eth,net,web3,txpool"

   활성화 시 사용 가능한 API:
   - txpool_status (메트릭 4, 5)
   - net_peerCount  (메트릭 7)

   공개 RPC (ETH Sepolia, FUJI): 보안/부하 이유로 차단됨 → null 반환

💡 K-Mainnet은 출금/결제 등 핵심 트랜잭션이 오가는 체인이므로 txpool/peer 모니터링 가치 높음
```

### 3.2 관리 기능 (수동 — Kafka Consumer)

Admin BE에서 Kafka 요청을 보내면 Monitor Worker가 처리하고 결과를 응답한다.

#### 3.2.1 EntryPoint 관리

| 기능 | 요청 토픽 | 응답 토픽 | 설명 |
|------|----------|----------|------|
| 충전 / 회수 | `adapter.board.entrypoint.request` | `adapter.board.entrypoint.result` | `action: DEPOSIT \| WITHDRAW` 으로 구분 |

> 잔액 조회는 기존 BE에서 직접 처리 — Monitor Worker 불필요

#### 3.2.2 Smart Contract 관리

| 기능 | 요청 토픽 | 응답 토픽 | 설명 |
|------|----------|----------|------|
| 컨트랙트 목록/상태 | `adapter.board.contract.request` | `adapter.board.contract.result` | 등록된 컨트랙트 목록 + 온체인 상태 통합 조회 |

#### 3.2.3 인프라 조회

| 기능 | 요청 토픽 | 응답 토픽 | 설명 |
|------|----------|----------|---------|
| 인프라 상태 조회 | `adapter.board.infra.request` | `adapter.board.infra.result` | 컴포넌트별 헬스 상태 조회 |

> `chainId` 불필요 — 인프라 헬스는 프로세스 단위 조회 (RPC만 체인별 배열로 반환)

> **토픽명은 Admin BE 팀과 협의 후 확정**

---

## 4. Kafka 메시지 스키마

### 4.1 네트워크 메트릭 조회 요청/응답

**요청** (`adapter.board.metric.request`):

```json
{
  "request_id": "T123456789",
  "chain_id": "8217"
}
```

**응답** (`adapter.board.metric.result`):

```json
{
  "request_id": "T123456789",
  "chain_id": "8217",
  "block": {
    "number": 4819589,
    "timestamp": 1722098371,
    "hash": "0x...",
    "parent_hash": "0x...",
    "nonce": "0x0000000000000000",
    "sha3_uncles": "0x...",
    "logs_bloom": "0x...",
    "transactions_root": "0x...",
    "state_root": "0x...",
    "receipts_root": "0x...",
    "miner": "0x...",
    "difficulty": "0",
    "total_difficulty": "0",
    "extra_data": "0x...",
    "size": 1024,
    "gas_limit": "30000000",
    "gas_used": "1234567",
    "base_fee_per_gas": "25000000000",
    "transactions": []
  },
  "tx_pool": {
    "pending": "0xc",
    "queued": "0x3"
  },
  "peer_count": "0x12",
  "syncing": false,
  "message": null
}
```

> - **Monitor Worker는 ethers.js 응답을 그대로 반환** — hex→decimal 변환 불필요
> - `block`: `provider.getBlock("latest")` 응답 (ethers.js Block 객체)
>   - `block.number`: 최신 블록 높이 integer (지표 1)
>   - `block.timestamp`: 블록 타임스탬프 Unix 초 integer (지표 2 산출용)
>   - `block.transactions`: 트랜잭션 해시 목록 (지표 3 TPS 산출용)
>   - `block.gas_used` / `block.base_fee_per_gas`: bigint → decimal string
> - `tx_pool`: `txpool_status` raw 응답 hex (지표 4, 5 — K-Mainnet 전용, 공개 RPC는 `null`)
> - `peer_count`: `net_peerCount` raw hex (지표 7 — K-Mainnet 전용, 공개 RPC는 `null`)
> - `syncing`: `eth_syncing` 응답 (`false` = 동기화 완료, object = 동기화 중)
> - **Admin BE에서 처리**: latency 계산, TPS 계산, tx_pool hex→decimal 변환, valid ratio 계산

### 4.2 EntryPoint 충전 / 회수 (통합)

**요청** (`adapter.board.entrypoint.request`):

```json
// DEPOSIT 예시 (핫월렛 → EntryPoint 충전)
{
  "request_id": "T123456789",
  "chain_id": "8217",
  "action": "DEPOSIT",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  "amount": "5.0"
}

// WITHDRAW 예시 (EntryPoint → 핫월렛 회수)
{
  "request_id": "T123456789",
  "chain_id": "8217",
  "action": "WITHDRAW",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  "amount": "3.0"
}
```

> - `action`: `DEPOSIT` — `depositTo()` 호출 / `WITHDRAW` — `withdrawTo()` 호출
> - `address`: 대상 주소 (EntryPoint 또는 수신 주소)
> - `amount`: decimal string (예: `"5.0"`)

**응답** (`adapter.board.entrypoint.result`):

```json
{
  "request_id": "T123456789",
  "action": "DEPOSIT",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  "amount": "5.0",
  "status": "TXPD",
  "tx_hash": "0xe9e91f1ee4b56c0df2e9f06c2b8c27c6076195a88a7b8537ba8313d80e6f124e",
  "complete_datetime": null,
  "message": null
}
```

> - TX 서명자: **Bundler의 `server_key1`** (= Hotwallet, 기존 출금과 동일 키) — 요청에서 받지 않음
> - Monitor Worker → `POST /api/entrypoint/transfer` → Bundler → action에 따라 분기 호출
> - `status`: `TXPD` (전송 성공, 컨펌 대기) | `FAIL` (전송 실패)
> - `tx_hash`: 트랜잭션 해시 (실패 시 `null`)
> - `complete_datetime`: 완료 시각 YYYYMMDDHHmmss (미완료 시 `null`)

### 4.3 컨트랙트 목록/상태 조회

**요청** (`adapter.board.contract.request`):

```json
{
  "request_id": "T123456789",
  "chain_id": "8217"
}
```

**응답** (`adapter.board.contract.result`):

```json
{
  "request_id": "T123456789",
  "chain_id": "8217",
  "contracts": [
    {
      "name": "EntryPoint",
      "proxy_address": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d3789",
      "impl_address": "0xImpl000000000000000000000000000000000001",
      "version": "v0.6.0",
      "paused": false
    },
    {
      "name": "AccountFactory",
      "proxy_address": "0xFact000000000000000000000000000000001234",
      "impl_address": "0xImpl000000000000000000000000000000000002",
      "version": "v1.2.0",
      "paused": false
    },
    {
      "name": "USDC Token",
      "proxy_address": "0xUsdc00000000000000000000000000000000ABCD",
      "impl_address": "0xImpl000000000000000000000000000000000003",
      "version": "v2.1.0",
      "paused": false
    }
  ],
  "message": null
}
```

> - `impl_address`: EIP-1967 storage slot(`eth_getStorageAt`) 조회
> - `version`: 컨트랙트 `version()` 함수 호출 (없으면 Config DB 설정값 사용)
> - `paused`: 컨트랙트 `paused()` 함수 호출
> - 조회 대상 컨트랙트 목록은 Config DB에서 읽어옴
> - 실패한 컨트랙트는 해당 항목에 `"error": "..."` 필드 포함, 나머지는 정상 반환

### 4.4 인프라 상태 조회

**요청** (`adapter.board.infra.request`):

```json
{
  "request_id": "T123456789"
}
```

> `chainId` 없음 — 인프라 헬스는 프로세스 전체 기준

**응답** (`adapter.board.infra.result`):

```json
{
  "request_id": "T123456789",
  "health": {
    "modules": [
      { "name": "bundler",  "status": "UP" },
      { "name": "listener", "status": "UP" },
      ...
    ],
    "infra": [
      { "name": "kms",       "status": "UP" },
      { "name": "websocket", "status": "UP" },
      ...
    ]
  },
  "message": null
}
```

> - `modules.bundler`: Bundler HTTP 헬스체크 (BUNDLER_URL)
> - `modules.listener`: Listener HTTP 헬스체크
> - `infra.kms`: NHN Cloud KMS API 헬스체크
> - `infra.websocket`: WebSocket 연결 상태
> - `status`: `"UP"` | `"DOWN"`

---

## 5. 프로젝트 구조

```
src/
├── monitor.ts                                    # 진입점 (SIGINT/SIGTERM 핸들링)
│
├── bootstrap/
│   └── monitor-bootstrap.ts                      # 인프라 조립 + shutdown 함수 반환
│
├── domain/
│   └── port/
│       └── in/
│           ├── monitor-metrics.port.ts            # MetricsInquiryCase
│           ├── entrypoint-transfer.port.ts         # EntryPointTransferCase (DEPOSIT | WITHDRAW)
│           ├── contract-inquiry.port.ts            # ContractInquiryCase
│           └── infra-inquiry.port.ts               # InfraInquiryCase
│
├── application/
│   └── monitor/
│       ├── metrics-inquiry.service.ts              # 메트릭 즉시 조회 (요청 기반)
│       ├── entrypoint-transfer.service.ts          # EP 충전/회수 (TX 제출, action 분기)
│       ├── contract-inquiry.service.ts             # 컨트랙트 목록/상태 조회
│       └── infra-inquiry.service.ts                # 컴포넌트 헬스 ping 조회
│
└── adapter/
    └── in/
        └── kafka/
            └── handlers/
                ├── network-inquiry.handler.ts       # Zod 스키마 + HandlerConfig
                ├── entrypoint-transfer.handler.ts   # action: DEPOSIT | WITHDRAW
                ├── contract-inquiry.handler.ts
                └── infra-inquiry.handler.ts
```

> 기존 코드 재사용: `ChainReaderPort`, `KafkaProducer`, `getOrCreateProvider`, `config DB`, `createHandlerConfig`, `registerHandler` 등

---

## 6. 부트스트랩 흐름

```
monitor-bootstrap.ts

1. Config DB 연결 (읽기 전용)
   └── 활성 체인 목록 + RPC URL 조회

2. Kafka Producer 연결

3. Kafka Consumer 연결 (Consumer Group: bc-monitor)

4. ChainReader 생성 (체인별 RPC 프로바이더)
   └── 기존 getOrCreateProvider() 재사용
   └── K-Mainnet 전용 provider는 txpool 지원 확인

5. Bundler HTTP 클라이언트 생성
   └── BUNDLER_URL 환경변수 → axios/fetch 클라이언트
   └── 기존 메인 Adapter의 ExternalBundlerAdapter 재사용 또는 신규 엔드포인트용 확장
   ※ TX 서명은 Bundler의 server_key1이 담당 — Monitor는 서명 키 불보유

6. 서비스 생성
   ├── MetricsInquiryService (chainReaders, activeChains)
   ├── EntryPointTransferService (bundlerClient)
   ├── ContractInquiryService (chainReaders)
   └── InfraInquiryService (chainReaders, bundlerClient, kafkaProducer, redisClient, kmsClient)

7. Kafka 핸들러 등록 (전체 요청 기반)
   ├── metric.request       → MetricsInquiryService
   ├── entrypoint.request   → EntryPointTransferService
   ├── contract.request     → ContractInquiryService
   └── infra.request        → InfraInquiryService

8. shutdown 함수 반환
   └── Producer disconnect → Consumer stop → DB close
```

---

## 7. MetricsInquiryService 상세

```typescript
// 요청 기반 — setInterval 없음
class MetricsInquiryService implements MetricsInquiryCase {
  private readonly K_CHAIN_ID = 56357;

  constructor(
    private readonly chainReaderResolver: ChainReaderResolver,
    private readonly activeChains: ChainConfig[],
  ) {}

  async handle(request: MetricsInquiryRequest): Promise<ChainMetrics[]> {
    const targets = request.chainId
      ? this.activeChains.filter(c => Number(c.chainId) === request.chainId)
      : this.activeChains;

    // 병렬 조회 (체인 수만큼)
    return Promise.all(targets.map(chain => this.collectChain(chain)));
  }

  private async collectChain(chain: ChainConfig): Promise<ChainMetrics> {
    const reader = this.chainReaderResolver(Number(chain.chainId));
    const isKChain = Number(chain.chainId) === this.K_CHAIN_ID;
    const base = { chainId: chain.chainId, chainName: chain.name, timestamp: new Date().toISOString() };

    try {
      // ① Last Accepted Height — eth_blockNumber
      const height = await reader.getBlockNumber();

      // ② + ③ 최근 10블록 병렬 조회 (latency/TPS 원본 데이터 수집)
      const blockNums = Array.from({ length: 10 }, (_, i) => height - i);
      const blocks = await Promise.all(
        blockNums.map(n => reader.getBlock(n))  // eth_getBlockByNumber × 10
      );

      // 원본값 그대로 반환 — 변환/계산은 Admin BE에서
      const result: ChainMetrics = {
        ...base,
        network: chain.network,                                // config 설정값
        rpcEndpoint: chain.rpcUrl,                             // config 설정값
        blockNumber: await reader.send('eth_blockNumber', []), // 메트릭 1: 16진 원본
        blocks: blocks.map(b => ({                            // 메트릭 2, 3용 원본 블록 배열
          number: b.number,
          timestamp: b.timestamp,
          txCount: b.transactions.length,
        })),
      };

      // ⑦ Avg Gas Price — eth_gasPrice (전체 체인, 16진 원본)
      result.avgGasPrice = await reader.send('eth_gasPrice', []);

      // ⑧ Peer Count + ④⑤ Tx Pool — K-Mainnet(56357) 전용
      if (isKChain) {
        result.peerCount    = await reader.send('net_peerCount', []);  // "0x12" 원본
        const pool = await reader.send('txpool_status', []);
        result.txPoolPending = pool.pending; // "0xf" 원본
        result.txPoolQueued  = pool.queued;  // "0x3" 원본
      } else {
        result.peerCount     = null;
        result.txPoolPending = null;
        result.txPoolQueued  = null;
      }

      return result;

    } catch (err) {
      // RPC 실패 시 — height/latency 조회 불가 상태만 반환
      // (Admin BE에서 이 응답으로 poll_success = false 판단 가능)
      return { ...base, error: (err as Error).message };
    }
  }
}
```

#### RPC 호출 순서 (체인 1개 기준)

```
1. eth_blockNumber                        → blockNumber (16진 원본)
2. eth_getBlockByNumber × 10 (병렬)       → blocks[0..9] ({ number, timestamp, txCount })
3. eth_gasPrice                           → avgGasPrice (16진 원본)

[K-Mainnet 전용]
4. net_peerCount                          → peerCount (16진 원본)
5. txpool_status                          → txPoolPending / txPoolQueued (16진 원본)

열 RPC 호출 수: 일반 체인 12회 / K-Mainnet 14회

※ rpcEndpoint / network: RPC 호출 없음 (Config DB 설정값)
※ 모든 변환/계산(hex→decimal, latency, TPS, valid ratio)은 Admin BE에서 처리
```

---

## 8. 환경변수

### Monitor Worker 전용

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `KAFKA_MONITOR_CONSUMER_GROUP` | `bc-monitor` | Monitor Worker Consumer Group |

> Monitor Worker는 서명 키를 보유하지 않음. TX 서명은 Bundler(server_key1)가 담당

### 기존 공유 환경변수

| 변수 | 설명 |
|------|------|
| `KAFKA_BROKERS` | Kafka 브로커 주소 |
| `DATABASE_CONFIG_URL` | Config DB 경로 |
| `BUNDLER_URL` | Bundler HTTP 주소 (EntryPoint 충전/회수 요청용) |
| `KMS_APPKEY` | NHN Cloud KMS AppKey (Redis 비번 복호화용) |

> 수집 주기 관련 환경변수 없음 (요청 기반이므로 Admin BE 쪽에서 결정)

---

## 9. 토픽 목록 (Admin BE 협의 필요)

### 네트워크 메트릭 조회 (Admin BE ↔ Monitor)

| 요청 토픽 | 응답 토픽 | 설명 |
|----------|----------|---------|
| `adapter.board.metric.request` | `adapter.board.metric.result` | 전체/특정 체인 메트릭 조회 |

### 관리 기능 (Admin BE ↔ Monitor)

| 요청 토픽 | 응답 토픽 | 설명 |
|----------|----------|---------|
| `adapter.board.entrypoint.request` | `adapter.board.entrypoint.result` | EP 충전(`DEPOSIT`) / 회수(`WITHDRAW`) |
| `adapter.board.contract.request` | `adapter.board.contract.result` | 컨트랙트 목록/상태 통합 조회 |
| `adapter.board.infra.request` | `adapter.board.infra.result` | 인프라 컴포넌트 헬스 조회 |

---

## 10. 패키지 스크립트

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "start:reconcile": "node dist/reconcile.js",
    "start:monitor": "node dist/monitor.js",
    "build": "tsc -p tsconfig.build.json"
  }
}
```

---

## 11. Admin BE 협의 사항

| # | 항목 | 설명 |
|---|------|------|
| 1 | Kafka 토픽명 | 위 토픽명 확정 여부 |
| 2 | 메시지 스키마 | snake_case 필드명 확인 |
| 3 | txpool / net API | K-Mainnet 노드에 txpool + net API 활성화 여부 확인 필요 |
| 4 | 메트릭 조회 주기 | Admin BE에서 얼마나 자주 요청할지 결정 (Monitor 측 처리 없음) |
| 5 | 관리 기능 범위 | EntryPoint/Contract 외 추가 기능 여부 |
| 6 | 인증/권한 | 관리 명령에 대한 인증 메커니즘 필요 여부 |

---

## 12. 개발 순서 (권장)

```
Phase 1 — 메트릭 조회 (Consumer + Producer)
  ├── monitor.ts 진입점
  ├── monitor-bootstrap.ts (Config DB + Producer + Consumer + ChainReader)
  ├── MetricsInquiryService (blockNumber + latency)
  ├── metrics-inquiry.handler.ts 등록
  └── 테스트: 요청 → 응답 동작 확인

Phase 2 — EntryPoint 관리
  ├── [Bundler] POST /api/entrypoint/transfer 엔드포인트 추가 (신규 파일만, action 분기)
  ├── [Monitor] EntryPoint 충전/회수 핸들러 (Bundler HTTP 호출)
  └── 테스트: 요청-응답 동작 확인

Phase 3 — Contract / 인프라 조회
  ├── ContractInquiryService (EIP-1967 구현체 조회, version(), paused())
  ├── contract-inquiry.handler.ts 등록
  ├── InfraInquiryService (Bundler/Listener/KMS/WebSocket ping)
  └── infra-inquiry.handler.ts 등록

Phase 4 — txpool 메트릭 (K-Mainnet 노드 API 활성화 후)
  └── MetricsInquiryService에 txPool 조회 추가 (K-Mainnet 한정)
```
