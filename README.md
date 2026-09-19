# 校园公共信息与数据展示中心（整合练习）

课堂作业八 · 案例复现成果：把前面几次课的模块整合进一个统一入口的网站，
作为期末大作业的原型。主题围绕校园学习生活（自习室查询与使用统计）。

## 运行方法

需要用本地服务器打开（页面要读取 data/data.json，双击 index.html 用 file:// 打开会加载失败）。

方式一（需要 Node.js）：在 integration 目录下执行

    npx --yes http-server . -p 8123

然后浏览器访问 http://127.0.0.1:8123

方式二：用 VS Code 的 Live Server 插件，右键 integration/index.html → Open with Live Server。

## 目录说明

    integration/
    ├── index.html          统一入口：导航 + 首页卡片 + 自习室筛选 + 统计图表
    ├── css/style.css       自定义样式
    ├── js/app.js           自习室筛选逻辑、图表渲染与错误提示
    ├── data/data.json      统计数据（自习室使用量，示例数据）
    ├── libs/               第三方库（本地引入，无需联网）
    └── three-d/scene.html  校园三维导览（A-Frame 场景）

## 页面与功能

- 首页：统一导航 + 四个模块入口卡片；
- 自习室：按楼层 / 开放状态筛选（数据写在 js 数组里，先改数组再重画列表）；
- 统计：ECharts 柱状图，数据从 data/data.json 加载，含标题、单位与数据来源；
- 校园三维：A-Frame 校园场景，可从首页导航进入，点左上角"返回首页"回来。

## 数据与资源来源

- 数据：`data/data.json` 为课堂演示用示例数据，自行编写；
- Bootstrap 5.3.3（MIT License）— https://getbootstrap.com
- jQuery 3.7.1（MIT License）— https://jquery.com
- ECharts 5.5.0（Apache License 2.0）— https://echarts.apache.org
- A-Frame 1.7.0（MIT License）— https://aframe.io

以上库均为官网下载后放在 `integration/libs/` 本地引入。
