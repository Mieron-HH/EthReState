import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface MetadataAttr {
	ipnft: string;
	url: string;
}

export interface ImageAttr {
	data: Buffer;
	contentType: string;
}

interface PropertyAttr {
	metadata: MetadataAttr;
	seller: string;
	tokenID?: string;
	street: string;
	city: string;
	state: string;
	zipCode: string;
	price: string;
	downPayment: string;
	size: string;
	bedroomNumber: string;
	bathroomNumber: string;
	thumbnail: ImageAttr;
	images: ImageAttr[];
	owner: string;
	minted: Boolean;
	listed: Boolean;
	inspected: Boolean;
	locked: Boolean;
	sold: Boolean;
	cancelled: Boolean;
	likes: string[];
	views: number;
	buyer?: string;
}

export interface PropertyDoc extends PropertyAttr, mongoose.Document {
	version: number;
}

interface PropertyModel extends mongoose.Model<PropertyDoc> {
	build(attr: PropertyAttr): PropertyDoc;
}

const propertySchema = new mongoose.Schema(
	{
		metadata: { type: Object, required: true },
		seller: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "User",
		},
		tokenID: { type: Number, required: false },
		street: { type: String, required: true, lowercase: true, trim: true },
		city: { type: String, required: true, lowercase: true, trim: true },
		price: { type: String, required: true },
		state: { type: String, required: true, lowercase: true, trim: true },
		zipCode: { type: String, required: true },
		downPayment: { type: String, required: false },
		size: { type: String, required: true },
		bedroomNumber: { type: String, required: true },
		bathroomNumber: { type: String, required: true },
		owner: { type: String, required: true, lowercase: true, trim: true },
		thumbnail: { type: Object, required: true },
		images: { type: [Object], required: true },
		minted: { type: Boolean, required: true },
		mintedAt: { type: Date, required: false },
		listed: { type: Boolean, required: true },
		listedAt: { type: Date, required: false },
		inspected: { type: Boolean, required: true },
		inspectedAt: { type: Date, required: false },
		locked: { type: Boolean, required: true },
		lockedAt: { type: Date, required: false },
		sold: { type: Boolean, required: true },
		soldAt: { type: Date, required: false },
		cancelled: { type: Boolean, required: true },
		likes: { type: [String], required: true },
		views: { type: Number, required: true },
		buyer: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
		createdAt: { type: Date, default: Date.now },
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.__v;
			},
		},
	}
);

propertySchema.index({ tokenID: 1 });
propertySchema.set("versionKey", "version");
propertySchema.plugin(updateIfCurrentPlugin);

propertySchema.statics.build = (attr: PropertyAttr) => {
	return new Property(attr);
};

const Property = mongoose.model<PropertyDoc, PropertyModel>(
	"Property",
	propertySchema
);

export { Property };
