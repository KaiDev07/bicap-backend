import Tour from "../models/tourModel.js";
import FavoriteTour from "../models/favoriteTourModel.js";
import Purchase from "../models/purchaseModel.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
    },
    region: bucketRegion,
});

export const getAllTours = async (req, res) => {
    try {
        const user = req.user;
        let favoriteTours = [];

        if (user) {
            const userFavoriteTours = await FavoriteTour.findOne({
                user: user.id,
            });
            if (userFavoriteTours) {
                favoriteTours = userFavoriteTours.tourIds;
            }
        }

        const allTours = await Tour.find().lean();
        for (const tour of allTours) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: tour.imageName,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            tour.imageUrl = url;
        }

        res.status(200).json({ tours: allTours, favoriteTours });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getToursByLocation = async (req, res) => {
    try {
        const location = req.body.location;

        const tours = await Tour.find({ location }).lean();
        for (const tour of tours) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: tour.imageName,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            tour.imageUrl = url;
        }

        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFavoriteTours = async (req, res) => {
    try {
        const userId = req.user.id;

        const favoriteTours = await FavoriteTour.findOne({
            user: userId,
        }).lean();

        const tours = [];
        if (favoriteTours) {
            for (const tourId of favoriteTours.tourIds) {
                const tour = await Tour.findOne({ _id: tourId }).lean();
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: tour.imageName,
                };
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, {
                    expiresIn: 3600,
                });
                tour.imageUrl = url;
                tours.push(tour);
            }
        }
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addToFavorites = async (req, res) => {
    try {
        const tourId = req.body.tourId;
        const userId = req.user.id;

        const favoriteTours = await FavoriteTour.findOne({ user: userId });
        if (!favoriteTours) {
            await FavoriteTour.create({
                user: userId,
                tourIds: [tourId],
            });
        } else {
            if (!favoriteTours.tourIds.includes(tourId)) {
                favoriteTours.tourIds.push(tourId);
                await favoriteTours.save();
            }
        }

        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const removeFromFavorites = async (req, res) => {
    try {
        const tourId = req.body.tourId;
        const userId = req.user.id;

        const favoriteTours = await FavoriteTour.findOne({
            user: userId,
        });
        if (favoriteTours) {
            const newFavoriteTourIds = favoriteTours.tourIds.filter(
                (tour) => tour !== tourId
            );
            if (newFavoriteTourIds.length === 0) {
                await FavoriteTour.deleteOne({ _id: favoriteTours._id });
            } else {
                favoriteTours.tourIds = newFavoriteTourIds;
                await favoriteTours.save();
            }
        }

        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPurchases = async (req, res) => {
    try {
        const userId = req.user.id;

        const purchases = await Purchase.findOne({ user: userId }).lean();
        const tours = [];
        if (purchases) {
            for (const tourId of purchases.tourIds) {
                const tour = await Tour.findOne({ _id: tourId }).lean();
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: tour.imageName,
                };
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, {
                    expiresIn: 3600,
                });
                tour.imageUrl = url;
                tours.push(tour);
            }
        }

        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addToPurchases = async (req, res) => {
    try {
        const { tourId, price } = req.body;
        const userId = req.user.id;

        const purchase = await Purchase.findOne({ user: userId });
        if (!purchase) {
            await Purchase.create({
                user: userId,
                tourIds: [tourId],
                prices: [price],
            });
        } else {
            purchase.tourIds.push(tourId);
            purchase.prices.push(price);
            await purchase.save();
        }

        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
