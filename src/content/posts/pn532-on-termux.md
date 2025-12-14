---
title: 在 Termux 中使用 PN532
published: 2025-12-14
description: 介绍如何在 Termux 中使用 PN532 NFC 模块进行读写和破解 Mifare Classic 卡。
category: 技术
tags:
  - Termux
  - NFC
---

:::note[参考文献]
[安卓使用 PN532 读写 NFC](https://young-lord.github.io/posts/android-pn532-nfc)

原文使用了 [TermuxArch](https://github.com/TermuxArch/TermuxArch)，本文聚焦于纯 Termux 环境下的配置。
:::

## 连接

Termux 内的程序一般情况下是无法直接访问 USB 设备的，我们通过 [TCPUART](https://play.google.com/store/apps/details?id=com.hardcodedjoy.tcpuart) 工具进行桥接。如果你没有 Google Play，也可以从 [APKPure](https://apkpure.com/cn/tcpuart-transparent-bridge/com.hardcodedjoy.tcpuart) 或者 [APKCombo](https://apkcombo.com/zh/tcpuart-transparent-bridge/com.hardcodedjoy.tcpuart/) 下载。

### 编译 libnfc

libnfc 官方并不支持 TCPUART，因此我们需要自行编译。博主将 [mywalkb 很久之前所做的修改](https://github.com/mywalkb/libnfc) 合并到了官方仓库中，方便编译。代码可以在[这里](https://github.com/TTsdzb/libnfc-tcp)查看。

首先安装编译所需依赖：

```sh
pkg install autoconf automake binutils clang git libtool make
```

:::tip
博主并不是在新装环境下编译的，可能还需要其他依赖。如果有缺失，欢迎联系反馈。
:::

克隆仓库并编译安装：

```sh
git clone --depth=1 https://github.com/TTsdzb/libnfc-tcp.git
cd libnfc-tcp
autoreconf -vis
./configure --prefix=$PREFIX --with-drivers=pn532_uart
make -j$(nproc)
make install
```

如果后续你想要卸载 libnfc，可以在源码目录下执行：

```sh
make uninstall
```

### 连接设备

使用 OTG 连接你的设备，打开 TCPUART，点击上方的 “Connect” 连接设备端口。如果系统弹出授权请求，点击确定。随后在中间选择 “server” 工作模式并手动输入一个端口。为了避免权限问题，端口号最好不要太小，本文使用参考文献中的 10000 端口。设置好后点击 “Start” 启动服务，国产 OS 记得允许后台运行。

在 Termux 中指定设备：

```sh
export LIBNFC_DEVICE="pn532_uart:tcp_127.0.0.1_10000"
```

其中 `127.0.0.1` 为 TCPUART 服务端 IP，`10000` 为你在 TCPUART 中设置的端口号。

:::tip
理论上来说你可以使用类似的方法连接另一台设备上的 TCPUART 服务，例如在电脑上连接手机的 PN532。读者可自行尝试。
:::

随后就可以使用 libnfc 了，例如：

```console
$ nfc-scan-device
nfc-scan-device uses libnfc 1.8.0
1 NFC device(s) found:
error   libnfc.bus.uart Unable to apply new speed settings.
- user defined device:
    pn532_uart:tcp_127.0.0.1_10000
```

会有报错产生，可能是由于 TCPUART 的速率设置是在 APP 里完成的，无法动态调整，但不影响使用。使用一张 CUID 空卡进行测试：

```console
$ nfc-list
error   libnfc.bus.uart Unable to apply new speed settings.
NFC device: user defined device opened
1 ISO14443A passive target(s) found:
ISO/IEC 14443A (106 kbps) target:
    ATQA (SENS_RES): 00  04  
       UID (NFCID1): 54  45  14  cf  
      SAK (SEL_RES): 08  
```

## nfc-mfclassic

nfc-mfclassic 是 libnfc 自带的 Mifare Classic 读写工具，可以用来读写非加密卡或已知密钥卡。直接执行 `nfc-mfclassic` 而不加任何参数可显示帮助信息。这里举几个常用的例子。

读取一张非加密卡：

```console
$ nfc-mfclassic r a u dump.mfd
NFC reader: user defined device opened
Found MIFARE Classic card:
ISO/IEC 14443A (106 kbps) target:
    ATQA (SENS_RES): 00  04  
       UID (NFCID1): 54  45  14  cf  
      SAK (SEL_RES): 08  
RATS support: no
Guessing size: seems to be a 1024-byte card
Reading out 64 blocks |................................................................|
Done, 64 of 64 blocks read.
Writing data to file: dump.mfd ...Done.
```

已知密钥读取加密卡（即在后面加上存有密钥的 mfd 文件）：

```console
$ nfc-mfclassic r a u dump.mfd key.mfd 
NFC reader: user defined device opened
Found MIFARE Classic card:
ISO/IEC 14443A (106 kbps) target:
    ATQA (SENS_RES): 00  04  
       UID (NFCID1): 54  45  14  cf  
      SAK (SEL_RES): 08  
RATS support: no
Guessing size: seems to be a 1024-byte card
Reading out 64 blocks |................................................................|
Done, 64 of 64 blocks read.
Writing data to file: dump.mfd ...Done.
```

写 UID/CUID 卡。`W` 代表写入时连同 0 块一起写入，如果使用 `w` 则不会写入 0 块：

```console
$ nfc-mfclassic W a u dump.mfd
NFC reader: user defined device opened
Found MIFARE Classic card:
ISO/IEC 14443A (106 kbps) target:
    ATQA (SENS_RES): 00  04  
       UID (NFCID1): 54  45  14  cf  
      SAK (SEL_RES): 08  
RATS support: no
Guessing size: seems to be a 1024-byte card
Sent bits:     50  00  57  cd  
Sent bits:     40 (7 bits)
Warning: Unlock command [1/2]: failed / not acknowledged.
Trying to rewrite block 0 on a direct write tag.
Writing 64 blocks |................................................................|
Done, 64 of 64 blocks written.
```

CUID 不会响应 0 块的解锁命令，因此会有警告信息，但不影响写入。

## mfcuk

mfcuk 可用于爆破全加密卡的一个密钥。该软件在 [Termux User Repository (TUR)](https://github.com/termux-user-repository/tur) 中有打包，可以直接安装：

```sh
# 如果你还没有使用过，添加 TUR 源
pkg install tur-repo
# 安装 mfcuk
pkg install --no-install-recommends mfcuk
```

:::important
我们已经通过自行编译的方式安装了 libnfc，因此这里使用 `--no-install-recommends` 避免重新安装 libnfc 导致问题。
:::

如果安装较慢，请自行使用技术手段加速。既然你能访问 Github，想必有加速方法（笑）。

使用 mfcuk 爆破密钥：

```sh
mfcuk -C -R 0:A -s 250 -S 250
```

爆破出一个密钥即可使用后续方法继续破解。

## mfoc-hardnested

mfoc-hardnested 是 mfoc 的一个分支，支持破解半加密卡或使用已知密钥破解全加密卡的剩余密钥。该软件需要自行编译：

```sh
git clone --depth=1 https://github.com/nfc-tools/mfoc-hardnested
cd mfoc-hardnested
autoreconf -vis
./configure --prefix=$PREFIX
make -j$(nproc)
make install
```

破解半加密卡：

```sh
mfoc-hardnested -O dump.mfd
```

破解已知一个密钥的全加密卡：

```sh
mfoc-hardnested -k ffffeeeedddd -O dump.mfd
```

破解已知多个密钥的全加密卡：

```sh
mfoc-hardnested -f keys.txt -O dump.mfd
```

## crypto1_bs

crypto1_bs 可用于破解半加密卡或使用已知密钥破解全加密卡的剩余密钥，一次能破解单个块的一个密钥，需要自行编译。博主将需要的其他仓库作为子模块添加到了一个新的仓库中，代码可以在[这里](https://github.com/TTsdzb/crypto1_bs)查看。

```sh
git clone --depth=1 --recurse-submodules https://github.com/TTsdzb/crypto1_bs.git
cd crypto1_bs
make
```

首先需要收集 nounces：

```sh
./libnfc_crypto1_crack <已知密钥> <已知密钥块号> <A|B> <目标块号> <A|B>
```

收集到足够的 nounces 后，会提示 `press enter to start brute-force phase`。程序会在当前目录生成一个类似 `0x1111aaaa_003A.txt` 的文件，其中 `1111aaaa` 为卡片 UID，`003A` 为目标块号。你可以直接按回车开始爆破，但由于该步骤需要算力，在手机上可能较慢，建议将生成的文件传到电脑上进行爆破（在 Linux 上编译方法是相同的）：

```sh
./solve_bs 0x1111aaaa_003A.txt 0x1111aaaa
```

参考文献中介绍了使用 Proxmark3 软件破解，但博主并未在 Termux 中编译成功，如有需要可以自行尝试。
