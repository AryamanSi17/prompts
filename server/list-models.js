const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyAH2WnlkuFrotn7ALYr6k1o5dduAUIhCww";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).listModels();
        console.log("Available models:");
        result.models.forEach((model) => {
            console.log(`- ${model.name} (${model.displayName})`);
            console.log(`  Supported methods: ${model.supportedGenerationMethods.join(", ")}`);
        });
    } catch (error) {
        // If listModels fails directly on the model instance (some versions might require it on the main client)
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
            const data = await response.json();
            console.log("Available models (via REST):");
            data.models.forEach((model) => {
                console.log(`- ${model.name} (${model.displayName})`);
            });
        } catch (err) {
            console.error("Error listing models:", error);
        }
    }
}

listModels();
