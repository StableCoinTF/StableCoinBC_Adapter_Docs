
    const schema = {
  "asyncapi": "3.0.0",
  "info": {
    "title": "StableCoin BC Adapter",
    "version": "1.0.0",
    "description": "StableCoin 블록체인 어댑터의 Kafka 메시지 스펙.\n계정 생성/배포, 출금, 결제, 정산, 잔액 조회, 대사, 입금 감지 등의 블록체인 연동 기능을 제공합니다.\n"
  },
  "defaultContentType": "application/json",
  "channels": {
    "accountCreate": {
      "address": "adapter.account.create",
      "title": "계정 생성 요청",
      "description": "Core → Adapter",
      "x-group": "계정 관리",
      "x-icon": "🆕",
      "messages": {
        "AccountCreateRequest": {
          "name": "AccountCreateRequest",
          "title": "계정 생성 요청",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "networkType"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "U123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-2>"
              },
              "networkType": {
                "type": "string",
                "description": "네트워크 타입 (예: EVM)",
                "examples": [
                  "EVM"
                ],
                "x-parser-schema-id": "<anonymous-schema-3>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-1>"
          },
          "examples": [
            {
              "name": "계정 생성 요청 예시",
              "payload": {
                "requestId": "U123456789",
                "networkType": "EVM"
              }
            }
          ],
          "x-parser-unique-object-id": "AccountCreateRequest"
        }
      },
      "x-parser-unique-object-id": "accountCreate"
    },
    "accountCreated": {
      "address": "adapter.account.created",
      "title": "계정 생성 결과",
      "description": "Adapter → Core",
      "messages": {
        "AccountCreateResponse": {
          "name": "AccountCreateResponse",
          "title": "계정 생성 결과",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "address",
              "networkType"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "U123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-5>"
              },
              "address": {
                "type": "string",
                "description": "생성된 Smart Account 주소 (실패 시 null)",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "nullable": true,
                "examples": [
                  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
                ],
                "x-parser-schema-id": "<anonymous-schema-6>"
              },
              "networkType": {
                "type": "string",
                "description": "네트워크 타입 (실패 시 null)",
                "nullable": true,
                "examples": [
                  "EVM"
                ],
                "x-parser-schema-id": "<anonymous-schema-7>"
              },
              "message": {
                "type": "string",
                "description": "에러 메시지 (성공 시 빈 문자열)",
                "nullable": true,
                "examples": [
                  ""
                ],
                "x-parser-schema-id": "<anonymous-schema-8>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-4>"
          },
          "examples": [
            {
              "name": "계정 생성 성공",
              "payload": {
                "requestId": "U123456789",
                "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
                "networkType": "EVM",
                "message": ""
              }
            },
            {
              "name": "계정 생성 실패",
              "payload": {
                "requestId": "U123456789",
                "address": null,
                "networkType": null,
                "message": "UNSUPPORTED_NETWORK_TYPE"
              }
            }
          ],
          "x-parser-unique-object-id": "AccountCreateResponse"
        }
      },
      "x-parser-unique-object-id": "accountCreated"
    },
    "accountDeploy": {
      "address": "adapter.account.deploy",
      "title": "계정 배포 요청",
      "description": "Core → Adapter",
      "x-group": "계정 관리",
      "x-icon": "🚀",
      "messages": {
        "AccountDeployRequest": {
          "name": "AccountDeployRequest",
          "title": "계정 배포 요청",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "chainId",
              "address"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "U123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-10>"
              },
              "chainId": {
                "type": "string",
                "description": "체인 ID (예: 11155111 = Sepolia)",
                "examples": [
                  "11155111"
                ],
                "x-parser-schema-id": "<anonymous-schema-11>"
              },
              "address": {
                "type": "string",
                "description": "배포할 Smart Account 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
                ],
                "x-parser-schema-id": "<anonymous-schema-12>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-9>"
          },
          "examples": [
            {
              "name": "계정 배포 요청 예시",
              "payload": {
                "requestId": "U123456789",
                "chainId": "11155111",
                "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
              }
            }
          ],
          "x-parser-unique-object-id": "AccountDeployRequest"
        }
      },
      "x-parser-unique-object-id": "accountDeploy"
    },
    "accountDeployed": {
      "address": "adapter.account.deployed",
      "title": "계정 배포 결과",
      "description": "Adapter → Core",
      "messages": {
        "AccountDeployResponse": {
          "name": "AccountDeployResponse",
          "title": "계정 배포 결과",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "status",
              "txHash",
              "completeDatetime"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "U123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-14>"
              },
              "status": {
                "title": "트랜잭션 상태",
                "type": "string",
                "enum": [
                  "TXPD",
                  "TXCF",
                  "TXFA"
                ],
                "description": "트랜잭션 상태:\n- TXPD: Pending (제출됨, 컨펌 대기 중)\n- TXCF: Confirmed (블록 컨펌 완료)\n- TXFA: Failed (트랜잭션 실패)\n",
                "x-parser-schema-id": "TransactionStatus"
              },
              "txHash": {
                "type": "string",
                "description": "트랜잭션 해시 (Pending 시 null)",
                "pattern": "^0x[a-fA-F0-9]{64}$",
                "nullable": true,
                "examples": [
                  "0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890"
                ],
                "x-parser-schema-id": "<anonymous-schema-15>"
              },
              "completeDatetime": {
                "type": "string",
                "description": "완료 일시 (yyyyMMddHHmmss, Pending 시 null)",
                "nullable": true,
                "examples": [
                  "20260325143015"
                ],
                "x-parser-schema-id": "<anonymous-schema-16>"
              },
              "message": {
                "type": "string",
                "description": "에러 메시지 (성공 시 빈 문자열)",
                "nullable": true,
                "examples": [
                  ""
                ],
                "x-parser-schema-id": "<anonymous-schema-17>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-13>"
          },
          "examples": [
            {
              "name": "배포 Pending",
              "payload": {
                "requestId": "U123456789",
                "status": "TXPD",
                "txHash": null,
                "completeDatetime": null,
                "message": ""
              }
            },
            {
              "name": "배포 Confirmed",
              "payload": {
                "requestId": "U123456789",
                "status": "TXCF",
                "txHash": "0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890",
                "completeDatetime": "20260325143015",
                "message": ""
              }
            }
          ],
          "x-parser-unique-object-id": "AccountDeployResponse"
        }
      },
      "x-parser-unique-object-id": "accountDeployed"
    },
    "accountDelete": {
      "address": "adapter.account.delete",
      "title": "계정 삭제 요청",
      "description": "Core → Adapter (응답 없음)",
      "x-group": "계정 관리",
      "x-icon": "🗑️",
      "messages": {
        "AccountDeleteRequest": {
          "name": "AccountDeleteRequest",
          "title": "계정 삭제 요청 (NoReply)",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "address"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "U123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-19>"
              },
              "address": {
                "type": "string",
                "description": "삭제할 계정 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
                ],
                "x-parser-schema-id": "<anonymous-schema-20>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-18>"
          },
          "examples": [
            {
              "name": "계정 삭제 요청 예시",
              "payload": {
                "requestId": "U123456789",
                "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
              }
            }
          ],
          "x-parser-unique-object-id": "AccountDeleteRequest"
        }
      },
      "x-parser-unique-object-id": "accountDelete"
    },
    "withdrawRequest": {
      "address": "adapter.withdraw.request",
      "title": "출금 요청",
      "description": "Core → Adapter",
      "x-group": "거래",
      "x-icon": "📤",
      "messages": {
        "WithdrawRequest": {
          "name": "WithdrawRequest",
          "title": "출금 요청",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "chainId",
              "toAddress",
              "amount"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "WD-20260325-000001"
                ],
                "x-parser-schema-id": "<anonymous-schema-22>"
              },
              "chainId": {
                "type": "string",
                "description": "체인 ID",
                "examples": [
                  "11155111"
                ],
                "x-parser-schema-id": "<anonymous-schema-23>"
              },
              "toAddress": {
                "type": "string",
                "description": "수신 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0xAb5801a7D398351b8bE11C439e05C5b3259aeC9B"
                ],
                "x-parser-schema-id": "<anonymous-schema-24>"
              },
              "amount": {
                "type": "string",
                "description": "출금 금액 (Wei 단위 decimal string)",
                "pattern": "^\\d+(\\.\\d+)?$",
                "examples": [
                  "100000000000000000"
                ],
                "x-parser-schema-id": "<anonymous-schema-25>"
              },
              "symbol": {
                "type": "string",
                "description": "토큰 심볼 (null이면 네이티브 토큰)",
                "nullable": true,
                "examples": [
                  "USDC",
                  null
                ],
                "x-parser-schema-id": "<anonymous-schema-26>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-21>"
          },
          "examples": [
            {
              "name": "ERC-20 토큰 출금",
              "payload": {
                "requestId": "WD-20260325-000001",
                "chainId": "11155111",
                "toAddress": "0xAb5801a7D398351b8bE11C439e05C5b3259aeC9B",
                "amount": "100000000000000000",
                "symbol": "USDC"
              }
            },
            {
              "name": "네이티브 코인 출금",
              "payload": {
                "requestId": "WD-20260325-000002",
                "chainId": "11155111",
                "toAddress": "0xAb5801a7D398351b8bE11C439e05C5b3259aeC9B",
                "amount": "500000000000000000",
                "symbol": null
              }
            }
          ],
          "x-parser-unique-object-id": "WithdrawRequest"
        }
      },
      "x-parser-unique-object-id": "withdrawRequest"
    },
    "withdrawResult": {
      "address": "adapter.withdraw.result",
      "title": "출금 결과",
      "description": "Adapter → Core",
      "messages": {
        "WithdrawResponse": {
          "name": "WithdrawResponse",
          "title": "출금 결과",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "status",
              "txHash",
              "completeDatetime",
              "amount",
              "gasFee"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "WD-20260325-000001"
                ],
                "x-parser-schema-id": "<anonymous-schema-28>"
              },
              "status": "$ref:$.channels.accountDeployed.messages.AccountDeployResponse.payload.properties.status",
              "txHash": {
                "type": "string",
                "description": "트랜잭션 해시",
                "pattern": "^0x[a-fA-F0-9]{64}$",
                "examples": [
                  "0xe9e91f1ee4b56c0df2e9f06c2b8c27c6076195a88a7b8537ba8313d80e6f124e"
                ],
                "x-parser-schema-id": "<anonymous-schema-29>"
              },
              "completeDatetime": {
                "type": "string",
                "description": "완료 일시 (yyyyMMddHHmmss)",
                "examples": [
                  "20260325173715"
                ],
                "x-parser-schema-id": "<anonymous-schema-30>"
              },
              "amount": {
                "type": "string",
                "description": "출금 금액 (decimal string)",
                "examples": [
                  "100000000000000000"
                ],
                "x-parser-schema-id": "<anonymous-schema-31>"
              },
              "gasFee": {
                "type": "string",
                "description": "가스 수수료 (gasFee = gasUsed * effectiveGasPrice)",
                "examples": [
                  "21000"
                ],
                "x-parser-schema-id": "<anonymous-schema-32>"
              },
              "message": {
                "type": "string",
                "description": "에러 메시지 (성공 시 null)",
                "nullable": true,
                "examples": [
                  null
                ],
                "x-parser-schema-id": "<anonymous-schema-33>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-27>"
          },
          "examples": [
            {
              "name": "출금 성공 (Confirmed)",
              "payload": {
                "requestId": "WD-20260325-000001",
                "status": "TXCF",
                "txHash": "0xe9e91f1ee4b56c0df2e9f06c2b8c27c6076195a88a7b8537ba8313d80e6f124e",
                "completeDatetime": "20260325173715",
                "amount": "100000000000000000",
                "gasFee": "21000",
                "message": null
              }
            },
            {
              "name": "출금 실패",
              "payload": {
                "requestId": "WD-20260325-000001",
                "status": "TXFA",
                "txHash": "0xe9e91f1ee4b56c0df2e9f06c2b8c27c6076195a88a7b8537ba8313d80e6f124e",
                "completeDatetime": "20260325173715",
                "amount": "100000000000000000",
                "gasFee": "21000",
                "message": "INSUFFICIENT_BALANCE"
              }
            }
          ],
          "x-parser-unique-object-id": "WithdrawResponse"
        }
      },
      "x-parser-unique-object-id": "withdrawResult"
    },
    "paymentRequest": {
      "address": "adapter.payment.request",
      "title": "결제 요청",
      "description": "Core → Adapter",
      "x-group": "거래",
      "x-icon": "💳",
      "messages": {
        "PaymentRequest": {
          "name": "PaymentRequest",
          "title": "결제 요청",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "amount",
              "symbol"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "결제 고유 ID",
                "examples": [
                  "2026032501"
                ],
                "x-parser-schema-id": "<anonymous-schema-35>"
              },
              "amount": {
                "type": "string",
                "description": "결제 금액 (decimal string)",
                "pattern": "^\\d+(\\.\\d+)?$",
                "examples": [
                  "7.69"
                ],
                "x-parser-schema-id": "<anonymous-schema-36>"
              },
              "symbol": {
                "type": "string",
                "description": "토큰 심볼 (USDC, USDT, ETH, AVAX 등)",
                "examples": [
                  "USDC"
                ],
                "x-parser-schema-id": "<anonymous-schema-37>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-34>"
          },
          "examples": [
            {
              "name": "USDC 결제 요청",
              "payload": {
                "requestId": "2026032501",
                "amount": "7.69",
                "symbol": "USDC"
              }
            }
          ],
          "x-parser-unique-object-id": "PaymentRequest"
        }
      },
      "x-parser-unique-object-id": "paymentRequest"
    },
    "paymentResult": {
      "address": "adapter.payment.result",
      "title": "결제 결과",
      "description": "Adapter → Core",
      "messages": {
        "PaymentResponse": {
          "name": "PaymentResponse",
          "title": "결제 결과",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "status"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "결제 고유 ID",
                "examples": [
                  "2026032501"
                ],
                "x-parser-schema-id": "<anonymous-schema-39>"
              },
              "chainId": {
                "type": "string",
                "description": "체인 ID",
                "nullable": true,
                "examples": [
                  "56357"
                ],
                "x-parser-schema-id": "<anonymous-schema-40>"
              },
              "status": "$ref:$.channels.accountDeployed.messages.AccountDeployResponse.payload.properties.status",
              "txHash": {
                "type": "string",
                "description": "트랜잭션 해시 (실패 시 null)",
                "pattern": "^0x[a-fA-F0-9]{64}$",
                "nullable": true,
                "examples": [
                  "0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890"
                ],
                "x-parser-schema-id": "<anonymous-schema-41>"
              },
              "completeDatetime": {
                "type": "string",
                "description": "완료 일시 (yyyyMMddHHmmss, 실패 시 null)",
                "nullable": true,
                "examples": [
                  "20260325191630"
                ],
                "x-parser-schema-id": "<anonymous-schema-42>"
              },
              "amount": {
                "type": "string",
                "description": "결제 금액 (실패 시 null)",
                "nullable": true,
                "examples": [
                  "7.69"
                ],
                "x-parser-schema-id": "<anonymous-schema-43>"
              },
              "gasFee": {
                "type": "string",
                "description": "가스 수수료 (gasFee = gasUsed * effectiveGasPrice, 실패 시 null)",
                "nullable": true,
                "examples": [
                  "21000"
                ],
                "x-parser-schema-id": "<anonymous-schema-44>"
              },
              "message": {
                "type": "string",
                "description": "에러 메시지 (성공 시 null)",
                "nullable": true,
                "examples": [
                  null
                ],
                "x-parser-schema-id": "<anonymous-schema-45>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-38>"
          },
          "examples": [
            {
              "name": "결제 성공",
              "payload": {
                "requestId": "2026032501",
                "chainId": "56357",
                "status": "TXCF",
                "txHash": "0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890",
                "completeDatetime": "20260325191630",
                "amount": "7.69",
                "gasFee": "21000",
                "message": null
              }
            },
            {
              "name": "결제 실패",
              "payload": {
                "requestId": "2026032501",
                "chainId": null,
                "status": "TXFA",
                "txHash": null,
                "completeDatetime": null,
                "amount": null,
                "gasFee": null,
                "message": "BUSINESS_ERROR"
              }
            }
          ],
          "x-parser-unique-object-id": "PaymentResponse"
        }
      },
      "x-parser-unique-object-id": "paymentResult"
    },
    "commonConfirm": {
      "address": "adapter.common.confirm",
      "title": "트랜잭션 컨펌 요청",
      "description": "Core → Adapter",
      "x-group": "거래",
      "x-icon": "✅",
      "messages": {
        "ConfirmRequest": {
          "name": "ConfirmRequest",
          "title": "트랜잭션 컨펌 요청",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "txHash"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "W123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-47>"
              },
              "txHash": {
                "type": "string",
                "description": "확인할 트랜잭션 해시",
                "pattern": "^0x[a-fA-F0-9]{64}$",
                "examples": [
                  "0xe9e91f1ee4b56c0df2e9f06c2b8c27c6076195a88a7b8537ba8313d80e6f124e"
                ],
                "x-parser-schema-id": "<anonymous-schema-48>"
              },
              "chainId": {
                "type": "string",
                "description": "체인 ID (결제 컨펌 확인 시 null)",
                "nullable": true,
                "examples": [
                  "11155111"
                ],
                "x-parser-schema-id": "<anonymous-schema-49>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-46>"
          },
          "examples": [
            {
              "name": "출금 컨펌 확인",
              "payload": {
                "requestId": "W123456789",
                "txHash": "0xe9e91f1ee4b56c0df2e9f06c2b8c27c6076195a88a7b8537ba8313d80e6f124e",
                "chainId": "11155111"
              }
            },
            {
              "name": "결제 컨펌 확인",
              "payload": {
                "requestId": "W123456789",
                "txHash": "0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890",
                "chainId": null
              }
            }
          ],
          "x-parser-unique-object-id": "ConfirmRequest"
        }
      },
      "x-parser-unique-object-id": "commonConfirm"
    },
    "commonConfirmed": {
      "address": "adapter.common.confirmed",
      "title": "트랜잭션 컨펌 결과",
      "description": "Adapter → Core",
      "messages": {
        "ConfirmResponse": {
          "name": "ConfirmResponse",
          "title": "트랜잭션 컨펌 결과",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "txHash",
              "status",
              "confirmCount"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "W123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-51>"
              },
              "txHash": {
                "type": "string",
                "description": "트랜잭션 해시",
                "pattern": "^0x[a-fA-F0-9]{64}$",
                "examples": [
                  "0xe9e91f1ee4b56c0df2e9f06c2b8c27c6076195a88a7b8537ba8313d80e6f124e"
                ],
                "x-parser-schema-id": "<anonymous-schema-52>"
              },
              "status": "$ref:$.channels.accountDeployed.messages.AccountDeployResponse.payload.properties.status",
              "chainId": {
                "type": "string",
                "description": "체인 ID",
                "nullable": true,
                "examples": [
                  "11155111"
                ],
                "x-parser-schema-id": "<anonymous-schema-53>"
              },
              "confirmCount": {
                "type": "integer",
                "description": "현재 블록 컨펌 수",
                "examples": [
                  7
                ],
                "x-parser-schema-id": "<anonymous-schema-54>"
              },
              "gasFee": {
                "type": "string",
                "description": "가스 수수료 (실패 시 null)",
                "nullable": true,
                "examples": [
                  "0.0001"
                ],
                "x-parser-schema-id": "<anonymous-schema-55>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-50>"
          },
          "examples": [
            {
              "name": "컨펌 완료",
              "payload": {
                "requestId": "W123456789",
                "txHash": "0xe9e91f1ee4b56c0df2e9f06c2b8c27c6076195a88a7b8537ba8313d80e6f124e",
                "status": "TXCF",
                "chainId": "11155111",
                "confirmCount": 7,
                "gasFee": "0.0001"
              }
            },
            {
              "name": "컨펌 대기 중",
              "payload": {
                "requestId": "W123456789",
                "txHash": "0xe9e91f1ee4b56c0df2e9f06c2b8c27c6076195a88a7b8537ba8313d80e6f124e",
                "status": "TXPD",
                "chainId": "11155111",
                "confirmCount": 2,
                "gasFee": null
              }
            }
          ],
          "x-parser-unique-object-id": "ConfirmResponse"
        }
      },
      "x-parser-unique-object-id": "commonConfirmed"
    },
    "balanceInquiry": {
      "address": "adapter.balance.inquiry",
      "title": "잔액 조회 요청",
      "description": "Core → Adapter",
      "x-group": "조회 & 대사",
      "x-icon": "💎",
      "messages": {
        "BalanceRequest": {
          "name": "BalanceRequest",
          "title": "잔액 조회 요청",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "address"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "B123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-57>"
              },
              "address": {
                "type": "string",
                "description": "조회할 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
                ],
                "x-parser-schema-id": "<anonymous-schema-58>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-56>"
          },
          "examples": [
            {
              "name": "잔액 조회 요청 예시",
              "payload": {
                "requestId": "B123456789",
                "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
              }
            }
          ],
          "x-parser-unique-object-id": "BalanceRequest"
        }
      },
      "x-parser-unique-object-id": "balanceInquiry"
    },
    "balanceResult": {
      "address": "adapter.balance.result",
      "title": "잔액 조회 결과",
      "description": "Adapter → Core",
      "messages": {
        "BalanceResponse": {
          "name": "BalanceResponse",
          "title": "잔액 조회 결과",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "result"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "B123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-60>"
              },
              "result": {
                "type": "array",
                "description": "체인/토큰별 잔액 목록",
                "items": {
                  "type": "object",
                  "required": [
                    "chainId",
                    "symbol",
                    "address",
                    "balance"
                  ],
                  "properties": {
                    "chainId": {
                      "type": "string",
                      "description": "체인 ID",
                      "examples": [
                        "11155111"
                      ],
                      "x-parser-schema-id": "<anonymous-schema-63>"
                    },
                    "symbol": {
                      "type": "string",
                      "description": "토큰 심볼",
                      "examples": [
                        "USDC"
                      ],
                      "x-parser-schema-id": "<anonymous-schema-64>"
                    },
                    "address": {
                      "type": "string",
                      "description": "조회한 주소",
                      "pattern": "^0x[a-fA-F0-9]{40}$",
                      "examples": [
                        "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
                      ],
                      "x-parser-schema-id": "<anonymous-schema-65>"
                    },
                    "balance": {
                      "type": "string",
                      "description": "잔액 (decimal string)",
                      "examples": [
                        "250.0"
                      ],
                      "x-parser-schema-id": "<anonymous-schema-66>"
                    }
                  },
                  "x-parser-schema-id": "<anonymous-schema-62>"
                },
                "x-parser-schema-id": "<anonymous-schema-61>"
              },
              "message": {
                "type": "string",
                "description": "에러 메시지 (성공 시 null)",
                "nullable": true,
                "examples": [
                  null
                ],
                "x-parser-schema-id": "<anonymous-schema-67>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-59>"
          },
          "examples": [
            {
              "name": "잔액 조회 성공",
              "payload": {
                "requestId": "B123456789",
                "result": [
                  {
                    "chainId": "11155111",
                    "symbol": "USDC",
                    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
                    "balance": "250.0"
                  },
                  {
                    "chainId": "11155111",
                    "symbol": "ETH",
                    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
                    "balance": "1.5"
                  }
                ],
                "message": null
              }
            },
            {
              "name": "잔액 조회 실패",
              "payload": {
                "requestId": "B123456789",
                "result": [],
                "message": "ACCOUNT_NOT_FOUND"
              }
            }
          ],
          "x-parser-unique-object-id": "BalanceResponse"
        }
      },
      "x-parser-unique-object-id": "balanceResult"
    },
    "configCreate": {
      "address": "adapter.config.create",
      "title": "설정 등록",
      "description": "Core → Adapter (응답 없음)",
      "x-group": "설정 & 이벤트",
      "x-icon": "⚙️",
      "messages": {
        "ConfigRegisterRequest": {
          "name": "ConfigRegisterRequest",
          "title": "설정 등록 요청 (NoReply)",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "chainId",
              "contractAddress"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "C123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-69>"
              },
              "chainId": {
                "type": "string",
                "description": "체인 ID",
                "examples": [
                  "43114"
                ],
                "x-parser-schema-id": "<anonymous-schema-70>"
              },
              "contractAddress": {
                "type": "string",
                "description": "토큰 컨트랙트 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
                ],
                "x-parser-schema-id": "<anonymous-schema-71>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-68>"
          },
          "examples": [
            {
              "name": "토큰 설정 등록",
              "payload": {
                "requestId": "C123456789",
                "chainId": "43114",
                "contractAddress": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
              }
            }
          ],
          "x-parser-unique-object-id": "ConfigRegisterRequest"
        }
      },
      "x-parser-unique-object-id": "configCreate"
    },
    "settlementRequest": {
      "address": "adapter.settlement.request",
      "title": "정산 요청",
      "description": "Core → Adapter",
      "x-group": "설정 & 이벤트",
      "x-icon": "🏦",
      "messages": {
        "SettlementRequest": {
          "name": "SettlementRequest",
          "title": "정산 요청",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "symbol",
              "amount",
              "fee",
              "merchantAddress"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "ST-20260407-000001"
                ],
                "x-parser-schema-id": "<anonymous-schema-73>"
              },
              "symbol": {
                "type": "string",
                "description": "토큰 심볼 (1-20자)",
                "examples": [
                  "USDC"
                ],
                "x-parser-schema-id": "<anonymous-schema-74>"
              },
              "amount": {
                "type": "string",
                "description": "정산 금액 (decimal string)",
                "pattern": "^\\d+(\\.\\d+)?$",
                "examples": [
                  "100.00"
                ],
                "x-parser-schema-id": "<anonymous-schema-75>"
              },
              "fee": {
                "type": "string",
                "description": "수수료 (decimal string)",
                "pattern": "^\\d+(\\.\\d+)?$",
                "examples": [
                  "1.50"
                ],
                "x-parser-schema-id": "<anonymous-schema-76>"
              },
              "merchantAddress": {
                "type": "string",
                "description": "가맹점 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0xCBdAbfa3d691211f337e1f415D4Ee64979C7ee00"
                ],
                "x-parser-schema-id": "<anonymous-schema-77>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-72>"
          },
          "examples": [
            {
              "name": "USDC 정산 요청",
              "payload": {
                "requestId": "ST-20260407-000001",
                "symbol": "USDC",
                "amount": "100.00",
                "fee": "1.50",
                "merchantAddress": "0xCBdAbfa3d691211f337e1f415D4Ee64979C7ee00"
              }
            }
          ],
          "x-parser-unique-object-id": "SettlementRequest"
        }
      },
      "x-parser-unique-object-id": "settlementRequest"
    },
    "settlementResult": {
      "address": "adapter.settlement.result",
      "title": "정산 결과",
      "description": "Adapter → Core",
      "messages": {
        "SettlementResponse": {
          "name": "SettlementResponse",
          "title": "정산 결과",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "chainId",
              "status"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "ST-20260407-000001"
                ],
                "x-parser-schema-id": "<anonymous-schema-79>"
              },
              "chainId": {
                "type": "string",
                "description": "체인 ID",
                "examples": [
                  "56357"
                ],
                "x-parser-schema-id": "<anonymous-schema-80>"
              },
              "status": "$ref:$.channels.accountDeployed.messages.AccountDeployResponse.payload.properties.status",
              "txHash": {
                "type": "string",
                "description": "트랜잭션 해시 (실패 시 null)",
                "pattern": "^0x[a-fA-F0-9]{64}$",
                "nullable": true,
                "examples": [
                  "0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890"
                ],
                "x-parser-schema-id": "<anonymous-schema-81>"
              },
              "completeDatetime": {
                "type": "string",
                "description": "완료 일시 (yyyyMMddHHmmss, 실패 시 null)",
                "nullable": true,
                "examples": [
                  "20260407143015"
                ],
                "x-parser-schema-id": "<anonymous-schema-82>"
              },
              "amount": {
                "type": "string",
                "description": "정산 금액 (실패 시 null)",
                "nullable": true,
                "examples": [
                  "100.00"
                ],
                "x-parser-schema-id": "<anonymous-schema-83>"
              },
              "gasFee": {
                "type": "string",
                "description": "가스 수수료 (실패 시 null)",
                "nullable": true,
                "examples": [
                  "21000"
                ],
                "x-parser-schema-id": "<anonymous-schema-84>"
              },
              "message": {
                "type": "string",
                "description": "에러 메시지 (성공 시 null)",
                "nullable": true,
                "examples": [
                  null
                ],
                "x-parser-schema-id": "<anonymous-schema-85>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-78>"
          },
          "examples": [
            {
              "name": "정산 성공",
              "payload": {
                "requestId": "ST-20260407-000001",
                "chainId": "56357",
                "status": "TXCF",
                "txHash": "0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890",
                "completeDatetime": "20260407143015",
                "amount": "100.00",
                "gasFee": "21000",
                "message": null
              }
            },
            {
              "name": "정산 실패",
              "payload": {
                "requestId": "ST-20260407-000001",
                "chainId": "56357",
                "status": "TXFA",
                "txHash": null,
                "completeDatetime": null,
                "amount": null,
                "gasFee": null,
                "message": "INSUFFICIENT_BALANCE"
              }
            }
          ],
          "x-parser-unique-object-id": "SettlementResponse"
        }
      },
      "x-parser-unique-object-id": "settlementResult"
    },
    "reconciliationInquiry": {
      "address": "adapter.reconciliation.inquiry",
      "title": "대사 조회 요청",
      "description": "Core → Adapter",
      "x-group": "조회 & 대사",
      "x-icon": "📊",
      "messages": {
        "ReconciliationRequest": {
          "name": "ReconciliationRequest",
          "title": "대사 조회 요청",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "targetDt"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "RC-20260407-000001"
                ],
                "x-parser-schema-id": "<anonymous-schema-87>"
              },
              "targetDt": {
                "type": "string",
                "description": "대사 기준 일시 (yyyyMMddHHmmss)",
                "pattern": "^\\d{14}$",
                "examples": [
                  "20260407000000"
                ],
                "x-parser-schema-id": "<anonymous-schema-88>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-86>"
          },
          "examples": [
            {
              "name": "대사 조회 요청 예시",
              "payload": {
                "requestId": "RC-20260407-000001",
                "targetDt": "20260407000000"
              }
            }
          ],
          "x-parser-unique-object-id": "ReconciliationRequest"
        }
      },
      "x-parser-unique-object-id": "reconciliationInquiry"
    },
    "reconciliationResult": {
      "address": "adapter.reconciliation.result",
      "title": "대사 조회 결과",
      "description": "Adapter → Core",
      "messages": {
        "ReconciliationResponse": {
          "name": "ReconciliationResponse",
          "title": "대사 조회 결과",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "result"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "RC-20260407-000001"
                ],
                "x-parser-schema-id": "<anonymous-schema-90>"
              },
              "result": {
                "type": "array",
                "description": "토큰별 대사 결과 목록",
                "items": {
                  "type": "object",
                  "required": [
                    "symbol",
                    "userOnTotal",
                    "platformOnTotal",
                    "reserveOnTotal",
                    "notDeployUserOnTotal"
                  ],
                  "properties": {
                    "symbol": {
                      "type": "string",
                      "description": "토큰 심볼",
                      "examples": [
                        "USDC"
                      ],
                      "x-parser-schema-id": "<anonymous-schema-93>"
                    },
                    "userOnTotal": {
                      "type": "string",
                      "description": "사용자 온체인 잔액 합계 (decimal string)",
                      "examples": [
                        "50000.00"
                      ],
                      "x-parser-schema-id": "<anonymous-schema-94>"
                    },
                    "platformOnTotal": {
                      "type": "string",
                      "description": "플랫폼 온체인 잔액 합계 (decimal string)",
                      "examples": [
                        "10000.00"
                      ],
                      "x-parser-schema-id": "<anonymous-schema-95>"
                    },
                    "reserveOnTotal": {
                      "type": "string",
                      "description": "리저브 온체인 잔액 합계 (decimal string)",
                      "examples": [
                        "0"
                      ],
                      "x-parser-schema-id": "<anonymous-schema-96>"
                    },
                    "notDeployUserOnTotal": {
                      "type": "string",
                      "description": "미배포 사용자 온체인 잔액 합계 (decimal string)",
                      "examples": [
                        "500.00"
                      ],
                      "x-parser-schema-id": "<anonymous-schema-97>"
                    }
                  },
                  "x-parser-schema-id": "<anonymous-schema-92>"
                },
                "x-parser-schema-id": "<anonymous-schema-91>"
              },
              "message": {
                "type": "string",
                "description": "에러 메시지 (성공 시 null)",
                "nullable": true,
                "examples": [
                  null
                ],
                "x-parser-schema-id": "<anonymous-schema-98>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-89>"
          },
          "examples": [
            {
              "name": "대사 조회 성공",
              "payload": {
                "requestId": "RC-20260407-000001",
                "result": [
                  {
                    "symbol": "USDC",
                    "userOnTotal": "50000.00",
                    "platformOnTotal": "10000.00",
                    "reserveOnTotal": "0",
                    "notDeployUserOnTotal": "500.00"
                  },
                  {
                    "symbol": "USDT",
                    "userOnTotal": "30000.00",
                    "platformOnTotal": "5000.00",
                    "reserveOnTotal": "0",
                    "notDeployUserOnTotal": "200.00"
                  }
                ],
                "message": null
              }
            },
            {
              "name": "대사 조회 실패",
              "payload": {
                "requestId": "RC-20260407-000001",
                "result": [],
                "message": "VALIDATION_ERROR"
              }
            }
          ],
          "x-parser-unique-object-id": "ReconciliationResponse"
        }
      },
      "x-parser-unique-object-id": "reconciliationResult"
    },
    "depositDetected": {
      "address": "adapter.deposit.detected",
      "title": "입금 감지 이벤트",
      "description": "Adapter → Core (WebSocket 감지)",
      "x-group": "설정 & 이벤트",
      "x-icon": "💰",
      "messages": {
        "DepositEvent": {
          "name": "DepositEvent",
          "title": "입금 감지 이벤트",
          "description": "WebSocket에서 감지된 입금을 Kafka로 발행",
          "payload": {
            "type": "object",
            "required": [
              "chainId",
              "txHash",
              "fromAddress",
              "toAddress",
              "amount",
              "confirmCount",
              "symbol",
              "status",
              "transactionDatetime"
            ],
            "properties": {
              "chainId": {
                "type": "string",
                "description": "체인 ID",
                "examples": [
                  "11155111"
                ],
                "x-parser-schema-id": "<anonymous-schema-100>"
              },
              "txHash": {
                "type": "string",
                "description": "트랜잭션 해시",
                "pattern": "^0x[a-fA-F0-9]{64}$",
                "examples": [
                  "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
                ],
                "x-parser-schema-id": "<anonymous-schema-101>"
              },
              "fromAddress": {
                "type": "string",
                "description": "송신 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0xAb5801a7D398351b8bE11C439e05C5b3259aeC9B"
                ],
                "x-parser-schema-id": "<anonymous-schema-102>"
              },
              "toAddress": {
                "type": "string",
                "description": "수신 (입금) 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
                ],
                "x-parser-schema-id": "<anonymous-schema-103>"
              },
              "amount": {
                "type": "string",
                "description": "입금 금액 (Wei/decimal string)",
                "examples": [
                  "10000000000"
                ],
                "x-parser-schema-id": "<anonymous-schema-104>"
              },
              "confirmCount": {
                "type": "integer",
                "description": "현재 블록 컨펌 수",
                "examples": [
                  10
                ],
                "x-parser-schema-id": "<anonymous-schema-105>"
              },
              "symbol": {
                "type": "string",
                "description": "토큰 심볼",
                "examples": [
                  "USDT"
                ],
                "x-parser-schema-id": "<anonymous-schema-106>"
              },
              "status": {
                "type": "string",
                "description": "트랜잭션 상태 (TXPD / TXCF / TXFA)",
                "examples": [
                  "TXCF"
                ],
                "x-parser-schema-id": "<anonymous-schema-107>"
              },
              "transactionDatetime": {
                "type": "string",
                "description": "트랜잭션 일시 (yyyyMMddHHmmss)",
                "examples": [
                  "20260325122100"
                ],
                "x-parser-schema-id": "<anonymous-schema-108>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-99>"
          },
          "examples": [
            {
              "name": "USDT 입금 감지 (Confirmed)",
              "payload": {
                "chainId": "11155111",
                "txHash": "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
                "fromAddress": "0xAb5801a7D398351b8bE11C439e05C5b3259aeC9B",
                "toAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
                "amount": "10000000000",
                "confirmCount": 10,
                "symbol": "USDT",
                "status": "TXCF",
                "transactionDatetime": "20260325122100"
              }
            },
            {
              "name": "네이티브 코인 입금 감지 (Pending)",
              "payload": {
                "chainId": "11155111",
                "txHash": "0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890",
                "fromAddress": "0xAb5801a7D398351b8bE11C439e05C5b3259aeC9B",
                "toAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
                "amount": "500000000000000000",
                "confirmCount": 1,
                "symbol": "ETH",
                "status": "TXPD",
                "transactionDatetime": "20260325122200"
              }
            }
          ],
          "x-parser-unique-object-id": "DepositEvent"
        }
      },
      "x-parser-unique-object-id": "depositDetected"
    }
  },
  "operations": {
    "receiveAccountCreate": {
      "action": "receive",
      "channel": "$ref:$.channels.accountCreate",
      "title": "계정 생성 요청 수신",
      "summary": "계정 생성 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.accountCreated"
      },
      "x-parser-unique-object-id": "receiveAccountCreate"
    },
    "sendAccountCreated": {
      "action": "send",
      "channel": "$ref:$.channels.accountCreated",
      "title": "계정 생성 결과 발행",
      "summary": "계정 생성 결과 발행",
      "x-parser-unique-object-id": "sendAccountCreated"
    },
    "receiveAccountDeploy": {
      "action": "receive",
      "channel": "$ref:$.channels.accountDeploy",
      "title": "계정 배포 요청 수신",
      "summary": "계정 배포 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.accountDeployed"
      },
      "x-parser-unique-object-id": "receiveAccountDeploy"
    },
    "sendAccountDeployed": {
      "action": "send",
      "channel": "$ref:$.channels.accountDeployed",
      "title": "계정 배포 결과 발행",
      "summary": "계정 배포 결과 발행",
      "x-parser-unique-object-id": "sendAccountDeployed"
    },
    "receiveAccountDelete": {
      "action": "receive",
      "channel": "$ref:$.channels.accountDelete",
      "title": "계정 삭제 요청 수신",
      "summary": "계정 삭제 요청 수신 (응답 없음)",
      "x-parser-unique-object-id": "receiveAccountDelete"
    },
    "receiveWithdrawRequest": {
      "action": "receive",
      "channel": "$ref:$.channels.withdrawRequest",
      "title": "출금 요청 수신",
      "summary": "출금 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.withdrawResult"
      },
      "x-parser-unique-object-id": "receiveWithdrawRequest"
    },
    "sendWithdrawResult": {
      "action": "send",
      "channel": "$ref:$.channels.withdrawResult",
      "title": "출금 결과 발행",
      "summary": "출금 결과 발행",
      "x-parser-unique-object-id": "sendWithdrawResult"
    },
    "receivePaymentRequest": {
      "action": "receive",
      "channel": "$ref:$.channels.paymentRequest",
      "title": "결제 요청 수신",
      "summary": "결제 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.paymentResult"
      },
      "x-parser-unique-object-id": "receivePaymentRequest"
    },
    "sendPaymentResult": {
      "action": "send",
      "channel": "$ref:$.channels.paymentResult",
      "title": "결제 결과 발행",
      "summary": "결제 결과 발행",
      "x-parser-unique-object-id": "sendPaymentResult"
    },
    "receiveConfirm": {
      "action": "receive",
      "channel": "$ref:$.channels.commonConfirm",
      "title": "트랜잭션 컨펌 요청 수신",
      "summary": "트랜잭션 컨펌 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.commonConfirmed"
      },
      "x-parser-unique-object-id": "receiveConfirm"
    },
    "sendConfirmed": {
      "action": "send",
      "channel": "$ref:$.channels.commonConfirmed",
      "title": "트랜잭션 컨펌 결과 발행",
      "summary": "트랜잭션 컨펌 결과 발행",
      "x-parser-unique-object-id": "sendConfirmed"
    },
    "receiveBalanceInquiry": {
      "action": "receive",
      "channel": "$ref:$.channels.balanceInquiry",
      "title": "잔액 조회 요청 수신",
      "summary": "잔액 조회 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.balanceResult"
      },
      "x-parser-unique-object-id": "receiveBalanceInquiry"
    },
    "sendBalanceResult": {
      "action": "send",
      "channel": "$ref:$.channels.balanceResult",
      "title": "잔액 조회 결과 발행",
      "summary": "잔액 조회 결과 발행",
      "x-parser-unique-object-id": "sendBalanceResult"
    },
    "receiveSettlementRequest": {
      "action": "receive",
      "channel": "$ref:$.channels.settlementRequest",
      "title": "정산 요청 수신",
      "summary": "정산 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.settlementResult"
      },
      "x-parser-unique-object-id": "receiveSettlementRequest"
    },
    "sendSettlementResult": {
      "action": "send",
      "channel": "$ref:$.channels.settlementResult",
      "title": "정산 결과 발행",
      "summary": "정산 결과 발행",
      "x-parser-unique-object-id": "sendSettlementResult"
    },
    "receiveReconciliationInquiry": {
      "action": "receive",
      "channel": "$ref:$.channels.reconciliationInquiry",
      "title": "대사 조회 요청 수신",
      "summary": "대사 조회 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.reconciliationResult"
      },
      "x-parser-unique-object-id": "receiveReconciliationInquiry"
    },
    "sendReconciliationResult": {
      "action": "send",
      "channel": "$ref:$.channels.reconciliationResult",
      "title": "대사 조회 결과 발행",
      "summary": "대사 조회 결과 발행",
      "x-parser-unique-object-id": "sendReconciliationResult"
    },
    "receiveConfigCreate": {
      "action": "receive",
      "channel": "$ref:$.channels.configCreate",
      "title": "설정 등록 요청 수신",
      "summary": "설정 등록 요청 수신 (응답 없음)",
      "x-parser-unique-object-id": "receiveConfigCreate"
    },
    "sendDepositDetected": {
      "action": "send",
      "channel": "$ref:$.channels.depositDetected",
      "title": "입금 감지 이벤트 발행",
      "summary": "입금 감지 이벤트 발행 (WebSocket → Kafka)",
      "x-parser-unique-object-id": "sendDepositDetected"
    }
  },
  "components": {
    "schemas": {
      "TransactionStatus": "$ref:$.channels.accountDeployed.messages.AccountDeployResponse.payload.properties.status"
    }
  },
  "x-parser-spec-parsed": true,
  "x-parser-api-version": 3,
  "x-parser-spec-stringified": true
};
    const config = {"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault"}};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  