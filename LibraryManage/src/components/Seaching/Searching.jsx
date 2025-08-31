import React from 'react'
import Student from '../Student/Student'

function Searching({ search, filter, name, Students }) {
    if (name.length === 0 || search.trim() === "") {
        return <Student name={name} Students={Students}/>;
    }

    let results = [];

    if (filter === "name") {
        results = name.filter((n) =>
            n.name.toLowerCase().includes(search.toLowerCase())
        );
    } else if (filter === "PRN") {
        results = name.filter((n) =>
            n.PRN.toLowerCase().includes(search.toLowerCase()) //use n.PRN... for sies data
        );
    }else{
        results = name.filter((n) =>
            n.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    return <Student name={results} Students={Students} />;
}


export default Searching
 
