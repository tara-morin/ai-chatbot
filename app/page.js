import {Link, Button, Typography, Box} from '@mui/material';
export default function Home(){

    return (
        <Box 
            bgcolor="#ffd9e8"
            width="100vw"
            height= "100vh">
        <Box
            sx={{
                justifyContent:'center',
                alignItems: 'center',
                display: 'flex',
                alignContent:'center',
                flexDirection:'column',
                padding:20
            }}
        >
        <Typography
            sx={{fontFamily:'-apple-system, system-ui, BlinkMacSystemFont',
                fontSize:'40px',
                textAlign:'center'
            }}
        >
            Welcome to the relationship textbot!
        </Typography>
        <Button variant= "contained">
            <Link underline= "none" href="/chatting" color="white">Get Started</Link>
        </Button>
        </Box>
        </Box>
    )

}