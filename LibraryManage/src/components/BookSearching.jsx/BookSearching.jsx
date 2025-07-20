import React from 'react'
import Book from '../Book/Book';

function BookSearching({paginatedbooks,filter,books,bookname}) {
    if (books.length === 0 || bookname.trim() === "") {
        return <Book books={paginatedbooks}/>;
    }
     let results = [];

    if (filter === "title") {
        results = books.filter((n) =>
            n.Title.toLowerCase().includes(bookname.toLowerCase())
        );
    } else if (filter === "author") {

        results = books.filter((n) =>
            n.Author.toLowerCase().includes(bookname.toLowerCase()) //use n.PRN... for sies data
        );
    }else{
        results = paginatedbooks;
       
    }

    return <Book books={results}  />;

 
}

export default BookSearching
