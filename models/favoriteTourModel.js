import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tourSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    tourIds: {
        type: Array,
        required: true,
    },
});

export default mongoose.model("Favoritetour", tourSchema);
