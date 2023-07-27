import express, { Response } from "express";

// importing models
import { Property } from "../../models/property";

const router = express.Router();

router.get("/api/property/popular", async (res: Response) => {
	const popularProperties = await Property.find({
		minted: true,
		listed: true,
		sold: false,
	})
		.sort({
			likes: -1,
			views: -1,
		})
		.limit(20);

	return res.status(200).send(popularProperties);
});

export { router as GetPopularPropertiesRouter };
