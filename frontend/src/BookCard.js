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
      additional_data: '',
      series: '',
      issue_city: {},
      publishing_house: {},
      issue_year: '',
      pages: '',
      redirect: false,
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
        this.setState({
          id:params.pk,
          name:a.name,
          bbk:a.bbk,
          authors:a.author,
          author_sign: a.authorSign,
          keywords: a.keywords,
          description: a.description,
          place: a.place,
          additional_data: a.additionalData,
          series: a.series,
          issue_city: a.issueCity,
          publishing_house: a.publishingHouse,
          issue_year: a.issueYear,
          pages: a.pages,
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
      <div className="app-book-card">
        <div className="book-card-actions">
          <a href={"/books/manage/" + this.props.match.params.pk} className="btn btn-primary btn-sm">Изменить</a>
          <button type="button" onClick={() => self.handleDelete(this.props.pk)} className="btn btn-sm btn-outline-light">Удалить</button>
        </div>
        <table className="table">
          <tbody>
            <tr>
              <td>ББК</td>
              <td>{(this.state.bbk || []).map(function(b) { return <span key={b.id} style={{ marginRight: '8px' }}>{b.code}</span>; })}</td>
            </tr>
            <tr>
              <td>Автор</td>
              <td>{this.state.author_sign} {(this.state.authors || []).map(function(a, index) {
                if (index === 0) return <span key={a.id}>{a.shortName}</span>;
                return <span key={a.id}>, {a.shortName}</span>;
              })}</td>
            </tr>
            <tr>
              <td>Название</td>
              <td>{self.state.name} {self.state.additional_data && '/ ' + self.state.additional_data} — {(self.state.issue_city && self.state.issue_city.name) || '—'}: {(self.state.publishing_house && self.state.publishing_house.name) || '—'}, {self.state.issue_year}. — {self.state.pages} {self.state.series && '— ' + self.state.series}</td>
            </tr>
            {this.state.description && (
              <tr>
                <td>Аннотация</td>
                <td><i>{this.state.description}</i></td>
              </tr>
            )}
            {this.state.place && (
              <tr>
                <td>Расположение</td>
                <td>{this.state.place}</td>
              </tr>
            )}
            {(this.state.keywords || []).length > 0 && (
              <tr>
                <td>Ключевые слова</td>
                <td>{(this.state.keywords || []).map(function(w) { return <span key={w.id}>{w.name}, </span>; })}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

export default BookCard;
