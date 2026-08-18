# dsh-song-memory v2.0 —— 记忆插件界面重做（开发任务提示词）

> 用途：把这份提示词交给任意编码 agent（Claude Code / Codex / 其他），它即可独立接手开发。
> 项目位置：/Users/songsong/code/dsh-song-memory（已完成改名，package name 与插件 id 均为 dsh-song-memory）

---

## 一、项目是什么

这是一个 DeepSeek Harness（DSH，Cordis 插件体系）的记忆插件。底层引擎是 **mnemon**（Go 写的 LLM-supervised 持久记忆：图结构召回、跨会话、named stores 项目隔离），DSH 侧的官方集成插件叫 dsh-mnemon（TypeScript）。本项目 = **dsh-mnemon v0.2.9 的 fork**，任务是在它的代码基础上**只重做界面**，引擎逻辑完全保留。

**用户诉求**：dsh-mnemon 功能很强（用户之前用着舒服），但它的页面太复杂——14 个功能模块、最深 4-5 层、满屏术语（记忆体/沉淀/召回/Provider/存储域…），普通用户不知道怎么下手。用户要求：**用苹果 HIG 理念重做界面——默认简单、高级折叠、术语全白话，但功能零丢失**。

## 二、已完成的工作（接手时先验证，勿重复做）

1. ✅ 已 fork dsh-mnemon v0.2.9 到本项目，**mnemon 引擎已安装**（`which mnemon` → v0.2.3，brew cask）。
2. ✅ **导航收敛为四大白话标签**（commit `07af29f` + `58777ce`）：`记忆 | 常用小抄 | 项目文档 | 运行状态`；8 个页面组件（Overview/Runtime/Documents/Explore/Entities/Remember/List/Status）全部保留、page 分发机制不变；创建表单默认只填名字+说明（高级折叠）、搜索框默认智能模式、图谱默认隐藏有"查看关系图"展开入口、anchor 跳转目标全部可达。
3. ✅ **术语全白话替换**（commit `621e1f6`）：zh 233 key + en 201 key，覆盖 13 项对照（记忆体→记忆仓库、沉淀→存入记忆、召回→检索、存储域→存储位置、Provider→存储服务、运行时/热记忆→常用小抄、档案→项目文档、实体→主题、图谱→关系图、策略→自动存入策略、配置→设置、监督写回→AI 审核后再存、独立任务 Agent→后台 AI 小助手）；`config.*` 高级设置区按 PRD 保留技术词；新增禁词回归测试 `tests/terminology.spec.ts`。
4. ✅ 测试基线：`node_modules/.bin/vitest run` → **347 passed / 1 skipped**（38 文件）。改名（package.json name、cordis.patch.yml id）已完成，未提交。
5. ✅ 已安装到 DSH web profile：`dsh plugin --profile web add link:/Users/songsong/code/dsh-song-memory`，用户已重启 DSH，插件已加载。
6. ✅ 文档：`docs-v2/` 下有 PRD-v2.0.md、product-definition-v2.0.md、DECISION-v2.0-mnemon.md、dsh-mnemon-FUNCTION-MAP.md。

## 三、需求依据（必读）

- **PRD**：`docs-v2/PRD-v2.0.md`（12 条 FR，每条 Given-When-Then 验收标准；附录 A 术语对照表；附录 B 14 模块→新位置映射；附录 C 已确认的 4 个决策）。
- **功能全貌**：`docs-v2/dsh-mnemon-FUNCTION-MAP.md`（14 模块 + 简化草案）。
- 核心验收：**FR-11 功能零丢失**——原 14 个功能模块在重做后全部可访问（高级区能找到），一个不能少。

## 四、铁律（红线，违反即失败）

1. **只改 `src/client/` 下的 UI 文件**（locales.ts 文案、MnemonView.tsx 及页面组件 JSX、*.module.css）。
2. **引擎/宿主红线绝不碰**：`src/` 下非 client 文件、`src/client/api.ts` 的 RPC 方法签名与 payload、`anchor.ts` 跳转通道、`workspace-mount.tsx` / `sidebar-entry.ts` / `workspace-controller.ts`（宿主 DOM 注入）。
3. **测试必须全绿**：`node_modules/.bin/vitest run` 347 passed / 1 skipped 为基线，改完只增不减；结构断言如因改动失效需重写匹配新结构，**不能删测试**。
4. **zh + en 两本词典同步**，禁词测试（terminology.spec.ts）必须保持通过。
5. 术语：界面用户可见处不得出现旧术语（记忆体/沉淀/召回/存储域/运行时/档案/实体/图谱/Provider…），高级设置区（config.*）除外。
6. 提交遵循 Conventional Commits；改完跑 `pnpm build`（或 `node_modules/.bin/tsdown`）确认打包通过。

## 五、当前待办（按优先级）

### P0：收尾改名（未提交）
- 工作区未提交改动：package.json（name→dsh-song-memory）、cordis.patch.yml（id→dsh-song-memory）、pnpm-workspace.yaml（allowBuilds 修正）、tsdown.config.ts、docs-v2/。检查这些改动完整性并提交；确认 `dsh plugin` 的 patch id 与 package name 一致，避免加载异常。

### P1：真实环境验证（关键，尚未做）
- 用户已重启 DSH、插件已 link 加载。**请在浏览器实际打开页面验证**：四个标签（记忆/常用小抄/项目文档/运行状态）是否正常显示、创建记忆仓库是否只填名字+说明、搜索框默认智能、图谱默认隐藏、"存入记忆"按钮可用、运行状态页健康灯正常。
- 若页面报错/白屏：查 DSH 日志（`~/.dsh/logs/`），定位是改名问题还是组件问题，修复。
- buildin 与 sidebar 两种显示模式都验证（设置里切换）。

### P2：旧记忆导入（用户要求"旧记忆导出后重新导入"）
- 旧数据备份在 `~/memory-backup-v1/`（notes.md.bak、memory.md.bak 等，是用户旧自研插件的草稿箱与摘要）。
- 用户拍板：按项目拆分导入新系统的记忆仓库（无法确定归属的放"历史存档"仓库）。
- mnemon 有导入能力（IMPORT.md：历史聊天导入；或 dsh-mnemon 的备份恢复：.mnemonpack / ZIP）。评估用哪种方式把备份内容导入，写清步骤并执行。

### P3：QA 与发布准备
- 独立 QA：对照 PRD 12 条 FR 逐条验收（重点 FR-2 项目隔离、FR-11 功能零丢失、禁词零残留）。
- 独立安全审计：零密钥/零个人路径/依赖安全（基线可参考旧审计 docs/AUDIT-1.5.3.md 的检查项）。
- 版本与发布：version 现为 0.2.9（继承上游），建议 bump 到 v1.0.0 或 v2.0.0 标识本项目重构；更新 README（说明这是 song-memory v2.0，基于 mnemon）；CHANGELOG；git tag + GitHub Release（仓库地址确认后）。

## 六、验收标准（完成才算）

1. `vitest run` 全绿（≥347 passed），禁词测试通过。
2. 浏览器实测：四标签正常、创建仓库只填名字+说明、搜索默认智能、图谱默认隐藏、存入记忆可用、运行状态正常、sidebar/buildin 两模式都正常。
3. 旧记忆成功导入新系统（用户能在页面看到历史记忆）。
4. 14 个功能模块逐项可达（对照 PRD 附录 B）。
5. 改名提交完成，`dsh plugin --profile web` 加载正常无报错。
6. README/CHANGELOG/版本号更新，tag 与 Release 就绪（或按用户确认的发布范围）。

## 七、工作方式

- 每一步改动跑测试；遇到不确定的产品决策（如导入方式、版本号、发布范围），不要擅自定，列出选项问用户。
- 报告格式：改了什么 / 测试结果 / 实测截图或描述 / 遗留风险。
