# P1｜领域与三轴状态模型

## 对象链

```text
Person Yuki ─┐
             ├─ Relationship ─ Commitment ─ Signals / RealityAttempt
Person 阿琳 ─┘
```

Relationship 是稳定容器；同一句原话在结束后重新提出，必须创建新的 Commitment，不能复活旧对象。

## 轴一：Shared State

| 状态 | 含义 |
|---|---|
| `PENDING` | 单方创建，尚未送达/确认 |
| `SHARED` | 双方已说算数 |
| `REAL_PENDING` | 一方发起“来真的”，等待另一方 |
| `REAL` | 双方同意开始现实尝试 |
| `FULFILLED_PENDING` | 一方提出已经兑现，等待确认 |
| `FULFILLED` | 双方确认已经发生 |
| `LET_GO` | 任一方放下，共同未来结束 |
| `DECLINED` | 对方明确表示这次不算 |
| `WITHDRAWN` | 提议人在回应前收回 |

主要转换：

```text
PENDING ──accept──> SHARED ──propose real──> REAL_PENDING ──accept──> REAL
   │                   │                                            │
   ├─decline─> DECLINED├─let go──────────────────────────────> LET_GO
   └─withdraw> WITHDRAWN└─fulfil proposal────────> FULFILLED_PENDING ─accept─> FULFILLED
```

拒绝现实尝试只结束本次 `RealityAttempt`，Commitment 回到 `SHARED`；它不是 `LET_GO`。

## 轴二：Visibility State

- `SURFACED`：当前在 Relationship 的“还在”中可见。
- `SUNK`：时间或行为让它沉进“池”；共享状态不变。
- 已解决的 Shared State 不再使用 Visibility State，进入“后来”。

Visibility 是呈现轴，不得暗改 Shared State。

## 轴三：Signal

`WANT_STILL` 表示“我仍然想”。它不是状态转换，也不等于 `REAL_PENDING`。

- `SHARED`：对双方可见，可作为轻微信号。
- `SELF_ONLY`：只留给自己；常用于 `LET_GO` 后的私人余留。

## RealityAttempt

现实尝试必须是独立记录，至少包含发起人、双方响应、开始/结束时间和 `ACTIVE | FAILED | FULFILLED | ABANDONED`。多次“又没成”不能覆盖历史。

## 一致性规则

- 状态转换在服务端验证权限与当前版本，并保持幂等。
- 旧分享链接只展示已处理结果，不重新开放按钮。
- `PENDING` 失败不播放 M01；成功落库才进入 `SHARED`。
