import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AITextInputProps {
  onExtractedData: (data: {
    characters: Array<{
      title: string;
      description: string;
      year: string;
    }>;
    events: Array<{
      title: string;
      description: string;
      year: string;
    }>;
    terms: Array<{
      title: string;
      description: string;
      year: string;
    }>;
  }) => void;
}

const AITextInput = ({ onExtractedData }: AITextInputProps) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const extractEntities = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Extract historical entities from this text and return ONLY a JSON object (no markdown, no code blocks) with this structure:
      {
        "characters": [{ "title": string, "description": string, "year": string, "connections": [{ "target": string, "relationship": string }] }],
        "events": [{ "title": string, "description": string, "year": string, "connections": [{ "target": string, "relationship": string }] }],
        "terms": [{ "title": string, "description": string, "year": string, "connections": [{ "target": string, "relationship": string }] }]
      }
      
      IMPORTANT:
      - Return ONLY the JSON object, no other text
      - For each entity, analyze the text and identify logical connections to other entities
      - In connections, "target" should be the title of another entity
      - The "relationship" should describe how they are connected
      
      Text: ${text}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      // Remove any markdown code blocks or extra text
      const jsonStr = responseText.replace(/```json\n|```\n|```/g, "").trim();
      const data = JSON.parse(jsonStr);
      onExtractedData(data);
    } catch (error) {
      console.error("Error extracting entities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm p-4 shadow-sm border border-border/50">
      <div className="space-y-4">
        <div className="text-right">
          <h3 className="text-xl font-semibold mb-2">تحليل النص التاريخي</h3>
          <p className="text-muted-foreground">
            أدخل نصًا تاريخيًا وسيقوم الذكاء الاصطناعي باستخراج الشخصيات
            والأحداث والمصطلحات
          </p>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="أدخل النص التاريخي هنا..."
          className="min-h-[200px] text-right"
        />
        <div className="flex justify-end">
          <Button
            onClick={extractEntities}
            disabled={!text.trim() || isLoading}
            className="w-full md:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            تحليل النص
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AITextInput;
