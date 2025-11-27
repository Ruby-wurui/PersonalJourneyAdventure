const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCE076u1QBPeLU6Hd92Buh5ysDD_vaPBKo");

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct "listModels" on the instance in some versions, 
        // but let's try to just run a simple generation with a known safe model 'gemini-pro' 
        // to see if the key works at all, or use the model manager if available.

        // Actually, the error message suggested calling ListModels. 
        // In the Node SDK, it might not be directly exposed easily without looking at docs.
        // Let's try to just use 'gemini-pro' as a fallback test.
        console.log("Testing gemini-pro...");
        const proModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await proModel.generateContent("Hello");
        console.log("gemini-pro response:", result.response.text());
    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
