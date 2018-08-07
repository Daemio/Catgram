const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const name = Math.floor(Math.random()*1000000) + file.originalname;
        cb(null, name);
    }
});
const fileFilter = (req, file, cb) => {
    const type = file.mimetype;
    if(type === 'image/jpeg' || type === 'image/png'){
        cb(null, true);
    } else {
        cb(new Error('File of incorrect type'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5242880 //less than 5 mb
    }
});

module.exports = upload;