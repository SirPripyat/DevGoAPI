import app from "./app";

function server() {
  const PORT = 5500;

  try {
    app.listen(PORT, async () => {
      console.log(`Starting server on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      `Error when try start the server on the port: ${PORT}. Error: `,
      error
    );
  }
}

server();
