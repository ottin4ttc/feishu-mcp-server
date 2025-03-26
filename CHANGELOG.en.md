# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2023-06-01

### Added

- Initial version release
- FeiShu document reading capabilities
  - Get document raw content (`get_feishu_doc_raw`)
  - Get document metadata (`get_feishu_doc_info`)
- FeiShu bot messaging capabilities
  - Send text messages (`send_feishu_text_message`)
  - Send interactive cards (`send_feishu_card`)
- Dual mode support
  - STDIO mode for CLI environments
  - HTTP mode for web services
- Modular architecture for easy extension

### Improved

- Comprehensive error handling mechanisms
- Optimized API client structure
- Enhanced server logging system

### Fixed

- Initial release, no fixes yet 