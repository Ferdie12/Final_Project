
const ImageKit = require('imagekit');

const {
    PUBLIC_KEY_IMAGEKIT,
    PRIVATE_KEY_IMAGEKIT,
    URL_IMAGEKIT
} = process.env;

const imagekit = new ImageKit({
    publicKey: PUBLIC_KEY_IMAGEKIT,
    privateKey: PRIVATE_KEY_IMAGEKIT,
    urlEndpoint: URL_IMAGEKIT
});
module.exports = imagekit;