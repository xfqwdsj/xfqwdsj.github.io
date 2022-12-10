---
title: 利用 Nginx 部署支持 SNI 转发的 Trojan 服务端以及踩坑记录
date: 2022-02-02T18:23:58.000+00:00
tags:
- 技术
- Nginx
- Trojan
- 服务器
- 代理
- GFW
category: 技术
toc: true
updated: 2022-12-11T00:01:59+08:00

---
## 前言

之前使用 Caddy 部署的服务端，到现在出现了一个问题：不具备部署多个网络服务的能力。

我尝试过使用反向代理，但无论如何都不能成功连接。正当我一筹莫展之时，我发现了[这篇文章](https://www.chengxiaobai.com/trouble-maker/trojan-shared-443-port-scheme)。啪的一下很快啊，我马上蹦了起来开始操作。

<!-- more -->

部署 Trojan 的教程可以查看[这篇文章](https://blog.xfqlittlefan.xyz/2022/01/27/Caddy-Trojan/)。

{% message color:warning %}
由于部署过程中有很多坑，为引导读者避坑，本文将以我的操作顺序以及问题的解决过程来记录，所以如果你只是想知道部署方法，请先通读文章。
{% endmessage %}

## 安装 `Nginx`

一般情况下，只需执行以下命令：

```bash bash
sudo apt install nginx
```

但是我比较“喜欢”绕~~（搜索关键词不对）~~，于是我在[官网](https://nginx.org/en/linux_packages.html#Ubuntu)上查到了完整的安装方法：

```bash bash
sudo apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
gpg --dry-run --quiet --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
```

确保输出为：

```
pub   rsa2048 2011-08-19 [SC] [expires: 2024-06-14]
      573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
uid                      nginx signing key <signing-key@nginx.com>
```

如果不是就删掉 `/usr/share/keyrings/nginx-archive-keyring.gpg` 再来。

下一步就是安装了：

{% message color:info %}
主要版并不是不稳定，按照官网说法，只是不那么稳定而已。我选择的是主要版。
{% endmessage %}

{% message color:warning %}
官网没写怎么换分支，我也不会。
{% endmessage %}

{% tabs %}

<!-- tab id:stable title:稳定版 -->

```bash bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```

<!-- endtab -->
<!-- tab id:main active title:主要版 -->

```bash bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```

<!-- endtab -->

{% endtabs %}

```bash bash
sudo apt update
sudo apt install nginx
```

## 安装 `Certbot`

文档：<https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal>

> 安装 `Snapd` 的方法：
>
> ```bash bash
> sudo apt install snapd
> ```

```bash bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

## 配置

安装之后，噩梦就开始了。

我开始到处学习 Nginx 的配置文件，最后我是这么做的：

首先删除一个默认的配置文件：`/etc/nginx/conf.d/default.conf`

然后编辑配置文件：

```conf /etc/nginx/nginx.conf
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}

# 这部分是原文中复制过来的
stream {
    # 这里就是 SNI 识别，将域名映射成一个配置名
    map $ssl_preread_server_name $backend_name {
        [Trojan 与伪装服务器共用的域名] trojan;
    # 域名都不匹配情况下的默认值
        default web;
    }

    # web，配置转发详情
    upstream web {
        server 127.0.0.1:80;
    }

    # trojan，配置转发详情
    upstream trojan {
        server 127.0.0.1:[Trojan 端口];
    }

    # 监听 443 并开启 ssl_preread
    server {
        listen 443 reuseport;
        listen [::]:443 reuseport;
        proxy_pass  $backend_name;
        ssl_preread on;
    }
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;

    keepalive_timeout  65;

    include /etc/nginx/conf.d/*.conf;

    server {
        server_name [Trojan 与伪装服务器共用的域名];

        location / {
            root /usr/share/nginx/html/;
            index index.html index.htm;
        }

        listen 80;
    }
}
```

编辑 Trojan 的配置文件 `/usr/local/etc/trojan/config.json` ，把 `local_port` 修改一下，重启。

```bash bash
sudo systemctl restart trojan
```

注册系统服务，启动 Nginx：

```bash bash
sudo nginx -s stop
sudo systemctl enable nginx
sudo systemctl start nginx
```

申请证书：

```bash bash
sudo certbot --nginx
```

Certbot 会从配置文件中发现你配置的域名并自动修改配置文件，配置 SSL 。

配置完成后，再次修改配置文件：

```conf /etc/nginx/nginx.conf
server {
    server_name [域名];

    location / {
        root /usr/share/nginx/html/;
        index index.html index.htm;
    }

    listen 80 ssl;
    ssl_certificate /etc/letsencrypt/live/[域名]/fullchain.pem;   # 记下这两个路径
    ssl_certificate_key /etc/letsencrypt/live/[域名]/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

```bash bash
sudo nginx -s reload
```

编辑 Trojan 的配置文件 `/usr/local/etc/trojan/config.json` ，把证书路径修改一下，重启。

```bash bash
sudo systemctl restart trojan
```

这时我们就可以用原来的客户端配置连接到代理了。

作为一个合格的~~懒狗~~自动化玩家，我们肯定是要测试一下自动更新 SSL 的可靠程度。~~（怕自己配置出错）~~

```bash bash
sudo certbot renew --dry-run
```

但我们竟收到了 400 错误！

打开浏览器：

![浏览器](/uploads/2022-02-03-010519.png)

按照我们配置 Caddy 的经验，这样配置应该没有错。

上网搜索，怎么配怎么不对：有说 `ssl` 后加 `default` 的，有说端口 443 加 `ssl` 而 80 不加的，可行的就第一种，但也失败了。（说是失败，不如说是不适合我们的需求）

到这里，我们就止步不前了，我也尝试过搜索 Nginx 取消这个功能的办法，无奈没有搜到。

于是我开始翻看我看过的各种文章，果然还是最开始给我灵感的文章又给了我灵感。文章中的转发设置中并没有转到 80 端口，而这个问题产生的原因是使用 HTTP 协议访问了启用了 SSL 的 80 端口，我们再新开一个端口，用于 SSL 连接不就行了吗？

开干：

```conf /etc/nginx/nginx.conf
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}

stream {
    map $ssl_preread_server_name $backend_name {
        [Trojan 及伪装域名] trojan;
        default web;
    }

    upstream web {
        server 127.0.0.1:[Web SSL 端口];
    }

    upstream trojan {
        server 127.0.0.1:[Trojan 端口];
    }

    server {
        listen 443 reuseport;
        listen [::]:443 reuseport;
        proxy_pass  $backend_name;
        ssl_preread on;
    }
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;

    server {
        server_name [Trojan 及伪装域名];

        location / {
            root /usr/share/nginx/html/;
            index index.html index.htm;
        }

        listen [Web SSL 端口] ssl;
        listen 80;
        ssl_certificate /etc/letsencrypt/live/[*]/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/[*]/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    }

    server {
        server_name [其他服务域名];
    
        listen [Web SSL 端口] ssl;
        listen 80;
        ssl_certificate /etc/letsencrypt/live/[*]/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/[*]/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    }
}

```

重载 Nginx ，大功告成：

```bash bash
sudo nginx -s reload
```

## 后记

折腾这个花了我一个下午的光阴，这次折腾给我一个启示：思维不能僵化。HTTP 端口不一定是 80 ，HTTPS 端口也不一定是 443 。折腾完后我再次蹦了起来：NB ！并马上打开电脑记录。

本文内容可能与实际情况有些出入（文件内容、实现效果等），但最终结果部分应该不会错。