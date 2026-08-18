// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { zh, en } from '../src/client/locales.ts'

/**
 * PRD-v2.0 附录 A 术语对照表回归测试：
 * 用户可见文案（非高级设置区）禁止出现旧术语。config.* 命名空间是高级设置区
 * （Provider 服务配置等），按 PRD「设置高级区除外」豁免。
 */
const ADVANCED_PREFIX = 'config.'

// zh 禁词：附录 A 旧术语（含「等」字覆盖的 策略/配置/Provider/任务 Agent 等）
const ZH_BANNED = [
  '记忆体',
  '沉淀',
  '召回',
  '存储域',
  '运行时',
  '热记忆',
  '档案',
  '实体',
  '图谱',
  'Provider',
  '监督写回',
  '写入门控',
  '独立任务 Agent',
  '任务 Agent',
]

// en 禁词：与 zh 同步的旧术语。注意「Runtime」仅用于「运行状态」等运营语义
// （nav.runtimeStatus/nav.status.detail/status.aria），不属于热记忆旧术语。
// 使用词边界匹配，避免误伤 Identity（含 entity 子串）等正常英文单词。
const EN_BANNED: Array<[RegExp, string]> = [
  [/\bMemory Space(s)?\b/, 'Memory Space'],
  [/\bDistill(ation|ed|ing)?\b/, 'Distill'],
  [/\bdistill(ation|ed|ing)?\b/, 'distill'],
  [/\bRecall(ed|ing)?\b/, 'Recall'],
  [/\brecall(ed|ing)?\b/, 'recall'],
  [/\bEntities\b/, 'Entities'],
  [/\bentity(ies)?\b/, 'entity'],
  [/\bstorage domain(s)?\b/, 'storage domain'],
  [/\bStorage Domains\b/, 'Storage Domains'],
  [/\b[hh]ot[- ]memory\b/, 'hot memory'],
  [/\bwriteback\b/, 'writeback'],
  [/\bsupervised writeback\b/, 'supervised writeback'],
  [/\b[tT]ask [aA]gent\b/, 'task Agent'],
  [/\bdeposit(ed|ing)?\b/, 'deposit'],
  [/\bProvider(s)?\b/, 'Provider'],
  [/\bprovider(s)?\b/, 'provider'],
]

describe('PRD-v2.0 术语全白话回归', () => {
  it('zh 词典的用户可见 key 不出现旧术语（config.* 高级设置区除外）', () => {
    const hits: Array<[string, string, string]> = []
    for (const [key, value] of Object.entries(zh)) {
      if (key.startsWith(ADVANCED_PREFIX)) continue
      for (const word of ZH_BANNED) {
        if (value.includes(word)) hits.push([key, word, value])
      }
      // 策略 → 自动存入策略：允许出现在「自动存入策略」内，禁止其他独立用法
      if (value.includes('策略') && !value.includes('自动存入策略')) {
        hits.push([key, '策略(独立)', value])
      }
      // 配置 → 设置/高级设置：用户可见区不应再有「配置」
      if (value.includes('配置')) hits.push([key, '配置', value])
    }
    expect(hits).toEqual([])
  })

  it('en 词典与 zh 同步，用户可见 key 不出现旧术语', () => {
    const hits: Array<[string, string, string]> = []
    for (const [key, value] of Object.entries(en)) {
      if (key.startsWith(ADVANCED_PREFIX)) continue
      // 插值占位符（{provider} 等）是传给组件渲染的参数名，不是用户可见文案
      const visible = value.replace(/\{[a-zA-Z]+\}/g, '')
      for (const [re, word] of EN_BANNED) {
        if (re.test(visible)) hits.push([key, word, value])
      }
      // strategy → auto-save policy：只允许「Auto-save policy」形式
      if (/\bstrategy\b/i.test(visible) && !/auto-save policy/i.test(visible)) {
        hits.push([key, 'strategy(独立)', value])
      }
    }
    expect(hits).toEqual([])
  })
})
