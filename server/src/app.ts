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
import { SignoutRouter } from "./routes/user/sign-out";
import { GetUserRouter } from "./routes/user/get-user";

// importing PROPERTY routes
import { CreateRouter } from "./routes/property/create-property";
import { FetchPropertyRouter } from "./routes/property/fetch-property";
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
import { GetPropertyImagesRouter } from "./routes/property/get-property-images";
import { ChangePropertyThumbnailRouter } from "./routes/property/change-property-thumbnail";
import { AddPropertyImageRouter } from "./routes/property/add-property-image";
import { RemovePropertyImageRouter } from "./routes/property/remove-property-image";
import { ChangePropertyPriceRouter } from "./routes/property/change-property-price";

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
		origin: "*",
		credentials: true,
	})
);

// hooking USER routes
app.use(SignupRouter);
app.use(SigninRouter);
app.use(CurrentUserRouter);
app.use(SignoutRouter);
app.use(GetUserRouter);

// hooking PROPERTY routes
app.use(CreateRouter);
app.use(FetchPropertyRouter);
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
app.use(GetPropertyImagesRouter);
app.use(ChangePropertyThumbnailRouter);
app.use(AddPropertyImageRouter);
app.use(RemovePropertyImageRouter);
app.use(ChangePropertyPriceRouter);

// Invalid routes
app.all("*", async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export default app;
