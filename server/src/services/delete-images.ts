import { Request } from "express";
import fs from "fs";
import path from "path";

export class DeleteImages {
	static deleteMultipleImages = async (req: Request) => {
		for (let index in req.files) {
			// @ts-ignore
			const image = req.files[index];

			try {
				fs.unlinkSync(path.join("properties/", image.filename!));
				// File deleted successfully
			} catch (error) {
				console.error(error);
				// Handle the error here
			}
		}
	};

	static deleteSingleImage = async (req: Request) => {
		if (req.file) {
			// @ts-ignore
			const image = req.file;

			try {
				fs.unlinkSync(path.join("properties/", image.filename!));
				// File deleted successfully
			} catch (error) {
				console.error(error);
				// Handle the error here
			}
		}
	};
}
