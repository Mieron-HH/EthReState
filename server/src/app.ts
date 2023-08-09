import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
const cors = require("cors");

// importing errors, types and middlewares
import { errorHandler, NotFoundError } from "@kmalae.ltd/library";

// importing USER routes
import { SignupRouter } from "./routes/user/sign-up";
import { SigninRouter } from "./routes/user/sign-in";
import { CurrentUserRouter } from "./routes/user/current-user";
import { signoutRouter } from "./routes/user/sign-out";

// importing MINT routes
import { PublishRouter } from "./routes/property/publish-property";
import { MintRouter } from "./routes/property/mint-property";
import { ListRouter } from "./routes/property/list-property";
import { UnlistRouter } from "./routes/property/unlist-property";
import { LockRouter } from "./routes/property/lock-property";
import { UnlockRouter } from "./routes/property/unlock-property";
import { SellRouter } from "./routes/property/sell-property";
import { CancelRouter } from "./routes/property/cancel-property";
import { GetPropertiesRouter } from "./routes/property/get-properties";
import { GetSellerPropertiesRouter } from "./routes/property/get-seller-properties";
import { GetBuyerPropertiesRouter } from "./routes/property/get-buyer-properties";
import { GetPopularPropertiesRouter } from "./routes/property/get-popular-properties";
import { UpdateLikesRouter } from "./routes/property/update-property-likes";
import { UpdateViewsRouter } from "./routes/property/update-property-views";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: false,
	})
);
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

// hooking USER routes
app.use(SignupRouter);
app.use(SigninRouter);
app.use(CurrentUserRouter);
app.use(signoutRouter);

// hooking MINT routes
app.use(PublishRouter);
app.use(MintRouter);
app.use(ListRouter);
app.use(UnlistRouter);
app.use(LockRouter);
app.use(UnlockRouter);
app.use(SellRouter);
app.use(CancelRouter);
app.use(GetPropertiesRouter);
app.use(GetSellerPropertiesRouter);
app.use(GetBuyerPropertiesRouter);
app.use(GetPopularPropertiesRouter);
app.use(UpdateLikesRouter);
app.use(UpdateViewsRouter);

// Invalid routes
app.all("*", async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export default app;
