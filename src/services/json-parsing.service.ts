import { Injectable } from '@nestjs/common';

interface ParsedData {
  result: object;
  type: string;
}

interface ParsedResult {
  otherText: string;
  parsedData: ParsedData | null;
}

@Injectable()
export class JsonParsingService {
  extractAndParse(jsonLikeString: string): ParsedResult {
    // Regular expression to extract the content outside and inside <sandbox-result> tags
    const regex = /([^<]*)<sandbox-result>(.*?)<\/sandbox-result>([^>]*)/s;
    const match = jsonLikeString.match(regex);

    if (match) {
      const otherText = match[1] + match[3]; // Concatenate other text before and after the tags
      const jsonString = match[2]; // Extract the content within the tags
      try {
        // Parse the extracted JSON-like string
        const data = JSON.parse(jsonString);
        return { otherText, parsedData: data };
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return { otherText, parsedData: null };
      }
    } else {
      console.error('No valid JSON found in the input string.');
      return { otherText: '', parsedData: null };
    }
  }
}
