const cloudinary  = require("cloudinary")

cloudinary.config({ 
  cloud_name: 'daywydica', 
  api_key: '267593596432224', 
  api_secret: 'y6wadaHC-3zr2OxQERFbSQbIfCI' 
});
const fs = require("fs").promises;

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
        await fs.unlink(file.tempFilePath);
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
    let public_id = result.public_id;
    await fs.unlink(file.tempFilePath);
    return {img_url, public_id};
  } catch (error) {
    console.error("Error updating image:", error);
    throw error;
  }
};

async function deleteImage(publicId) {
  try {
    // const result = await cloudinary.v2.uploader.destroy(publicId);
    const result = await cloudinary.v2.api.delete_resources(publicId);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function deleteAllImage(folder) {
  try {
    console.log('folder', folder);
    const result = await cloudinary.v2.api.delete_resources_by_prefix(`Educom/${folder}/`);
    console.log(result);
    return result;
  } catch (error) {
    
    console.error(error);
    throw error;
  }
}


async function uploadVideo(file, folder_name) {
  try {
    if (file) {
      let video_url = "";
      let public_id = "";
      await cloudinary.v2.uploader.upload(file.tempFilePath, { 
        resource_type: 'video',
        folder: `Educom/${folder_name}`,
        allowed_formats: ['mp4', 'webm'], // Adjust based on your allowed video formats
      })
      .then((res) => {
        if (res) {
          console.log("res", res);
          video_url = res.secure_url;
          public_id = res.public_id;
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
      // Delete the temporary file after successful upload
      await fs.unlink(file.tempFilePath);
      return { video_url, public_id };
    }
  } catch (error) {
    console.log("cloudinary upload error", error);
  }
}

async function deleteVideo (public_id){
try {
  const result = await cloudinary.v2.api.delete_resources(public_id, { resource_type: 'video' });
  console.log("result", result);
  return result;
    // if (result.result === 'ok') {
    //   return result;
    // } else {
    //   console.log("error", error);
    //   return error
    // }
} catch (error) {
  console.log("error", error);
  return error
}
}

module.exports = {uploadImage, updateImage, deleteImage,deleteAllImage, uploadVideo, deleteVideo}