
import OpenAI from 'openai';

export function useAi() {
  const client = new OpenAI({
    baseURL: "https://api.deepbricks.ai/v1/",
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    dangerouslyAllowBrowser: true
  });
  
  interface Input {
    system: string;
    user: string;
    assistant?: string;
  }
  const runAi = async(input:Input)=>{
    const response = await client.chat.completions.create({
      messages: [
        { role: 'system', content: input.system },
        { role: 'user', content: input.user }
      ],
      // model: 'gpt-3.5-turbo',
      model: 'gpt-4o-mini',
    });
    ;
    return response.choices[0].message.content;
  }



  return {
    runAi
  }
}