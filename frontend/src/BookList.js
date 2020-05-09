import React, { Component } from 'react';
import BookManager from './BookApi';


const bookManager = new BookManager();

class BookList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      books:[],
    };
    this.handleDelete = this.handleDelete.bind(this);
  };

  componentDidMount() {
    var self = this;
    bookManager.getBooks().then(function(result) {
      self.setState({books: result});
    });
  }

  handleDelete(book) {
    var self = this;
    bookManager.deleteBook(book).then(()=>{
      var newArr = self.state.books.filter(function(obj){
        return obj.id !== book.id;
      });
      self.setState({books: newArr})
    });
  }

  render() {
    var self = this
    return (
      <div className="container">
      <div className="books--list">
        <table className="table">
          <thead key="thead">
          <tr >
            <th>#</th>
            <th>Название</th>
            <th>Автор</th>
            <th>Год издания</th>
            <th>Действия</th>
            <th><a className="nav-item nav-link" href="/books/manage/">Создать книгу</a></th>
          </tr>
          </thead>
          <tbody>
            {this.state.books.map(function(b){
              return (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.author.map(function(a){
                    return (
                      <span key={a.id}>{a.short_name}, </span>)
                  })}</td>
                  <td>{b.name}</td>
                  <td>{b.issue_year}</td>
                  <td>
                    <a href={"/books/card/" + b.id} className="btn btn-sm btn-outline-light delete">Просмотреть карточку</a>
                    <a href={"/books/manage/" + b.id} className="btn btn-sm btn-outline-light delete">Изменить</a>
                    <button onClick={()=> self.handleDelete(b)} className="btn btn-sm btn-outline-light delete">Удалить</button>
                  </td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>
      </div>
      </div>
    );
  }
}
export default BookList;
