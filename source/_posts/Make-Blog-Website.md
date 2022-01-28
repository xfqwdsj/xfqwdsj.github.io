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

<!-- more -->

![创建仓库](/uploads/screenshot_20220128-165847_chrome.png)

创建之后，复制它的 **SSH** 地址。

### 注册 `CloudStudio`

访问 [https://cloudstudio.net](https://cloudstudio.net) 并注册一个账号（建议使用 GitHub 方式）。

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
npm install -S hexo-theme-icarus
npm uninstall hexo-theme-landscape
npm uninstall hexo-renderer-ejs		# https://github.com/ppoffice/hexo-theme-icarus/issues/855
```

修改[配置文件](https://hexo.io/zh-cn/docs/configuration)：

{% codeblock "_config.yml" lang:yml >folded %}
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: 网站标题
subtitle: 副标题
description: 描述
keywords:
  - 关键词
  - 关键词
author: 作者
language: zh-CN
timezone: Asia/Shanghai

# URL
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'
url: http://example.com
permalink: :year/:month/:day/:title/
permalink_defaults:
pretty_urls:
  trailing_index: true # Set to false to remove trailing 'index.html' from permalinks
  trailing_html: true # Set to false to remove trailing '.html' from permalinks

# Directory
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:

# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link:
  enable: true # Open external links in new tab
  field: site # Apply to the whole site
  exclude: ''
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace: ''
  wrap: true
  hljs: false
prismjs:
  enable: false
  preprocess: true
  line_number: true
  tab_replace: ''

# Home page setting
# path: Root path for your blogs index page. (default = '')
# per_page: Posts displayed per page. (0 = disable pagination)
# order_by: Posts order. (Order by date descending by default)
index_generator:
  path: ''
  per_page: 10
  order_by: -date

# Category & Tag
default_category: uncategorized
category_map:
tag_map:

# Metadata elements
## https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
meta_generator: true

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss
## updated_option supports 'mtime', 'date', 'empty'
updated_option: 'mtime'

# Pagination
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page

# Include / Exclude file(s)
## include:/exclude: options only apply to the 'source/' folder
include:
exclude:
ignore:

# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: icarus

# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: ''
{% endcodeblock %}

还需要对主题进行一次初始化，输入：

```bash bash
hexo server
```

完成后，按下 <kbd>Ctrl</kbd> + <kbd>C</kbd> 。

### 提交更改

切换到版本管理选项卡，提交更改并推送。

![提交更改](/uploads/2022-01-28-180741.png)

![推送更改](/uploads/2022-01-28-181050.png)

至此，我们可以暂时关闭 `CloudStudio` 了。

### 打开 `GitHub Web Editor`

打开仓库，按下 <kbd>.</kbd> 键即可打开。

### 继续配置

继续修改[主题配置文件](https://ppoffice.github.io/hexo-theme-icarus/Configuration/icarus%E7%94%A8%E6%88%B7%E6%8C%87%E5%8D%97-%E4%B8%BB%E9%A2%98%E9%85%8D%E7%BD%AE/)（由于主题配置文件更加复杂，所以没有编写示例）。