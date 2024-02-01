import {v2 as cloudinary} from 'cloudinary';
import { response } from 'express';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env_CLOUDINARY_API_KEY,
  api_secret: process.env_CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
        cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("file is upload on cloudinary",response.url);
        return response;
    } catch (error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary as upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}
          