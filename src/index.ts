import express from "express";
import path from "path";
import * as sessionAuth from "./middleware/sessionAuth";
import * as routes from "./routes";


// tslint:disable-next-line:no-var-requires
if (process.env.NODE_ENV !== 'production') require("dotenv").config();


const port = process.env.PORT;

const app = express();
app.use( express.json() );

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );
app.use( express.static( path.join( __dirname, "public" ) ) );


sessionAuth.register( app );
routes.register( app );
app.get( "/", ( req, res ) => {
    res.render( "index" );
} );
app.listen( port, () => {
        // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );