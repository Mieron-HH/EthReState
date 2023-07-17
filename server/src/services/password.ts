import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
	static toHash = async (password: string) => {
		const salt = randomBytes(8).toString("hex");
		const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

		return `${buffer.toString("hex")}.${salt}`;
	};

	static compare = async (givenPassword: string, storedPassword: string) => {
		const [hashedPassword, salt] = storedPassword.split(".");
		const buffer = (await scryptAsync(givenPassword, salt, 64)) as Buffer;

		return buffer.toString("hex") === hashedPassword;
	};
}
