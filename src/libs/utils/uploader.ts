import path from "path";
import fs from "fs";
import multer from "multer";
import { v4 } from "uuid";

function getTargetImageStorage(address: any) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const relativeUploadPath = path.join("uploads", address);
      const absoluteUploadPath = path.join(process.cwd(), relativeUploadPath);
      fs.mkdirSync(absoluteUploadPath, { recursive: true });
      cb(null, relativeUploadPath);
    },
    filename: function (req, file, cb) {
      const extension = path.parse(file.originalname).ext;
      const random_name = v4() + extension;
      cb(null, random_name);
    },
  });
}

const makeUploader = (address: string) => {
  const storage = getTargetImageStorage(address);
  return multer({ storage: storage });
};

export default makeUploader;
