const cloudinary  = require("cloudinary")

cloudinary.config({ 
  cloud_name: 'daywydica', 
  api_key: '267593596432224', 
  api_secret: 'y6wadaHC-3zr2OxQERFbSQbIfCI' 
});

async function uploadImage(file, folder_name){
try {
    if(file){
        let img_url = ""
        let public_id=""
        await cloudinary.v2.uploader.upload(file.tempFilePath,{folder:`Educom/${folder_name}`}).then((res)=>{
          if(res){
            console.log("res", res);
            img_url = res.secure_url
            public_id = res.public_id
          }
        }).catch((error)=>{
          console.log("error", error);
        })
         return {img_url, public_id}
        }
} catch (error) {
    console.log("cloudinary upload error", error);
}
}

 const updateImage = async (file, imageId) => {

  try {
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      public_id: imageId,
      invalidate: true,
      overwrite: true,
    });
    let img_url = result.secure_url;
    let public_id = result.public_id
    return {img_url, public_id};
  } catch (error) {
    console.error("Error updating image:", error);
    throw error;
  }
};

module.exports = {uploadImage, updateImage}