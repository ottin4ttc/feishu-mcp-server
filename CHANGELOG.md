# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2023-06-01

### Added

- Initial release
- Support for FeiShu document reading
  - Get raw document content (`get_feishu_doc_raw`)
  - Get document metadata (`get_feishu_doc_info`)
- Support for FeiShu bot messaging
  - Send text messages (`send_feishu_text_message`)
  - Send interactive cards (`send_feishu_card`)
- Dual mode support
  - STDIO mode for CLI environment
  - HTTP mode for web services
- Modular architecture for easy extension

### Improved

- Enhanced error handling mechanism
- Optimized API client structure
- Improved server logging system

### Fixed

- Initial release, no fixes yet 