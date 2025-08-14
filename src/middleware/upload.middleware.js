const multer = require('multer');
const path = require('path');

const createUpload = (module) => {
    const UPLOADS_FOLDER = `src/${module}/uploads/images`;
    const imagePath = path.join(process.cwd(), UPLOADS_FOLDER);

    const storage = multer.diskStorage({
        destination: () => imagePath,
        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
            const fileName = file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-') + '-' + Date.now();
            cb(null, fileName + fileExt);
        },
    });

    const isValidImage = (file) =>
        ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype);

    return multer({
        storage,
        limits: { fileSize: 10000000 }, // 10MB
        fileFilter: (req, file, cb) => {
            if (['coverImage', 'gallery'].includes(file.fieldname)) {
                if (isValidImage(file)) {
                    cb(null, true);
                } else {
                    cb(new AppError('Only .jpg, .png, or .jpeg format allowed!', 400));
                }
            } else {
                cb(new AppError('Unknown field!', 400));
            }
        },
    });
};

module.exports = { createUpload };