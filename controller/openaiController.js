// import OpenAI from "openai";
const OpenAI = require("openai")
const fs = require("fs")
const { Readable } =  require('stream');
const streamifier = require('streamifier');
const ffmpeg = require('fluent-ffmpeg');

const openai = new OpenAI({
    apiKey: "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",
});

const  bufferToStream  = (buffer) => {
    return  Readable.from(buffer);
  }

exports.chatAI = async(req, res)=>{
    const {questions} = req.query
    console.log("questions", questions);
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: questions }],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
    });
    return res.status(200).json({response:chatCompletion.choices[0].message.content })
}


exports.uploadfiles = async(req, res)=>{

    try {
        const result = await openai.files.create({
            file: fs.createReadStream("data.jsonl"),
            purpose:"fine-tune"
        })
        console.log("result");
        
        return res.status(200).json({response: result})
    } catch (error) {
        console.log("error in uploading", error);
        return res.status(400).json({response: error})
    }
  

}


exports.listfiles = async(req, res)=>{

    try {
        const result = await openai.files.list();
        console.log("res", result);
    
    return res.status(200).json({response: result})
    } catch (error) {

        console.log("error", error);
        res.status(400).json({response: error})
    }


}


exports.fineTune = async(req, res)=>{

    try {
        const result = await openai.fineTuning.jobs.create({
            training_file: "file-SXPOStuVIMyio4WTthM02S6Q",
            model: "gpt-3.5-turbo-1106"
        })
        console.log("result", result);
        return res.status(200).json({response: result})
    } catch (error) {
       console.log("error", error);
       return res.status(400).json({errorResponse: error}) 
    }

   
}


exports.transcribe = async(req, res)=>{
    try {
        console.log("req.body", req.body,req.files);
          const {audio_file, video_file} = req.files
        
    //       const tempFilePath = `./temp_${Date.now()}.mp3`;
    //       audio_file.mv(tempFilePath);
        
    //     const transcript = await openai.audio.transcriptions.create({
    //       model: 'whisper-1',
    //     //   file:fs.createReadStream("sample.mp3"),
    //     file: fs.createReadStream(tempFilePath),
    //       response_format: 'text'
    //     })
    //        // Remove the temporary file
    // fs.unlinkSync(tempFilePath);
    
    //     res.status(200).json({ transcript });



     // Save the video file temporarily to the server
     const tempVideoPath = `./temp_${Date.now()}.mp4`;
     video_file.mv(tempVideoPath);
 
     // Extract audio from the video using ffmpeg
     const tempAudioPath = `./temp_audio_${Date.now()}.mp3`;
 
     ffmpeg(tempVideoPath)
       .noVideo()
       .audioCodec('libmp3lame')
       .on('end', () => {
        
         const audioFileStream = fs.createReadStream(tempAudioPath);
 
         openai.audio.transcriptions.create({
           model: 'whisper-1',
           file: audioFileStream,
           response_format: 'text',
         })
         .then(response => {
          console.log("response", response);
          //  const transcript = response.data.transcript;
 
           // Remove the temporary files
           fs.unlinkSync(tempVideoPath);
           fs.unlinkSync(tempAudioPath);

           openai.chat.completions.create({
            messages: [ {
              role: "system",
              content: "You are a helpful assistant designed to output JSON. You will recieve a text file which is a transcribe of a video lecture and you will respond a summary of same file in 80 words",
            },{ role: "user", content: response }],
            model: "gpt-3.5-turbo-1106",
            response_format: { type: "json_object" },
        }).then((result)=>{
          console.log("result", result);
         return res.status(200).json({ transcript:response, contentSummary:result.choices[0].message.content });
        });
         })
         .catch(error => {
           console.error('OpenAI API Error:', error.message);
           res.status(500).json({ error: 'Internal Server Error' });
         });
       })
       .on('error', (err) => {
         console.error('FFmpeg Error:', err);
         res.status(500).json({ error: 'Internal Server Error' });
       })
       .save(tempAudioPath);

      } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


