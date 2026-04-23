/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ReasoningResult {
  finalAnswer: string;
  reasoningSummary: string;
  tradeoffs: string;
  confidenceScore: number; // 0-100
}

export interface ReasoningStep {
  title: string;
  content: string;
}
