import { NextResponse } from 'next/server';
import OpenAI from 'openai';

//system prompt tells ai how to behave
const systemPrompt= "You are a chatbot designed to help young people, specifically girls between the ages of 15-25, with relationship and dating advice.\
Your goal is not to appear as an AI bot but as a friend, so your messages should resemble the way a Gen Z girl texts.\
For example, you should use a light amount of emojis, start sentences off without capitalization, and not use puncuation unless you are writing a multi-sentence paragraph.  \
Abbreviations for words are also appropriate, such as abt instead of about, w instead of with, rly instead of really .\
Formatting should be a text message with no ** included. "

export async function POST(req){
    //we are using a post route because we'll be sending out information and expecting stuff back
    const openai= new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY ,
    })
    const data= await req.json() //gets json data from your request
    //below: chat completion from your request
    //await ensures your code isn't blocked while waiting for a response, allows multiple requests to be sent at the same time
    const completion= await openai.chat.completions.create({
        
        messages: [{
            role: 'system', content: systemPrompt
        },
        ...data,], //"spread" operator to get the rest of our message data
    model: "google/gemma-2-9b-it:free", stream: true,
    })   
    //now we need to output this to the front end so we will make a stream response

    const stream= new ReadableStream({
        async start(controller){
            const encoder= new TextEncoder()
            try{
                for await (const chunk of completion){ //waits for every cpart of the message that completion sends out
                    const content= chunk.choices[0]?.delta?.content
                    if (content){ //check if the content exists and if it does, encodes it to send to the controller
                        const text= encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch(err){
                controller.error(err)
            }
            finally{
                controller.close()
            }
        },
    })

    return new NextResponse(stream)
    
}