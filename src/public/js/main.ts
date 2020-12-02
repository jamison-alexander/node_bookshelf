import axios from "axios";
import * as M from "materialize-css";
import Vue from "vue";

// tslint:disable-next-line no-unused-expression
new Vue( {
    computed: {
        hazbookshelf(): boolean {
            return this.isLoading === false && this.bookshelf.length > 0;
        },
        nobookshelf(): boolean {
            return this.isLoading === false && this.bookshelf.length === 0;
        }
    },
    data() {
        return {
            title: "",
            genre: "",
            bookshelf: [],
            isLoading: true,
            author: "",
            selectedbook: "",
            selectedbookId: 0,
            year: ""
        };
    },
    el: "#app",
    methods: {
        addbookshelf() {
            const bookshelf = {
                title: this.title,
                genre: this.genre,
                author: this.author,
                year: this.year
            };
            axios
                .post( "/api/bookshelf/add", bookshelf )
                .then( () => {
                    this.$refs.year.focus();
                    this.title = "";
                    this.genre = "";
                    this.author = "";
                    this.year = "";
                    this.loadbookshelf();
                } )
                .catch( ( err: any ) => {
                    // tslint:disable-next-line:no-console
                    console.log( err );
                } );
        },
        confirmDeletebookshelf( id: string ) {
            const bookshelf = this.bookshelf.find( ( g ) => g.id === id );
            this.selectedbookshelf = `${ bookshelf.year } ${ bookshelf.title } ${ bookshelf.author }`;
            this.selectedbookshelfId = bookshelf.id;
            const dc = this.$refs.deleteConfirm;
            const modal = M.Modal.init( dc );
            modal.open();
        },
        deletebookshelf( id: string ) {
            axios
                .delete( `/api/bookshelf/remove/${ id }` )
                .then( this.loadbookshelf )
                .catch( ( err: any ) => {
                    // tslint:disable-next-line:no-console
                    console.log( err );
                } );
        },
        loadbookshelf() {
            axios
                .get( "/api/bookshelf/all" )
                .then( ( res: any ) => {
                    this.isLoading = false;
                    this.bookshelf = res.data;
                } )
                .catch( ( err: any ) => {
                    // tslint:disable-next-line:no-console
                    console.log( err );
                } );
        }
    },
    mounted() {
        return this.loadbookshelf();
    }
} );