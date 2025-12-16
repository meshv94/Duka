const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User reference is required']
		},
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			maxlength: [100, 'Name cannot exceed 100 characters']
		},
		mobile_number: {
			type: String,
			required: [true, 'Mobile number is required'],
			trim: true,
			match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit mobile number']
		},
		pincode: {
			type: String,
			required: [true, 'Pincode is required'],
			trim: true
		},
		city: {
 			type: String,
 			trim: true,
 			required: false
 		},
		address: {
			type: String,
			required: [true, 'Address is required'],
			trim: true
		},
		latitude: {
			type: Number,
			required: false
		},
		longitude: {
			type: Number,
			required: false
		},
		type: {
			type: String,
			enum: ['home', 'work', 'other'],
			default: 'home'
		},
		isDefault: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
);

// Indexes for efficient lookup
addressSchema.index({ user: 1 });
addressSchema.index({ user: 1, isDefault: 1 });

// Ensure only one default address per user
addressSchema.pre('save', async function (next) {
	try {
		if (this.isDefault) {
			// unset isDefault for other addresses of the same user
			await this.constructor.updateMany(
				{ user: this.user, _id: { $ne: this._id }, isDefault: true },
				{ $set: { isDefault: false } }
			);
		}
		next();
	} catch (err) {
		next(err);
	}
});

module.exports = mongoose.model('Address', addressSchema);

