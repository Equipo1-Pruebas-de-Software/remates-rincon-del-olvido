import createApp from "./server.js";

const server = createApp().then(app => {
	app.listen(process.env.PORT, () => {
		console.log(`Backend corriendo en http://localhost:${process.env.PORT}`)
	})
});

export default server;