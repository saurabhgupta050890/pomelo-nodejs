const Hapi = require("@hapi/hapi");
const { formatData } = require("./utils/jsonformat");
const { getGithubRepo } = require("./utils/github");

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
    layout: true,
    layoutPath: "views/layout",
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

  /**
   * Route to render the gihub repo serach page
   */
  server.route({
    method: "GET",
    path: "/github",
    handler: async (request, h) => {
      let { page } = request.query;
      page = page ? parseInt(page, 10) : 1;
      const count = 10;
      const { items, total_count } = await getGithubRepo(
        "nodejs+user:google",
        page,
        count
      );
      return h.view("github", {
        items,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < Math.ceil(total_count / count) ? page + 1 : null,
      });
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
