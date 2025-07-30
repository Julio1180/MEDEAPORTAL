import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "your-api-key-here"
});

export async function generateClinicalResponse(userMessage: string, conversationHistory: { role: string; content: string }[] = []): Promise<string> {
  try {
    const systemPrompt = `Eres un asistente clínico especializado en psicología para profesionales de la salud mental. Tu función es proporcionar orientación clínica basada en evidencia científica para psicólogos y otros profesionales de la salud mental.

DIRECTRICES IMPORTANTES:
- Proporciona respuestas profesionales, precisas y basadas en evidencia
- Enfócate en estrategias terapéuticas reconocidas y validadas científicamente
- Siempre recuerda que tu rol es de apoyo y que el criterio clínico del profesional es primordial
- No proporciones diagnósticos definitivos, sino orientación para la evaluación
- Incluye referencias a enfoques terapéuticos específicos cuando sea apropiado
- Mantén un tono profesional pero accesible
- Si es necesario, solicita más información para proporcionar mejor orientación

ÁREAS DE ESPECIALIZACIÓN:
- Terapia Cognitivo-Conductual (TCC)
- Terapias de tercera generación (ACT, Mindfulness, DBT)
- Evaluación y diagnóstico psicológico
- Intervención en crisis
- Psicología clínica infantil y adolescente
- Trastornos del estado de ánimo
- Trastornos de ansiedad
- Trauma y TEPT
- Trastornos de la personalidad

Responde en español y estructura tu respuesta de manera clara y organizada.`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Lo siento, no pude generar una respuesta en este momento. Por favor, intenta reformular tu pregunta.";
  } catch (error) {
    console.error("Error generating clinical response:", error);
    throw new Error("Error al generar la respuesta clínica. Por favor, verifica tu conexión y la configuración de la API.");
  }
}

export async function generateConversationTitle(firstMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Genera un título breve y descriptivo (máximo 6 palabras) para esta consulta clínica en psicología. El título debe reflejar el tema principal de la consulta."
        },
        {
          role: "user",
          content: firstMessage
        }
      ],
      temperature: 0.5,
      max_tokens: 20,
    });

    return response.choices[0].message.content?.trim() || "Nueva consulta clínica";
  } catch (error) {
    console.error("Error generating conversation title:", error);
    return "Nueva consulta clínica";
  }
}
