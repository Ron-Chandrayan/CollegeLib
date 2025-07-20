import React from 'react'
import Book from '../Book/Book';

function BookSearching({paginatedbooks,filter,books,bookname,filter2,bookname2, filter3,bookname3}) {
    if (books.length === 0 || bookname.trim() === "") {
        return <Book books={paginatedbooks}/>;
    }
     let results = [];

    if (filter === "title") {
        results = books.filter((n) =>
            n.Title.toLowerCase().includes(bookname.toLowerCase())
        );
        if(filter2==="author"){
            results = results.filter((n) =>
            n.Author.toLowerCase().includes(bookname2.toLowerCase())
        );
          if(filter3==="publisher"){
            results = results.filter((n) =>
            n.Publisher.toLowerCase().includes(bookname3.toLowerCase())
        );
          }
        
        }else if(filter2==="publisher"){
            results = results.filter((n) =>
            n.Publisher.toLowerCase().includes(bookname2.toLowerCase())
        );
           if(filter3==="author"){
            results = results.filter((n) =>
            n.Author.toLowerCase().includes(bookname3.toLowerCase())
        );
          }
        }
        
        
    } else if (filter === "author") {

        results = books.filter((n) =>
            n.Author.toLowerCase().includes(bookname.toLowerCase()) //use n.PRN... for sies data
        );
        if(filter2==="title"){
            results = results.filter((n) =>
            n.Title.toLowerCase().includes(bookname2.toLowerCase())
        );
        if(filter3==="publisher"){
             results = results.filter((n) =>
            n.Publisher.toLowerCase().includes(bookname3.toLowerCase())
        );
        }
        
        }else if(filter2==="publisher"){
            results = results.filter((n) =>
            n.Publisher.toLowerCase().includes(bookname2.toLowerCase())
        );
         if(filter3==="title"){
             results = results.filter((n) =>
            n.Title.toLowerCase().includes(bookname3.toLowerCase())
        );
        }
        }




    }else if(filter==="publisher"){
        results = books.filter((n) =>
            n.Publisher.toLowerCase().includes(bookname.toLowerCase()) //use n.PRN... for sies data
        )
        if(filter2==="title"){
            results = results.filter((n) =>
            n.Title.toLowerCase().includes(bookname2.toLowerCase())
        );
        if(filter3==="author"){
             results = results.filter((n) =>
            n.Author.toLowerCase().includes(bookname3.toLowerCase())
        );
        }
        
        }else if(filter2==="author"){
            results = results.filter((n) =>
            n.Author.toLowerCase().includes(bookname2.toLowerCase())
        );
        if(filter3==="title"){
             results = results.filter((n) =>
            n.Title.toLowerCase().includes(bookname3.toLowerCase())
        );
        }
        }
    }else{
        results = paginatedbooks;
       
    }

    return <Book books={results}  />;

 
}

export default BookSearching
