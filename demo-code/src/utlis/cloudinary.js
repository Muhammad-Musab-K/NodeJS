import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

const fileUpload = async (uploadFile) => {

    try {
        const response = await cloudinary.uploader.upload(uploadFile, { resource_type: auto },)
        console.log(`The file is save : ${response.url}`)

    } catch (error) {
        console.log(`the file is not save in cloudinary due to : ${error.message}`)
        fs.unlink(uploadFile)
    }
}

export { fileUpload }
