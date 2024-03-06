import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})


 //multer.diskStorage: This function creates a storage engine for Multer that saves files to disk. It takes an options object with two properties: destination and filename.

//destination: Specifies the directory where uploaded files will be stored. In this case, it's set to './public/temp', which means files will be stored in the ./public/temp directory relative to the root directory of your application.

//filename: Specifies the function used to determine the name of the uploaded file. In this case, it's set to file.originalname, which means the uploaded file will keep its original name. You might want to add some logic here if you want to generate unique filenames or modify the filenames in any way.

//export const upload = multer({ storage }): This exports a configured Multer middleware instance named upload. It takes the storage configuration created by multer.diskStorage. This upload middleware is then used to handle file uploads in your routes or controllers.

//In summary, this code sets up Multer middleware to handle file uploads, specifying that uploaded files should be stored in the ./public/temp directory with their original filenames. You would then use the upload middleware in your Express route handlers to handle file uploads.