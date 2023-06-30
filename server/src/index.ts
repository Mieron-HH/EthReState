import mongoose from "mongoose";
import app from "./app";
import * as dotnev from "dotenv";
dotnev.config();

app.listen(3000, async () => {
	console.log("Server started on port 3000");
});
