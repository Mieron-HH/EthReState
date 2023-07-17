import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

// importing errors, types and middlewares
import { errorHandler, NotFoundError } from "@kmalae.ltd/library";

// importing USER routes
import { SignupRouter } from "./routes/user/sign-up";
import { SigninRouter } from "./routes/user/sign-in";
import { CurrentUserRouter } from "./routes/user/current-user";

// importing MINT routes
import { CreateTokenUriRouter } from "./routes/nft/create-token-uri";
import { MintRouter } from "./routes/nft/mint-nft";
import { ListRouter } from "./routes/nft/list-property";
import { BuyRouter } from "./routes/nft/buy-property";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(cookieSession({ signed: false, secure: false }));

// hooking USER routes
app.use(SignupRouter);
app.use(SigninRouter);
app.use(CurrentUserRouter);

// hooking MINT routes
app.use(CreateTokenUriRouter);
app.use(MintRouter);
app.use(ListRouter);
app.use(BuyRouter);

// Default route
app.all("*", async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export default app;
