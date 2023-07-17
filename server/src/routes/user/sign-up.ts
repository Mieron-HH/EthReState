import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
var web3 = require("web3");

// importing models
import { User } from "../../models/user";

// importing types, middlewares, and errors
import { BadRequestError, validateRequest } from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/user/signup",
	[
		body("firstName")
			.notEmpty()
			.withMessage("First name must be provided")
			.isAlphanumeric()
			.withMessage("First name can only contain letters"),
		body("lastName")
			.notEmpty()
			.withMessage("Last name must be provided")
			.isAlphanumeric()
			.withMessage("Last name can only contain letters"),
		body("publicAddress")
			.optional()
			.custom((value) => {
				return web3.utils.isAddress(value);
			}),
		body("email")
			.notEmpty()
			.withMessage("Email should be provided")
			.isEmail()
			.withMessage("Invalid email"),
		body("password")
			.notEmpty()
			.withMessage("Password must be provided")
			.trim()
			.isLength({ min: 4, max: 50 })
			.withMessage("Password must be between 4 and 50 characters"),
		body("SSN")
			.notEmpty()
			.withMessage("SSN must be provided")
			.isNumeric()
			.withMessage("SSN can only contain 9 digits")
			.isLength({ min: 9, max: 9 })
			.withMessage("SSN can only contain 9 digits"),
		body("phoneNumber")
			.notEmpty()
			.withMessage("Phone number must be provided")
			.isMobilePhone("en-US")
			.withMessage("Invalid phone number"),
		body("DOB")
			.notEmpty()
			.withMessage("Date of birth must be provided")
			.isISO8601()
			.withMessage("Incorrect date format")
			.exists()
			.isDate()
			.withMessage("Invalid date of birth"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const {
			firstName,
			lastName,
			publicAddress,
			email,
			password,
			SSN,
			phoneNumber,
			DOB,
		} = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) throw new BadRequestError("Email already exists");

		const newUser = User.build({
			firstName,
			lastName,
			publicAddress,
			email,
			password,
			SSN,
			phoneNumber,
			DOB,
		});

		try {
			await newUser.save();

			const userJWt = jwt.sign(
				{ id: newUser.id, email: newUser.email },
				process.env.JWT_KEY!
			);

			req.session = {
				jwt: userJWt,
			};

			return res.status(201).send(newUser);
		} catch (error) {
			console.error(error);
			throw new BadRequestError("User not registered");
		}
	}
);

export { router as SignupRouter };
