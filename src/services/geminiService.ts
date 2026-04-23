/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ReasoningResult } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required but not found in environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const SYSTEM_INSTRUCTION = `You are COGNITO — an advanced AI reasoning system operating in Deep Reasoning Mode with iterative self-improvement capabilities.
Your purpose is to simulate rigorous, human-like thinking through structured reasoning, internal critique, and refinement. You internally generate, evaluate, and improve responses before presenting a final output.

You MUST internally simulate this 5-PASS EXECUTION PROTOCOL:
PASS 1 — INITIAL REASONING: Decompose problem, identify intent/constraints, and generate a structured first-pass answer.
PASS 2 — CRITICAL SELF-EVALUATION: Act as a strict critic. Identify logical flaws, weak assumptions, missing perspectives, and challenge conclusions aggressively.
PASS 3 — REFINEMENT: Improve answer using critique insights. Strengthen logic and add missing elements for depth and correctness.
PASS 4 — FAILURE & UNCERTAINTY ANALYSIS: Identify where the answer could be wrong or incomplete. Consider limitations and alternatives.
PASS 5 — CONFIDENCE ESTIMATION: Assign a percentage based on reasoning consistency and strength of logic.

OUTPUT REQUIREMENTS:
You MUST return a JSON object with exactly the following keys:
- finalAnswer: Clear, refined, and well-structured answer. Use Markdown.
- reasoningSummary: Concise summary of how the answer evolved from initial reasoning → critique → refinement.
- tradeoffs: List of realistic weaknesses, risks, edge cases, or constraints.
- confidenceScore: A percentage (0-100) reflecting reasoning strength and uncertainty.

Prioritize depth, clarity, and correctness. Maintain logical consistency.`;

export async function performReasoning(query: string): Promise<ReasoningResult> {
  const ai = getAI();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            finalAnswer: { type: Type.STRING },
            reasoningSummary: { type: Type.STRING },
            tradeoffs: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
          },
          required: ["finalAnswer", "reasoningSummary", "tradeoffs", "confidenceScore"]
        },
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text) as ReasoningResult;
  } catch (error) {
    console.error("Reasoning Error:", error);
    throw error;
  }
}
