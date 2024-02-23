const FILE_PATH = process.env.FILE_PATH || './temp'; // 运行文件夹，节点文件存放目录
const UUID = process.env.UUID || '89c13786-25aa-4520-b2e7-12cd60fb5202';
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || ''; // 固定隧道域名，留空即启用临时隧道
const ARGO_AUTH = process.env.ARGO_AUTH || ''; // 固定隧道json或token，留空即启用临时隧道
const CFIP = process.env.CFIP || 'government.se'; // 优选域名或优选ip
const CFPORT = process.env.CFPORT || 443; // 节点端口
const NAME = process.env.NAME || 'Vls'; // 节点名称
const port = process.env.PORT || 3000; // http服务端口，也是订阅端口，游戏玩具平台改为分配的端口，否则无法订阅
const ArgoPort = process.env.ARGO_PORT || 8080; // Argo端口，使用固定隧道token需和cf后台设置的端口对应

const express = require('express'),
  app = express(),
  axios = require('axios'),
  os = require('os'),
  fs = require('fs'),
  path = require('path'),
  {
    promisify
  } = require('util'),
  exec = promisify(require('child_process')['exec']),
  {
    execSync
  } = require('child_process');
!fs['existsSync'](FILE_PATH) ? (fs['mkdirSync'](FILE_PATH), console['log'](FILE_PATH + ' is created')) : console['log'](FILE_PATH + ' already exists');
const pathsToDelete = ['web', 'bot', 'npm', 'sub.txt', 'boot.log'];
function cleanupOldFiles() {
  pathsToDelete['forEach'](_0x3828fb => {
    const _0x303ea0 = path['join'](FILE_PATH, _0x3828fb);
    fs['unlink'](_0x303ea0, _0x4fa9b8 => {
      _0x4fa9b8 ? console['error']('Skip Delete ' + _0x303ea0) : console['log'](_0x303ea0 + ' deleted');
    });
  });
}
cleanupOldFiles(), app['get']('/', function (_0x13895c, _0x4f8351) {
  _0x4f8351['send']('Hello world!');
});
function generateConfig() {
  const _0x292da0 = {
    'log': {
      'access': '/dev/null',
      'error': '/dev/null',
      'loglevel': 'none'
    },
    'inbounds': [{
      'port': ArgoPort,
      'protocol': 'vless',
      'settings': {
        'clients': [{
          'id': UUID,
          'flow': 'xtls-rprx-vision'
        }],
        'decryption': 'none',
        'fallbacks': [{
          'dest': 0xbb9
        }, {
          'path': '/vless',
          'dest': 0xbba
        }, {
          'path': '/vmess',
          'dest': 0xbbb
        }, {
          'path': '/trojan',
          'dest': 0xbbc
        }]
      },
      'streamSettings': {
        'network': 'tcp'
      }
    }, {
      'port': 0xbb9,
      'listen': '127.0.0.1',
      'protocol': 'vless',
      'settings': {
        'clients': [{
          'id': UUID
        }],
        'decryption': 'none'
      },
      'streamSettings': {
        'network': 'ws',
        'security': 'none'
      }
    }, {
      'port': 0xbba,
      'listen': '127.0.0.1',
      'protocol': 'vless',
      'settings': {
        'clients': [{
          'id': UUID,
          'level': 0x0
        }],
        'decryption': 'none'
      },
      'streamSettings': {
        'network': 'ws',
        'security': 'none',
        'wsSettings': {
          'path': '/vless'
        }
      },
      'sniffing': {
        'enabled': true,
        'destOverride': ['http', 'tls', 'quic'],
        'metadataOnly': false
      }
    }, {
      'port': 0xbbb,
      'listen': '127.0.0.1',
      'protocol': 'vmess',
      'settings': {
        'clients': [{
          'id': UUID,
          'alterId': 0x0
        }]
      },
      'streamSettings': {
        'network': 'ws',
        'wsSettings': {
          'path': '/vmess'
        }
      },
      'sniffing': {
        'enabled': true,
        'destOverride': ['http', 'tls', 'quic'],
        'metadataOnly': false
      }
    }, {
      'port': 0xbbc,
      'listen': '127.0.0.1',
      'protocol': 'trojan',
      'settings': {
        'clients': [{
          'password': UUID
        }]
      },
      'streamSettings': {
        'network': 'ws',
        'security': 'none',
        'wsSettings': {
          'path': '/trojan'
        }
      },
      'sniffing': {
        'enabled': true,
        'destOverride': ['http', 'tls', 'quic'],
        'metadataOnly': false
      }
    }],
    'dns': {
      'servers': ['https+local://8.8.8.8/dns-query']
    },
    'outbounds': [{
      'protocol': 'freedom'
    }, {
      'tag': 'WARP',
      'protocol': 'wireguard',
      'settings': {
        'secretKey': 'YFYOAdbw1bKTHlNNi+aEjBM3BO7unuFC5rOkMRAz9XY=',
        'address': ['172.16.0.2/32', '2606:4700:110:8a36:df92:102a:9602:fa18/128'],
        'peers': [{
          'publicKey': 'bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=',
          'allowedIPs': ['0.0.0.0/0', '::/0'],
          'endpoint': '162.159.193.10:2408'
        }],
        'reserved': [0x4e, 0x87, 0x4c],
        'mtu': 0x500
      }
    }],
    'routing': {
      'domainStrategy': 'AsIs',
      'rules': [{
        'type': 'field',
        'domain': ['domain:openai.com', 'domain:ai.com'],
        'outboundTag': 'WARP'
      }]
    }
  };
  fs['writeFileSync'](path['join'](FILE_PATH, 'config.json'), JSON['stringify'](_0x292da0, null, 0x2));
}
generateConfig();
function getSystemArchitecture() {
  const _0x3ca8ce = os['arch']();
  return _0x3ca8ce === 'arm' || _0x3ca8ce === 'arm64' ? 'arm' : 'amd';
}
function downloadFile(_0x1f9e6b, _0x10cdf3, _0x34827b) {
  const _0x59035b = path['join'](FILE_PATH, _0x1f9e6b),
    _0x1e0504 = fs['createWriteStream'](_0x59035b);
  axios({
    'method': 'get',
    'url': _0x10cdf3,
    'responseType': 'stream'
  })['then'](_0x39591e => {
    _0x39591e['data'].pipe(_0x1e0504), _0x1e0504['on']('finish', () => {
      _0x1e0504['close'](), console['log']('Download ' + _0x1f9e6b + ' successfully'), _0x34827b(null, _0x1f9e6b);
    }), _0x1e0504['on']('error', _0x149869 => {
      fs['unlink'](_0x59035b, () => {});
      const _0x51bc6c = 'Download ' + _0x1f9e6b + ' failed: ' + _0x149869['message'];
      console['error'](_0x51bc6c), _0x34827b(_0x51bc6c);
    });
  })['catch'](_0x3b1a26 => {
    const _0x1016d6 = 'Download ' + _0x1f9e6b + ' failed: ' + _0x3b1a26['message'];
    console['error'](_0x1016d6), _0x34827b(_0x1016d6);
  });
}
async function downloadFilesAndRun() {
  const _0x16dc52 = getSystemArchitecture(),
    _0x498ca3 = getFilesForArchitecture(_0x16dc52);
  if (_0x498ca3['length'] === 0x0) {
    console['log']('Can\'t find a file for the current architecture');
    return;
  }
  const _0x2f0512 = _0x498ca3['map'](_0x4f446e => {
    return new Promise((_0x4fcaf9, _0x277bf4) => {
      downloadFile(_0x4f446e['fileName'], _0x4f446e['fileUrl'], (_0x113fd0, _0x3aeec4) => {
        _0x113fd0 ? _0x277bf4(_0x113fd0) : _0x4fcaf9(_0x3aeec4);
      });
    });
  });
  try {
    await Promise['all'](_0x2f0512);
  } catch (_0xa205b9) {
    console['error']('Error downloading files:', _0xa205b9);
    return;
  }
  function _0x317488(_0x496dfb) {
    const _0x3a3013 = 0x1fd;
    _0x496dfb['forEach'](_0x55a91a => {
      const _0x4c7b41 = path['join'](FILE_PATH, _0x55a91a);
      fs['chmod'](_0x4c7b41, _0x3a3013, _0x4eb838 => {
        _0x4eb838 ? console['error']('Empowerment failed for ' + _0x4c7b41 + ': ' + _0x4eb838) : console['log']('Empowerment success for ' + _0x4c7b41 + ': ' + _0x3a3013['toString'](0x8));
      });
    });
  }
  const _0x1bac70 = ['./npm', './web', './bot'];
  _0x317488(_0x1bac70);
  let _0x285d08 = '';
  const _0x93d69f = 'nohup ' + FILE_PATH + '/web -c ' + FILE_PATH + '/config.json >/dev/null 2>&1 &';
  try {
    await exec(_0x93d69f), console['log']('web is running'), await new Promise(_0x1d13cd => setTimeout(_0x1d13cd, 0x3e8));
  } catch (_0x45e183) {
    console['error']('web running error: ' + _0x45e183);
  }
  if (fs['existsSync'](path['join'](FILE_PATH, 'bot'))) {
    let _0x1a6ac9;
    if (ARGO_AUTH['match'](/^[A-Z0-9a-z=]{120,250}$/)) _0x1a6ac9 = 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ' + ARGO_AUTH;else ARGO_AUTH['match'](/TunnelSecret/) ? _0x1a6ac9 = 'tunnel --edge-ip-version auto --config ' + FILE_PATH + '/tunnel.yml run' : _0x1a6ac9 = 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ' + FILE_PATH + '/boot.log --loglevel info --url http://localhost:' + ArgoPort;
    try {
      await exec('nohup ' + FILE_PATH + '/bot ' + _0x1a6ac9 + ' >/dev/null 2>&1 &'), console['log']('bot is running'), await new Promise(_0x39a602 => setTimeout(_0x39a602, 0x7d0));
    } catch (_0x71a024) {
      console['error']('Error executing command: ' + _0x71a024);
    }
  }
  await new Promise(_0x3438da => setTimeout(_0x3438da, 0x1388));
}
function getFilesForArchitecture(_0x5e2ae8) {
  if (_0x5e2ae8 === 'arm') return [{
    'fileName': 'npm',
    'fileUrl': 'https://github.com/eooce/test/releases/download/ARM/swith'
  }, {
    'fileName': 'web',
    'fileUrl': 'https://github.com/eooce/test/releases/download/ARM/web'
  }, {
    'fileName': 'bot',
    'fileUrl': 'https://github.com/eooce/test/releases/download/arm64/server'
  }];else {
    if (_0x5e2ae8 === 'amd') return [{
      'fileName': 'npm',
      'fileUrl': 'https://github.com/eooce/test/releases/download/amd64/npm'
    }, {
      'fileName': 'web',
      'fileUrl': 'https://github.com/eooce/test/releases/download/amd64/web'
    }, {
      'fileName': 'bot',
      'fileUrl': 'https://github.com/eooce/test/releases/download/amd64/bot'
    }];
  }
  return [];
}
function argoType() {
  if (!ARGO_AUTH || !ARGO_DOMAIN) {
    console['log']('ARGO_DOMAIN or ARGO_AUTH variable is empty, use quick tunnels');
    return;
  }
  if (ARGO_AUTH['includes']('TunnelSecret')) {
    fs['writeFileSync'](path['join'](FILE_PATH, 'tunnel.json'), ARGO_AUTH);
    const _0x16a41c = '\n  tunnel: ' + ARGO_AUTH['split']('"')[0xb] + '\n  credentials-file: ' + path['join'](FILE_PATH, 'tunnel.json') + '\n  protocol: http2\n  \n  ingress:\n    - hostname: ' + ARGO_DOMAIN + '\n      service: http://localhost:' + ArgoPort + '\n      originRequest:\n        noTLSVerify: true\n    - service: http_status:404\n  ';
    fs['writeFileSync'](path['join'](FILE_PATH, 'tunnel.yml'), _0x16a41c);
  } else console['log']('ARGO_AUTH mismatch TunnelSecret,use token connect to tunnel');
}
argoType();
async function extractDomains() {
  let _0x4bc159;
  if (ARGO_AUTH && ARGO_DOMAIN) _0x4bc159 = ARGO_DOMAIN, console['log']('ARGO_DOMAIN:', _0x4bc159), await _0x177f89(_0x4bc159);else try {
    const _0x28f667 = fs['readFileSync'](path['join'](FILE_PATH, 'boot.log'), 'utf-8'),
      _0x143a69 = _0x28f667['split']('\n'),
      _0x3c58f9 = [];
    _0x143a69['forEach'](_0x1ec21f => {
      const _0x369b91 = _0x1ec21f['match'](/https?:\/\/([^ ]*trycloudflare\.com)\/?/);
      if (_0x369b91) {
        const _0x5eabd7 = _0x369b91[0x1];
        _0x3c58f9['push'](_0x5eabd7);
      }
    });
    if (_0x3c58f9['length'] > 0x0) _0x4bc159 = _0x3c58f9[0x0], console['log']('ArgoDomain:', _0x4bc159), await _0x177f89(_0x4bc159);else {
      console['log']('ArgoDomain not found, re-running bot to obtain ArgoDomain'), fs['unlinkSync'](path['join'](FILE_PATH, 'boot.log')), await new Promise(_0x3f33c3 => setTimeout(_0x3f33c3, 0x7d0));
      const _0x5a35fc = 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ' + FILE_PATH + '/boot.log --loglevel info --url http://localhost:' + ArgoPort;
      try {
        await exec('nohup ' + path['join'](FILE_PATH, 'bot') + ' ' + _0x5a35fc + ' >/dev/null 2>&1 &'), console['log']('bot is running.'), await new Promise(_0x6ae3a2 => setTimeout(_0x6ae3a2, 0xbb8)), await extractDomains();
      } catch (_0x514fb7) {
        console['error']('Error executing command: ' + _0x514fb7);
      }
    }
  } catch (_0x1ba38f) {
    console['error']('Error reading boot.log:', _0x1ba38f);
  }
  async function _0x177f89(_0x52c7ba) {
    const _0x597134 = execSync('curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'', {
        'encoding': 'utf-8'
      }),
      _0x2c2adc = _0x597134['trim']();
    return new Promise(_0x1d6ffc => {
      setTimeout(() => {
        const _0x5db7a3 = {
            'v': '2',
            'ps': NAME + '-' + _0x2c2adc,
            'add': CFIP,
            'port': CFPORT,
            'id': UUID,
            'aid': '0',
            'scy': 'none',
            'net': 'ws',
            'type': 'none',
            'host': _0x52c7ba,
            'path': '/vmess?ed=2048',
            'tls': 'tls',
            'sni': _0x52c7ba,
            'alpn': ''
          },
          _0x2beeae = '\nvless://' + UUID + '@' + CFIP + ':' + CFPORT + '?encryption=none&security=tls&sni=' + _0x52c7ba + '&type=ws&host=' + _0x52c7ba + '&path=%2Fvless?ed=2048#' + NAME + '-' + _0x2c2adc + '\n  \nvmess://' + Buffer['from'](JSON['stringify'](_0x5db7a3))['toString']('base64') + '\n  \ntrojan://' + UUID + '@' + CFIP + ':' + CFPORT + '?security=tls&sni=' + _0x52c7ba + '&type=ws&host=' + _0x52c7ba + '&path=%2Ftrojan?ed=2048#' + NAME + '-' + _0x2c2adc + '\n    ';
        console['log'](Buffer['from'](_0x2beeae)['toString']('base64'));
        const _0x2c45a5 = path['join'](FILE_PATH, 'sub.txt');
        fs['writeFileSync'](_0x2c45a5, Buffer['from'](_0x2beeae)['toString']('base64')), console['log']('File saved successfully'), console['log']('Thank you for using this script,enjoy!'), app['get']('/sub', (_0x5bd12b, _0xfa14e0) => {
          const _0x4e007a = Buffer['from'](_0x2beeae)['toString']('base64');
          _0xfa14e0['set']('Content-Type', 'text/plain; charset=utf-8'), _0xfa14e0['send'](_0x4e007a);
        }), _0x1d6ffc(_0x2beeae);
      }, 0x7d0);
    });
  }
}
const bootLogPath = path['join'](FILE_PATH, 'boot.log'),
  configPath = path['join'](FILE_PATH, 'config.json');
function cleanFiles() {
  setTimeout(() => {
    exec('rm -rf ' + bootLogPath + ' ' + configPath, (_0x4a5b54, _0x5a19df, _0xda607e) => {
      if (_0x4a5b54) {
        console['error']('Error while deleting files: ' + _0x4a5b54);
        return;
      }
      console['log']('App is running'), console['log']('Thank you for using this script,enjoy!');
    });
  }, 0x186a0);
}
cleanFiles();
let hasLoggedEmptyMessage = false;
async function startserver() {
  await downloadFilesAndRun(), await extractDomains(), visitProjectPage();
}
startserver(), app['listen'](port, () => console['log']('Http server is running on: ' + port + '!'));