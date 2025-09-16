---
title: zsh 历史记录的配置详解
published: 2023-08-09
description: 在没有其他软件的情况下，zsh 的很多功能都需要手动配置。本文介绍了如何配置 zsh 以启用历史记录文件，并增强历史记录的使用体验。
category: 技术
tags:
  - Linux
  - zsh
---

## 前言

博主以前使用 [Zim](https://zimfw.sh)，一个类似于 [oh-my-zsh](https://ohmyz.sh/)，专门为 zsh 设计的 Shell 美化软件。正因为是专用的，zsh 的许多功能它都会很贴心地配置好，可以直接使用。

后来，为了使各平台不同种类的 Shell 样式统一，博主换用了 [Starship](https://starship.rs)。它能安装在各种操作系统、与各种不同的 Shell 整合，并且可以在它们之间使用同一套配置文件。这样博主只需要编写一次配置，就能在不同的设备上得到相同的体验，还可以利用一些文件同步软件同步设置。

这时候问题就来了，由于 [Starship](https://starship.rs) 的侧重点不在 zsh，它并没有考虑到 zsh 上特有的一些基本设置项。zsh 又不像 bash 那样有系统自带的 `.bashrc` 模板，因此很多我们习以为常的功能都需要手动配置后才能使用。

本文要讲的就是其中一个问题——不会保存历史记录。

## 基础配置

虽然像其他 Shell 一样有历史记录功能，但 zsh 的默认设置并不会将记录写入文件里。一旦退出并重新登录终端，之前的命令历史就丢失了，需要经常执行的命令每次都要重新输入。

zsh 需要一个 `$HISTFILE` 变量告诉它历史记录文件的路径，但这个变量默认为空。同时，`$SAVEHIST` 用于控制保存历史记录的条数。它的默认值为 0，这代表不保存历史记录。因此，你也要为它设定一个值。

也就是说，要把历史记录保存到文件，你的 `.zshrc` 中至少要有以下设定：

```sh
HISTFILE="$HOME/.zhistory"  # 历史记录位置
HISTSIZE=1000               # 单次会话的历史记录条数
SAVEHIST=$HISTSIZE          # 保存到文件中的历史记录条数
```

为什么还需要设置 `$HISTSIZE` 呢？这是因为 `$SAVEHIST` 的值必须小于 `$HISTSIZE`。而 `$HISTSIZE` 默认为 30，显然太少了。现在的硬件完全足够支持很大的值，为了方便我们使用，可以把它们改为至少 1000 来记录更多的命令历史。

`.zhistory` 是 [Zim](https://zimfw.sh) 或 [oh-my-zsh](https://ohmyz.sh/) 默认使用的历史记录文件。这可以让你继承以前的记录。设置了这三样东西后，zsh 就会像 bash 一样有自己的历史记录文件了。就算退出重新登录终端，也可以找到之前的命令。

## 进阶配置

如果要让历史记录更好用，还可以添加以下设定改变 zsh 的一些行为。

方便起见，你可以直接复制下面的代码块到你的 `.zshrc` 中。

### 写入策略

默认情况下，zsh 写入历史记录文件的时候会覆盖（重写）整个历史记录文件。但如果你同时开多个 Shell，这种方式可能会把历史文件弄乱。设置 `APPEND_HISTORY` 可以让它以“追加”的方式写入历史，避免出现问题。

```sh
setopt APPEND_HISTORY
```

zsh 只会在你退出（`exit` 或 `Ctrl+D`）时写入历史。如果你指定了 `INC_APPEND_HISTORY`，那么在 `APPEND_HISTORY` 的基础上，它还会在命令执行后立即追加到记录文件中。

```sh
setopt INC_APPEND_HISTORY
```

如果你设置了 `SHARE_HISTORY`，那么在 `INC_APPEND_HISTORY` 的基础上，zsh 还会在每次写入时检查一下记录文件有没有变化。这样如果你同时开了很多个 Shell，它们可以与记录文件保持同步，达到在不同进程中“共享”历史记录的效果。

```sh
setopt SHARE_HISTORY
```

### 扩展记录

`EXTENDED_HISTORY` 会让 zsh 记录下命令的开始时间和执行用时。可以使用 `history` 命令查询这些信息。

```sh
setopt EXTENDED_HISTORY
```

### 重复处理

我们经常会反复执行一些命令，此时这些相同的命令就会重复出现在历史记录里，占用空间。`HIST_IGNORE_DUPS` 可以让 zsh 比对上一条命令，如果重复了，就不记录历史。这可以将一大堆连续的重复命令缩减为一行。

```sh
setopt HIST_IGNORE_DUPS
```

但是如果重复的命令不相邻怎么办呢？`HIST_IGNORE_ALL_DUPS` 可以在写入历史的同时，移除所有之前的重复项，只保留这次的记录。

```sh
setopt HIST_IGNORE_ALL_DUPS
```

与之类似的是 `HIST_SAVE_NO_DUPS`。它不是移除之前的记录，而是不保存新的。

```sh
setopt HIST_SAVE_NO_DUPS
```

另一种方式是使用 `HIST_EXPIRE_DUPS_FIRST`。它平时不做任何处理，但历史记录满了以后，会优先删除重复的命令。

```sh
setopt HIST_EXPIRE_DUPS_FIRST
```

最后，`HIST_FIND_NO_DUPS` 保证你在搜索时不会出现重复的项，但不保证历史记录中没有重复的。

```sh
setopt HIST_FIND_NO_DUPS
```

### 去除多余空格

`HIST_REDUCE_BLANKS` 会在记录历史时去除命令里多余的空格。

```sh
setopt HIST_REDUCE_BLANKS
```

### 忽略策略

`HIST_IGNORE_SPACE` 使得所有以空格开头的命令都不被记录。当你要把密码或凭据作为命令行参数输入时非常有用。

```sh
setopt HIST_IGNORE_SPACE
```

`HIST_NO_STORE` 指定查询历史记录相关的命令（`history`，`fc`）不会被记录到历史中。

```sh
setopt HIST_NO_STORE
```

有时候我们需要在操作 Shell 时定义一些函数。它们一般很长，不适合记录，可以使用 `HIST_NO_FUNCTIONS` 忽略它们。

```sh
setopt HIST_NO_FUNCTIONS
```

### 关闭警告声

当你尝试在第一条向上或在最后一条向下滚动历史记录时，终端会发出警告声。设置 `NO_HIST_BEEP` 关闭这个功能。

```sh
setopt NO_HIST_BEEP
```

## 配置示例

最后，附上博主个人 `.zshrc` 中的历史记录配置。

```sh
# 历史记录设定
HISTFILE="$HOME/.zhistory"    # 历史记录位置
HISTSIZE=1000                 # 单次会话的历史记录条数
SAVEHIST=$HISTSIZE            # 保存到文件中的历史记录条数
setopt SHARE_HISTORY          # 在多个 Shell 间共享历史记录
setopt HIST_EXPIRE_DUPS_FIRST # 历史记录满时优先清除重复条目
setopt HIST_REDUCE_BLANKS     # 去除命令中多余的空格再记录
setopt HIST_IGNORE_SPACE      # 以空格开头的命令不计入历史
```
