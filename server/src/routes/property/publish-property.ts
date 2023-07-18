import express, { Request, Response } from "express";
import { body } from "express-validator";
var web3 = require("web3");
import { File } from "nft.storage";
import multer from "multer";
import fs from "fs";
import path from "path";
import { client } from "../../index";
import { validateImages } from "../../services/validate-images";

// importing models and services
import { User } from "../../models/user";
import { Property } from "../../models/property";
import { DeleteImages } from "../../services/delete-images";

// importing types, middlewares, and errors
import {
	BadRequestError,
	currentUser,
	requireAuth,
	validateRequest,
} from "@kmalae.ltd/library";

const router = express.Router();
const upload = multer({ dest: "properties/" });

router.post(
	"/api/property/publish",
	upload.any(),
	[
		body("owner")
			.notEmpty()
			.withMessage("Owner must be provided")
			.custom((input) => web3.utils.isAddress(input))
			.withMessage("Invalid public address"),
		body("price")
			.notEmpty()
			.withMessage("Price must be provided")
			.isNumeric()
			.withMessage("Price must be in digits"),
		body("size")
			.notEmpty()
			.withMessage("Size must be provided")
			.isNumeric()
			.withMessage("Size must be in digits"),
		body("location").notEmpty().withMessage("Location must be provided"),
		body("bathroomNumber")
			.notEmpty()
			.withMessage("Bathroom number must be provided")
			.isNumeric()
			.withMessage("Bathroom number must be in digits")
			.custom((input) => input >= 0)
			.withMessage("Bathroom number cannot be negative"),
		body("bedroomNumber")
			.notEmpty()
			.withMessage("Bedroom number must be provided")
			.isNumeric()
			.withMessage("Bedroom number must be in digits")
			.custom((input) => input >= 0)
			.withMessage("Bedroom number cannot be negative"),
	],
	currentUser,
	requireAuth,
	validateRequest,
	validateImages,
	async (req: Request, res: Response) => {
		const { email } = req.currentUser!;
		const existingUser = await User.findOne({ email });
		if (!existingUser) throw new BadRequestError("User not found");

		const { owner, price, size, location, bathroomNumber, bedroomNumber } =
			req.body;

		const propertyImages = [];
		let defaultImage;

		for (let index in req.files) {
			// @ts-ignore
			const image = req.files[index];
			const imageBuffer = fs.readFileSync(
				path.join("properties/" + image.filename)
			) as Buffer;

			if (image.fieldname === "propertyImage") {
				const propertyImage = new File([imageBuffer], image.filename, {
					type: image.mimetype,
				});

				// @ts-ignore
				propertyImages.push(propertyImage);
			} else {
				defaultImage = new File([imageBuffer], image.filename, {
					type: image.mimetype,
				});
			}
		}

		await DeleteImages.deleteImage(req);

		try {
			const metadata = await client.store({
				name: "Property Data",
				description: "IPFS stored Property data",
				image: defaultImage,
				properties: {
					owner,
					price,
					size,
					location,
					bathroomNumber,
					bedroomNumber,
					propertyImages,
				},
			});

			await client.check(metadata.ipnft);

			const property = Property.build({
				seller: existingUser.id,
				owner,
				metadata,
				minted: false,
				listed: false,
				locked: false,
				sold: false,
				likes: 0,
				views: 0,
			});

			await property.save();

			return res.status(201).send(property);
		} catch (error) {
			console.error(error);
			throw new Error("Error publishing property");
		}
	}
);

export { router as PublishRouter };
