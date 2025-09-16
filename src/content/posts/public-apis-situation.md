---
title: 开源项目被商业公司夺舍，Public APIs 将何去何从？
published: 2023-01-08
description: Public APIs 是一个收集免费公共 API 的 Github 项目。然而，自从 APILayer 公司接管项目后，他们尝试将其付费 API 添加到列表顶端，甚至剥夺社区维护者们的权限。本文基本概括了事件始末。
---

:::tip[TIP：是正确的吗？]
作者鼓励您亲自探索事情的始末，有您自己的思考，而不是只看文章的某一部分。

如果您能看懂英文，请务必阅读以下链接：

- 维护者 [@yannbertrand](https://github.com/yannbertrand) 的[博文](https://dev.to/yannbertrand/public-apis-situation-4101)
- 维护者 [@matheusfelipeog](https://github.com/matheusfelipeog) 的 [Issue](https://github.com/public-apis/public-apis/issues/3104)

同时如果您认为本文描述的部分事实有误，还请联系作者。
:::

## 事件始末

[Public APIs](https://github.com/public-apis/public-apis) 是一个收集了各种各样免费、公共 API 的 Github 项目。它收集了来自全球各类的 API 接口，而且非常全面，几乎所有你感兴趣的内容都可以在这里找到对应的 API。截至撰稿时，该项目原仓库已有 22.3 万 star，在网络上也可以看到不少人推荐这个项目。

这个项目在 2015 年由 Todd Motto 建立。2016 年，Todd 邀请了更多维护者帮助维护这个项目。他新建立了一个组织，并把仓库迁移到了这个组织中。几年时间里，这个仓库的 Star 数追上甚至赶超了 Vue（截至撰稿时 20.2 万）和 React（截至撰稿时 20.0 万）。

![原仓库的 Star 统计图片](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/public-apis-situation/star-history.png)
原仓库的 Star 统计，使用 [Star History](https://star-history.com)

在这段时间，维护者们在项目里并没有很高的权限。他们不能添加其他的维护者，更改简介、标签以及其他的设置项。他们也没有仓库所在组织的权限，这给他们改善这个项目带来了很大麻烦。随后，他们发现 Todd 不再是组织的所有者了。现在的所有者是 [APILayer](https://apilayer.com/)，一家提供付费 API 的公司。社区维护者们尝试联系 APILayer 但一直得不到回复，直到 2021 年 3 月他们才添加了一些其他的维护者。这时，所有的社区维护者们仍然没有必要的项目权限。

在 2021 年 5 月，来自 APILayer 的管理员**在项目简介中添加了他们自己公司的链接**。**他们还多次尝试将自己的*付费* API 添加到列表顶端**，这不光污染了只收集免费 API 的项目，还打破了原列表的字母序，使得项目无法通过测试。社区维护者 Yann（[@yannbertrand](https://github.com/yannbertrand)）恢复了这些更改，并联系 APILayer 让他们提供这么做的理由。但随后，APILayer 就没再给过社区维护者们任何答复。

![被更改过的项目简介图](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/public-apis-situation/apilayer-description.png)
被更改过的项目简介，图源 [@yannbertrand](https://github.com/yannbertrand) 的[博文](https://dev.to/yannbertrand/public-apis-situation-4101)

2022 年 3 月 11 日，APILayer 干出了更出格的事情。他们**在 README 中移除了一个支持者，并把他们自己的 Logo 和链接放在了那里**。但是，从成为拥有者以来，APILayer 完全没有为项目做出任何贡献。且不说项目新增的 API 都经由 Pull requests 而来，整个项目所有的维护工作包括处理 issue、合并 PR 都是由社区维护者完成的。在此期间，APILayer 也没有从经济上支持项目。这种不尊重大家工作的行为当然不被认可，Yann 同样恢复了这些更改。

隔天，2022 年 3 月 12 日，APILayer 终于不装了。他们移除了所有社区维护者的权限，使得他们不能再对仓库进行任何更改。16 日，他们**移除了 README 中的维护者名单，并再次添加了他们的付费 API**。

截至目前，对于原仓库的一系列问题，仍然没有更进一步的消息。维护者之一 Marcel（[@matheusfelipeog](https://github.com/matheusfelipeog)）开设了一个[新的仓库](https://github.com/public-apis-dev/public-apis)。

## 他们为什么要这样做？

关于 APILayer 这样做能得到什么好处，[@admariner](https://github.com/admariner) 在 [@matheusfelipeog](https://github.com/matheusfelipeog) 的 [Issue](https://github.com/public-apis/public-apis/issues/3104) 中给出了[很好的解释](https://github.com/public-apis/public-apis/issues/3104#issuecomment-1338874108)。

虽然这个项目只是一个“简单的文本文件”，但是它有 22 万 star。这意味着，每天有无数人浏览这个仓库的页面。这个页面有无数的流量。

根据 Ahrefs 的估计，这些流量的价值约为每月 3 万美元。

![流量估价图片](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/public-apis-situation/market-value.png)
流量估价，图源 [@admariner](https://github.com/admariner) 的[评论](https://github.com/public-apis/public-apis/issues/3104#issuecomment-1338874108)

如果一个销售 API 服务的公司，比如 APILayer，想要达到同样的效果，他们需要**每月**花费 3 万美元。而且，他们最终得到的流量可能有一部分是刷出来的。

《资本论》的脚注中有段话：

> 一旦有适当的利润，资本就胆大起来。如果有 10％ 的利润，它就保证到处被使用；有 20％ 的利润，它就活跃起来；有 50％ 的利润，它就铤而走险；为了 100％ 的利润，它就敢践踏一切人间法律；有 300％ 的利润，它就敢犯任何罪行，甚至冒绞首的危险。

更何况，APILayer 不需要做任何事情，只需等社区的大家做出贡献，最后将贡献者的心血全部收入自己囊中。最终，得到了花上许多钱还不一定能得到的东西，但却不用冒被吊死的风险。

但是，明眼人一看就能明白，这是明摆着的盗窃行为。

## 我们应该怎么做？

对于这件事情应当如何处理，以下为作者的看法。

1. 暂时放弃原仓库
   目前看来，社区仍然没有恢复[原仓库](https://github.com/public-apis/public-apis)的控制权。请不要再在原仓库进行任何活动，包括点 Star，发布 Issue 或 Pull request，也不要相信原仓库的任何信息。请使用原维护者 Marcel（[@matheusfelipeog](https://github.com/matheusfelipeog)）开设的[新仓库](https://github.com/public-apis-dev/public-apis)。如果你之前点过 Star，尽量取消并点在新仓库。同时，也不要向任何人推荐原仓库。
2. 抵制 APILayer
   不要使用 APILayer 提供的任何产品。一是，商业公司为了利益从社区吸血本就是很龌龊的行为；二是，从安全的角度考虑，能做出这种事，他们的道德可能也很值得怀疑。
