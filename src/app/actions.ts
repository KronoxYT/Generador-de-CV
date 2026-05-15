'use server';

import { refineCvContent } from "@/ai/flows/ai-powered-content-refinement";
import { generateSummary } from "@/ai/flows/generate-summary";

export async function refineWithAI(text: string) {
    if (!text) {
        return { refinedContent: "" };
    }
    
    if (!process.env.GOOGLE_GENAI_API_KEY) {
        return { refinedContent: text + " (IA desactivada: Configura GOOGLE_GENAI_API_KEY para mejorar este texto)" };
    }

    try {
        const result = await refineCvContent({ cvContent: text });
        return result;
    } catch (error) {
        console.error("AI refinement failed:", error);
        throw new Error("Failed to refine content with AI.");
    }
}

export async function generateSummaryWithAI(data: any) {
    if (!process.env.GOOGLE_GENAI_API_KEY) {
        return { summary: "Este es un resumen de prueba porque la IA no está configurada. Una vez que agregues tu API Key, aquí aparecerá un resumen profesional basado en tu experiencia como " + data.jobTitle + "." };
    }

    try {
        const result = await generateSummary(data);
        return result;
    } catch (error) {
        console.error("AI summary generation failed:", error);
        throw new Error("Failed to generate summary with AI.");
    }
}
