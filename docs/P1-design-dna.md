# P1｜Visual Master / Design DNA

## 真理来源

视觉以 **919 UI 第二版**为母版，并叠加 V3 的视觉减法：轻盈日常、明亮印象派浅池、只在关键状态出现一点魔法。禁止回到早期的深绿夜水方案。

## Token

- `Cloud Ivory #FAF7F1`：日常背景与主要留白。
- `Ink #263238`：正文与共同事实。
- `Soft Ink #707679`：解释和次要信息。
- `Tertiary #A4A3A0`：时间与极弱提示。
- `Divider Ink 12%`：全局细分隔线，不再由组件自行发明灰色。
- `Apricot #E99A7B`：人的动作与主 CTA。
- `Butter Star #F3D66B`：星星与极少数关键强调。
- `Monet Sky #BFD4E7`：时间水色和远处层次。
- `Pool Aqua #A8D8D4`：明亮浅池。
- `Rose Petal #E9BDC3`：池中的暖色花影，不作情侣主题。

暖色代表人和发生；水色代表时间和安静下来。

## 排版与结构

宋体只用于用户原话与极少数关键情绪句；页面标题、操作、正文、时间和状态全部使用现代系统黑体。等宽字体只属于手机外的原型工具栏。Relationship 是连续空间，以留白、字号差和统一细分隔线组织，不使用三个并列状态 Tab，也不采用 card-first design。

真实 UI 不出现 Alpha、阶段编号、测试视角、英文领域状态或 `RELATIONSHIP` 等展示标签。它们只允许存在于手机外的原型工具栏。

## Brand Star

所有 Outline / Butter / Water / Memory Star 必须来自同一颗略微不规则的手绘母星；不使用系统字符、Emoji 或标准五角星。Butter Star 保留轻微颜料叠色和不完全对称的边缘，Outline Star 沿用同一轮廓。

## Signature：M01 星星触水

Cloud Ivory 日常背景保持可见；浅水只占页面底部约 25–32%。Butter Star 从水面附近短距离、柔和下降，轻轻触水后只产生一圈 Ripple，然后出现“我们说好了”。星星不是坠入深处；不得使用黑绿、深海或夜水。

## Pool

池是空间隐喻，不是内容卡片列表。每颗星必须对应一条真实 `SUNK` Commitment；只有一条数据就只显示一颗，池为空时不放装饰星。选择真实星后才显示原话与“捞起来 / 再看看”。

Pool 不以整张插画直接充当背景，而由水底色、Monet Sky 反射、Rose Petal 花影、Butter 光斑、CSS 水纹和低透明绘画纹理分层组成。原始绘画只作为最弱的一层，不应呈现壁纸感。

## 魔法浓度

- Home：5%，右上绘画只作为边缘气氛。
- Say / Answer：0–5%。
- Relationship / Detail：5–10%。
- Pool：50–60%。
- M01 / M03 / Fulfilled：短暂 60–70%。
- Me / Settings：0%。

魔法必须稀缺。进入 Fulfilled 并出现真实生活照片后，优先级固定为：真实照片 > 原话 > 状态 > 印象派装饰。

## 动效与可达性

日常转场 180–320ms；M01/M02/M03 只承担状态反馈，不承担提交逻辑。支持 `prefers-reduced-motion`；控件有语义标签；不以颜色作为唯一状态信号。

## 禁止项

不使用深海夜水、黑绿森林系、心形、情侣粉紫、任务勾选、完成率、烟花庆祝、破碎失败动画、SaaS 卡片墙或通用 AI 渐变。
