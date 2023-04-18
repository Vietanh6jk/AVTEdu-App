const cloudinary = require('cloudinary').v2;

const CLOUD_NAME = "dtcke5fkl";
const API_KEY ="295933496344431";
const API_SECRET = "SbeoXulEWODLfB9hI5QE5MMl9WY";;

const ConnectImage = (function(){
  var instance;
  function init (){
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET
    });
    return cloudinary;
  }
  return {
    getInstance : function(){
        if (!instance) instance = init();
        return instance;
    }
  }
})
module.exports = {
  ConnectImage
};