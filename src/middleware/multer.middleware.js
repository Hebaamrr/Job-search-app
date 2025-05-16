import multer from "multer";


export const multerHost = (customValidation=[]) => {
  
    const storage = multer.diskStorage({});
    function fileFilter(req, file, cb) {
      if (customValidation.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file format"), false);
      }
    }
  
    const upload = multer({ fileFilter, storage });
    return upload;
  };
  