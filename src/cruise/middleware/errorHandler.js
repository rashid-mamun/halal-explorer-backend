function handleMulterError(err, req, res, next) {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum file size is 1MB.' });
    }
    next(err);
}

function handleServerError(err, req, res, next) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = {
    handleMulterError,
    handleServerError,
};
