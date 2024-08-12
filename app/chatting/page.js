'use client'
import {Link, Box, Stack, TextField, Button} from '@mui/material';
import SendIcon from '@mui/icons-material/Send'
import Image from "next/image";
import {useState} from 'react';

export default function Home() {
  const [messages, setMessages]= useState([{
    role:'assistant',
    content:'Hey! What can I help you with'
  },])
  const[message, setMessage]= useState('')

  //helper funciton to send our current messages array to the backend and get a response
  const sendMessage = async () => {
    setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])
  
    // Send the message to the server
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()  // Get a reader to read the response body
      const decoder = new TextDecoder()  // Create a decoder to decode the response text
  
      let result = ''
      // Function to process the text from the response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })  // Decode the text
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]  // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1)  // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },  // Append the decoded text to the assistant's message
          ]
        })
        return reader.read().then(processText)  // Continue reading the next chunk of the response
      })
    })
  }

  return(
    <Box
      width="100vw"
      height= "100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#ffd9e8"
    >
      <Box
      width= "600px"
      height= "700px"
      sx={{
        bgcolor: 'white'
      }}>
      <Stack
      direction= "column"
      width= "600px"
      height= "700px"
      fontFamily='-apple-system, system-ui, BlinkMacSystemFont'
      border= "1px solid black"
      p={2} spacing={3}>
        <Stack direction="column" spacing= {2} flexGrow={1} overflow="auto" maxHeight= "100%">
          {messages.map((message, index)=>(
              <Box key= {index} display= "flex" 
              justifyContent={
                message.role==='assistant'? 'flex-start': 'flex-end'}> 
                {/* makes it so the message goes to one side or the other depending on if its from the chatbot or not */}
                <Box bgcolor= {
                  message.role==='assistant'? '#f5f5f5' : '#147efb'} color= {
                    message.role==='assistant'? 'black' : 'white'} borderRadius={16} p={3}>
                    {/* changes message color depending on role. regular color is the oclor of the text, border radius makes the edges curved */}
                    {message.content}
                </Box>
                </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField 
          label= "Ask a question..." 
          fullWidth 
          value={message}
          onChange={(e)=> setMessage(e.target.value)}
          />
            <Button variant= "contained" onClick= {sendMessage} endIcon={<SendIcon />}>
              Send</Button>
        </Stack>
      </Stack>
      </Box>
    </Box>
  )
}
