# 逾期款项管理系统分角色图文培训课件

这是一个部署到 GitHub Pages 的静态 HTML 培训课件站点，按照三个使用角色拆分：

- `index.html`：培训入口与课程目录
- `sales.html`：业务员逾期款系统操作培训
- `finance.html`：财务人员逾期款系统操作培训
- `management.html`：管理层周报与数据查看培训

## 图片素材

三个角色页面已将截图压缩后内嵌到 HTML 中，因此 GitHub Pages 发布时不依赖额外图片目录。

本地源截图保留在：

- `assets/screenshots-clear/sales/`
- `assets/screenshots-clear/finance/`
- `assets/screenshots-clear/management/`

这些截图由用户确认已经完成脱敏，可用于课件展示。

## 部署方式

GitHub Pages 使用 `main` 分支根目录发布：

`Settings -> Pages -> Build and deployment -> Source -> Deploy from a branch`

选择 `main` 分支和 `/ (root)` 目录后保存。
