const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Process chat message with AI
// @route   POST /api/ai/chat
// @access  Public (or Private depending on requirements, setting to Public for demo if needed)
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
       return res.status(503).json({ 
           reply: "The AI Assistant is currently unavailable because the API key is not configured. Please consult your doctor for a final diagnosis." 
       });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Enforce the personality and disclaimer
    const systemInstruction = `You are the FemmeCare AI Assistant. Your personality is supportive, gentle, and empathetic. 
You must always be informative but cautious. 
CRITICAL RULE: You must always include some variation of this disclaimer in your medical advice: "Please consult your doctor for a final diagnosis." 
If the user mentions symptoms, kindly suggest they book an appointment with our specific female specialists on the platform.`;

    const prompt = `${systemInstruction}\n\nUser: ${message}\nAI:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error('AI Error:', error.message);
    const replyMsg = error.message.includes('API key') 
      ? 'The configured Gemini API Key is invalid. Please double check backend/.env'
      : `AI Service Error: ${error.message}. Please consult your doctor for a final diagnosis.`;
    res.status(500).json({ reply: replyMsg });
  }
};

module.exports = { chatWithAI };
