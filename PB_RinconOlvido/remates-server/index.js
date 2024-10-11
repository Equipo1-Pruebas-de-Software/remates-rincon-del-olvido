import app from "./server.js";

const server = app.listen(process.env.PORT, () =>
	console.log(`Backend corriendo en http://localhost:${process.env.PORT}`)
);

export default server;