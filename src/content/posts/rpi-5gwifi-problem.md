---
title: 树莓派 5Ghz WIFI 频繁断开连接
published: 2022-08-29
description: 树莓派 4 在使用 5Ghz WIFI 连接小米路由器时连接不稳定，非常影响使用。本文介绍了该问题的原因和解决方法。
category: 技术
tags:
  - Linux
  - 树莓派
  - C
---

> ~~参考文章：[树莓派 CM4 wifi 频繁断开连接](https://www.eggvs.com/article/7944.html)~~ 截至 2023.8.4 更新时该站已无法打开

## 问题描述

Pi4B 在使用内置 5GHz WIFI 网卡连接小米路由器时，网络会周期性断开连接，导致 SSH 经常卡顿掉线、文件传输容易失败等问题。

## 问题原因

如果路由器本身使能了 `ieee80211d=1`，那么 WIFI 模块的驱动会通过 Country IE 重新获取国家码，然后重设 WIFI 模块的国家码。这属于正常行为，但树莓派核心板上 WIFI 模块在国家码设置为 `CN` 时，不支持 80MHz 信道宽度和 36、40、44、48 等 5GHz 信道，所以会与 AP 断开连接。此时，因为 `wpa_supplicant` 的配置文件设置的国家码为 `US`，所以 WIFI 模块可以重新连接上 AP，但之后会重复上面断开连接的情况。

如果 WIFI 模块连接上 AP 以后工作在 40MHz 信道宽度，那么可以稳定工作在 40MHz 信道宽度，不会断开连接。而小米路由器默认频宽为 80MHz，即会出现上述情况。

这也可以解释设置国家码为 `CN` 时，无法搜索到小米 5GHz WIFI 的问题。

## 解决方案

### 方法一：修改路由器设置

将国家码设置为 `CN`，并将路由器设置为 40MHz 频宽。

该方法较为容易实现，但无法使用 80MHz 频宽和 36-48 信道。

### 方法二：修改内核模块

修改并重新编译内核模块，使国家码保持在 `US`。

该方法既能解决频繁掉线问题，也能使用 80MHz 频宽，但配置花费更多时间和精力。

:::warning
此修改强制让 WIFI 模块本身固定工作在 `US` 国家码下。即使系统层面通过 `iw reg set CN` 把国家码设为 `CN`，WIFI 驱动内部仍为 `US`，从而提高 WIFI 模块的兼容性。
**这将会导致系统里通过 `iw reg get` 得到的信息并不一定等于 WIFI 模块实际工作的信息。**
:::

:::tip
不同硬件在配置过程中需要的参数不同，请务必先阅读[官方文档](https://www.raspberrypi.com/documentation/computers/linux_kernel.html)。
以下过程以 Pi4B，arm64 为例。
:::

#### 获取源代码

获取当前内核版本：

```sh
uname -r
```

随后从官方的[源代码仓库](https://github.com/raspberrypi/linux)中克隆代码。需要根据内核版本选择合适的分支：

```sh
git clone --depth=1 --branch <分支名> https://github.com/raspberrypi/linux
```

`--depth=1` 表示限制 clone 的深度，不会下载 Git 协作的历史记录，这样可以大大加快克隆的速度。

#### 修改内核模块

修改 `drivers/net/wireless/broadcom/brcm80211/brcmfmac/cfg80211.c` 文件。

添加模块参数 `regulatory_domain_force_us`：

```c
static int regulatory_domain_force_us = 0;
module_param(regulatory_domain_force_us, int, S_IRUGO);
MODULE_PARM_DESC(regulatory_domain_force_us, "Force set regulatory domain to US.");
```

修改 `static void brcmf_cfg80211_reg_notifier(struct wiphy *wiphy, struct regulatory_request *req)` 函数：

```diff
static void brcmf_cfg80211_reg_notifier(struct wiphy *wiphy, struct regulatory_request *req)
{
 struct brcmf_cfg80211_info *cfg = wiphy_to_cfg(wiphy);
 struct brcmf_if *ifp = brcmf_get_ifp(cfg->pub, 0);
 struct brcmf_pub *drvr = cfg->pub;
 struct brcmf_fil_country_le ccreq;
 char *alpha2;
 s32 err;
 int i;
+char us_reg_code[3] = "US";

 err = brcmf_fil_iovar_data_get(ifp, "country", &ccreq, sizeof(ccreq));
 if (err) {
  bphy_err(drvr, "Country code iovar returned err = %d\n", err);
  return;
 }

 /* The country code gets set to "00" by default at boot - substitute
  * any saved ccode from the nvram file unless there is a valid code
  * already set.
  */
-alpha2 = req->alpha2;
+if (regulatory_domain_force_us)
+ alpha2 = us_reg_code;
+else
+ alpha2 = req->alpha2;

 if (alpha2[0] == '0' && alpha2[1] == '0') {
  extern char saved_ccode[2];

  if ((isupper(ccreq.country_abbrev[0]) &&
    isupper(ccreq.country_abbrev[1])) ||
   !saved_ccode[0])
   return;
  alpha2 = saved_ccode;
  pr_debug("brcmfmac: substituting saved ccode %c%c\n",
```

#### 编译内核

安装编译所需包：

```sh
sudo apt install git bc bison flex libssl-dev make
```

进行编译前的配置：

```sh
cd linux
KERNEL=kernel8
make bcm2711_defconfig
```

随后查看 `include/config/kernel.release` 中的内容。如果它与你的当前内核版本**完全相同**，那么你可以[只编译内核模块](#编译替换内核模块)然后直接替换。否则，你需要[编译安装整个内核](#编译整个内核)。

##### 编译替换内核模块

只编译内核模块，使用 4 个线程：

```sh
make -j4 modules
```

为了方便，这里采用直接替换文件的方式替换内核模块。

:::caution
修改系统前务必保证自己有办法恢复！
:::

需要用到的编译好的内核模块文件位于：

```sh
drivers/net/wireless/broadcom/brcm80211/brcmfmac/brcmfmac.ko
```

要替换的文件一般位于：

```sh
/usr/lib/modules/${您的内核版本}/kernel/drivers/net/wireless/broadcom/brcm80211/brcmfmac/brcmfmac.ko
```

`${您的内核版本}` 指代第一步时获取的内核版本。
如果找不到该文件，可以使用如下命令进行搜索：

```sh
sudo find / -name brcmfmac.ko
```

:::tip
如果要替换的位置没有 `brcmfmac.ko` 而是 `brcmfmac.ko.xz`，说明你的系统使用了内核模块压缩。你需要运行如下命令压缩 `.ko` 文件：

```sh
xz drivers/net/wireless/broadcom/brcm80211/brcmfmac/brcmfmac.ko
```

并在下面的命令中使用 `brcmfmac.ko.xz` 代替 `brcmfmac.ko`。
其他格式的压缩操作类似，不多赘述。
:::

备份原模块文件：

```sh
sudo mv /usr/lib/modules/${您的内核版本}/kernel/drivers/net/wireless/broadcom/brcm80211/brcmfmac/brcmfmac.ko /usr/lib/modules/${您的内核版本}/kernel/drivers/net/wireless/broadcom/brcm80211/brcmfmac/brcmfmac.ko.bak
```

复制新模块文件：

```sh
sudo cp drivers/net/wireless/broadcom/brcm80211/brcmfmac/brcmfmac.ko /usr/lib/modules/${您的内核版本}/kernel/drivers/net/wireless/broadcom/brcm80211/brcmfmac/brcmfmac.ko
```

##### 编译整个内核

编译内核，使用 4 个线程：

```sh
make -j4 zImage modules dtbs
```

这会比只编译内核模块花费更多的时间。

安装编译好的内核以及内核模块：

```sh
sudo make modules_install
sudo cp arch/arm/boot/dts/*.dtb /boot/
sudo cp arch/arm/boot/dts/overlays/*.dtb* /boot/overlays/
sudo cp arch/arm/boot/dts/overlays/README /boot/overlays/
sudo cp arch/arm/boot/zImage /boot/$KERNEL.img
```

#### 重新启动

添加 `/etc/modprobe.d/brcmfmac.conf` 文件，内容如下：

```
options brcmfmac regulatory_domain_force_us=1
```

在 WIFI 驱动 brcmfmac.ko 加载时即会传入模块参数 `regulatory_domain_force_us=1`，作用于修改过的代码并强制指定国家码为 `US`。

重新启动树莓派：

```sh
sudo shutdown -r now
```

可通过 `cat /sys/module/brcmfmac/parameters/regulatory_domain_force_us` 查看 `regulatory_domain_force_us` 字段的值。若有该值且为 `1`，则表示修改成功。
