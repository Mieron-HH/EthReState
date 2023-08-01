import express, { Request, Response } from "express";

// importing models
import { Property } from "../../models/property";

interface RangeValues {
	$lte?: string;
	$gte?: string;
}

interface QueryParams {
	minted: boolean;
	listed: boolean;
	sold: boolean;
	cancelled: boolean;
	street?: string | RegExp;
	city?: string | RegExp;
	state?: string;
	bedroomNumber?: string;
	bathroomNumber?: string;
	price?: RangeValues;
	size?: RangeValues;
}

const router = express.Router();

router.post(
	"/api/property/getProperties",
	async (req: Request, res: Response) => {
		const {
			street,
			city,
			state,
			bedroomNumber,
			bathroomNumber,
			minPrice,
			maxPrice,
			minSize,
			maxSize,
		} = req.body;

		const queryParams: QueryParams = {
			minted: true,
			listed: true,
			sold: false,
			cancelled: false,
		};

		if (street) queryParams.street = new RegExp(street, "i");
		if (city) queryParams.city = new RegExp(city, "i");
		if (state) queryParams.state = state;
		if (bedroomNumber) queryParams.bedroomNumber = bedroomNumber;
		if (bathroomNumber) queryParams.bathroomNumber = bathroomNumber;
		if (minPrice || maxPrice) {
			queryParams.price = {};

			if (minPrice) queryParams.price["$gte"] = minPrice;
			if (maxPrice) queryParams.price["$lte"] = maxPrice;
		}
		if (minSize || maxSize) {
			queryParams.size = {};

			if (minSize) queryParams.size["$gte"] = minSize;
			if (maxSize) queryParams.size["$lte"] = maxSize;
		}

		const properties = await Property.find(queryParams).populate("seller");

		return res.status(200).send(properties);
	}
);

export { router as GetPropertiesRouter };
