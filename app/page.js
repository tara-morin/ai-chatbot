'use client'
import { Stack } from "@mui/material";
import Image from "next/image";
import {useState} from 'react';

export default function Home() {
  const [messages, setMessages]= useState([{
    role:'assistant', 
    content:'Hi, I am the Headstarter Support Agent. How can I assist you today?'
  }])
  const[message, setMessage]= useState('')

  return(
    <Box
      width="100vw"
      height= "100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
      direction= "column"
      width= "600px"
      height= "700px"
      border= "1px solid black"
      p={2} spacing={3}>
        <Stack direction="column" spacing= {2} flexGrow={1} overflow="auto" maxHeight= "100%">

          {messages.map((message, index)=>(
              <Box key= {index} display= "flex" justifyContent={
                message.role==='assistant'? 'flex-start': 'flex-end'}> 
                {/* makes it so the message goes to one side or the other depending on if its from the chatbot or not */}
                <Box bgcolor= {
                  message.role==='assistant'? 'primary.main' : 'secondary.main'} color= "white" borderRadius={16} p={3}>
                    {/* changes message color depending on role. regular color is the oclor of the text, border radius makes the edges curved */}
                    {message.content}
                </Box>
                </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
