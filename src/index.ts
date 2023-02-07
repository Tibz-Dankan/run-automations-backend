import { server } from "./app";

const startApp = () => {
  const port = process.env.PORT || 5000;
  // connect mongo here
  server.listen(port, () =>
    console.log(`server started and running on port ${port}...`)
  );
};

startApp();
