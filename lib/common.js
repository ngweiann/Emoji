window.setTimeout(function () {
  var v = config.welcome.version;
  if (!v) app.tab.open(config.welcome.url + "?v=" + app.version() + "&type=install");
  config.welcome.version = app.version();
}, config.welcome.timeout);

app.popup.receive("support", function () {app.tab.open(config.welcome.url)});