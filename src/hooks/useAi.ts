
import OpenAI from 'openai';

export function useAi() {
  const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    dangerouslyAllowBrowser: true
  });
  
  const runAi = async(input:any)=>{
    const response = await client.chat.completions.create({
      messages: [{ role: 'user', content: input }],
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