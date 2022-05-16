"use strict";

const Path = require("path");
const Hapi = require("@hapi/hapi");
const Hoek = require("@hapi/hoek");
const { formatData } = require("./utils/jsonformat");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  await server.register(require("@hapi/vision"));

  server.views({
    engines: {
      html: require("handlebars"),
    },
    relativeTo: __dirname,
    path: "views",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h.view("index");
    },
  });

  /**
   * Health check route.
   */
  server.route({
    method: "GET",
    path: "/health/check",
    handler: (request, h) => {
      return "Server Running";
    },
  });

  server.route({
    method: "POST",
    path: "/data",
    handler: (request, h) => {
      return formatData(request.payload);
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
