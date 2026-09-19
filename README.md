# 下次一定

> 一个保存两个人之间那些“以后”的微信小程序。

「下次一定」不是任务管理器，也不催人完成计划。一个人说出一句以后；只有另一个人也说“算数”，它才成为两个人共同的 `Commitment`。时间可以让它浮起、沉进池里、真的发生，或安静地成为后来。

这是产品长期主仓库，不是一次性演示。当前版本为 **High-fi Prototype V3 · Alpha 01**：先通过 H5 验证体验，领域模型与页面结构会继续演进到微信小程序。

## 当前可体验

Golden Path 已实现：

`我们 → 说一个下次 → 可选补充 → 说给谁听 → 微信分享模拟 → 算数吗 → M01 星星触水 → 我和 TA → Commitment Detail`

后续状态已进入领域模型与页面信息架构：池、还想、来真的、兑现、算啦、后来。

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

## 版本路线

- `v0.1`：Golden Path / Say & 算数（当前）
- `v0.2`：池 + WANT_STILL
- `v0.3`：Reality Flow
- `v0.4`：Later + Relationship Boundary
- `v0.5`：P1 User Test Revision
- `v1.0.0-p1`：P1 Freeze

## 状态

Alpha 代码使用本地模拟数据，不应被视为隐私、安全、服务端一致性或微信审核完成。后端状态最终是真相；任何 Magic 都只能在状态提交成功后播放。
