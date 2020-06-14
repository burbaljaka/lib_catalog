import React, { Component, useState } from 'react';
import BookManager from './BookApi';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import BBKManager from './BBKApi';
import CityManager from './CitiesApi';
import PubManager from './PubApi';
import KeyWordManager from './KeyWordAPI';
import AuthorManager from './AuthorApi'

import Select, { components } from "react-select";


const bookManager = new BookManager();
const bbkManager = new BBKManager();
const cityManager = new CityManager();
const pubManager = new PubManager();
const key_wordManager = new KeyWordManager();
const authorManager = new AuthorManager();

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

    return (
        <div
            ref={ref}
            style={style}
            className={className}
            aria-labelledby={labeledBy}
        >
        <input
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
        />
        <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
                (child) =>
                !value || child.props.children.toLowerCase().includes(value.toLowerCase()),
            )}
        </ul>
        </div>
        );
    },
);

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
        className="btn btn-sm btn-outline-light delete"
        ref={ref}
        onClick={(e) => {
        e.preventDefault();
        onClick(e);
        }}
    >
    {children}
    &#x25bc;
    </button>
));

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
                key_words:[],
                place: '',
                pages: '',
            },
            cities:[],
            publishing_houses:[],
            issue_city: {
                id:null,
                name:''
            },
            publishing_house: {
                id:null,
                name:''
            },
            new_city: '',
            bbk:[],
            key_words: [],
            authors: [],
            redirect: false
        };
    // добавить для получения списков данных
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCitiesDropdown = this.handleCitiesDropdown.bind(this);
    this.handleHouseDropdown = this.handleHouseDropdown.bind(this);
    this.handleKeyWordDropdown = this.handleKeyWordDropdown.bind(this);
    this.handleBookKeyWordDropDown = this.handleBookKeyWordDropDown.bind(this);
    this.handleBookBBKDropDown = this.handleBookBBKDropDown.bind(this);
    this.handleBookAuthorsDropDown = this.handleBookAuthorsDropDown.bind(this);
    }

    componentDidMount(){
        cityManager.getCities().then(function(result) {
            self.setState({cities:result})});
        pubManager.getPubs().then(function(result) {
            self.setState({publishing_houses:result})});
        bbkManager.getBBKs().then(function(result) {
            self.setState({bbk:result})});
        key_wordManager.getKeyWords().then(function(result){
            self.setState({key_words:result})});
        authorManager.getAuthors().then(function(result){
            self.setState({authors:result})});
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
                        key_words: a.keywords,
                        place: a.place,
                        pages: a.pages
                    },
                    issue_city: a.issue_city,
                    publishing_house: a.publishing_house,
                })
            });

        ;
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
            "keywords": this.state.currentBook.key_words,
            "issue_city": this.state.issue_city,
            "publishing_house": this.state.publishing_house,
            "place": this.state.currentBook.place,
            "pages": this.state.currentBook.pages,
        }).then((result)=>{
            alert("Книга создана!");
        }).catch((err)=>{
            alert(err.message);
        });
    }

    handleSubmit(e){
        const { match: { params } } = this.props;
        if (params && params.pk){
            this.handleUpdate(params.pk);
        } else {
            this.handleCreate(params);
        }
        e.preventDefault();
    }

    handleChange(e){
        this.setState({
            currentBook:{...this.state.currentBook,
                [e.target.id]:e.target.value
            }
        })
    }

    handleCitiesDropdown(e){
        this.setState({
            issue_city:{
                name:e.target.innerText,
                id: e.target.id
            }
        });
    }

    handleHouseDropdown(e){
        this.setState({
            publishing_house:{
                name:e.target.innerText,
                id: e.target.id
            }
        });
    }

    handleKeyWordDropdown(e){
        this.setState({
            key_words:{
                name:e.target.innerText,
                id: e.target.id
            }
        });
    }

//    renderKeyWords() {
//        return (this.state.key_words.map(data=>({label:data.name, value:data.id})))
//    }

//    renderBookKeyWords() {
//        return (this.state.currentBook.key_words.map(data=>({label:data.name, value:data.id})))
//    }

    handleBookKeyWordDropDown (key_wor)  {
        let keys;
        if (key_wor !== null) {
            keys = key_wor;
        } else {
            keys = []
        };
        this.setState({
            currentBook:{...this.state.currentBook,
                        key_words: keys
                    }
        });
    }

    handleBookBBKDropDown (bbks)  {
        let bks;
        if (bbks !== null) {
            bks = bbks;
        } else {
            bks = []
        };
        this.setState({
            currentBook:{...this.state.currentBook,
                bbk: bks
            }
        });
    }

    handleBookAuthorsDropDown (book_author) {
        let just_authors;
        if (book_author !== null) {
            just_authors = book_author;
        } else {
            just_authors = []
        };
        this.setState({
            currentBook:{...this.state.currentBook,
                author: just_authors
            }
        });
        if (this.state.currentBook.author_sign === []) {
            this.setState({
                currentBook:{...this.state.currentBook,
                            author_sign: just_authors[0].author_code
                        }
        })}

    }

    render() {
        var self = this;
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
                    <textarea className="form-control" id="description" rows="7" type="text" value={this.state.currentBook.description} onChange={this.handleChange}/>

                    <label>Расположение</label>
                    <input className="form-control" id="place" type="text" value={this.state.currentBook.place} onChange={this.handleChange}/>

                    <label>Количество страниц</label>
                    <input className="form-control" id="pages" type="text" value={this.state.currentBook.pages} onChange={this.handleChange}/>

                    <div className="row justify-content-end">
                        <div className="col-8">
                            <label>Город издательства: <strong>{this.state.issue_city.name}</strong></label>
                        </div>
                        <div className="col-4">
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    Выбрать город издательства
                                </Dropdown.Toggle>
                                <Dropdown.Menu as={CustomMenu}>
                                    {this.state.cities.map(function(c){
                                        return <Dropdown.Item eventKey={c.id} id={c.id} onClick={self.handleCitiesDropdown}>{c.name}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="row justify-content-end">
                        <div className="col-8">
                            <label>Издательство: <strong>{this.state.publishing_house.name}</strong></label>
                        </div>
                        <div className="col-4">
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    Выбрать издательство
                                </Dropdown.Toggle>
                                <Dropdown.Menu as={CustomMenu}>
                                    {this.state.publishing_houses.map(function(c){
                                        return <Dropdown.Item eventKey={c.id} id={c.id} onClick={self.handleHouseDropdown}>{c.name}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="row justify-content-end">
                        <div className="col-4">
                            <label>Ключевые слова:
                            </label>
                        </div>
                        <div className="col-8">
                            <Select
                                closeMenuOnSelect={false}
                                options={this.state.key_words}
                                value={this.state.currentBook.key_words}
                                getOptionLabel={ x => x.name}
                                getOptionValue={ x => x.id}
                                onChange={this.handleBookKeyWordDropDown}
                                isMulti
                                isSearchable
                                placeholder="Выберите ключевые слова"
                            />
                        </div>
                    </div>

                    <div className="row justify-content-end">
                        <div className="col-4">
                            <label>ББК:</label>
                        </div>
                        <div className="col-8">
                            <Select
                                closeMenuOnSelect={false}
                                options={this.state.bbk}
                                value={this.state.currentBook.bbk}
                                getOptionLabel={ x => (x.code+' '+x.description)}
                                getOptionValue={ x => x.id}
                                onChange={this.handleBookBBKDropDown}
                                isMulti
                                isSearchable
                                placeholder="Выберите ББК"
                            />
                        </div>
                    </div>

                    <div className="row justify-content-end">
                        <div className="col-4">
                            <label>Авторы:</label>
                        </div>
                        <div className="col-8">
                            <Select
                                closeMenuOnSelect={false}
                                options={this.state.authors}
                                value={this.state.currentBook.author}
                                getOptionLabel={ x => (x.lname+' '+x.fname+' '+x.mname)}
                                getOptionValue={ x => x.id}
                                onChange={this.handleBookAuthorsDropDown}
                                isMulti
                                isSearchable
                                placeholder="Выберите авторов"
                            />
                        </div>
                    </div>
                </div>

            <input className="btn btn-primary" type="submit" value="Сохранить"/>


        </form>
    </div>
    );
  }

}
export default BookCreateUpdate;


