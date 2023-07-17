import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

// importing models and services
import { User } from "../../models/user";
import { Password } from "../../services/password";

// importing types, middlewares, and errors
import { BadRequestError, validateRequest } from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/user/signin",
	[
		body("email")
			.notEmpty()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Invalid email"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (!existingUser) throw new BadRequestError("Invalid credentials");
		if (!(await Password.compare(password, existingUser.password)))
			throw new BadRequestError("Invalid credentials");

		try {
			const userJwt = jwt.sign(
				{ id: existingUser.id, email: existingUser.email },
				process.env.JWT_KEY!
			);

			req.session = {
				jwt: userJwt,
			};

			return res.status(200).send(existingUser);
		} catch (error) {
			console.error(error);
			throw new BadRequestError("Unable to create session");
		}
	}
);

export { router as SigninRouter };
