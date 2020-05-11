import React, { Component } from 'react';
import BookManager from './BookApi';

const bookManager = new BookManager();

class BookCreateUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id:null,
        name:'',
        author:[],
        description:'',
        author_sign:'',
        issue_year:{},
        bbk:[],
        keywords:[],
        issue_city: {},
        publishing_house: {},
        place: '',
        pages: '',
        redirect: false
      };
    // добавить для получения списков данных
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    const {match: {params}} = this.props;
    if(params && params.pk) {
      bookManager.getBook(params.pk).then((a)=>{
        console.log(a);
        console.log(this.props);
        this.setState({
          name:a.name,
          author:a.author,
          description:a.description,
          author_sign: a.author_sign,
          issue_year: a.issue_year,
          bbk: a.bbk,
          keywords: a.keywords,
          issue_city: a.issue_city,
          publishing_house: a.publishing_house,
          place: a.place,
          pages: a.pages
        })
      })
    }
  }

  handleUpdate(pk){
    bookManager.updateBook({
      "pk": pk,
      "name": this.state.name,
      "author": this.state.author,
      "description": this.state.description,
      "author_sign": this.state.author_sign,
      "issue_year": this.state.issue_year,
      "bbk": this.state.bbk,
      "keywords": this.state.keywords,
      "issue_city": this.state.issue_city,
      "publishing_house": this.state.publishing_house,
      "place": this.state.place,
    }).then((result)=>{
        alert("Книга отредактирована!");
      }).catch(()=>{
        alert("Ошибка! Проверь форму!");
      });
  }

  handleCreate(){
    bookManager.createBook({
      "name": this.state.name,
      "author": this.state.author,
      "description": this.state.description,
      "author_sign": this.state.author_sign,
      "issue_year": this.state.issue_year,
      "bbk": this.state.bbk,
      "keywords": this.state.keywords,
      "issue_city": this.state.issue_city,
      "publishing_house": this.state.publishing_house,
      "place": this.state.place,
    }).then((result)=>{
        alert("Книга создана!");
      }).catch(()=>{
        alert("Ошибка! Проверь форму!");
      });
  }

  handleSubmit(e){
    const { match: { params } } = this.props;
    if (params && params.pk){
      this.handleUpdate(params.pk);
    }
    else {
      this.handleCreate(params);
    }
    e.preventDefault();
  }

  handleChange(e){
    this.setState({
        [e.target.id]:e.target.value
      })
  }

  render() {
    return (
      <div className="container">
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label>Название</label>
          <input onChange={this.handleChange} id="name" className="form-control" type="text" value={this.state.name}/>

          <label>Авторский знак</label>
          <input className="form-control" id="author_sign" type="text" value={this.state.author_sign} onChange={this.handleChange}/>

          <label>Год издания</label>
          <input className="form-control" id="issue_year" type="text" value={this.state.issue_year} onChange={this.handleChange}/>

          <label>Описание</label>
          <input className="form-control" id="description" type="text" value={this.state.description} onChange={this.handleChange}/>

          <label>Расположение</label>
          <input className="form-control" id="place" type="text" value={this.state.place} onChange={this.handleChange}/>

          <label>Количество страниц</label>
          <input className="form-control" id="pages" type="text" value={this.state.pages} onChange={this.handleChange}/>

          <input className="btn btn-primary" type="submit" value="Сохранить"/>

        </div>
      </form>
      </div>
    );
  }

}
export default BookCreateUpdate;
