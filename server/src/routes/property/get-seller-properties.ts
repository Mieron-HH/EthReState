import express, { Request, Response } from "express";

// importing models
import { User } from "../../models/user";
import { Property } from "../../models/property";

// importing types, middlewares, and errors
import { BadRequestError, currentUser, requireAuth } from "@kmalae.ltd/library";

interface QueryParams {
	seller: string;
	minted?: boolean;
	listed?: boolean;
	locked?: boolean;
	sold?: boolean;
	cancelled?: boolean;
	city?: string | RegExp;
	bedroomNumber?: string;
	bathroomNumber?: string;
}

const router = express.Router();

router.post(
	"/api/property/getSellerProperties",
	currentUser,
	requireAuth,
	async (req: Request, res: Response) => {
		const { email } = req.currentUser!;
		const existingUser = await User.findOne({ email });
		if (!existingUser) throw new BadRequestError("User not found");

		const { propertyStatus, city, bedroomNumber, bathroomNumber } = req.body;
		const queryParams: QueryParams = {
			seller: existingUser._id,
		};

		if (propertyStatus) {
			switch (propertyStatus) {
				case "minted":
					queryParams.minted = true;
					break;
				case "listed":
					queryParams.minted = true;
					queryParams.listed = true;
					break;
				case "locked":
					queryParams.minted = true;
					queryParams.listed = true;
					queryParams.locked = true;
					break;
				case "sold":
					queryParams.minted = true;
					queryParams.listed = true;
					queryParams.locked = true;
					queryParams.sold = true;
					break;
				case "cancelled":
					queryParams.minted = true;
					queryParams.listed = false;
					queryParams.cancelled = true;
					break;
			}
		}

		if (city) queryParams.city = new RegExp(city, "i");
		if (bedroomNumber) queryParams.bedroomNumber = bedroomNumber;
		if (bathroomNumber) queryParams.bathroomNumber = bathroomNumber;

		const properties = await Property.find(queryParams);

		return res.status(200).send(properties);
	}
);

export { router as GetSellerPropertiesRouter };
