import React, { Component } from 'react';
import BookManager from './BookApi';


const bookManager = new BookManager();

class BookList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      books:[],
    }
  };

  componentDidMount() {
    var self = this;
    bookManager.getBooks().then(function(result) {
      self.setState({books: result});
    });
  }



  render() {
    var self = this;
    return (
      <>
        <div className="app-list-header">
          <h1 className="app-list-title">Книги</h1>
          <a className="btn btn-primary btn-sm" href="/books/manage/">Создать книгу</a>
        </div>
        <div className="app-card books--list">
          <table className="table">
            <thead key="thead">
              <tr>
                <th>#</th>
                <th>Автор</th>
                <th>Название</th>
                <th>Год</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.books.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>
                    Нет книг. <a href="/books/manage/">Добавить книгу</a>
                  </td>
                </tr>
              ) : (
                this.state.books.map(function(b) {
                  return (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{(b.author || []).map(function(a, index) {
                        if (index === 0) return <span key={a.id}>{a.short_name}</span>;
                        return <span key={a.id}>, {a.short_name}</span>;
                      })}</td>
                      <td>{b.name}</td>
                      <td>{b.issue_year}</td>
                      <td>
                        <a href={"/books/card/" + b.id} className="btn btn-sm btn-outline-light">Карточка</a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
export default BookList;
