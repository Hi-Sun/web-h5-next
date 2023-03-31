let _openInstallReadyPromises: Promise<unknown> | null = null;

export function initOpenInstall(data = {}, options: any) {
  if (!_openInstallReadyPromises) {
    const date = new Date();
    const loadOpenInstall = (t: string) => loadScript(`https://web.cdn.openinstall.io/openinstall.js?t=${t}`);
    _openInstallReadyPromises = loadOpenInstall(`${date.getDate()}`)
      .catch(() => {
        // 加载失败，重试一次
        return loadOpenInstall(`${date.getMinutes()}${date.getSeconds()}`);
      })
      .then(() => {
        return new Promise((resolve) => {
          //@ts-ignore
          new OpenInstall(
            {
              appKey: 'appKey',
              onready: function () {
                const { autoOpen = true } = options;
                autoOpen && this.schemeWakeup();
                resolve(this);
              },
            },
            data,
          );
        });
      })
      .catch((e) => {
        console.error('initOpenInstall: failed', e);
        _openInstallReadyPromises = null;
      });
  }
  return _openInstallReadyPromises;
}

// 触发唤起
export function openOrInstall(data?: {}, options?: {}) {
  initOpenInstall(data, options)
    .then((openInstall: any) => {
      openInstall.wakeupOrInstall();
    })
    .catch(() => {
      console.error('wakeupOrInstall: failed');
    });
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const sDom = document.createElement('script');
    const unlisten = () => {
      //@ts-ignore
      sDom.onload = sDom.onreadystatechange = null;
    };
    //@ts-ignore
    sDom.onload = sDom.onreadystatechange = function () {
      //@ts-ignore
      if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
        unlisten();
        resolve();
      }
    };
    sDom.onerror = function () {
      unlisten();
      reject();
    };
    sDom.src = src;
    sDom.setAttribute('type', 'text/javascript');
    document.body.appendChild(sDom);
  });
}