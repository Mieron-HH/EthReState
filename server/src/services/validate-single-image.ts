import { NextFunction, Request, Response } from "express";

// importing types, middlewares, and errors
import { BadRequestError } from "@kmalae.ltd/library";
import { DeleteImages } from "./delete-images";

export const validateSingleImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const accepted_format = ["image/jpeg", "image/jpg", "image/png"];

	// @ts-ignore
	if (!req.file) {
		await DeleteImages.deleteMultipleImages(req);
		throw new BadRequestError("Property image required");
	}

	// @ts-ignore
	const image = req.file!;
	if (!["propertyImage", "thumbnailImage"].includes(image.fieldname)) {
		await DeleteImages.deleteMultipleImages(req);
		throw new BadRequestError("Property image required");
	}

	if (!accepted_format.includes(image.mimetype.toLowerCase())) {
		await DeleteImages.deleteMultipleImages(req);
		throw new BadRequestError("Invalid image format");
	}

	next();
};
