# 下次一定

> 一个保存两个人之间那些“以后”的微信小程序。

「下次一定」不是任务管理器，也不催人完成计划。一个人说出一句以后；只有另一个人也说“算数”，它才成为两个人共同的 `Commitment`。时间可以让它浮起、沉进池里、真的发生，或安静地成为后来。

这是产品长期主仓库，不是一次性演示。当前版本为 **High-fi Prototype V3 · Alpha 04（Reality Flow）**：919 / V3 视觉对齐已经冻结，当前通过 H5 验证现实尝试与关系边界，领域模型与页面结构会继续演进到微信小程序。

## 当前可体验

Golden Path 已实现：

`我们 → 说一个下次 → 图片/时间/地点可选补充 → 发给微信朋友 → 算数吗 → M01 明亮浅水触水 → 我和 TA → Commitment Detail`

Pool Path 已实现：

`Commitment Detail → 模拟时间流逝 → M02 沉下去 → Relationship 连续页 → 看看池底 → 选择星星 → 捞起来 → M03 → Commitment Detail`

“捞起来”只改变 Visibility `SUNK → SURFACED`；“还想”只新增 `WANT_STILL` Signal。两者互不代替，也都不会自动进入“来真的”。

Reality Flow 已实现：

`Commitment Detail → 来真的 → REAL_PENDING → 双方同意 → REAL → 又没成 / 发起兑现 → FULFILLED_PENDING → 双方确认 → FULFILLED → 后来`

每次现实尝试使用独立 `RealityAttempt` 和追加式事件记录；“又没成”只结束当次尝试并回到 `SHARED`，不会覆盖过去，也不等于 `LET_GO`。

## 开始运行

需要 Node.js 20+。

```bash
npm install
npm run dev:h5
```

生产构建与类型检查：

```bash
npm run typecheck
npm run build:h5
```

完整本地校验和生产依赖审计：

```bash
npm run verify
npm run security:audit
```

微信小程序构建（接入真实 AppID 与平台能力后）：

```bash
npm run build:weapp
```

## 架构

```text
src/
├── domain/        # People → Relationship → Commitment 与三轴状态
├── pages/         # H5 / 小程序共享页面
├── platform/      # mock / WeChat 能力适配边界
└── app.*
docs/              # P0/P1 冻结共识与测试计划
```

前端：Taro 4 + React 18 + TypeScript。H5 的模拟分享只存在于 `platform` 层，后续真实微信分享不会改写领域对象或 Golden Path。

## 文档索引

- [P0 产品定义](docs/P0-product-definition.md)
- [产品宪法](docs/P0-product-constitution.md)
- [领域与三轴状态模型](docs/P1-domain-state-model.md)
- [关系边界](docs/P1-relationship-boundary.md)
- [Visual Master / Design DNA](docs/P1-design-dna.md)
- [Interaction Assembly](docs/P1-interaction-assembly.md)
- [User Test Plan](docs/P1-user-test-plan.md)
- [Security Baseline](docs/SECURITY.md)

## 版本路线

- `v0.1`：Golden Path / Say & 算数
- `v0.2`：池 + WANT_STILL
- `v0.3-alpha.1`：919 / V3 Visual & UX Alignment
- `v0.3-alpha.2`：Reality Flow（当前）
- `v0.4`：Later + Relationship Boundary
- `v0.5`：P1 User Test Revision
- `v1.0.0-p1`：P1 Freeze

## 状态

Alpha 代码使用本地模拟数据，不应被视为隐私、安全、服务端一致性或微信审核完成。后端状态最终是真相；任何 Magic 都只能在状态提交成功后播放。

开发服务器仅监听 `127.0.0.1`，不得通过改回 `0.0.0.0` 将其直接暴露到局域网或公网。当前上游依赖告警及处理策略见 [Security Baseline](docs/SECURITY.md)。
