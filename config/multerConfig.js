// import path from "path";
// import { fileURLToPath } from "url";
// import multer from "multer";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, path.join(__dirname, "../images"));
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: {
//     files: 3,
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Not an image! Please upload only images."), false);
//     }
//   },
// });

// export default upload;

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, "..", "images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

export default upload;
