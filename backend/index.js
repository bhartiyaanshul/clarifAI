import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const key = "AIzaSyD8Up380cxnixgwyXEvcOKQVrwg6f8N2Lk";
const genAI = new GoogleGenerativeAI(key);
const fileManager = new GoogleAIFileManager(key);
const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));

const uploadVideoToAIBucket = async (name, type) => {
  try {

    console.log("This is the file name", name);

    const uploadResult = await fileManager.uploadFile(name, {
      mimeType: type,
      displayName: name,
    });

    console.log("This is the uploaded file", uploadResult.file.displayName);

    return uploadResult;
  } catch (error) {
    throw new Error(`Error uploading video: ${error}`);
  } finally {
    console.log("done");
    fs.unlinkSync(name)
  }
};

const analyzeContent = async (fileUri) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await fileManager.getFile(fileUri);

    const aiRes = await model.generateContent([
      {
        fileData: {
          mimeType: result.mimeType,
          fileUri: result.uri,
        },
      },
      {
        text: `
          Analyze the following content and determine if it is child-friendly. Return a rating from 1 to 10 and "TRUE" if the content is suitable for children, and "FALSE" if it is not. Consider the following criteria:
          {
            "explicit": {
              "rating": "",
              "description": "The reason for rating"
            },
            "violent": {
              "rating": "",
              "description": "The reason for rating"
            },
            "mature": {
              "rating": "",
              "description": "The reason for rating"
            },
            "adult": {
              "rating": "",
              "description": "The reason for rating"
            },
            "Overall": {
              "rating": "",
              "description": "The reason for rating"
            }
          }
        `,
      },
    ]);

    console.log(aiRes.response.text())

    return aiRes;
  } catch (error) {
    throw new Error(`Error analyzing content: ${error}`);
  }
};

app.post("/upload", async (req, res) => {

  console.log(req.body)

  try {
    const { blob, name, type } = req.body;

    if (!blob || !name) {
      return res.status(400).send("File and name are required.");
    }

    console.log(blob.byteLength)

    const buffer = Buffer.from(blob, "base64");
    // name = vide.mp4 || image.png



    fs.writeFile(name, buffer, async (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return res.status(500).send(`Error: ${err.message}`);
      }

      // console.log(`File ${filePath} created successfully.`);

      try {
        const uploadResult = await uploadVideoToAIBucket(name, type);
        const analysisResult = await analyzeContent(uploadResult.file.name);

        res.send(analysisResult);
      } catch (error) {
        console.error(`Error during upload/analyze: ${error}`);
        res.status(500).send(`Error: ${error.message}`);
      }
    });
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});