import * as express from "express";
import pgPromise from "pg-promise";

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;
    const port = parseInt( process.env.PGPORT, 10 );
    const config = {
        database: process.env.PGDATABASE,
        host: process.env.PGHOST,
        port,
        user: process.env.PGUSER
    };

    const pgp = pgPromise();
    const db = process.env.NODE_ENV === 'production' ? pgp(process.env.DATABASE_URL) : pgp( config );

    app.get( `/api/book/all`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const bookshelfs = await db.any( `
                SELECT
                    id
                    , title
                    , author
                    , year
                    , genre
                FROM    books
                WHERE   user_id = $[userId]
                ORDER BY year, title, author`, { userId } );
            return res.json( bookshelfs );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.get( `/api/book/total`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const total = await db.one( `
            SELECT  count(*) AS total
            FROM    books
            WHERE   user_id = $[userId]`, { userId }, ( data: { total: number } ) => {
                return {
                    total: +data.total
                };
            } );
            return res.json( total );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.get( `/api/book/find/:search`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const bookshelf = await db.any( `
                SELECT
                    id
                    , title
                    , author
                    , year
                    , genre
                FROM    books
                WHERE   user_id = $[userId]
                AND   ( title ILIKE $[search] OR author ILIKE $[search] )`,
                { userId, search: `%${ req.params.search }%` } );
            return res.json( bookshelf );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.post( `/api/book/add`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = await db.one( `
                INSERT INTO books( user_id, title, author, year, genre )
                VALUES( $[userId], $[title], $[author], $[year], $[genre] )
                RETURNING id;`,
                { userId, ...req.body  } );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.post( `/api/book/update`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = await db.one( `
                UPDATE books
                SET title = $[title]
                    , author = $[author]
                    , year = $[year]
                    , genre = $[genre]
                WHERE
                    id = $[id]
                    AND user_id = $[userId]
                RETURNING
                    id;`,
                { userId, ...req.body  } );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.delete( `/api/book/remove/:id`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = await db.result( `
                DELETE
                FROM    books
                WHERE   user_id = $[userId]
                AND     id = $[id]`,
                { userId, id: req.params.id  }, ( r ) => r.rowCount );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );
};