---
title: 红米 Note 8 Pro 安装 KernelSU
published: 2023-12-28
description: 红米 Note 8 Pro 是非 GKI 设备，只能通过编译自定义内核的方式安装 KernelSU。本文介绍了编译及安装的具体步骤。
category: 技术
tags:
  - Android
---

:::warning[该方法已不可用]
KernelSU 已放弃对非 GKI 内核的支持，在这之后 Nova Kernels 也移除了其中的 KSU 部分，这篇文章失去了它原本的意义。同时由于博主不再使用红米 Note 8 Pro，无法提供更新，这篇文章仅作参考保留，不建议完全照做。

如果你真的很需要 Root，建议使用 [Kitsune Magisk](https://github.com/HuskyDG/magisk-files)，其隐藏力度足够日常大部分软件使用。博主已经测试过，APatch 无法修改红米 Note 8 Pro 的内核。
:::

:::tip
2024-2-27 更新：

如果你不想手动编译，你也可以加入 [Telegram 群组](https://telegram.me/NoVA_Kernels)直接获取发布版本。但官方发版比较慢，如果你很在意你的 KernelSU 是不是最新版，你仍然需要自行编译。
:::

红米 Note 8 Pro（Redmi Note 8 Pro）代号 begonia，于 2019 年 8 月发布，最高系统版本为 MIUI 12.5.6.0（Android 11），内核版本为 4.14。由于该机型没有使用 GKI 内核，因此要安装 KernelSU 必须构建自定义内核。

## 首要条件

1. 一台能正常使用的 Linux 机器（虚拟机、WSL 等也可以），应满足如下条件：
   1. 具有较好的网络或合适的代理服务器（至少预留 3 GB 流量）；
   2. 拥有 5 GB 空闲的存储空间。
2. 掌握基本的 Linux 操作和刷机操作；
3. 手机已经安装好 TWRP 或其他第三方 Recovery。

:::tip
不会在 Linux 上连接代理？可以参考 [Linux 代理服务器的使用](/posts/proxy-usage-on-linux/)
:::

:::tip
begonia 默认开启 AVB 机制，用于验证将要启动的系统是否经过修改，导致刷入 Recovery 或 Magisk 等之后，系统会无限重启。这并不代表设备变砖了，你只需要手动将其禁用即可。

可以通过 fastboot 刷入 `vbmeta.img` 的手段将其禁用。首先需要下载最近一次的更新包或完整卡刷包，解压并找到其中的 `vbmeta.img`。再将手机重启到 fastboot 模式，运行以下命令：

```sh
fastboot --disable-verity --disable-verification flash vbmeta vbmeta.img
```

:::

## 操作步骤

### 安装依赖包

编译过程需要一些软件包的支持。以 Ubuntu 为例，运行以下命令安装它们。

```sh
sudo apt install -y git-core gperf bc bison build-essential ccache curl flex g++-multilib gcc-multilib git gnupg gperf imagemagick lib32ncurses5-dev lib32readline-dev lib32z1-dev liblz4-tool libncurses5-dev libsdl1.2-dev libssl-dev libwxgtk3.0-gtk3-dev libxml2 libxml2-utils lzop pngcrush rsync schedtool squashfs-tools xsltproc libc6-dev-i386 x11proto-core-dev libx11-dev libgl1-mesa-dev zip unzip zlib1g-dev
```

### 获取内核源码

要编译内核首先要有源码。[KernelSU 官方文档](https://kernelsu.org/zh_CN/guide/unofficially-support-devices.html)上提供了一组适用于非 GKI 设备的内核，其中就有[适用于 begonia 的自定义内核](https://github.com/Nova-Kernels/kernel_xiaomi_mt6785)。

:::warning
官方文档页面仅方便查找设备对应源码，**这并不意味该源码被 KernelSU 开发者审查**，用户应自行承担使用风险。

如果你有能力，你应当在编译前检查源码中是否含有恶意代码。
:::

:::tip[关于 Nova Kernels]
<img alt="Nova" src="https://raw.githubusercontent.com/Nova-Kernels/.github/main/profile/resources/nova.png" width="325" />

Nova Kernels 是一个专注于平衡性能和续航时长的自定义内核。

目前支持：

<img width="32%" align="right" alt="Github" src="https://raw.githubusercontent.com/Nova-Kernels/.github/main/profile/resources/phone.png" />

```
Codename: begonia/begoniain
Device: Xiaomi Redmi Note 8 Pro
Released Date: 29th August 2019
```

```
Codename: marble
Device: Xiaomi Redmi Note 12 Turbo/Xiaomi Poco F5
Released Date: 28th March 2023/9th May 2023
```

```
Codename: pissaro
Device: Xiaomi Redmi Note 11 Pro/Xiaomi Redmi Note 11 Pro+/Xiaomi Redmi Note 11 Pro+ 5G/Xiaomi 11i 5G/Xiaomi 11i Hypercharge
Released Date: 26th January 2022/9th March 2022/6th January 2022
```

:::

首先将源码仓库克隆到准备好的 Linux 机器上：

```sh
git clone --depth=1 -b non-derp https://github.com/Nova-Kernels/kernel_xiaomi_mt6785.git
cd kernel_xiaomi_mt6785
```

由于 KernelSU 的部分是通过 Git submodule 的形式包含进仓库的，还需要额外初始化 submodule：

```sh
git submodule init
git submodule update
```

### 获取编译工具

这里博主采用了两种方法，请根据你的 Linux 发行版情况自行选择。

#### Neutron

这是 NoVA Kernel 官方发布新版本时使用的编译器，在使用时会有一点点性能提升。

编辑 `build.sh` 第 50 行：

```diff
- PATH=$PWD/toolchain/Azure/bin:$PATH
+ PATH=$PWD/toolchain/bin:$PATH
```

执行以下命令，获取编译所需的工具：

```sh
bash build.sh -t
```

#### Azure

由于 `libc6` 版本问题，Neutron 编译器在 Ubuntu LTS 等发行版不能正常工作，因此需要使用其他工具。

执行以下命令，获取编译所需的工具：

```sh
git clone --depth=1 https://gitlab.com/Panchajanya1999/azure-clang.git toolchain/Azure
```

### 编译内核

执行以下命令：

```sh
bash build.sh -b
```

执行完成后会在当前目录下生成名为 `NoVA-Begonia-4.14.<版本号>.zip` 的文件，这就是要用到的刷机包文件。

### 安装刷机包

使用 TWRP 或其他第三方 Recovery 安装编译出的刷机包。

如果你之前安装了 Magisk，它会与 KernelSU 共存。但如果你先安装 KernelSU 再卸载 Magisk，`boot` 分区会恢复到初始状态导致 KernelSU 也被一并卸载掉了。这时候你需要重新安装一遍刷机包。因此如果你计划用 KernelSU 替换 Magisk，请先卸载 Magisk 再刷 KernelSU。

等待刷入完成后，重启系统，打开 KernelSU 管理器，你应该看到“工作中”的字样。至此，整个安装过程就完成了，享受你的 KernelSU 之旅吧。
