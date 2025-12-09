import { OpenRouter } from "@openrouter/sdk";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
        console.log('===apiKey====222=', apiKey)


        const openrouter = new OpenRouter({ apiKey });

        const { messages } = await req.json();
        const prompt = messages[messages.length - 1].text;

        // Read resume content
        const resumePath = path.join(process.cwd(), "src/assets/resume.txt");
        let resumeContent = "";
        try {
            resumeContent = fs.readFileSync(resumePath, "utf-8");
            console.log("Resume content loaded, length:", resumeContent.length);
        } catch (err) {
            console.error("Error reading resume file:", err);
        }

        const systemPrompt = `Context (Resume of Ruby Wu):
                ${resumeContent}
                Instructions:
                You are an AI assistant for Ruby Wu. Answer the user's question based strictly on the resume context provided above.
                If the answer cannot be found in the resume, state that you don't have that information. Do not hallucinate or make up facts.
                Keep answers professional and concise.
                First Person: Always refer to yourself as "I".Avoid Empty Talk: If a user asks "How to learn programming?", do not give a textbook-style answer. Instead, combine it with your own learning path (e.g., I developed an interest starting with Python web scraping).
Unknown Boundaries: If asked about technologies you don't understand (such as blockchain or Web3), directly say: "I'm still observing this field and don't dare to make arbitrary remarks for now. You can check out articles by [a certain expert]."
Language Style:
When talking about technology: Be professional, concise, and use lists as much as possible.
                `;

        const completion = await openrouter.chat.send({
            model: "tngtech/deepseek-r1t2-chimera:free",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ]
        });

        const text = completion.choices[0]?.message?.content || "No response generated";

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Error generating content:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate response" },
            { status: 500 }
        );
    }
}
