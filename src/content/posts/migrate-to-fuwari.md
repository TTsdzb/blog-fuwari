---
title: 迁移到 Fuwari
published: 2025-09-16
category: 站信息
---

今天花了一点时间将整个博客迁移到了 [Fuwari](https://github.com/saicaca/fuwari)。如果有老观众（大概没有那么老的观众吧 XD）应该知道，博客最早是用的 [Hexo](https://hexo.io/) 引擎，[明日方舟主题](https://github.com/Yue-plus/hexo-theme-arknights)。后来发现了 [Aurora](https://github.com/auroral-ui/hexo-theme-aurora) 这个主题，本身作为一个博客主题（而不是游戏周边类型的主题）有更清晰的界面，还提供了很多好用的功能，例如基本的警示块（Admonitions）。这也是博主目前用的时间最长的主题。最近看到了 [Fuwari](https://github.com/saicaca/fuwari) 这个博客模板，一直有种想换的感觉。

## 那为什么要换呢？

1. ~~看腻了换换口味~~
2. [Aurora](https://github.com/auroral-ui/hexo-theme-aurora) 由于作者工作繁忙，已经几乎不再更新了。[Hexo](https://hexo.io/) 目前版本为 7.3，但 [Aurora](https://github.com/auroral-ui/hexo-theme-aurora) 仍然停留在 6.3，其代码高亮在最新版会失效。

## 更换的过程

因为 [Hexo](https://hexo.io/) 和 [Fuwari](https://github.com/saicaca/fuwari) 都是基于 Markdown 的，因此主要内容并不需要太大改动。只需要把原有博文中的 Front-matter 替换为 [Fuwari](https://github.com/saicaca/fuwari) 的对应字段即可。博文的资源都是存在对象存储里以外链的形式插入的，因此没有重新组织图像资产的麻烦。

[Fuwari](https://github.com/saicaca/fuwari) 唯一缺的一点是没有自带的友链页面，博主自己模仿关于（About）页面搓了一个，然后又通过修改自带的 Github 仓库卡片的形式搓了一个友链卡片。调试这个花的时间其实和整理博文花的时间差不多。卡片的样式比较基础，可能不是特别美观，如果有好的建议，欢迎联系。

## 评论系统哪儿去了？

因为两年时间里也几乎完全没有人评论，所以干脆去掉了捏。要不然服务器上还要多开一个完全没人用的 [Waline](https://waline.js.org/)，未免有点太麻烦了。如果发现哪里写的不对或者有改进建议的话可以给我发邮件，相信聪明的小伙伴都不会找不到邮箱吧（）
