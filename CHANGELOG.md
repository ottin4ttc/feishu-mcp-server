# 变更日志

所有对项目的显著变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
此项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [0.0.1] - 2023-06-01

### 新增功能

- 初始版本发布
- 支持飞书文档读取功能
  - 获取文档原始内容 (`get_feishu_doc_raw`)
  - 获取文档元数据 (`get_feishu_doc_info`)
- 支持飞书机器人消息功能
  - 发送文本消息 (`send_feishu_text_message`)
  - 发送交互卡片 (`send_feishu_card`)
- 双模式支持
  - STDIO模式用于CLI环境
  - HTTP模式用于Web服务
- 模块化架构，便于扩展

### 改进

- 完善错误处理机制
- 优化API客户端结构
- 改进服务器日志系统

### 修复

- 首次发布，暂无修复项 