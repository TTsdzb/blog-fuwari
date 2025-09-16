---
title: 西农信工网站在 Linux 下的布局修复
published: 2023-11-23
description: 本文介绍了西北农林科技大学信息工程学院官网在 Linux 下的布局问题产生原因，以及修复的方法。
category: 技术
tags:
  - 农专技术手册
  - Firefox
---

博主暑假新装了 Arch Linux，平时用的时候一切正常，结果上学院官网看通知的时候发现官网变成了这样：

![变乱的页面布局](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/nwafu-cie-website-layout/corrupted-layout.png)

整个网页顶部非常奇怪，所有能展开的地方全都平铺开来，而且点击按钮也收不回去。往下滚动是一个几乎占据了全屏的轮播图，而且下面所有的元素都跟屏幕一样宽。

:::tip[致急性子读者]
如果你想直接看怎么解决，请跳转到[解决方案](#解决方案)。

同时需要注意，这个方法**只能在 Firefox 浏览器中使用**。如果你坚持使用其他浏览器，那你现在可以关掉这篇文章了 (ー\_ー゛)
:::

经大佬提醒，发现网站自动跳转到了移动端页面：

```
https://cie.nwafu.edu.cn/index_mobile.htm
```

信工院的网站中桌面端 `index.htm` 和 `index_mobile.htm` 是分开的，加载了错误的页面，布局当然也就没法看了。当使用移动端查看这个页面时，布局是没有问题的：

![正常的移动端页面布局](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/nwafu-cie-website-layout/normal-mobile-layout.png)

## 排查原因

首先在地址栏中手动将 `index_mobile.htm` 改为 `index.htm` 访问，发现页面仍会自动跳回到 `index_mobile.htm`。因此，网站必然有某种自动跳转机制。

打开 DevTools 切到网络，勾选上保留日志，然后重复上述操作，找到 `index.htm` 对应的请求：

![桌面端网页的请求](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/nwafu-cie-website-layout/request-info.png)

可以看到服务器返回了 200 而并非 3xx 状态码，因此这种自动跳转并不是由服务端重定向实现的，考虑页面中可能有用于判断跳转的 JS 代码。鉴于直接访问会跳转来不及操作，这里使用 `view-source:` 查看 `index.htm` 的源码。可以看到，在文件的第八行 `<head>` 标签内就有这样的一段代码：

```html
<script type="text/javascript">
	var browser = {
		versions: (function () {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return {
				//移动终端浏览器版本信息
				trident: u.indexOf("Trident") > -1, //IE内核
				presto: u.indexOf("Presto") > -1, //opera内核
				webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
				gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/) || u.indexOf("iPad") > -1, //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
				iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf("iPad") > -1, //是否iPad
				webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
			};
		})(),
	};
	if (browser.versions.android || browser.versions.iPhone) {
		var url = document.location.href;
		var ext = url.substr(url.lastIndexOf("."), url.length);
		if (ext != null && (ext == ".htm" || ext == ".html")) {
			url = url.substr(0, url.lastIndexOf("."));
			url = url + "_mobile" + ext;
		} else {
			url = url + "index_mobile.htm";
		}
		document.location = url;
	}
</script>
```

很明显这就是判断移动端的代码了。这段代码读取浏览器的 UA 即 `navigator.userAgent`，对其进行一系列匹配得出各种结果，最后如果是安卓或 iPhone 设备就跳转到移动端页面。问题就出在这个安卓平台的判定条件上：

```js
u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
```

只要用户的 UA 字段里有 `Linux` 字样，就会被判断为安卓手机，从而跳转到移动端页面，造成了上述问题。不禁令人感叹，写这段代码的开发人员是不是对 Linux 系统有什么偏见？

## 失败尝试

由于这段 JS 代码检测浏览器的 UA 字段，最容易想到的方法就是修改 `navigator.userAgent`，使其不包含 `Linux` 子串。

博主想到的方法是写一个油猴脚本，通过设置 `@run-at document-start` 使其尽快加载，设置 `@sandbox raw` 使其作出的更改可以影响到页面。同时，还需要使用一些特殊手段来修改 UA：

```js
Object.defineProperty(window.navigator, "userAgent", {
	value:
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
	writable: false,
});
```

实验证明脚本确实可以加载并成功修改 UA，在控制台中查询 `navigator.userAgent` 的值可以得到我们自己设置的字符串。但最终结果是，页面仍然会进行跳转。博主猜测可能是由于用于跳转的代码几乎位于 DOM 的最顶端，脚本加载的速度赶不上 DOM 解析的速度所致。

因此，我们需要在 DOM 解析之前就修改好 UA，或是阻断这段代码的执行。禁用 Javascript 能解决这个问题，但并不是一种好的解决方案。

## 解决方案

[uBlock Origin](https://github.com/gorhill/uBlock)（一个广告拦截插件）提供了一种“[HTML 过滤器](https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#html-filters)”，可以在接收响应数据之后、浏览器解析之前移除页面中的特定元素。这个功能只能在版本大于 57 的 Firefox 浏览器上工作，但它能完全解决文章讨论的这个问题。

:::warning[注意区分 uBlock Origin 和 uBlock]
[uBlock Origin](https://github.com/gorhill/uBlock) 和 [uBlock](https://ublock.org/) 是不同的两个广告拦截插件，使用时请注意区分。

有关它们的区别和起源，可以参考[这个 Wikipedia 页面](https://en.wikipedia.org/wiki/UBlock_Origin)或[它的中文版本](https://zh.wikipedia.org/wiki/UBlock_Origin)。
:::

:::tip
你不一定要使用原版 uBO，凡是基于 uBO 1.15.0+ 的广告拦截插件都可以。博主使用的是 [AdNauseam](https://adnauseam.io/)。
:::

打开插件设置并转到“自定义静态规则”选项卡，添加如下内容：

```
# 西北农林科技大学信息工程学院页面修复
cie.nwafu.edu.cn##^head > script:has-text('if(browser.versions.android || browser.versions.iPhone)')
```

这段规则表示在 `cie.nwafu.edu.cn` 域名下，将 `<head>` 标签内所有包含 `if(browser.versions.android || browser.versions.iPhone)` 字符串的 `<script>` 标签全部移除。之后浏览器解析页面时，就不会执行这一段代码，从而避免跳转到移动端页面。
