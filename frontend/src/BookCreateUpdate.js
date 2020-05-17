import React, { Component } from 'react';
import BookManager from './BookApi';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import BBKManager from './BBKApi';
import CityManager from './CitiesApi';

const bookManager = new BookManager();
const bbkManager = new BBKManager();
const cityManager = new CityManager();

class BookCreateUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBook:{
        id:null,
        name:'',
        author:[],
        description:'',
        author_sign:'',
        issue_year:'',
        issue_city: '',
        publishing_house: '',
        bbk:[],
        keywords:[],
        place: '',
        pages: '',
      },
      cities:[],
      issue_city: {
        id:null,
        name:''
      },
      publishing_house: {
        id:null,
        name:''
      },
      redirect: false
      };
    // добавить для получения списков данных
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCitiesDropdown = this.handleCitiesDropdown.bind(this);
  }

  componentDidMount(){
    const {match: {params}} = this.props;
    let self = this;
    if(params && params.pk) {
      bookManager.getBook(params.pk).then((a)=>{
        this.setState({
          currentBook:{
            name:a.name,
            author:a.author,
            description:a.description,
            author_sign: a.author_sign,
            issue_year: a.issue_year,
            issue_city: a.issue_city.name,
            publishing_house: a.publishing_house.name,
            bbk: a.bbk,
            keywords: a.keywords,
            place: a.place,
            pages: a.pages
          },
          issue_city: a.issue_city,
          publishing_house: a.publishing_house,
        })
      });
      cityManager.getCities().then(function(result) {
        self.setState({cities:result})
      });
    }
  }

  handleUpdate(pk){
    bookManager.updateBook({
      "pk": pk,
      "name": this.state.currentBook.name,
      "author": this.state.currentBook.author,
      "description": this.state.currentBook.description,
      "author_sign": this.state.currentBook.author_sign,
      "issue_year": this.state.currentBook.issue_year,
      "bbk": this.state.currentBook.bbk,
      "keywords": this.state.currentBook.keywords,
      "issue_city": this.state.issue_city,
      "publishing_house": this.state.publishing_house,
      "place": this.state.currentBook.place,
    }).then((result)=>{
      console.log(result);
        alert("Книга отредактирована!");
      }).catch(()=>{
        alert("Ошибка! Проверь форму!");
      });
  }

  handleCreate(){
    bookManager.createBook({
      "name": this.state.currentBook.name,
      "author": this.state.currentBook.author,
      "description": this.state.currentBook.description,
      "author_sign": this.state.currentBook.author_sign,
      "issue_year": this.state.currentBook.issue_year,
      "bbk": this.state.currentBook.bbk,
      "keywords": this.state.currentBook.keywords,
      "issue_city": this.state.issue_city,
      "publishing_house": this.state.publishing_house,
      "place": this.state.currentBook.place,
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
      currentBook:{
        [e.target.id]:e.target.value
      }
      })
  }

  handleCitiesDropdown(e){
    this.setState({
        issue_city:{
          name:e.target.text,
          id: e.target.id
        }
      }
    );
  }

  render() {
    var self = this;
    console.log(this.state);
    return (
      <div className="container">
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label >Название</label>
          <input onChange={this.handleChange} id="name" className="form-control" type="text" value={this.state.currentBook.name}/>

          <label>Авторский знак</label>
          <input className="form-control" id="author_sign" type="text" value={this.state.currentBook.author_sign} onChange={this.handleChange}/>

          <label>Год издания</label>
          <input className="form-control" id="issue_year" type="text" value={this.state.currentBook.issue_year} onChange={this.handleChange}/>

          <label>Описание</label>
          <input className="form-control" id="description" type="text" value={this.state.currentBook.description} onChange={this.handleChange}/>

          <label>Расположение</label>
          <input className="form-control" id="place" type="text" value={this.state.currentBook.place} onChange={this.handleChange}/>

          <label>Количество страниц</label>
          <input className="form-control" id="pages" type="text" value={this.state.currentBook.pages} onChange={this.handleChange}/>

          <div className="row justify-content-end">

            <div className="col-8">

              <label>Город издательства: <strong>{this.state.issue_city.name}</strong></label>
            </div>
            <div className="col-4">
              <DropdownButton title="Город издательства">
                {this.state.cities.map(function(c){
                  return (<Dropdown.Item id={c.id} onClick={self.handleCitiesDropdown}>{c.name}</Dropdown.Item>)
                })}
              </DropdownButton>
            </div>
          </div>

          <input className="btn btn-primary" type="submit" value="Сохранить"/>

        </div>
      </form>
      </div>
    );
  }

}
export default BookCreateUpdate;
