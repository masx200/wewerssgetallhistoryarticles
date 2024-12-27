# wewerssgetallhistoryarticles

#### 介绍

wewerss get all history articles

#### 软件架构

软件架构说明

#### 安装教程

1. xxxx
2. xxxx
3. xxxx

#### 使用说明

1. list

Usage:

`******\deno.exe run -A ******\list.ts --homepageUrl=https://***************** --authCode=***************`

`******\deno.exe run -A ******\list.ts --homepageUrl=https://***************** --authCode=*************** --limit=50`

2. getInProgressHistoryMp

Usage:

`******\deno.exe run -A ******\getInProgressHistoryMp.ts --homepageUrl=https://***************** --authCode=***************`

3. getHistoryArticles

Usage:

`******\deno.exe run -A ******\getHistoryArticles.ts --homepageUrl=https://***************** --authCode=*************** --mpId=***************`

4. wewerssgetallhistoryarticles

Usage:

`******\deno.exe run -A ******\wewerssgetallhistoryarticles.ts --homepageUrl=https://***************** --authCode=***************`

`******\deno.exe run -A ******\wewerssgetallhistoryarticles.ts --homepageUrl=https://***************** --authCode=*************** --limit=50`

## 功能解释

文件 list.ts

1. 功能概述 list.ts

   文件主要用于从指定的主页URL获取数据列表，并支持分页加载。它通过HTTP请求获取数据，并解析响应以返回结构化的列表数据。

2. 主要功能点 命令行参数解析：使用 parse 函数解析命令行参数，包括

   homepageUrl、authCode 和可选的 limit 参数。 网络请求：通过

   fetchWithStatusCheck 发送带有认证信息的HTTP GET请求，获取数据列表。

   数据解析：使用 listparse 函数解析响应数据，返回包含列表项和分页游标的对象。

   分页处理：通过异步生成器 listIterator 实现分页加载，逐页获取并输出数据。

   帮助信息：提供 printhelp 函数，用于打印命令行工具的使用说明。

3. 关键函数 list：根据提供的URL和认证码获取数据列表，支持分页。

   listparse：解析响应数据，返回结构化的列表数据。

   listIterator：异步生成器，用于迭代获取多页数据。

   main：主函数，负责解析命令行参数并调用相关函数执行任务。
