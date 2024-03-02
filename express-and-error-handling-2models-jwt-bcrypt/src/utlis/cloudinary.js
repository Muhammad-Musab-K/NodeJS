import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const FileUploadInCloudinary = async (uploadFile) => {
    try {
        const response = await cloudinary.uploader.upload(uploadFile,
            { resource_type: auto },
        )
        console.log(`The file is successfully Uploaded :${response.url} `)
    } catch (error) {
        fs.unlink(uploadFile)
    }
}
export { FileUploadInCloudinary }






