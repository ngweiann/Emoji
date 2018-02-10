var config = {};

config.welcome = {
  "timeout": 3000,
  set open (val) {app.storage.write('support', val)},
  "url": "http://mybrowseraddon.com/easy-emoji.html",
  get version () {return app.storage.read('version')},
  set version (val) {app.storage.write('version', val)},
  get open () {return (app.storage.read('support') !== undefined) ? app.storage.read('support') : true}
};