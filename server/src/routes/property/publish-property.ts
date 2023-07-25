import express, { Request, Response } from "express";
import { body } from "express-validator";
var web3 = require("web3");
import multer from "multer";
import fs from "fs";
import path from "path";

// importing models and services
import { User } from "../../models/user";
import { Property, ImageAttr } from "../../models/property";
import { validateImages } from "../../services/validate-images";
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
		body("street").notEmpty().withMessage("Street must be provided"),
		body("city").notEmpty().withMessage("City must be provided"),
		body("state")
			.notEmpty()
			.withMessage("State must be provided")
			.custom((input) => input.length === 2)
			.withMessage("State must be in 2 letters form"),
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
		if (!existingUser) {
			await DeleteImages.deleteImage(req);
			throw new BadRequestError("User not found");
		}

		const {
			owner,
			price,
			size,
			street,
			city,
			state,
			bathroomNumber,
			bedroomNumber,
		} = req.body;

		const propertyImages: ImageAttr[] = [];
		let thumbnail: ImageAttr = {
			data: Buffer.from([]),
			contentType: "",
		};

		for (let index in req.files) {
			// @ts-ignore
			const image = req.files[index];
			const imageBuffer = fs.readFileSync(
				path.join("properties/" + image.filename)
			) as Buffer;

			if (image.fieldname === "propertyImage") {
				const propertyImage: ImageAttr = {
					data: imageBuffer,
					contentType: image.mimetype,
				};

				// @ts-ignore
				propertyImages.push(propertyImage);
			} else {
				thumbnail = {
					data: imageBuffer,
					contentType: image.mimetype,
				};
			}
		}

		await DeleteImages.deleteImage(req);

		try {
			const property = Property.build({
				seller: existingUser.id,
				owner,
				street,
				city,
				state,
				price,
				size,
				bedroomNumber,
				bathroomNumber,
				thumbnail,
				images: propertyImages,
				minted: false,
				listed: false,
				locked: false,
				sold: false,
				cancelled: false,
				likes: [],
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
