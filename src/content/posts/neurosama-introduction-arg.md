---
title: Evil ARG 探索
published: 2025-03-20
description: 对 B 站视频合集《二十一牛史》的 ARG 内容探索记录。
image: https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/neurosama-introduction-arg-cover.jpg
category: 游戏
tags:
  - NeuroSama
---

[二十一牛史](https://space.bilibili.com/2676763/lists/4760398)是 B 站 UP [喵里卡](https://space.bilibili.com/2676763)的一个合集，讲述了 Neuro Sama 圈子里的各个 VTuber 以及她们与 Neuro 的关系。

[第四集](https://www.bilibili.com/video/BV1iJQ7YyEcr) 15:32 文本提示此处有 ARG 线索，遂探索之。

:::tip
在各位的集体努力下 Evil Arg 已经完结啦！[喵里卡结算动态](https://www.bilibili.com/opus/1054891083741265925)
:::

## 阶段一

### [第二集](https://www.bilibili.com/video/BV1t9NgeLET9)结尾文字

第二集结尾最后一秒快速闪过大段乌克兰语（？）文本。

![第二集原视频截图](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/Pasted%20image%2020250320190819.png)

```
ЖСТСПСІЙ ПЗРЛ! В ЇГФХУВЕОГ ХЦХ kwwsv:
```

直接翻译并不能得到有意义的结果。

:::tip[可能用到的知识？]
乌克兰语字母表：А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я
:::

[@高压郭炖大葱\_BH 4 HZD](https://space.bilibili.com/514132068) 指出最后的 `kwwsv:` 使用凯撒密码（偏移量 3）解密得到 `https:`。可能为[第四集结尾启动动画](#第四集结尾启动动画)的链接相关提示。

### [第三集](https://www.bilibili.com/video/BV1sHPKeoEYR)结尾拨号音

第三集结尾包含 DTMF 拨号音。提取并剪辑音频片段：

[第三集结尾拨号音音频](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/dial.wav)

使用[这个工具](http://dialabc.com/sound/detect/index.html)分析音频片段，得到号码为 64265452-13133321。“-” 表示原视频中间出现的停顿。

![原分析结果](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/Pasted%20image%2020250320165412.png)

[@高压郭炖大葱\_BH 4 HZD](https://space.bilibili.com/514132068) 使用九键键盘，将前半部分作为按键、后半部分作为按键次数一一对应解出了 `miaolika`，即 UP 主名字的全拼。

### [第四集](https://www.bilibili.com/video/BV1iJQ7YyEcr)结尾启动动画

此处为发现 ARG 的位置，同时文本提示了这里存在线索。

![原视频截图](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/Pasted%20image%2020250320165623.png)

推测可能的线索为设备表中的十六进制 ID：

```
47 69 74 68 75 62 2E 69 6F
```

注意到设备表中的 Base 列全为 16，将空格去除使用 Base16 解码得到 `Github.io`。应指代某一 Github Pages 网站。

:::tip
这里直接对照 ASCII 码表查找也能得到相同结果，其原理和 Base16 解码过程相同。
:::

:::tip
根据 [@拉菲-Laffey](https://space.bilibili.com/455160473) 意外发现的[内容](https://www.bilibili.com/opus/1047113340321529880)，出题 UP [@喵里卡](https://space.bilibili.com/2676763)有一个同名 [Github 账号](https://github.com/Miaolika)。因此链接的实际格式不应为 `*.github.io`，而是 `miaolika.github.io/*`。

虽然这在我们解谜过程中起到了提示的作用，但这并不是原先的解题思路。
:::

### [第五集](https://www.bilibili.com/video/BV1XAXpY9EAZ)结尾

第五集结尾没有显著文本，但根据之前规律，制作人员表之后的小片段会放线索。根据 [@拉菲-Laffey](https://space.bilibili.com/455160473) 评论提示，音频可能为二进制信息。结合 [@LemonadeWind](https://space.bilibili.com/1205035486) 回复和音频响度图特征，感觉更有可能是摩尔斯电码。

![音频响度图](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/Pasted%20image%2020250322185314.png)

:::tip
响度图上的间隙实际上应该是视频剪辑时留下的空白。如果你的脑子够用，你也可以靠视频中的黑屏部分判断摩尔斯码的间隔。博主就还是看响度图了（逃
:::

抄录如下：

```
.- --.- . .-. .--- - . -... ..- .--- .- -....
```

解码为 `AQERJTEBUJA6`。

将以上几个线索得到的字符串 `https:`，`miaolika`，`Github.io`，`AQERJTEBUJA6` 结合起来，可得一个有效的链接：[https://miaolika.github.io/AQERJTEBUJA6/](https://miaolika.github.io/AQERJTEBUJA6/)。

### Github Pages

访问[第五集结尾](#第五集结尾)得到的链接，进入一个网页。网页标题为 “Evil ARG Final Answer”，其中仅有一个内容为 “恭喜你到达了这里! Congratulation! ” 的二级标题和一个多次在[第二集](https://www.bilibili.com/video/BV1t9NgeLET9)出现的 banny 的视频片段。

![网页内容截图](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/Pasted%20image%2020250322200101.png)

## 阶段二

出题 UP [@喵里卡](https://space.bilibili.com/2676763) 于 2025 年 03 月 25 日 12:18 发送了关于 Evil ARG 的[动态](https://www.bilibili.com/opus/1048134717934665767)，标志着这个活动真正的部分正式开始。

先前解出的 [Github Pages](https://miaolika.github.io/AQERJTEBUJA6/) 内容发生了变化，包含一个奇怪背景，以及有中英两种语言的视频。

:::warning
为了保证加载速度，本页面中的部分图片经过了压缩。如果你要对线索中的图片文件进行处理，请**从来源处保存图片！**

（群友 @ThTsOd 提醒）
:::

### 网页上的法阵

网页的背景有一个持续旋转的法阵图。

![法阵](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/evilSigil.jpg)

[图片源链接](https://miaolika.github.io/AQERJTEBUJA6/evilSigil.jpg)

#### 最外圈文字

群友 [@哈维的盒子](https://space.bilibili.com/2984376) 发现外圈莫名其妙的文字由里朝外看为 Avtre 字母表。

![Avtre 字母表](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/avtre-alphabet.jpg)

根据视频中歌曲（[In Hell We Live, Lament](https://music.163.com/#/song?id=1900488879)）的歌词“Counter-clock we rose, Counter-clock we reload”（逆时针的我们再次起立，逆时针的我们重新加载）提示使用逆时针读，该部分解为 `lasciate ogne speranza uoi ch entrate`。

> 视频中这两句歌词的翻译跟网易云不同，更偏向意译，没用“逆时针”这个词，很难不让人猜想是不是故意的（）明明[原切片](https://www.bilibili.com/video/BV18N411v7MC/)都用了“逆时针”的翻译

该线索最终在[视频 00:40 字符表](#视频-0040-字符表)中使用。

#### 内圈小文字

群友 @(⁠☞ ﾟ ⁠ ヮﾟ ⁠)⁠☞fengqi 对照解出第二圈小文字：

```
             e              g

     st                            h

          e                   i
                     d
```

[@拉菲-Laffey](https://space.bilibili.com/455160473) 提出顺时针看为 `steghide`，对应一个隐写工具 steghide，但该工具解谜需要一个密钥。

该线索最终在[视频 00:40 字符表](#视频-0040-字符表)中使用。

### 网页上的线索视频

点击网页上的 `中文` 或 `English` 按钮可以播放对应语言的线索视频。

[中文视频源链接](https://miaolika.github.io/AQERJTEBUJA6/ending720p.mp4)

[英文视频源链接](https://miaolika.github.io/AQERJTEBUJA6/ending_en.mp4)

#### 视频 01:59 摩尔斯码

视频 01:59 处出现了具有间隔和两种声音的不规则钟表声，推测为摩尔斯电码。以较低沉的声音为点，较清脆的声音为横，抄录如下：

```
-.... .---- ..--- ....- ..---
```

解码为 `61242`。如果反过来也能解，解码为 `16797`。

该线索最终与[视频 05:17 摩尔斯码](#视频-0517-摩尔斯码)结合使用。

#### 视频 05:17 摩尔斯码

视频 05:17 出现了与上述钟表声相同的声音，抄录如下：

```
...-- --... ..... ..... ..---
```

解码为 `37552`。反过来也能解，解码为 `82007`。

群友 [@哈维的盒子](https://space.bilibili.com/2984376) 发现两段摩尔斯码反向（以较清脆的声音为点，较低沉的声音为横）解码的结果 `1679782007` 作为时间戳解读为 `2023-03-25 22:06:47+0`，正好是 Evil 的生日。

该线索最终在[传送门的条件](#传送门的条件)中使用。

#### 视频 00:40 SSTV

视频 00:40 处出现了一段形似数据编码的音频，群友 @bro 不想上学了 提出该段音频为 SSTV 编码的图像。使用[这个工具](https://github.com/colaclanth/sstv)解密得到如下图像（编码 Martin 2）。

![SSTV 图像](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/sstv.png)

该线索最终在[视频 00:40 字符表](#视频-0040-字符表)中使用。

#### 视频 00:40 字符表

视频第 1218 与 3016 帧出现了两张相同的字符表。

![字符表](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/01218.jpg)

[@拉菲-Laffey](https://space.bilibili.com/455160473) 认为该图像需要配合[视频 00:40 SSTV](#视频-0040-sstv) 叠加进行解密，得到以下图片。

![叠加图片](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/stack.png)

连起来得到以下文本：

```
浣嗕竵绁炴洸鍦扮嫳绡囩？涓夌珷
```

将其使用 GBK 解码再使用 UTF-8 编码，得到 `但丁神曲地狱篇磿三章`。群友 [@哈维的盒子](https://space.bilibili.com/2984376) 发现[网页上的法阵](#网页上的法阵)外圈字符解为神曲地狱篇第三歌的第九行。

```
9 Lasciate ogne speranza, voi ch'intrate'.
```

> [@喵里卡](https://space.bilibili.com/2676763)：但丁神曲第三章是对的，但是如果你把乱码都翻译的话，会发现其实是发癫文。

群友 [@哈维的盒子](https://space.bilibili.com/2984376) 提出使用该句（`lasciate ogne speranza voi ch'entrate`）作为密钥解密[内圈小文字](#内圈小文字)提到的隐写，解得 `hidden1.txt`，内容为 `netlify.app`。后续应该需要找到该平台上托管的某个网页（`*.netlify.app`，子域名只允许字母、数字、短横线 `-`）。

#### 传送门的条件

视频中 Camila 提到传送门只会在 `时间`、`地点`、`法阵`、`灵魂` 都正确的时候才会出现。

> [@喵里卡](https://space.bilibili.com/2676763) 提示：时间时间，所以时间肯定是从时间来的

群友 @莫畅 认为时间即为[视频 05:17 摩尔斯码](#视频-0517-摩尔斯码)中解出的时间。

法阵可能为 `netlify.app`，见[最外圈文字](#最外圈文字)与[内圈小文字](#内圈小文字)。

> [@喵里卡](https://space.bilibili.com/2676763) 提示：小提示 netlify 也可以有 subfolder。顺序是固定的。

考虑排列顺序，以及灵魂有，URL 应为 `<时间地点组合>.netlify.app/<灵魂组合>`。子域名中唯一能用作分隔符的是 `-` 字符，应该用于分割时间和地点。即，时间和地点内部没有任何分隔符。结合[视频 05:17 摩尔斯码](#视频-0517-摩尔斯码)中解出的时间，域名部分应为 `20230325220647-<地点>.netlify.app`

该线索在[视频 1840 帧 Avtre 字母](#视频-1840-帧-Avtre-字母)有更多进展。

#### 灵魂的五个要素

视频中 Cerber 提到灵魂有以下五个要素：

1. 血肉初醒之日
2. 缄封真名之魔
3. 穿魂利器之锋
4. 虚拟所寄之人
5. 流传尘世之语

Cerber 还提到“没有爱就看不见”。

群友 [@哈维的盒子](https://space.bilibili.com/2984376) 发现英文版视频线索更多：

1. The date that flesh first awakens
2. The demon who seals the true name
3. The weapon that pierces the soul
4. The person who she virtually love（应理解为“虚拟所爱之人”？）
5. The words passed through the mortal world (ps. on b2)（“PS. 在 b2 中”值得推敲，指代 Bilibili）

> 喵里卡在群里说了“discord 那边喜欢叫 b2”，因此指代 Bilibili 应该是实锤的。

该线索在[视频中的心形标记](#视频中的心形标记)有更多进展。

## 阶段二：新提示

由于解谜一直没有进展，[@喵里卡](https://space.bilibili.com/2676763) 于 2025 年 04 月 12 日 12:49 发布了一个新的视频，同时 [Github Pages](https://miaolika.github.io/AQERJTEBUJA6/) 也有了对应更新。

### 法阵视频

新版网页在点击法阵 6 次后会出现一个新的视频。

[视频源链接](https://miaolika.github.io/AQERJTEBUJA6/elivcop.mp4)

#### 视频 1840 帧 Avtre 字母

群友 @我不吃 🍋 发现视频第 1840 帧右上角有三个 Avtre 字母。

![新视频第 1840 帧](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/elivcop-01840.jpg)

参考[最外圈文字](#最外圈文字)解法解得 `gps`。群友 [@哈维的盒子](https://space.bilibili.com/2984376) 认为应该指背景这个奇观的位置，并找到了[该景观](https://zh.wikipedia.org/wiki/%E5%9C%B0%E7%8B%B1%E4%B9%8B%E9%97%A8)。

![地狱之门](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/%E5%9C%B0%E7%8B%B1%E4%B9%8B%E9%97%A8.png)

> [@喵里卡](https://space.bilibili.com/2676763) 提示：还有就是…中英文 Wiki 有不一样的地方

[英文 Wiki 页面](https://en.wikipedia.org/wiki/Darvaza_gas_crater)坐标转换为 Decimal 格式得到 `40.2525, 58.4396`。

> [@喵里卡](https://space.bilibili.com/2676763)：402525n584396e
>
> 这不是现实中任何一种标准格式，但由于子域名取名的限制（不能使用点 `.`、逗号 `,`、加号 `+` 以及度分秒等符号）只能这样取了。

群友 [@哈维的盒子](https://space.bilibili.com/2984376) 成功拼出域名 `20230325220647-402525n584396e.netlify.app`，进入后为一个标题包含“灵魂探索”的自定义的 404 页面。

![404 页面](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/netlify-404.jpg)

之后应在 URL 的路径部分添加灵魂要素内容，见[视频中的心形标记](#视频中的心形标记)。

#### 视频中的心形标记

群友 @catfish 和 @我不吃 🍋 发现视频第 1035、1822、1888、1983 (2133)、2150 帧分别有 1~5 个心形标记。

![新视频第 1035 帧](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/elivcop-01035.jpg)
![新视频第 1822 帧](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/elivcop-01822.jpg)
![新视频第 1888 帧](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/elivcop-01888.jpg)
![新视频第 1983 帧](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/elivcop-01983.jpg)
![新视频第 2133 帧](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/elivcop-02133.jpg)
![新视频第 2150 帧](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/neurosama-introduction-arg/elivcop-02150.jpg)

推测与[灵魂的五个要素](#灵魂的五个要素)有关，可以确定：

1. 血肉初醒之日：生日，`0325`
2. 缄封真名之魔：Abber，`abberdemon`
3. 穿魂利器之锋：鱼叉，`harpoon`
4. 虚拟所寄之人：Melba（蜂群自制的 AI），`melbatoast`
5. 流传尘世之语：不紧不慢不快不慢，`bujinbumanbukuaibuman`

> [@喵里卡](https://space.bilibili.com/2676763) 提示：世界上还有拼音不是吗

群友 [@哈维的盒子](https://space.bilibili.com/2984376) 发现对应部分正确会出现上述视频的对应帧附近内容，例如 `https://20230325220647-402525n584396e.netlify.app/0325` 即为 1035 帧所在片段的图片。最终成功找到了正确的 URL：`https://20230325220647-402525n584396e.netlify.app/0325/abberdemon/harpoon/melbatoast/bujinbumanbukuaibuman/`。

由此，经历了半个月~~的卡关~~过后，Evil Arg 堂堂完结！可喜可贺可喜可贺（

## 结局

点击网页上的 `中文` 或 `English` 按钮可以播放对应语言的 Evil 生贺视频！

[中文视频源链接](https://20230325220647-402525n584396e.netlify.app/0325/abberdemon/harpoon/melbatoast/bujinbumanbukuaibuman/evilbirthday.mp4)

[英文视频源链接](https://20230325220647-402525n584396e.netlify.app/0325/abberdemon/harpoon/melbatoast/bujinbumanbukuaibuman/evilbirthday_en.mp4)

## 致谢

解谜过程中许多网友积极提供了自己的思路，尽管最终证实并不正确，但仍然在此表示感谢（排名不分先后）：

- [@LemonadeWind](https://space.bilibili.com/1205035486)
- [@\_真焕琴\_](https://space.bilibili.com/484703647)
- 群友 @XY
- 群友 @易燃易爆危险品
- 群友 @淡柏名林
- 群友 @一盒水晶 kit
- 群友 @Aoi-Cyan
- 群友 @心碎战士
