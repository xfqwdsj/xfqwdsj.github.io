---
date: 2020-02-27T00:57:18+08:00
toc: true
updated: 2022-12-11T00:57:18+08:00
title: 利用抓包下载钉钉直播回放
tags:
- 网络
category: 技术

---
## 更新说明

本文首先发布在 [CSDN](https://blog.csdn.net/qq_42763682/article/details/104529683)，本次更新使文章表述更加严谨规范，且新增了一些链接。

## 引

> 最近在上网课，想在网上上传直播录像或者剪辑一些搞笑的片段上传。
>
> 但是当我打开电脑想点“下载”的时候……
> 
> ![Ooops](https://img-blog.csdnimg.cn/20200227090154600.png)

这个方法适用于 Android、Windows，因为我只在这两个平台测试过。Android 稍微麻烦一点，Windows 则需要一些工具。

<!-- more -->

## 抓包
### 准备工作

安装好抓包软件 [Fiddler](https://www.telerik.com/fiddler)。

### 开启 HTTPS 抓取

![抓取 HTTPS #1](https://img-blog.csdnimg.cn/20200227090633614.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNzYzNjgy,size_16,color_FFFFFF,t_70)

![抓取 HTTPS #2](https://img-blog.csdnimg.cn/20200227090710353.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNzYzNjgy,size_16,color_FFFFFF,t_70)

Android 同理，下载好你喜欢的抓包工具并安装根证书。

### 对钉钉进行抓包

打开钉钉窗口，按住工具栏上标有 `Any Process` 字样的按钮并拖动到钉钉窗口上：

![选择进程后](https://img-blog.csdnimg.cn/2020022709094674.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNzYzNjgy,size_16,color_FFFFFF,t_70)

Android 同理，选择程序钉钉，最好设置过滤域名 `alicdn.com`，以便更快地筛选。

在软件左下方命令框输入 `stop` 和 `cls`：

![stop](https://img-blog.csdnimg.cn/20200227091443617.png)

![cls](https://img-blog.csdnimg.cn/20200227091503881.png)

然后在直播回放打开前输入 `start`：

![start](https://img-blog.csdnimg.cn/20200227091610179.png)

以启动抓包。

也可以再加一条 `bold m3u8?`，可能会出现神奇的效果。

当回放加载完成（有画面）后输入 `stop` 以停止抓包。

Android 同理，清除列表，开启抓包，有画面就返回抓包软件并停止抓包。

### 寻找包

寻找环节，最好确保只打开一次回放，否则可能会出现重复包。

输入 `@alicdn.com` 和 `select vnd.apple.mpegurl`：

![@alicdn.com](https://img-blog.csdnimg.cn/2020022709205269.png)

![select vnd.apple.mpegurl](https://img-blog.csdnimg.cn/20200227092123194.png)

这样 Fiddler 就会自动定位到符合要求的包。

双击寻找到的包，转向窗口右边：

![窗口](https://img-blog.csdnimg.cn/20200227092254388.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNzYzNjgy,size_16,color_FFFFFF,t_70)

点击下方相应部分的的 `TextView` 选项卡应该能看到 `m3u8` 格式的文件。

回到左边，右键这个包选择复制 Url：

![复制 Url](https://img-blog.csdnimg.cn/20200227092746772.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNzYzNjgy,size_16,color_FFFFFF,t_70)

在 Android 上需要找域名为 `alicdn.com` 的 10KB 左右的 HTTP 请求。

## 下载
### 工具准备

此步骤可能需要在 Windows 上才能很好地进行。

本文中，我们使用 [N_m3u8DL-CLI](https://github.com/nilaoda/N_m3u8DL-CLI/releases/latest) 来下载视频。本文更新时我寻找到了同作者制作的跨平台 [N_m3u8DL-RE](https://github.com/nilaoda/N_m3u8DL-RE)，读者可以自行尝试。

下载最新版的一个 zip 文件，里面包含分片合并工具和一个可视化程序：

![选择的文件](https://img-blog.csdnimg.cn/20200227093400262.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNzYzNjgy,size_16,color_FFFFFF,t_70)

### 视频下载

设置好参数并运行：

![示例参数](https://img-blog.csdnimg.cn/2020022709380046.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNzYzNjgy,size_16,color_FFFFFF,t_70)

![运行过程](https://img-blog.csdnimg.cn/2020022709385710.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNzYzNjgy,size_16,color_FFFFFF,t_70)

## 完成

合并完成后就可以在 Downloads 目录下找到 mp4 文件啦！

![文件](https://img-blog.csdnimg.cn/20200227094028358.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNzYzNjgy,size_16,color_FFFFFF,t_70)