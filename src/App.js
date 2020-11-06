import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, } from 'react-router-dom';
import './App.css'; 
import Header from './components/Header'; 
import Search from './components/Search'; 
import SearchList from './components/SearchList';
import Bookcase from './pages/Bookcase.js'; 
import About from './pages/About'; 
import initialBooks from './models/books.json';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = (props) => {

  const [searchBooks, setSearchBooks] = useState(initialBooks);
  const [ keyword, setKeyword ] = useState('');
  const [ bookcase, setBookcase ] = useState([])
  const [ count, setCount ] = useState(0); 


  async function findBooks(value) {
    const results = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${value}&filter=paid-ebooks&print-type=books&projection=lite`).then
    (res => res.json()); 
    if(!results.error) {
      setSearchBooks(results.items); 
    } 
  }

   useEffect (() => {
     document.title = `${count} Book(s) added to bookcase`; 
   })


  function addBook(title) {
    const addedBook = searchBooks.find(book => {
      if (title === book.volumeInfo.title) {
        return true; 
      }
      return false; 
    });
    setBookcase((existingBooks)=> [...existingBooks, addedBook])
    setCount(count + 1); 

    const remainingSearchBooks = searchBooks.filter(book => {
      if (title === book.volumeInfo.title) {
        return false; 
      }
      return true; 
    });
    setSearchBooks(remainingSearchBooks)
    
    //experiment with remove button 
    //function removeBook(title) {
    //  console.log(`The book ${title} was clicked`);
    //  const newBookcaseList = bookcase.filter(book => title !== book.volumeInfo.title); 
    //  setBookcase(newBookcaseList);
    //}

  }



  return (
    <BrowserRouter>
      <Header count={count} />
      <Route exact path="/" render={() => (
        <Bookcase bookcase={bookcase} />
        
      
      )} />
      <Route exact path="/search" render={() => (
        <>
          <Search findBooks={findBooks} keyword={keyword} setKeyword={setKeyword} />
          <SearchList books={searchBooks} addBook={addBook} />
        </>
      )} />
      <Route exact path="/about" render={() => (
        <>
          <About />
        </>
      )} />
    </BrowserRouter>
  ); 
}
export default App;

