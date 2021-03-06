const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/templates", {
      target: "http://api.dev.edenlab.com.ua"
    })
  );
  app.use(proxy("/auth", { target: "http://localhost:4000/" }));
};
