
    const schema = {
  "asyncapi": "3.0.0",
  "info": {
    "title": "StableCoin BC Adapter",
    "version": "1.0.0",
    "description": "StableCoin 블록체인 어댑터의 Kafka 메시지 스펙.\n계정 생성/배포, 출금, 결제, 잔액 조회, 입금 감지 등의 블록체인 연동 기능을 제공합니다.\n"
  },
  "defaultContentType": "application/json",
  "channels": {
    "accountCreate": {
      "address": "adapter.account.create",
      "title": "계정 생성 요청",
      "description": "Core → Adapter",
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
                "x-parser-schema-id": "트랜잭션 상태"
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
      "messages": {
        "BalanceRequest": {
          "name": "BalanceRequest",
          "title": "잔액 조회 요청",
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
                  "B123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-57>"
              },
              "chainId": {
                "type": "string",
                "description": "체인 ID",
                "examples": [
                  "11155111"
                ],
                "x-parser-schema-id": "<anonymous-schema-58>"
              },
              "address": {
                "type": "string",
                "description": "조회할 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
                ],
                "x-parser-schema-id": "<anonymous-schema-59>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-56>"
          },
          "examples": [
            {
              "name": "잔액 조회 요청 예시",
              "payload": {
                "requestId": "B123456789",
                "chainId": "11155111",
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
              "requestId"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "B123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-61>"
              },
              "chainId": {
                "type": "string",
                "description": "체인 ID (실패 시 null)",
                "nullable": true,
                "examples": [
                  "11155111"
                ],
                "x-parser-schema-id": "<anonymous-schema-62>"
              },
              "address": {
                "type": "string",
                "description": "조회한 주소 (실패 시 null)",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "nullable": true,
                "examples": [
                  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
                ],
                "x-parser-schema-id": "<anonymous-schema-63>"
              },
              "balance": {
                "type": "string",
                "description": "잔액 (decimal string, 실패 시 null)",
                "nullable": true,
                "examples": [
                  "250000000000000000000"
                ],
                "x-parser-schema-id": "<anonymous-schema-64>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-60>"
          },
          "examples": [
            {
              "name": "잔액 조회 성공",
              "payload": {
                "requestId": "B123456789",
                "chainId": "11155111",
                "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
                "balance": "250000000000000000000"
              }
            },
            {
              "name": "잔액 조회 실패",
              "payload": {
                "requestId": "B123456789",
                "chainId": null,
                "address": null,
                "balance": null
              }
            }
          ],
          "x-parser-unique-object-id": "BalanceResponse"
        }
      },
      "x-parser-unique-object-id": "balanceResult"
    },
    "configRegister": {
      "address": "adapter.config.register",
      "title": "토큰 설정 등록",
      "description": "Core → Adapter (응답 없음)",
      "messages": {
        "ConfigRegisterRequest": {
          "name": "ConfigRegisterRequest",
          "title": "토큰 설정 등록 요청 (NoReply)",
          "payload": {
            "type": "object",
            "required": [
              "requestId",
              "chainId",
              "contractAddress",
              "symbol",
              "decimals"
            ],
            "properties": {
              "requestId": {
                "type": "string",
                "description": "요청 고유 ID",
                "examples": [
                  "C123456789"
                ],
                "x-parser-schema-id": "<anonymous-schema-66>"
              },
              "chainId": {
                "type": "string",
                "description": "체인 ID",
                "examples": [
                  "43114"
                ],
                "x-parser-schema-id": "<anonymous-schema-67>"
              },
              "contractAddress": {
                "type": "string",
                "description": "토큰 컨트랙트 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
                ],
                "x-parser-schema-id": "<anonymous-schema-68>"
              },
              "symbol": {
                "type": "string",
                "description": "토큰 심볼 (1-20자)",
                "examples": [
                  "USDC"
                ],
                "x-parser-schema-id": "<anonymous-schema-69>"
              },
              "decimals": {
                "type": "integer",
                "description": "토큰 소수점 자릿수",
                "minimum": 0,
                "examples": [
                  6
                ],
                "x-parser-schema-id": "<anonymous-schema-70>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-65>"
          },
          "examples": [
            {
              "name": "USDC 토큰 설정 등록",
              "payload": {
                "requestId": "C123456789",
                "chainId": "43114",
                "contractAddress": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                "symbol": "USDC",
                "decimals": 6
              }
            },
            {
              "name": "USDT 토큰 설정 등록",
              "payload": {
                "requestId": "C123456790",
                "chainId": "43114",
                "contractAddress": "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
                "symbol": "USDT",
                "decimals": 6
              }
            }
          ],
          "x-parser-unique-object-id": "ConfigRegisterRequest"
        }
      },
      "x-parser-unique-object-id": "configRegister"
    },
    "depositDetected": {
      "address": "adapter.deposit.detected",
      "title": "입금 감지 이벤트",
      "description": "Adapter → Core (WebSocket 감지)",
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
                "x-parser-schema-id": "<anonymous-schema-72>"
              },
              "txHash": {
                "type": "string",
                "description": "트랜잭션 해시",
                "pattern": "^0x[a-fA-F0-9]{64}$",
                "examples": [
                  "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
                ],
                "x-parser-schema-id": "<anonymous-schema-73>"
              },
              "fromAddress": {
                "type": "string",
                "description": "송신 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0xAb5801a7D398351b8bE11C439e05C5b3259aeC9B"
                ],
                "x-parser-schema-id": "<anonymous-schema-74>"
              },
              "toAddress": {
                "type": "string",
                "description": "수신 (입금) 주소",
                "pattern": "^0x[a-fA-F0-9]{40}$",
                "examples": [
                  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
                ],
                "x-parser-schema-id": "<anonymous-schema-75>"
              },
              "amount": {
                "type": "string",
                "description": "입금 금액 (Wei/decimal string)",
                "examples": [
                  "10000000000"
                ],
                "x-parser-schema-id": "<anonymous-schema-76>"
              },
              "confirmCount": {
                "type": "integer",
                "description": "현재 블록 컨펌 수",
                "examples": [
                  10
                ],
                "x-parser-schema-id": "<anonymous-schema-77>"
              },
              "symbol": {
                "type": "string",
                "description": "토큰 심볼",
                "examples": [
                  "USDT"
                ],
                "x-parser-schema-id": "<anonymous-schema-78>"
              },
              "status": {
                "type": "string",
                "description": "트랜잭션 상태 (TXPD / TXCF / TXFA)",
                "examples": [
                  "TXCF"
                ],
                "x-parser-schema-id": "<anonymous-schema-79>"
              },
              "transactionDatetime": {
                "type": "string",
                "description": "트랜잭션 일시 (yyyyMMddHHmmss)",
                "examples": [
                  "20260325122100"
                ],
                "x-parser-schema-id": "<anonymous-schema-80>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-71>"
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
    "계정 생성 요청 수신": {
      "action": "receive",
      "channel": "$ref:$.channels.accountCreate",
      "title": "계정 생성 요청 수신",
      "summary": "계정 생성 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.accountCreated"
      },
      "x-parser-unique-object-id": "계정 생성 요청 수신"
    },
    "계정 생성 결과 발행": {
      "action": "send",
      "channel": "$ref:$.channels.accountCreated",
      "title": "계정 생성 결과 발행",
      "summary": "계정 생성 결과 발행",
      "x-parser-unique-object-id": "계정 생성 결과 발행"
    },
    "계정 배포 요청 수신": {
      "action": "receive",
      "channel": "$ref:$.channels.accountDeploy",
      "title": "계정 배포 요청 수신",
      "summary": "계정 배포 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.accountDeployed"
      },
      "x-parser-unique-object-id": "계정 배포 요청 수신"
    },
    "계정 배포 결과 발행": {
      "action": "send",
      "channel": "$ref:$.channels.accountDeployed",
      "title": "계정 배포 결과 발행",
      "summary": "계정 배포 결과 발행",
      "x-parser-unique-object-id": "계정 배포 결과 발행"
    },
    "계정 삭제 요청 수신": {
      "action": "receive",
      "channel": "$ref:$.channels.accountDelete",
      "title": "계정 삭제 요청 수신",
      "summary": "계정 삭제 요청 수신 (응답 없음)",
      "x-parser-unique-object-id": "계정 삭제 요청 수신"
    },
    "출금 요청 수신": {
      "action": "receive",
      "channel": "$ref:$.channels.withdrawRequest",
      "title": "출금 요청 수신",
      "summary": "출금 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.withdrawResult"
      },
      "x-parser-unique-object-id": "출금 요청 수신"
    },
    "출금 결과 발행": {
      "action": "send",
      "channel": "$ref:$.channels.withdrawResult",
      "title": "출금 결과 발행",
      "summary": "출금 결과 발행",
      "x-parser-unique-object-id": "출금 결과 발행"
    },
    "결제 요청 수신": {
      "action": "receive",
      "channel": "$ref:$.channels.paymentRequest",
      "title": "결제 요청 수신",
      "summary": "결제 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.paymentResult"
      },
      "x-parser-unique-object-id": "결제 요청 수신"
    },
    "결제 결과 발행": {
      "action": "send",
      "channel": "$ref:$.channels.paymentResult",
      "title": "결제 결과 발행",
      "summary": "결제 결과 발행",
      "x-parser-unique-object-id": "결제 결과 발행"
    },
    "트랜잭션 컨펌 요청 수신": {
      "action": "receive",
      "channel": "$ref:$.channels.commonConfirm",
      "title": "트랜잭션 컨펌 요청 수신",
      "summary": "트랜잭션 컨펌 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.commonConfirmed"
      },
      "x-parser-unique-object-id": "트랜잭션 컨펌 요청 수신"
    },
    "트랜잭션 컨펌 결과 발행": {
      "action": "send",
      "channel": "$ref:$.channels.commonConfirmed",
      "title": "트랜잭션 컨펌 결과 발행",
      "summary": "트랜잭션 컨펌 결과 발행",
      "x-parser-unique-object-id": "트랜잭션 컨펌 결과 발행"
    },
    "잔액 조회 요청 수신": {
      "action": "receive",
      "channel": "$ref:$.channels.balanceInquiry",
      "title": "잔액 조회 요청 수신",
      "summary": "잔액 조회 요청 수신",
      "reply": {
        "channel": "$ref:$.channels.balanceResult"
      },
      "x-parser-unique-object-id": "잔액 조회 요청 수신"
    },
    "잔액 조회 결과 발행": {
      "action": "send",
      "channel": "$ref:$.channels.balanceResult",
      "title": "잔액 조회 결과 발행",
      "summary": "잔액 조회 결과 발행",
      "x-parser-unique-object-id": "잔액 조회 결과 발행"
    },
    "토큰 설정 등록 요청 수신": {
      "action": "receive",
      "channel": "$ref:$.channels.configRegister",
      "title": "토큰 설정 등록 요청 수신",
      "summary": "토큰 설정 등록 요청 수신 (응답 없음)",
      "x-parser-unique-object-id": "토큰 설정 등록 요청 수신"
    },
    "입금 감지 이벤트 발행": {
      "action": "send",
      "channel": "$ref:$.channels.depositDetected",
      "title": "입금 감지 이벤트 발행",
      "summary": "입금 감지 이벤트 발행 (WebSocket → Kafka)",
      "x-parser-unique-object-id": "입금 감지 이벤트 발행"
    }
  },
  "components": {
    "schemas": {
      "트랜잭션 상태": "$ref:$.channels.accountDeployed.messages.AccountDeployResponse.payload.properties.status"
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
  