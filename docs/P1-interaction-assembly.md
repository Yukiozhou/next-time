# P1｜Interaction Assembly

## Alpha 01 Golden Path

1. **我们**：空状态只露出一句解释、一颗淡星和“说一个下次”。
2. **说一个下次**：记录原话，42 字以内；不把它包装成任务。
3. **可选补充**：允许留下一点心情，可直接跳过。
4. **说给谁听**：选中 Relationship 中的另一个人。
5. **微信分享模拟**：`platform/mock` 返回送达结果；真实微信实现将替换 adapter。
6. **算数吗**：切换为接收者视角；解释双方确认的含义，并允许“这次不算”。
7. **M01 星星触水**：状态成功后播放，表达“落进两个人之间”。
8. **我和 TA**：新 Commitment 出现在“还在”，不直接揭示完整魔法世界。
9. **Commitment Detail**：原话、关系、时间线是主结构；后续进入还想/来真的。

## 扩展装配

```text
Relationship
├─ 还在：SURFACED
├─ 池：SUNK
└─ 后来：FULFILLED / LET_GO / DECLINED / WITHDRAWN

Commitment Detail
├─ 还想：Signal(WANT_STILL)
├─ 来真的：REAL_PENDING → REAL
├─ 兑现：FULFILLED_PENDING → FULFILLED
└─ 算啦：LET_GO
```

## 异常装配

- 分享失败：留在分享页，说明未送出，可重试。
- 接受失败：留在“算数吗”，不播放 M01。
- 旧卡片：展示“已经算数 / 这次没算数 / 已收回”，不重新操作。
- 并发变化：刷新为服务端状态，给出事实而非报错。
- 权限拒收：只说明没能送到，不提供绕过入口。

## 平台边界

页面只调用 `ShareAdapter`。H5 使用 mock；微信端负责登录、分享、AppID、订阅消息和后端会话。领域对象与状态转换不依赖平台 API。
