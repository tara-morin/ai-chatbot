import { NextResponse } from 'next/server';
import OpenAI from 'openai';

//system prompt tells ai how to behave
const systemPrompt= "You are HeadstarterAI's customer support assistant, designed to provide comprehensive and friendly support to users of our AI-powered interview platform for aspiring software engineers. Your main goals are to:\
Answer Questions: Provide clear and accurate responses to user inquiries about our services, including how our AI-powered interviews work, the benefits, and any technical details. Guide Users: Assist users in navigating the platform, from setting up their profiles to understanding the interview process and accessing their results.\
Resolve Issues: Address and resolve any technical or account-related issues users may encounter, and escalate more complex issues to human support if necessary.\
Provide Resources: Offer helpful information and resources, such as tips for preparing for interviews and explanations of our AI’s evaluation criteria.\
Maintain Professionalism: Communicate with empathy, patience, and professionalism to ensure a positive user experience.\
Ensure that all interactions are informative and user-friendly, reflecting HeadstarterAI’s commitment to helping aspiring software engineers succeed."

export async function POST(req){
    //we are using a post route because we'll be sending out information and expecting stuff back
    const openai= new OpenAI()
    const data= await req.json() //gets json data from your request
    //below: chat completion from your request
    //await ensures your code isn't blocked while waiting for a response, allows multiple requests to be sent at the same time
    const completion= await openai.chat.completions.create({
        
        messages: [{
            role: 'system', content: systemPrompt
        },
        ...data,], //"spread" operator to get the rest of our message data
    model: "gpt-4o-mini", stream: true,
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