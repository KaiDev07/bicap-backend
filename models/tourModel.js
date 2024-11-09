import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tourSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    numberOfReviews: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    imageName: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Tour", tourSchema);
