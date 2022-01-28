---
date: 2022-01-28T16:52:09.000+00:00
toc: true
title: 无需本地环境，搭建一个个人博客网站
tags:
- 博客
- 技术
category: 技术

---
## 前言

随着互联网的进步，越来越多的操作得以在网上进行。今天我们来做一个静态博客“云玩家”。

## 搭建

### 创建仓库

首先，在线上创建一个 Git 仓库。

![创建仓库](/uploads/screenshot_20220128-165847_chrome.png)

创建之后，复制它的 **SSH** 地址。

### 注册 `CloudStudio`

访问 <https://cloudstudio.net> 并注册一个账号（建议使用 GitHub 方式）。

新建一个 Ubuntu 的工作空间并设置仓库地址。

![新工作空间](/uploads/screenshot_20220128-171250_chrome.png)

### 配置仓库

打开终端，输入如下内容以安装 `Node.js`：

```bash bash
curl -fsSL https://deb.nodesource.com/setup_17.x | bash
apt-get install -y nodejs
```

![新终端](/uploads/screenshot_20220128-171554_chrome.png)

安装完成后，输入以下内容以更新 `Npm` 并安装 `Hexo`：

```bash bash
npm install -g npm
npm install -g hexo
```

输入以下内容进行初始化：

```bash bash
mkdir hexo
cd hexo
hexo init
cd ..
mv hexo/* .
mv 
rmdir hexo
```

以上命令新建了一个空 `hexo` 目录（`hexo` 初始化需要空目录），并在该目录执行初始化，初始化完成后将内容移回当前目录。

### 更改主题

我们使用 [`Icarus`](https://github.com/ppoffice/hexo-theme-icarus/) 主题。

```bash bash
npm install hexo-theme-icarus
```