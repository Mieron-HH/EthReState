import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PropertyImage {
	data: Buffer;
	contentType: string;
}

interface MetadataAttr {
	url: string;
	ipnft: string;
}

interface PropertyAttr {
	seller: string;
	tokenID?: string;
	street: string;
	city: string;
	state: string;
	price: string;
	size: string;
	metadata: MetadataAttr;
	owner: string;
	minted: Boolean;
	listed: Boolean;
	locked: Boolean;
	sold: Boolean;
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
		seller: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "User",
		},
		tokenID: { type: Number, required: false },
		street: { type: String, required: true, lowercase: true, trim: true },
		city: { type: String, required: true, lowercase: true, trim: true },
		price: { type: String, required: true },
		size: { type: String, required: true },
		owner: { type: String, required: true, lowercase: true, trim: true },
		metadata: { type: Object, required: true },
		state: { type: String, required: true, lowercase: true, trim: true },
		minted: { type: Boolean, required: true },
		listed: { type: Boolean, required: true },
		locked: { type: Boolean, required: true },
		sold: { type: Boolean, required: true },
		likes: { type: [String], required: true },
		views: { type: Number, required: true },
		buyer: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
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
