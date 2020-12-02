import express from "express";
import path from "path";
import dotenv from "dotenv";
import * as sessionAuth from "./middleware/sessionAuth";
import * as routes from "./routes";

// initialize configuration
dotenv.config();

const port = process.env.SERVER_PORT;

const app = express();
app.use( express.json() );

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );
app.use( express.static( path.join( __dirname, "public" ) ) );


// Configure session auth
sessionAuth.register( app );

// Configure routes
routes.register( app );
// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.render( "index" );
} );

// start the Express server
app.listen( port, () => {
        // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );