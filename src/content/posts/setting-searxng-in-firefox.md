---
title: 设置 SearXNG 为 Firefox 默认搜索引擎
published: 2025-03-07
description: 本文介绍了如何在火狐浏览器中设置 SearXNG 为默认搜索引擎。
category: 技术
tags:
  - SearXNG
  - Firefox
---

目前最新版 Firefox 已经不能添加自定义的搜索引擎，只能通过扩展包的方式实现。当然，模板已经有大佬写好了（[项目地址](https://github.com/ndsvw/SearXNG-WebExtensions)），这个模板可以为给定的地址生成扩展，安装生成的扩展后它会自动将默认搜索引擎设置为生成时指定的实例。

:::tip[为什么是模板的形式，而不是一个通用的、可以配置地址的扩展？]
Firefox 不允许添加动态的搜索引擎，它的地址必须在扩展打包时就已经确定下来。
:::

## 模板作者打包好的实例

模板作者已经为一些[常见的实例地址](https://github.com/ndsvw/SearXNG-WebExtensions#for-which-instances-do-extensions-exist)打包并发布了对应的扩展，如果你使用的实例地址在列表内，你可以点击给出的链接到官方商店直接安装。

## 生成自己的扩展

如果你使用的实例不在此列，或者你使用自己搭建的实例，那么你需要自己生成一个。同时，如果你不打算为生成的扩展签名，你可能需要更换浏览器版本。

### 自动生成

该方法需要一个 Linux 系统。理论上 MinGW 也能使用，但博主没有测试过。

克隆仓库：

```sh
git clone https://github.com/ndsvw/SearXNG-WebExtensions.git
cd SearXNG-WebExtensions
```

虽然这是一个 NodeJS 项目，但生成插件并不需要它，也不需要安装依赖。

为你的实例生成扩展，其中 `search.example.com` 替换成你自己的实例域名：

```sh
./create-extension.sh search.example.com
```

生成的扩展会存放在 `output` 目录内。

### 手动生成

将 `template` 目录复制一份，并使用任意文本编辑器将目录内所有文件中的所有 `{{INSTANCE.DOMAINNAME}}` 替换为你的实例域名。将目录内的文件全选，压缩为一个 zip 压缩文件。

:::warning
务必全选目录里的文件压缩，而不是压缩目录本身，否则你的扩展包内会多嵌套一层目录导致无法识别。
:::

## 签名和安装扩展

生成好扩展后，你可以在调试附加组件页面 `about:debugging#/runtime/this-firefox` 临时加载你的扩展来测试它是否正常。一般而言它可以正常工作。

此时你可以尝试在管理扩展页面点击右上方的齿轮，点击 “从文件安装附加组件” 然后选择你的扩展包。然而 Firefox 会提示扩展包已损坏，无法安装。这是因为 zip 格式的扩展包没有 Mozilla 的数字签名，因此浏览器会拒绝加载它。同时，`manifest.json` 中没有设置扩展 ID（而且因为没有签名，这个 ID 也不能从签名中获取），浏览器不能识别你的插件。

你可以选择给自己的扩展签名，或者使浏览器加载未签名的扩展包。参考[官方文档（英文）](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/)。

### 给扩展签名

签名有多种方法，一种是上传到 AMO 开发者中心（不一定要公开发布），另一种是使用 `web-ext sign` 命令，或者使用 AMO 签名 API。本文介绍第一种方法。

首先进入 [AMO 开发者中心](https://addons.mozilla.org/developers/)，点击右上角的 “发布或管理扩展”，登录 Mozilla 账户。如果你以前没有登录过开发者中心，会提示创建个人档案，按提示填写并保存。点击 “提交您的第一个附加组件”，或先点击上方 “我的附加组件” 再点击 “提交新附加组件”。同意协议后需要选择如何分发，如果你不希望别人使用你自己的实例，选择 “由您自己托管”。随后上传你的扩展包，并选择与 Firefox 兼容。最后，网页会询问是否提交源代码。因为我们的模板代码非常简单，没有使用混淆、压缩工具、前端模板引擎等开发工具，所以选择否并点击继续。

审核通过后，会以邮件的形式通知。你可以在扩展页面点击对应的版本并使用最上方 “文件” 部分的 xpi 链接安装你的扩展包。

### 加载未签名的扩展包

首先你必须在 `manifest.json` 中手动指定扩展 ID。解压缩你的扩展（如果需要），编辑 `manifest.json` 并添加一行：

```diff
  // ...

  "browser_specific_settings": {
    "gecko": {
+     "id": "addon@example.com",
      "strict_min_version": "79.0"
    }
  },

  // ...
```

其中 `addon` 和 `example.com` 都可以替换成自己喜欢的名字和域名。修改后将目录内的文件全选，压缩为一个 zip 压缩文件。

要加载非签名的扩展，还需要修改一项高级配置（[官方文档](https://support.mozilla.org/zh-CN/kb/add-ons-signing-firefox#w_ru-he-cai-neng-shi-yong-fei-qian-ming-de-fu-jia-zu-jian-gao-ji-yong-hu)）。进入 `about:config` 页面，搜索 `xpinstall.signatures.required` 并点击右侧按钮将其改为 `false`。注意该配置只会在[延长支持版（ESR）](https://www.mozilla.org/firefox/organizations/)、[开发者版](https://www.mozilla.org/firefox/developer/)和 [Nightly 版](https://nightly.mozilla.org/)或某些第三方预编译版本生效，如果你正在使用普通版，你必须更换你的浏览器。

最后，在插件页中安装你的 zip 扩展包即可。
