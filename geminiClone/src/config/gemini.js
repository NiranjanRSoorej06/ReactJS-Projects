const apiKey = "AIzaSyAI9mp34X9IfXOGaEQXXHNAqXrNlEaoGZU";
const apikey2 ="AIzaSyDBDUEl-yqN7IGXfxGjXydFGNjaUqJZCVw";

import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { writeFile } from 'fs';

// 🔑 Just edit this variable to change your prompt
const prompt = "a futuristic city skyline at sunset with flying cars";

function saveBinaryFile(fileName, content) {
  writeFile(fileName, content, (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved.`);
  });
}

async function main() {
  const ai = new GoogleGenAI({ apiKey });

  const model = 'gemini-2.5-flash-image-preview';
  const generationConfig = {
    responseModalities: ['IMAGE', 'TEXT'],
  };

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    generationConfig,
    contents,
  });

  let fileIndex = 0;
  for await (const chunk of response) {
    const parts = chunk.candidates?.[0]?.content?.parts;
    if (!parts) continue;

    if (parts[0].inlineData) {
      const fileName = `output_${fileIndex++}`;
      const inlineData = parts[0].inlineData;
      const fileExtension = mime.getExtension(inlineData.mimeType || 'bin');
      const buffer = Buffer.from(inlineData.data || '', 'base64');
      saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
    } else if (parts[0].text) {
      console.log(parts[0].text);
    }
  }
}

export { main, prompt };
