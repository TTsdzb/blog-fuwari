---
title: 如何在 Linux 系统中使用代理服务器
published: 2022-03-29
description: 在国内安装软件时，可能有下载速度慢甚至根本无法连接服务器的情况。使用合适的代理服务器可以一定程度上缓解这个问题。
category: 技术
tags:
  - Linux
  - Git
  - Docker
---

在进行下面的步骤之前，首先需要搞清楚你的代理服务器 IP、端口、协议，以及用户名和密码（如果有的话）是什么。你可能通过一些手段和软件，最终获取到了一个 HTTP（或 Socks）代理。如果你还没有，那么请先不要阅读这篇文章，它将对你没有帮助。

## 普通程序

一般情况下，我们使用 `http_proxy`、`https_proxy`、`ftp_proxy` 这三个环境变量指定代理服务器：

```sh
export http_proxy="http://username:password@proxyServer:port"
export https_proxy="http://username:password@proxyServer:port"
export ftp_proxy="http://username:password@proxyServer:port"
```

其中，`http_proxy` 指定了 HTTP 协议要使用的代理，`https_proxy` 指定了 HTTP **和** HTTPS 协议使用的代理，`ftp_proxy` 指定了 FTP 协议使用的代理。

等号后面的字符串是代理服务器的 URL。使用环境变量时，只能通过 HTTP 协议代理。

- `username` 表示代理服务器的用户名
- `password` 表示密码

如果没有设置验证，以上两项可以去掉。

- `proxyServer` 表示主机名
- `port` 表示端口

这三个环境变量可以简化为 `all_proxy` 一个变量。它表示所有这三种协议使用同一个代理服务器。

```sh
export all_proxy="http://username:password@proxyServer:port"
```

简单的示例，假如你在本机（即回环接口的 `127.0.0.1`）上的 `7890` 端口有一个不带用户名和密码的 HTTP 代理，你希望所有程序的 HTTP(S) 请求都经过这个代理服务器：

```sh
export https_proxy="http://127.0.0.1:7890"
```

程序会读取相应的环境变量，并通过指定的代理服务器访问互联网。

## 不能使用环境变量的程序

有些程序不会读取这些环境变量，它们的代理需要在程序的配置中手动指定。这里有一些常用程序：

### Git

Git 的代理由它自己的设置决定。使用 `git config` 修改相应的设置项。

```sh
git config --global http.proxy "http://127.0.0.1:7890"
git config --global https.proxy "http://127.0.0.1:7890"
```

Git 也支持通过 Socks 协议代理。

```sh
git config --global http.proxy "socks5://127.0.0.1:7891"
git config --global https.proxy "socks5://127.0.0.1:7891"
```

`--global` 表示全局设置；HTTP 和 SOCKS5 选一种设置即可。
也可以单独为某个网站指定，在 `http` 和 `proxy` 中间加上网站域名即可：

```sh
git config --global "http.http://github.com.proxy" "http://127.0.0.1:7890"
git config --global "https.https://github.com.proxy" "http://127.0.0.1:7890"
```

若要使用 SSH 进行克隆、推送等操作，它的代理在 SSH 配置文件中，需编辑 `~/.ssh/config` 。
请参考 [SSH 配置文件](/SSH-Config#ProxyCommand)。

### Snap

#### 方法一：修改程序设置

Snap 的代理写在设置里面。

```sh
sudo snap set system proxy.http="http://127.0.0.1:8080"
sudo snap set system proxy.https="http://127.0.0.1:8080"
```

#### 方法二：通过 systemd 传入环境变量

考虑到 Snap 的 snapd 由 systemd 启动，也可以直接修改 service 文件，传入前面提到的环境变量（网上大部分是这种方法）：

```sh
sudo systemctl edit snapd.service
```

添加如下内容，将 `proxy` 和 `port` 替换为代理服务器和端口：

```ini
[Service]
Environment=all_proxy=http://proxy:port
```

随后重载 systemd 然后重启 snapd 即可。

```sh
sudo systemctl daemon-reload
sudo systemctl restart snapd
```

### Docker

与 Snap 同理，由 systemd 启动的 dockerd 执行实际的操作。

请参考上面 Snap 部分的方法二，修改 service 文件并重启 dockerd 服务即可。

```sh
sudo systemctl edit docker.service
```

:::tip
如果你的 Docker 是通过 Snap 安装的，那么它的服务名称为 `snap.docker.dockerd` ，而不是普通的 `docker` ！
:::

容器使用的代理写在 `~/.docker/config.json` 中，这里不讨论。

## 通用工具 ProxyChains

如果一个软件不读取环境变量，也没有提供代理相关的配置项，可以尝试使用 ProxyChains 转发软件的网络流量。ProxyChains 通过修改软件的动态链接库来接管程序的所有 TCP 连接和 DNS 请求。它可以快速解决一些程序不走代理的麻烦问题。

:::tip
ProxyChains 的工作原理更像是“破解”要执行的程序。因此它导致程序无法正常工作甚至崩溃是正常的。它对 UDP 协议和使用静态链接的程序无能为力，对脚本程序（例如 Bash 脚本）和需要生成大量进程的软件的支持也不好。

请在没有任何其他办法的情况下再使用它。
:::

### 安装

ProxyChains 一般不内置于各大发行版中，需要自行安装。一般常用的版本是 `proxychains-ng`（即 Next Generation）。使用对应的包管理器安装这个软件包即可，以 Arch Linux 为例：

```sh
pacman -Syu proxychains-ng
```

### 配置

默认配置文件位于 `/etc/proxychains.conf`。使用编辑器打开这个文件，里面有许多注释与默认配置。前面都不需要改动，只需要在文件的最后找到 `[ProxyList]`，并在下面添加上自己的代理服务器即可。协议、地址、端口之间使用空格分割，一行一个：

```ini
[ProxyList]
# add proxy here ...
# meanwile
# defaults set to "tor"
http 127.0.0.1 7890
socks5 127.0.0.1 7891
```

:::tip
如果此处有一些示例配置，记得把它们删除。在默认配置下，只要列表里有一个无法使用的代理服务器，ProxyChains 就不会工作。
:::

### 使用

像使用 `sudo` 一样在要执行的命令前加 `proxychains` 即可。例如，通过代理连接一个 Telnet 服务器：

```sh
proxychains telnet google.com 80
```
