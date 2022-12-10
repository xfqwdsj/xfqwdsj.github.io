---
date: 2022-01-28T09:52:55+08:00
title: 利用 Caddy 部署 Trojan 服务端
tags:
- 技术
- Caddy
- Trojan
- 服务器
- 代理
- GFW
category: 技术
toc: true
updated: 2022-01-28T09:52:55+08:00

---
## 准备工作

参见[此文章](https://blog.xfqlittlefan.xyz/2022/01/27/caddy-v2ray/)。

## 开始部署

<!-- more -->

### 安装 `Caddy`

{% message color:info %}
如果不想让伪装地址指向本机，可以不用安装。
{% endmessage %}

### 安装 `Trojan` <sup>[[文档]](https://github.com/trojan-gfw/trojan/wiki/Binary-&-Package-Distributions#quickstart-script)</sup>

```bash bash
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/trojan-gfw/trojan-quickstart/master/trojan-quickstart.sh)"
```

### 配置 `Caddy`

{% message color:info %}
除特别说明，否则文章中所有带 `[ ]` 号的文本均需连 `[ ]` 号依据其中提示替换。
{% endmessage %}

`Caddy` 成功安装后，修改 `Caddyfile` 为以下内容：

{% message color:info %}
我们需要让出 443 端口给 `Trojan`，所以在 `Caddyfile` 中显式指定了端口。
{% endmessage %}

```bash /etc/caddy/Caddyfile
[域名]:80 {
  tls [邮箱]
  root * /usr/share/caddy # 可修改为其他内容
  file_server
}
```

在以上文件中，我们在自己的域名（需指向服务器）的 80 端口建立了一个网站（也可以不建立或进行反向代理），用于 `Trojan` 的伪装。

反向代理可以这样配置：

```bash /etc/caddy/Caddyfile
[域名]:80 {
  tls [邮箱]
  reverse_proxy [地址]
}
```

如果想让伪装指向其他地址，可以不用配置。

### 配置 `Trojan` <sup>[[文档]](https://trojan-gfw.github.io/trojan/config.html#a-valid-serverjson)</sup>

将配置文件修改为如下内容：

```json /usr/local/etc/trojan/config.json
{
    "run_type": "server",
    "local_addr": "0.0.0.0",
    "local_port": 443,
    "remote_addr": "127.0.0.1", //这是伪装地址，默认无需更改，未配置 Caddy 的需要更改
    "remote_port": 80,
    "password": [
        "password1",            //此处填写密码，可以只留下一个
        "password2"
    ],
    "log_level": 1,
    "ssl": {
        "cert": "/var/lib/caddy/.local/share/caddy/certificates/acme-v02.api.letsencrypt.org-directory/[域名]/[域名].crt",
        "key": "/var/lib/caddy/.local/share/caddy/certificates/acme-v02.api.letsencrypt.org-directory/[域名]/[域名].key",
        "key_password": "",
        "cipher": "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384",
        "cipher_tls13": "TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_256_GCM_SHA384",
        "prefer_server_cipher": true,
        "alpn": [
            "http/1.1",
            "h2"
        ],
        "reuse_session": true,
        "session_ticket": false,
        "session_timeout": 600,
        "plain_http_response": "",
        "curves": "",
        "dhparam": ""
    },
    "tcp": {
        "prefer_ipv4": false,
        "no_delay": true,
        "keep_alive": true,
        "reuse_port": false,
        "fast_open": false,
        "fast_open_qlen": 20
    },
    "mysql": {
        "enabled": false,
        "server_addr": "127.0.0.1",
        "server_port": 3306,
        "database": "trojan",
        "username": "trojan",
        "password": "",
        "key": "",
        "cert": "",
        "ca": ""
    }
}
```

### 启动服务

{% message color:info %}
配置后，服务均会自动启动。
{% endmessage %}

```bash bash
sudo systemctl reload caddy
sudo systemctl enable trojan
sudo systemctl start trojan
```

## 部署完成

Enjoy it!