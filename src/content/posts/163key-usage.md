---
title: 网易云音乐 163key 的使用
published: 2022-05-16
description: 网易云音乐会在下载的歌曲文件中写入相关信息，掌握读取这些信息的方法可以为自动化操作带来便利，同时提高准确度。
category: 技术
tags:
  - 网易云
  - Python
---

网易云音乐客户端在下载歌曲时会向歌曲写入标签（元数据），其中在 Comment 字段中有一串字符串，开头是 `163 key(Don't modify):`。

以 RoughSketch - 666 为例：
![在属性窗口中的163key](https://closure-static.oss-cn-hongkong.aliyuncs.com/blog-assets/163key-usage/163key.png)

```
163 key(Don't modify):L64FU3W4YxX3ZFTmbZ+8/T2pe247TRKgRJL+sO6ZF+Zsdjuf2gdMH+AKchsDMApnzxU9HrjFayL9cOo+RaExJcM8X9Kv4coonZRypWZb0hCG6F7ZLDKVV3EtH1yIIjMlb9Q5KzLaVMBv3bHtH+epb6Gq8SHRgFivFGMz2mOStud/ngWVTxjr2TKC7Sanr7WW18YeHHC2z7dmVn/UUGSiQwUW83BDLZQfL0AXMpNVXSbHPCQx1kCy7M6nsCc3/J+BQNrrOgMbvnReWAfUnv2Agi3u64FmduXuDcHdoP0eEFBDJFJbc5Mm7zJZq5vBnFs5OmAMPZQSO8PBqvyaXeO6i4pjyM8VOmt+EQdwcFHcFYg+MNc1qij2PyrrUazcIHW1ijysHhnBTrx9t0Ml2j4KoRu6hXtDlzeig57gzp3g2Xlf2gpnK8EqNcxuA2BruMfJtl3uVFa46oIxURC5/UT4zTz57QgDmcNmGkZd5r2zl5Y=
```

若要跳过分析，请转到[实例](#实例)。

## 分析

去掉开头的 `163 key(Don't modify):` 以后，剩下的部分是 base64 编码。解码后得到一段二进制数据。
经查找得知这是用 aes-128-ecb 算法加密的密文，密钥是 `#14ljk_!\]&0U<'(`。
（参考地址：[163 key 使用指南](https://www.morfans.cn/archives/2793)）
解密后得到如下字符串：

```
music:{"musicId":1821507605,"musicName":"666","artist":[["RoughSketch",161837]],"albumId":0,"album":"","albumPicDocId":"109951165741459370","albumPic":"https://p4.music.126.net/icjUarfrUvQPfJZ9MX7GXA==/109951165741459370.jpg","bitrate":320000,"mp3DocId":"afff55760e0dd5d95e3caa00f8a397ff","duration":119823,"mvId":0,"alias":[],"transNames":[],"format":"mp3"}
```

可以很明显看出去掉头就是包含信息的 json 了。

```jsonc
{
	"musicId": 1821507605, // 音乐 ID
	"musicName": "666", // 歌曲的标题
	"artist": [
		// 歌曲的作者，每个都包含名字和 ID
		["RoughSketch", 161837]
	],
	"albumId": 0, // 歌曲所属的专辑的 ID，这首歌没有专辑
	"album": "", // 歌曲所属专辑的标题
	"albumPicDocId": "109951165741459370",
	"albumPic": "https://p4.music.126.net/icjUarfrUvQPfJZ9MX7GXA==/109951165741459370.jpg", // 歌曲的专辑封面（即歌曲的缩略图）
	"bitrate": 320000, // 歌曲的比特率（音质）
	"mp3DocId": "afff55760e0dd5d95e3caa00f8a397ff",
	"duration": 119823, // 歌曲时长
	"mvId": 0, // 歌曲对应的 MV 的 ID，这首歌没有
	"alias": [],
	"transNames": [],
	"format": "mp3" // 歌曲的格式
}
```

## 操作实现

这里使用 Python 演示，因为比较方便。

提取歌曲里的 Comment 字段可以使用库 `eyed3`（需要从 pip 安装），它可以增加、删除、修改 mp3 文件中 ID3 元数据（即歌曲信息）。这里我们只用它获取数据。

```py
import eyed3

# 读取歌曲文件的信息
song = eyed3.load('RoughSketch - 666.mp3')
# 获取 Comment 字段
comment = song.tag.comments[0].text
# 去掉前面 “...Don't modify” 部分
b64str = key[22:]
```

这样我们就得到了 base64 处理过的字符串。
Python 自带处理 base64 的库。使用该库获取加密后的二进制串：

```py
import base64

enc = base64.b64decode(b64str)
```

随后我们对数据进行解密，这里用到 `pycryptodome` 库（需要从 pip 安装）。

```py
from Crypto.Cipher import AES

aes = AES.new(b"#14ljk_!\\]&0U<'(", AES.MODE_ECB)
# 解密数据
dec = aes.decrypt(enc)
# 把解密后的二进制串转换为字符串
dec_str = dec.decode('utf-8')
```

实际操作时会得到这样一个字符串：

```py
'music:{"musicId":1821507605,"musicName":"666","artist":[["RoughSketch",161837]],"albumId":0,"album":"","albumPicDocId":"109951165741459370","albumPic":"https://p4.music.126.net/icjUarfrUvQPfJZ9MX7GXA==/109951165741459370.jpg","bitrate":320000,"mp3DocId":"afff55760e0dd5d95e3caa00f8a397ff","duration":119823,"mvId":0,"alias":[],"transNames":[],"format":"mp3"}\n\n\n\n\n\n\n\n\n\n'
```

需要注意最后的一堆换行符，它们也可能是莫名其妙的非空白字符（比如 `\x01`），导致 json 解析失败。应当额外处理，把 `}` 后的内容截断。
笔者技术力不佳，还不清楚这些字符出现的原因。

```py
# 把 dec_str 掐头去尾
json_str = dec_str[6:dec_str.rfind('}') + 1]
```

最后使用 Python 自带的 json 库解析字符串：

```py
import json

obj = json.loads(json_str)
```

这样我们就得到了一个包含 163key 中信息的字典。可以使用这个字典中的信息进行一些其他操作，例如获取歌词或下载专辑封面。

## 实例

将刚刚分析的内容综合起来：

```py
import eyed3
from base64 import b64decode
from Crypto.Cipher import AES
import json


def get_key_info(path: str):
    """
    从一个文件中读取 163key 并解密。
    :param path: 要读取的文件路径
    :return: 目标文件 163key 的内容。如果没有或者无法解析返回 None
    """
    song = eyed3.load(path)
    key = song.tag.comments[0].text
    if type(key) == str and key.startswith("163 key(Don't modify):"):
        b64str: str = key[22:]
        enc_str: bytes = b64decode(b64str)
        aes = AES.new(b"#14ljk_!\\]&0U<'(", AES.MODE_ECB)
        dec_str: str = aes.decrypt(enc_str).decode('utf-8')
        if dec_str.startswith("music:"):
            return json.loads(dec_str[6:dec_str.rfind('}') + 1])
        else:
            return None
    else:
        return None

```

使用函数 `get_key_info` 即可获得一个包含 163key 中信息的字典。
