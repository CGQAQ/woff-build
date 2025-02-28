const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = require('child_process').execSync('which ldd').toString().trim();
      return readFileSync(lddPath, 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !glibcVersionRuntime
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'woff-build.android-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./woff-build.android-arm64.node')
          } else {
            nativeBinding = require('@napi-rs/woff-build-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, 'woff-build.android-arm-eabi.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./woff-build.android-arm-eabi.node')
          } else {
            nativeBinding = require('@napi-rs/woff-build-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, 'woff-build.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./woff-build.win32-x64-msvc.node')
          } else {
            nativeBinding = require('@napi-rs/woff-build-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, 'woff-build.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./woff-build.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('@napi-rs/woff-build-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'woff-build.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./woff-build.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('@napi-rs/woff-build-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    localFileExisted = existsSync(join(__dirname, 'woff-build.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./woff-build.darwin-universal.node')
      } else {
        nativeBinding = require('@napi-rs/woff-build-darwin-universal')
      }
      break
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'woff-build.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./woff-build.darwin-x64.node')
          } else {
            nativeBinding = require('@napi-rs/woff-build-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'woff-build.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./woff-build.darwin-arm64.node')
          } else {
            nativeBinding = require('@napi-rs/woff-build-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'woff-build.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./woff-build.freebsd-x64.node')
      } else {
        nativeBinding = require('@napi-rs/woff-build-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'woff-build.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./woff-build.linux-x64-musl.node')
            } else {
              nativeBinding = require('@napi-rs/woff-build-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'woff-build.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./woff-build.linux-x64-gnu.node')
            } else {
              nativeBinding = require('@napi-rs/woff-build-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'woff-build.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./woff-build.linux-arm64-musl.node')
            } else {
              nativeBinding = require('@napi-rs/woff-build-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'woff-build.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./woff-build.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('@napi-rs/woff-build-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = existsSync(
          join(__dirname, 'woff-build.linux-arm-gnueabihf.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./woff-build.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require('@napi-rs/woff-build-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { convertTTFToWOFF2, convertTTFToWOFF2Async, convertWOFF2ToTTF, convertWOFF2ToTTFAsync } = nativeBinding

module.exports.convertTTFToWOFF2 = convertTTFToWOFF2
module.exports.convertTTFToWOFF2Async = convertTTFToWOFF2Async
module.exports.convertWOFF2ToTTF = convertWOFF2ToTTF
module.exports.convertWOFF2ToTTFAsync = convertWOFF2ToTTFAsync
