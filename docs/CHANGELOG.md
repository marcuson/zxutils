## [0.5.1](https://github.com/marcuson/zxutils/compare/0.5.0...0.5.1) (2024-02-28)


### Bug Fixes

* Fix reboot in linux. ([d0119a3](https://github.com/marcuson/zxutils/commit/d0119a31b05c065f550c6635d660055ac9f1aecb))

# [0.5.0](https://github.com/marcuson/zxutils/compare/0.4.0...0.5.0) (2024-02-28)


### Features

* Move reboot helper to basic plugin. ([efaa526](https://github.com/marcuson/zxutils/commit/efaa52697c219a63276b3ac7aaa99e4afa914dcc))

# [0.4.0](https://github.com/marcuson/zxutils/compare/0.3.0...0.4.0) (2023-11-29)


### Features

* **zxman:** Add command to show version. ([50fd35f](https://github.com/marcuson/zxutils/commit/50fd35f4aa3d8bc81446637af09da3455ed8bcb6))

# [0.3.0](https://github.com/marcuson/zxutils/compare/0.2.0...0.3.0) (2023-11-29)


### Features

* **zxman:** Add pack commands to create tarballs of scripts. ([28ae1cd](https://github.com/marcuson/zxutils/commit/28ae1cddcfcc41c45d83e6b9b0370e08485c74f3))
* **zxman:** Add possibility to install encrypted tarballs. ([5eb77ed](https://github.com/marcuson/zxutils/commit/5eb77ed2f9d11f3d01e32873c7d91ade4c7ac2a5))

# [0.2.0](https://github.com/marcuson/zxutils/compare/0.1.1...0.2.0) (2023-11-28)


### Features

* **zxman:** Allow to run script from local repo dir. ([69e0950](https://github.com/marcuson/zxutils/commit/69e095025e50dafd34fbbbf0b127265cbfa86d07))
* **zxman:** Install from tarball (replace zip). ([f4ec266](https://github.com/marcuson/zxutils/commit/f4ec266ba461adea1c42d4c851573551ec5da102))

## [0.1.1](https://github.com/marcuson/zxutils/compare/0.1.0...0.1.1) (2023-11-28)


### Bug Fixes

* **zxman:** Fix CLI invocation on Windows. ([eb7e923](https://github.com/marcuson/zxutils/commit/eb7e92377d8150ec05070e45e5dde51b46c479be))

# [0.1.0](https://github.com/marcuson/zxutils/compare/0.0.0...0.1.0) (2023-11-28)


### Bug Fixes

* Fix log indent. ([cf5f688](https://github.com/marcuson/zxutils/commit/cf5f6880819bcb2f2fe5fc2e698e0929a6d1ed10))
* **WinPlugin:** Do not recreate shortcut if already present. ([c7822f0](https://github.com/marcuson/zxutils/commit/c7822f0b216032ef1ea314cb3fb1d6e25c2e307c))
* **WinPlugin:** Fix UAC status change. ([1bc435f](https://github.com/marcuson/zxutils/commit/1bc435f11dbf913268c1370f648046d3f46332cd))
* **zxman:** Fix options pass to script via `zxman run`. ([91329ed](https://github.com/marcuson/zxutils/commit/91329ed0eca7395dcbb6b1a622e8ceb6c63d4c9f))


### Features

* Add BasicPlugin method to copy file. ([7a6de3e](https://github.com/marcuson/zxutils/commit/7a6de3e052651a0126528e5963387e447dfb3ac7))
* Add CLI to run scripts. ([5cd5c99](https://github.com/marcuson/zxutils/commit/5cd5c998f9661b47803913e3b4ceb7841f960af4))
* Add copy dir utility. ([3a86339](https://github.com/marcuson/zxutils/commit/3a86339d859534c7dc625efe5f3ed0a1f2495e56))
* Add core functionalities: utils, plugins, step tracking. ([9f09cce](https://github.com/marcuson/zxutils/commit/9f09cce88bcb2af5ffc7a176f3c578e8080ee956))
* Add runAsPowershell functionality for WinPlugin. ([869b330](https://github.com/marcuson/zxutils/commit/869b330c4f6ae3cb80866aa985317d012a76922d))
* Add Win plugin to edit taskbar, desktop icons and ensure UNC connection. ([219438e](https://github.com/marcuson/zxutils/commit/219438e4d1dd9783e186b21aedb883ab7bf71cf7))
* Add WinPlugin method to restore classic right click menu. ([4041adb](https://github.com/marcuson/zxutils/commit/4041adb73de2b34ec33ebca8993cbc3f001fe748))
* Basic implementation of install and list commands of zxman. ([644fe2d](https://github.com/marcuson/zxutils/commit/644fe2d34ec0ccb0bbd4bd7ef6870c0d331500c5))
* **WinPlugin:** Add askRestart method. ([b165dae](https://github.com/marcuson/zxutils/commit/b165dae674e4fe09ca5fa4f61526765aa1cd2918))
* **WinPlugin:** Add createShortcut utility. ([191e7c3](https://github.com/marcuson/zxutils/commit/191e7c34ca06b4b15c2cf290a78760b0426e78f4))
* **WinPlugin:** Add utility to manipulate PATH env var. ([88ee6ce](https://github.com/marcuson/zxutils/commit/88ee6ce42135e97574651513d493d7f7ef8f49f1))
