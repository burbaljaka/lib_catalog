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
      console.log(result);
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
    var self = this
    return (
      <div className="authors--list">
        <table className="table">
          <thead key="thead">
          <tr>
            <th>#</th>
            <th>Имя</th>
            <th>Авторский знак</th>
          </tr>
          </thead>
          <tbody>
            {this.state.authors.map(function(a){
              return (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.lname} {a.fname} {a.mname}</td>
                  <td>{a.author_code}</td>
                  <td>
                    <a href={"/author/" + a.id} className="btn btn-sm btn-outline-light delete">Изменить</a>
                    <button onClick={()=> self.handleDelete(a)} className="btn btn-sm btn-outline-light delete">Удалить</button>
                  </td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
export default AuthorList;
