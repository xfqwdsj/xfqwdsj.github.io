---
title: 利用 Caddy 部署使用 Websocket 的 V2Ray Vmess 服务端，并搭建一个文件服务器
date: 2022-01-27 19:09:45
tags:
  - techonology
  - caddy
  - v2ray
  - server
  - proxy
  - gfw
---

> 灵感源自<https://blog.kallydev.com/docs/technical-notes/server/deploy-v2ray-with-docker/>，有修改。

## 部署说明

{% message info info-circle %}
仅用于参考，并非硬性要求，需按照实际情况自行更改。
{% endmessage %}

- 服务器为腾讯云轻量应用服务器（海外地区）；
- 服务器操作系统为 Ubuntu 20.04 LTS；
- 在海外服务商购买的域名（例如 GoDaddy、Google Domain）。

## 部署步骤

### 准备工作

#### 创建用户

{% message info info-circle %}
除特别说明，否则文章中所有带 `[ ]` 号的文本均需连 `[ ]` 号依据其中提示替换
{% endmessage %}

```bash
sudo useradd -s /bin/bash -m [用户名]
sudo passwd [用户名]
```

#### 配置新用户

```bash
sudo visudo
```

在文件末尾找到以下内容：

```
#includedir /etc/sudoers.d
lighthouse ALL=(ALL) NOPASSWD: ALL
ubuntu  ALL=(ALL:ALL) NOPASSWD: ALL
```

修改为：
```
#includedir /etc/sudoers.d
[用户名] ALL=(ALL) NOPASSWD: ALL
```

#### 登录到新用户

按 Ctrl + D 退出登录后重新登录至新用户。参考方法（Windows、Linux、MacOS终端均可，Android需要一个终端模拟器）：

```bash
ssh [用户名]@[服务器IP]
```

#### 删除默认用户

```bash
sudo userdel -r ubuntu
sudo userdel -r lighthouse
```

#### 卸载监控组件（可选）<sup>[[文档]](https://cloud.tencent.com/document/product/248/53584#.E5.8D.B8.E8.BD.BD.E7.9B.91.E6.8E.A7.E7.BB.84.E4.BB.B6)</sup>

{% message warning exclamation-circle %}
本操作 **非必要** 执行，但 **建议** 执行。
{% endmessage %}

##### 卸载 `BaradAgent`
登录云服务器后，执行以下命令，进入 `BaradAgent` 安装目录。
```bash
cd /usr/local/qcloud/monitor/barad/admin
```
执行以下命令，卸载 `BaradAgent`。该命令不显示结果，如果不存在 `/usr/local/qcloud/monitor/barad` 文件夹，则说明卸载成功。
```bash
./uninstall.sh
```
{% message info info-circle %}
`BaradAgent` 上报云服务器部分指标数据，卸载 `BaradAgent` 后会停止数据上报。`Sgagent` 基本占用极少的内存，您也可以参考下列步骤卸载 `Sgagent` 。
{% endmessage %}

##### 卸载 `Sgagent`
执行以下命令，进入 `Sgagent` 安装目录。
```bash
cd /usr/local/qcloud/stargate/admin
```
执行以下命令，卸载 `Sgagent`。该命令不显示结果，您可以执行 `crontab -l |grep stargate` 命令查看是否有计划任务，若无计划任务，则说明卸载成功。
```bash
./uninstall.sh
```

#### 更新并升级所有软件包

```bash
sudo apt update
sudo apt upgrade -y
```

由于软件包比较多，需等待一段时间，并关注屏幕上的选项。

### 开始部署

#### 安装

##### 安装 `Caddy` <sup>[[文档]](https://caddyserver.com/docs/install#debian-ubuntu-raspbian)</sup>

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /etc/apt/trusted.gpg.d/caddy-stable.asc
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

##### 安装 `V2Ray`

```bash
sudo bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
```

#### 配置

##### 配置 `V2Ray`

```bash
sudo nano /usr/local/etc/v2ray/config.json
```

替换为以下内容（参考<https://www.v2ray.com/chapter_02/protocols/vmess.html>，UUID在线生成：<https://1024tools.com/uuid>）：

```json
{
  "inbound": {
    "port": [任意 0-65535 的端口，推荐避开 80 与 443],
    "listen": "127.0.0.1",
    "protocol": "vmess",
    "settings": {
      "clients": [{
        "id": "[任意 UUID]",
         "alterId": [任意 0-65536 的数字]
      }]
    },
    "streamSettings": {
      "network": "ws",
      "wsSettings": {
        "path": "[任意用于 WebSocket 的路径，如：/v2ray]"
      }
    }
  },
  "outbound": {
    "protocol": "freedom",
    "settings": {}
  }
}
```

按 <kbd>Ctrl</kbd> + <kbd>X</kbd> 退出，按 <kbd>Y</kbd> 保存，按 <kbd>Enter</kbd> 确认。

##### 配置 `Caddy`

```bash
sudo nano /etc/caddy/Caddyfile
```

替换为以下内容：

```
[域名] {
  tls [任意电子邮箱地址]
  reverse_proxy [WebSocket 路径] localhost:[端口] {
    header_up -Origin
  }
}
```

#### 绑定域名

##### 更换域名服务器（可选）

##### 添加 DNS 解析记录

为域名添加一条指向服务器 IP 地址的 A 记录。

#### 启动服务

至此，代理已经配置完毕，现在重载 `Caddy` 并启动 `V2Ray`。

```bash
sudo systemctl start v2ray
sudo systemctl reload caddy
```

### 客户端配置

#### 下载客户端

我使用的客户端为 `Clash`。

#### 编辑配置文件

Clash 的配置文件格式为 yaml ，有严格的缩进规则。

以下为范例：

```yaml
port: 7890
socks-port: 7891
redir-port: 7892
allow-lan: false
mode: Rule
log-level: info

proxies:
- name: "代理"
  type: vmess
  server: [域名]
  port: 443
  uuid: [UUID]
  alterId: [alterId]
  cipher: auto
  udp: true
  tls: true
  network: ws
  ws-opts:
    - path: [path]

proxy-groups:
- name: "PROXY"
  type: select
  proxies:
    - "代理"
```

推荐添加一些代理规则，如：<https://github.com/Loyalsoldier/clash-rules>。

#### 导入配置文件

### 增强体验的额外配置

腾讯云的轻量应用服务器用作代理绰绰有余，所以我们还可以部署一些额外的东西。

#### 修改 `Caddy` 配置文件

在 Caddyfile 开头加入以下内容：

```
*.[域名] {
  tls [邮箱]
}
[域名] {
  tls [邮箱]
}
```
再在你想要的任意域名下加入`file_server`。

`file_server` 中加入（可选项）：

- `root [自定义根目录]`
- `browse #启用索引`

修改后，我的 `Caddyfile` 是这样的：

```
*.[域名] {
    tls [邮箱]
}

[域名] {
    tls [邮箱]
}

files.[域名] {
    basicauth [想要密码限制的目录（后加 *）/ 文件，也可选择删除，全部限制] {
        [用户名] [密码]
    }

    file_server {
        root [root1]
        browse
    }
}
proxy.[域名] {
    reverse_proxy /v2ray localhost:10000 {
        header_up -Origin
    }

    file_server {
        root [root2]
    }
}
```

其中的 [密码] 需要这样生成：

```bash
caddy hash-password
```

于是我把 Clash 配置文件放到 [root2] 中并在客户端配置从 Url 导入，从 proxy.[域名] 访问；把要分享的文件放在 [root1] ，其中有两个目录：Public 和 Private ，密码限制 Private 目录。

#### 安装、配置 `VsFTPd`

## 部署完成

至此，你的代理服务器、文件服务器都已搭建完毕，享受吧！