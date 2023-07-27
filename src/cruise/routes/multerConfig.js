const multer = require('multer');
const path = require('path');


const UPLOADS_FOLDER = 'src/cruise/uploads/images'

const imagePath = path.join(process.cwd(), UPLOADS_FOLDER);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagePath);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName =
            file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();

        cb(null, fileName + fileExt);
    },
});

const imageFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000, // 1MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'coverImage' || file.fieldname === 'gallery') {
            imageFilter(req, file, cb);
        } else {
            cb(new Error('There was an unknown error!'));
        }
    },
});

module.exports = upload;
