import {Button, Typography} from '@mui/material';
import Link from 'next/link'
export default function Home(){

    return (
        <div>
        <Typography
        fontFamily='-apple-system, system-ui, BlinkMacSystemFont'>
            Welcome to your relationship textbot!
        </Typography>
        <Button variant= "contained">
            <Link href="/chatting">Get Started</Link>
        </Button>
        </div>
    )

}