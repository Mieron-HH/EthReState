import express, { Request, Response } from "express";
import mongoose from "mongoose";

// importing models
import { User } from "../../models/user";
import { Property } from "../../models/property";

// importing types, middlewares, and errors
import { BadRequestError } from "@kmalae.ltd/library";

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
}

const router = express.Router();

router.post(
	"/api/property/getProperties",
	async (req: Request, res: Response) => {
		const { street, city, state, bedroomNumber, bathroomNumber } = req.body;

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

		const properties = await Property.find(queryParams).populate("seller");

		return res.status(200).send(properties);
	}
);

export { router as GetPropertiesRouter };
