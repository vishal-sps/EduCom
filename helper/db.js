const { default: mongoose } = require('mongoose');

const connectDB = async()=>{
    try {
        let url = `mongodb+srv://educomuser:${process.env.MONGODB_PASSWORD}@educluster.wpjvvwb.mongodb.net/?retryWrites=true&w=majority`
      const connectRes =   await mongoose.connect(url)
      return connectRes
    } catch (error) {
        console.log("Error in connecting DB", error);
        throw error
    }
}

module.exports = {connectDB}