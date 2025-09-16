---
title: SSH 的配置文件
published: 2022-04-22
description: SSH 的配置文件可以定义一些常用主机，以及它们的一些基本信息，从而简化连接时的操作。
category: 技术
tags:
  - Linux
  - SSH
---

SSH 配置文件分为系统和用户两种，系统的位于 `/etc/ssh/ssh_config` ，用户的位于 `~/.ssh/config` 。
配置文件可分为多个配置区段，每个配置区段使用一个 `Host` 来区分。我们可以在命令行中输入不同的 Host 来加载不同的配置段。

```ssh-config
Host pi4b
  HostName 192.168.31.5
  User pi

Host pi4b-remote
  HostName an.example.frp.server
  Port 12345
  User pi

Host pi0w
  HostName 192.168.31.6
  User pi

Host TencentYun
  HostName an.example.vps
  User ubuntu
```

以下是一些常用配置项。

## Host

`Host` 配置项标识了一个配置区段。它定义了一个主机配置，其余各项都是它的子项。
可以使用通配符：`*` 代表 0 ～ n 个非空白字符，`?` 代表一个非空白字符，`!` 表示例外通配。

## HostName

指定远程主机名，可以直接使用数字 IP 地址。
如果主机名中包含 `%h` ，则实际使用时会被命令行中的主机名替换。适合上述使用了通配符的情况。

## Port

指定远程主机端口号，默认为 `22` 。

## User

指定登录用户名。

上述三项的示例：

```ssh-config
Host pi4b
  HostName 192.168.31.5
  Port 2222
  User pi
```

连接时即可直接使用命令 `ssh pi4b` ，SSH 会在配置文件中找到这个 Host 并使用记录的信息建立连接，相当于 `ssh -p 2222 pi@192.168.31.5` 。

## IdentityFile

指定密钥认证使用的私钥文件路径。
私钥文件相当于你的身份证，服务器可以通过它来识别你的身份，可以做到免密登录，既方便又可以防范中间人攻击。
切记不要泄露你的私钥！
默认为 `~/.ssh/id_rsa` ，`~/.ssh/id_dsa` ，`~/.ssh/id_ecdsa` ，`~/.ssh/id_ed25519` 中的一个。
文件名称可以使用以下转义符：

- `%d` 本地用户目录
- `%u` 本地用户名称
- `%l` 本地主机名
- `%h` 远程主机名
- `%r` 远程用户名

## UserKnownHostsFile

指定一个或多个用户认证主机缓存文件，用来缓存通过认证的远程主机的密钥，多个文件用空格分隔。
这些缓存文件保存了服务器的特征信息，每次连接之前 SSH 都会将服务器信息与记录比较，如果不一致说明可能有人冒充服务器窃取密码（即刚刚提到的中间人攻击）。
默认缓存文件为： `~/.ssh/known_hosts` ，`~/.ssh/known_hosts2` 。

## GlobalKnownHostsFile

指定一个或多个全局认证主机缓存文件，用来缓存通过认证的远程主机的密钥，多个文件用空格分隔。
默认缓存文件为：`/etc/ssh/ssh_known_hosts` ，`/etc/ssh/ssh_known_hosts2` 。

## ProxyCommand

指定使用的代理命令。
设置后，SSH 连接就会经过对应的代理中继。
示例：

```ssh-config
Host github.com
  HostName github.com
  ProxyCommand nc -X 5 -x 127.0.0.1:10808 %h %p
```

其中 `-X` 代表协议， `5` 代表 socks5 ，也可设为 `4` 即 socks4 或 `connect` 即 HTTP 。`-x` 是代理实际地址和端口。
后面的 `%h` 、`%p` 意思是 Host 和 Port，必须得写上。

如果是 Windows：
系统自带的 SSH 客户端配置文件位于 `%USERPROFILE%\.ssh\config` 。
这里需要用到 Git for Windows ，`C:\Program Files\Git` 为其安装目录，需要视情况替换。

```ssh-config
Host github.com
  HostName github.com
  ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -S 127.0.0.1:10808 %h %p
```

`-S` 指 socks ，默认是 socks5 ，HTTP 就写 `-H` 。
