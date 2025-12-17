
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
	module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
	name: { type: String, required: true, trim: true },
	main_price: { type: Number, required: true, min: 0 },
	special_price: { type: Number, default: null, min: 0 },
	preparation_time_minute: { type: Number, default: 0, min: 0 },
	packaging_charge: { type: Number, default: 0, min: 0 },
	image: { type: String, default: '' },
	isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

