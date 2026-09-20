# P1｜Round 01 Readiness

日期：2026-09-20  
版本：V3 Alpha 05 / `0.4.0-alpha.1`

## 结论

Round 01 的内部工程演练已完成，核心任务与反向分支均可在 H5 原型中走通，可以开始招募 5–7 位真实参与者。

本文件只记录实现与流程可用性，不代表用户理解度已经通过。`5/7` 等正式通过线必须来自真实参与者，不能用内部走查代替。

## 内部演练结果

| 路径 | 预期 | 结果 |
|---|---|---|
| Golden Path | 分享、算数、M01、Relationship、Detail 连通 | 通过 |
| M03 → Detail | 捞起只改变 Visibility，M03 后进入原话详情 | 通过 |
| 这次不算 | 不创建 Commitment / Relationship，不播放 M01 | 通过 |
| Pool | `SURFACED → SUNK → SURFACED`，不改变 Shared State | 通过 |
| 还想 | 只追加 `WANT_STILL`，不移动原话 | 通过 |
| 来真的同意 | `SHARED → REAL_PENDING → REAL` | 通过 |
| 来真的拒绝 | 本次 RealityAttempt 结束，回到 `SHARED` | 通过 |
| 又没成 | RealityAttempt 历史保留，回到 `SHARED` | 通过 |
| 兑现确认 | `REAL → FULFILLED_PENDING → FULFILLED → 后来` | 通过 |
| 兑现未确认 | 追加“还没有”事件，回到 `REAL` | 通过 |
| 算啦 | `LET_GO`，进入“后来”，不提供原地复活 | 通过 |
| 私人还想 | LET_GO 后追加 `WANT_STILL / SELF_ONLY`，不恢复共同状态 | 通过 |
| 收起关系 | 只修改 Yuki 的 Visibility，历史仍可访问 | 通过 |
| 拒收新提议 | 只修改 Yuki 的接收权限，与收起关系独立 | 通过 |

## 工程检查

- 2026-09-20 在最新视觉实现上重新执行 `npm run verify`：TypeScript 与 H5 production build 均通过。
- H5 完整手动走查：Golden Path → Pool → 捞起来 → 还想 → 来真的 → 又没成，以及独立终态分支“兑现 / 算啦”与 Relationship Boundary 均通过；未发现视觉层遮挡点击区或阻断状态转换。
- `npm run security:audit` 已执行，但未通过：当前 Taro / H5 构建依赖链报告 18 项（11 moderate、1 high、6 critical）。建议修复路径包含 Taro 相关破坏性版本变化，因此不在视觉冻结提交中自动执行 `npm audit fix --force`；作为升级工具链前必须单独处理并回归的工程风险记录。
- 当前仍有 Webpack entrypoint 约 299 KiB 的性能提示，不阻塞 Round 01。

## 冻结点

当前实现定义为 **V3 Alpha 05 · Round 01 Candidate**。除非 Round 01 用户测试暴露明确问题，否则不再主动调整视觉；新的视觉探索必须在独立方案中评审后再进入正式页面。

## 正式 Round 01 待执行

按 [User Test Plan](P1-user-test-plan.md) 招募 5–7 人。主持人不得提前解释“算数”“池”“还想 / 来真的”或三种关系边界；每位参与者分别记录首次动作、错误、帮助次数、关键原话与隐私担忧。

正式测试完成前，以下判断保持开放：

- 用户是否自然理解“双方都确认才算数”。
- 用户是否把池误解为失败或删除。
- 用户是否首次就能区分“捞起来 / 还想 / 来真的”。
- 用户是否能区分“算啦 / 收起关系 / 不再接收新提议”。
- M01 是否帮助确认状态，而不是拖慢任务。
