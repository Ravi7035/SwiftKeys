import {app,server} from "./lib/socket.js";
import 'dotenv/config';

const Port=process.env.PORT;

server.listen(Port,()=>
{
    console.log(`server running on port ${Port}`)
});

