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

```txt
Options:
      --version      Show version number                               [boolean]
  -h                 Show help                                         [boolean]
      --homepageUrl  The homepage URL                                   [string]
      --authCode     The authentication code                            [string]
      --limit        The limit number                                   [string]
      --cron         The cron expression                                [string]
      --help         Show help                                         [boolean]
```

## 功能解释

### 文件 list.ts

1. 功能概述 list.ts

   文件主要用于从指定的主页URL获取数据列表，并支持分页加载。

它通过HTTP请求获取数据，并解析响应以返回结构化的列表数据。

2. 主要功能点 命令行参数解析：使用 parse 函数解析命令行参数，包括

   homepageUrl、authCode 和可选的 limit 参数。

网络请求：通过

fetchWithStatusCheck 发送带有认证信息的HTTP GET请求，获取数据列表。

数据解析：使用 listparse 函数解析响应数据，返回包含列表项和分页游标的对象。

分页处理：通过异步生成器 listIterator 实现分页加载，逐页获取并输出数据。

帮助信息：提供 printhelp 函数，用于打印命令行工具的使用说明。

3. 关键函数 list：根据提供的URL和认证码获取数据列表，支持分页。

   listparse：解析响应数据，返回结构化的列表数据。

   listIterator：异步生成器，用于迭代获取多页数据。

   main：主函数，负责解析命令行参数并调用相关函数执行任务。

### 文件 wewerssgetallhistoryarticles.ts

1. 功能概述 wewerssgetallhistoryarticles.ts

   文件的主要功能是从指定的主页URL获取所有历史文章，并处理正在进行的历史记录。

它通过调用其他模块中的函数来实现分页加载、获取历史文章和持续检查进行中的历史记录。

2. 主要功能点 命令行参数解析：使用 parseArgs 解析命令行参数，包括

   homepageUrl、authCode 和可选的 limit 参数。

数据列表迭代：通过 listIterator 异步生成器逐页获取数据列表。

获取历史文章：对于每个包含历史记录的项目，调用 getHistoryArticles
获取具体的历史文章。

持续检查进行中的历史记录：通过 processOngoingHistory
函数不断检查是否有新的进行中历史记录，直到没有新记录为止。

帮助信息：提供 printhelp 函数，用于打印命令行工具的使用说明。

3. 关键函数

   wewerssgetallhistoryarticles：主逻辑函数，负责迭代获取数据列表并处理历史文章。

   processOngoingHistory：持续检查并处理正在进行的历史记录，每次检查后等待5秒。

   main：主函数，负责解析命令行参数并调用相关函数执行任务。
