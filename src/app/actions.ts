'use server';

import { refineCvContent } from "@/ai/flows/ai-powered-content-refinement";

export async function refineWithAI(text: string) {
    if (!text) {
        return { refinedContent: "" };
    }
    try {
        const result = await refineCvContent({ cvContent: text });
        return result;
    } catch (error) {
        console.error("AI refinement failed:", error);
        throw new Error("Failed to refine content with AI.");
    }
}
