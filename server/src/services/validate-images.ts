import { NextFunction, Request, Response } from "express";

// importing types, middlewares, and errors
import { BadRequestError } from "@kmalae.ltd/library";

export const validateImages = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const accepted_format = ["image/jpeg", "image/jpg", "image/png"];
	let image_count = 0;
	let default_image_found = false;

	if (!req.files || Object.keys(req.files).length === 0)
		throw new BadRequestError("Property images required");

	for (let index in req.files) {
		// @ts-ignore
		const image = req.files[index]!;
		if (!["propertyImage", "defaultImage"].includes(image.fieldname))
			throw new BadRequestError("Property images required");

		if (!accepted_format.includes(image.mimetype.toLowerCase()))
			throw new BadRequestError("Invalid image format");

		if (image.fieldname === "defaultImage") default_image_found = true;
		else image_count++;
	}

	if (!default_image_found) throw new BadRequestError("Default image required");
	if (image_count < 3)
		throw new BadRequestError("Mininum three images required");

	next();
};
