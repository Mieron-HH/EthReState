import mongoose from "mongoose";
const hre = require("hardhat");
import app from "./app";
import * as dotnev from "dotenv";
dotnev.config();

import { NFTStorage, File } from "nft.storage";
var client: NFTStorage;

app.listen(5000, async () => {
	if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
	if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
	if (!process.env.NFT_KEY) throw new Error("NFT_KEY must be defined");

	await mongoose.connect(process.env.MONGO_URI, { dbName: "RethState" });
	console.log("Connected to MongoDB");

	client = new NFTStorage({ token: process.env.NFT_KEY });
	console.log("Connected to IPFS");

	console.log("Connected on port 5000");
});

export { client };
