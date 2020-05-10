import React, {Component} from 'react';
import BookManager from './BookApi';
import { Redirect } from "react-router-dom";

const bookManager = new BookManager();

class BookCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: '',
      bbk: [],
      authors: [],
      author_sign: '',
      keywords: [],
      description: '',
      place: '',
      redirect: false
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(book) {
    var self = this;
    const {match: {params}} = this.props;
    if(params && params.pk) {
      bookManager.deleteBook(params.pk).then(()=>{
        this.setState({redirect:true})
      })
    }
  }

  componentDidMount(){
    const {match: {params}} = this.props;
    if(params && params.pk) {
      bookManager.getBook(params.pk).then((a)=>{
        console.log(a);
        this.setState({
          name:a.name,
          bbk:a.bbk,
          authors:a.author,
          author_sign: a.author_sign,
          keywords: a.keywords,
          description: a.description,
          place: a.place
        })
      })
    }
  }

  render() {
    var self = this
    if (this.state.redirect === true) {
      return <Redirect to='/' />
    }
    return (
      <div className="container">
          <div className="book-card">
          <div className="row justify-content-end">
            <div className="col-1">
              <a href={"/books/manage/" + this.state.id} className="btn btn-sm btn-outline-light delete">Изменить</a>
            </div>
            <div className="col-1">
              <button onClick={()=> self.handleDelete(this.props.pk)} className="btn btn-sm btn-outline-light delete">Удалить</button>
            </div>
          </div>
              <table className="table">
              <tbody>
                  <tr>
                      {this.state.bbk.map(function(b){
                        return (
                          <td width="100">
                              {b.code}
                          </td>
                        )})}
                  </tr>
                  <tr>
                      <td>{this.state.author_sign}</td>
                      <td>{this.state.authors.map(function(a){
                        return (
                          <span>{a.short_name}, </span>
                        )
                      })}
                      </td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>{this.state.name}</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>{this.state.description}</td>
                  </tr>
                  <tr>
                      <td>{this.state.place}</td>
                      <td>{this.state.keywords.map(function(w){
                        return (
                          <span>{w.name}</span>
                        )
                      })}</td>
                  </tr>
              </tbody>
              </table>
          </div>
      </div>
    )
  }
}

export default BookCard;
