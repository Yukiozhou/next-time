# P1｜Round 01 Readiness

日期：2026-09-28
版本：V3 Alpha 06 / Round 01 Candidate 2 / `0.5.0-alpha.1`

## 结论

Alpha 05 的“准备完成”结论范围过宽：当时 Home 未展示关系，无法观察收起前后的行为。Alpha 06 补齐关系延续和全局导航。当前具备单次 H5 会话内的用户测试条件；正式 Round 01 尚未执行，不代表用户理解度、真实微信通知、持久化或安全上线条件已经通过。

## Alpha 06 增量验收（2026-09-28）

- 最新 `npm run verify` 通过（TypeScript + H5 build）；仍有现有入口体积与水彩 Star 素材体积警告。本轮未升级依赖，安全审计沿用下方历史风险记录，不宣称已修复。
- 首次算数后，Home 出现 Jack；点击进入关系。
- 从关系内再次发起显示“说给 Jack 听 / 发给 Jack”；接受后两条原话同时保留。
- 第一条算啦、第二条兑现，两条记录在全局“后来”按结束时间倒序出现；详情返回原来的“后来”入口。
- 收起后 Home 与全局“后来”隐藏 Jack 的内容；“我 / 已收起的人”提供历史入口和恢复，恢复不改动拒收开关。
- 后续新提议被拒绝时，既有两条记录不丢失。
- 新增第三条后沉入池、选择、捞起，M03 返回该条详情。
- 通知与提醒显示尚未接入说明，不提供虚假开关；隐私设置进入已有关系边界。
- 原话上限统一为 60 字。
- 当前数据仅在页面会话内保留，刷新会重置；测试以 Yuki / Jack 单关系为范围。

本文件只记录实现与流程可用性，不代表用户理解度已经通过。`5/7` 等正式通过线必须来自真实参与者，不能用内部走查代替。

## Alpha 05 历史内部演练结果（2026-09-20）

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

Alpha 05 视觉冻结点保留。当前增量为 **Alpha 06 · Round 01 Candidate 2：Relationship Continuity**，仅补全关系延续；除非用户明确要求或测试暴露问题，不主动继续调整视觉。

## 正式 Round 01 待执行

按 [User Test Plan](P1-user-test-plan.md) 招募 5–7 人。主持人不得提前解释“算数”“池”“还想 / 来真的”或三种关系边界；每位参与者分别记录首次动作、错误、帮助次数、关键原话与隐私担忧。

正式测试完成前，以下判断保持开放：

- 用户是否自然理解“双方都确认才算数”。
- 用户是否把池误解为失败或删除。
- 用户是否首次就能区分“捞起来 / 还想 / 来真的”。
- 用户是否能区分“算啦 / 收起关系 / 不再接收新提议”。
- M01 是否帮助确认状态，而不是拖慢任务。
