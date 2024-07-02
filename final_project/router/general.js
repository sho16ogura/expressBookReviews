const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios').default;


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "Invalid user name. Please use different one"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});

});

/*
// Get the book list available in the shop
public_users.get('/', (req, res) => {

    res.status(200).send(JSON.stringify(books, null, 4));
});
*/

public_users.get('/', (req, res) => {
    axios.get("https://ogurasho16-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/").then(resp => {
        res.send(resp);
    }).catch(function(err) {
        res.send(err);
    })

})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn;
    let book = books[isbn];

    if (book){

        res.status(200).send(books[isbn]);
        
    } else{

        res.status(404).send(`Cannot find book with isbn ${isbn}`);

    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const author = req.params.author;
    let booksByAuthor = []

    for (isbn of Object.keys(books)){

        let book = books[isbn];

        if (author == book.author){

            booksByAuthor.push({
                "isbn":isbn,
                "title":book.title,
                "reviews":book.reviews
            })
        }
    }

    if (booksByAuthor.length > 0){
        res.status(200).send(booksByAuthor);
    }else{
        res.status(404).send(`Cannot find book written by author ${author}`)
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const title = req.params.title;
    let booksByTitle = []

    for (isbn of Object.keys(books)){

        let book = books[isbn];

        if (title == book.title){

            booksByTitle.push({
                "isbn":isbn,
                "author":book.author,
                "reviews":book.reviews
            })
        }
    }

    if (booksByTitle.length > 0){
        res.status(200).send(booksByTitle);
    }else{
        res.status(404).send(`Cannot find book titled ${title}`)
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];

    if (book){

        res.status(200).send({"reviews": book.reviews});
        
    } else{

        res.status(404).send(`Cannot find book with isbn ${isbn}`);

    }
});



module.exports.general = public_users;
