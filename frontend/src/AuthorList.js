import React, { Component } from 'react';
import AuthorManager from './AuthorApi';

const authorManager = new AuthorManager();

class AuthorList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authors:[],
    };
    this.handleDelete = this.handleDelete.bind(this);
  };

  componentDidMount() {
    var self = this;
    authorManager.getAuthors().then(function(result) {
      self.setState({authors: result});
    });
  }

  handleDelete(author) {
    var self = this;
    authorManager.deleteAuthor(author).then(()=>{
      var newArr = self.state.authors.filter(function(obj){
        return obj.id !== author.id;
      });
      self.setState({authors: newArr})
    });
  }

  render() {
    var self = this;
    return (
      <>
        <div className="app-list-header">
          <h1 className="app-list-title">Авторы</h1>
          <a className="btn btn-primary btn-sm" href="/authors/manage/">Создать автора</a>
        </div>
        <div className="app-card authors--list">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Имя</th>
                <th>Авторский знак</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.authors.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>Нет записей</td>
                </tr>
              ) : (
                this.state.authors.map(function(a) {
                  return (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.lname} {a.fname}</td>
                      <td>{a.author_code}</td>
                      <td>
                        <a href={"/authors/manage/" + a.id} className="btn btn-sm btn-outline-light">Изменить</a>
                        <button type="button" onClick={() => self.handleDelete(a)} className="btn btn-sm btn-outline-light">Удалить</button>
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
export default AuthorList;
