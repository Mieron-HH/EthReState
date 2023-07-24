import { NextFunction, Request, Response } from "express";

// importing types, middlewares, and errors
import { BadRequestError } from "@kmalae.ltd/library";
import { DeleteImages } from "./delete-images";

export const validateImages = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const accepted_format = ["image/jpeg", "image/jpg", "image/png"];
	let image_count = 0;
	let thumbnail_image_found = false;

	if (!req.files || Object.keys(req.files).length === 0) {
		await DeleteImages.deleteImage(req);
		throw new BadRequestError("Property images required");
	}

	for (let index in req.files) {
		// @ts-ignore
		const image = req.files[index]!;
		if (!["propertyImage", "thumbnailImage"].includes(image.fieldname)) {
			await DeleteImages.deleteImage(req);
			throw new BadRequestError("Property images required");
		}

		if (!accepted_format.includes(image.mimetype.toLowerCase())) {
			await DeleteImages.deleteImage(req);
			throw new BadRequestError("Invalid image format");
		}

		if (image.fieldname === "thumbnailImage") thumbnail_image_found = true;
		else image_count++;
	}

	if (!thumbnail_image_found || image_count < 3) {
		await DeleteImages.deleteImage(req);
		if (!thumbnail_image_found)
			throw new BadRequestError("Default image required");
		else throw new BadRequestError("Mininum three property images required");
	}

	next();
};
