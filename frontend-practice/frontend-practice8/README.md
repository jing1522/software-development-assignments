# 前端综合实践（作业八）

本仓库包含两部分成果：

- `integration/` —— 案例复现：迷你版校园信息中心（跟课堂演示分步完成）
- `my-site/` —— 自主实践：数模备赛回顾单页站（作为期末大作业的原型）

## 运行方法

两部分都需要本地服务器打开（页面要读取本地 JSON 数据，直接双击 `index.html` 用 file:// 打开会加载失败）。

方式一（需要 Node.js）：在对应目录下执行

    cd integration
    npx --yes http-server . -p 8123

或

    cd my-site
    npx --yes http-server . -p 8126

然后浏览器访问对应的 http://127.0.0.1 地址。

方式二：用 VS Code 的 Live Server 插件，右键对应目录的 `index.html` → Open with Live Server。

## 目录说明

    integration/
    ├── index.html          统一入口：导航 + 首页卡片 + 自习室筛选 + 统计图表
    ├── css/style.css       自定义样式
    ├── js/app.js           自习室筛选逻辑、图表渲染与错误提示
    ├── data/data.json      统计数据（自习室使用量，示例数据）
    ├── libs/               第三方库（本地引入，无需联网）
    └── three-d/scene.html  校园三维导览（A-Frame 场景）

    my-site/
    ├── index.html          单页站点：回顾 / 我的准备 / 我的心得 / 三维沙盘 / 问卷
    ├── css/style.css       自定义样式
    ├── js/dashboard.js     备赛数据看板（ECharts 柱状图 + Chart.js 折线图 + ECharts 饼图，
    │                       实际/计划切换与点柱联动）
    ├── js/survey.js        问卷（表单校验、localStorage 本地保存与提交计数）
    ├── data/prep.json      备赛实际数据（7–8 月，自编示例）
    ├── data/plan.json      备赛计划数据（自编示例）
    ├── libs/               第三方库（本地引入，无需联网）
    └── three-d/scene.html  三维沙盘（A-Frame 六边形扫描场景）

## 页面与功能

integration（案例复现）：

- 首页：统一导航 + 四个模块入口卡片；
- 自习室：按楼层 / 开放状态筛选（先改数组再重画列表）；
- 统计：ECharts 柱状图，数据从 data/data.json 加载，含标题、单位与数据来源；
- 校园三维：A-Frame 校园场景，可从首页导航进入并返回。

my-site（自主实践）：

- 回顾：赛后复盘定位与服务对象；
- 我的准备：三张图表 + 实际/计划切换 + 点击柱状图联动；
- 我的心得：经验卡、七阶段用法与参考链接；
- 三维沙盘：扫描点先向正右飞到大圆顶点，再顺时针沿正六边形扫描，扫到哪条边哪条边亮；
- 问卷：表单校验 + 本地保存（localStorage）+ 提交计数。

## 数据与资源来源

- 数据：`integration/data/data.json`、`my-site/data/prep.json`、`my-site/data/plan.json` 均为自编示例数据；
- Bootstrap 5.3.3（MIT License）— https://getbootstrap.com
- jQuery 3.7.1（MIT License）— https://jquery.com
- ECharts 5.5.0（Apache License 2.0）— https://echarts.apache.org
- Chart.js 4.4.1（MIT License）— https://www.chartjs.org
- A-Frame 1.7.0（MIT License）— https://aframe.io

以上库均为官网下载后放在各自 `libs/` 目录本地引入。
