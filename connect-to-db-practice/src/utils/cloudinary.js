import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const fileUploadInCloudinary = async (localFile) => {
    try {
        const response = await cloudinary.uploader.upload(localFile,
            { resource_type: auto },
            function (error, result) { console.log(result); });
        fs.unlinkSync(localFile)
        return response
    } catch (error) {
        console.log("The file is not upload cloudinary because" + error.message)
        fs.unlinkSync(localFile)
    }
}

export { fileUploadInCloudinary }
