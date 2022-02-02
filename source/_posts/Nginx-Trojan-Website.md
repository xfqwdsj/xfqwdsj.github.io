---
title: 利用 Nginx 部署支持 SNI 转发的 Trojan 服务端以及踩坑记录
date: 2022-02-02 18:23:58
tags:
  - 技术
  - Nginx
  - Trojan
  - 服务器
  - 代理
  - GFW
category: 技术
toc: true
---

## 前言

之前使用 Caddy 部署的服务端，到现在出现了一个问题：不具备部署多个网络服务的能力。

我尝试过使用反向代理，但无论如何都不能成功连接。正当我一筹莫展之时，我发现了[这篇文章](https://www.chengxiaobai.com/trouble-maker/trojan-shared-443-port-scheme)。啪的一下很快啊，我马上蹦了起来开始操作。

<!-- more -->

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
<!-- item stable '稳定版' -->
```bash bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```
<!-- enditem -->
<!-- activeitem main '主要版' -->
```bash bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```
<!-- enditem -->
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