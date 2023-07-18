import { Request } from "express";
import fs from "fs";
import path from "path";

export class DeleteImages {
	static deleteImage = async (req: Request) => {
		for (let index in req.files) {
			// @ts-ignore
			const image = req.files[index];
			// @ts-ignore
			fs.unlink(path.join("properties/" + image.filename!), (error) => {
				if (error) console.log(error);
			});
		}
	};
}
