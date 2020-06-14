import React, { Component } from 'react';
import AuthorManager from './AuthorApi';

const authorManager = new AuthorManager();

class AuthorCreateUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id:null,
        fname:'',
        mname:'',
        lname:'',
        author_code:'',
      }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    const {match: {params}} = this.props;
    if(params && params.pk) {
      authorManager.getAuthor(params.pk).then((a)=>{
        this.setState({
          fname:a.fname,
          mname:a.mname,
          lname:a.lname,
          author_code: a.author_code
        })
      })
    }
  }

  handleUpdate(pk){
    authorManager.updateAuthor({
      "pk": pk,
      "fname": this.state.fname,
      "mname": this.state.mname,
      "lname": this.state.lname,
      "author_code": this.state.author_code,
    }).then((result)=>{
        alert("Автор отредактирован!");
      }).catch(()=>{
        alert("Ошибка! Проверь форму!");
      });
  }

  handleCreate(){
    authorManager.createAuthor({
      "fname": this.state.fname,
      "mname": this.state.mname,
      "lname": this.state.lname,
      "author_code": this.state.author_code,
    }).then((result)=>{
        alert("Автор создан!");
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
          <label>Фамилия</label>
          <input onChange={this.handleChange} id="lname" className="form-control" type="text" value={this.state.lname}/>

          <label>Имя</label>
          <input className="form-control" id="fname" type="text" value={this.state.fname} onChange={this.handleChange}/>

          <label>Отчество</label>
          <input className="form-control" id="mname" type="text" value={this.state.mname} onChange={this.handleChange}/>

          <label>Авторский знак</label>
          <input className="form-control" id="author_code" type="text" value={this.state.author_code} onChange={this.handleChange}/>

          <input className="btn btn-primary" type="submit" value="Сохранить"/>


        </div>
      </form>
      <a href="http://lib.sportedu.ru/HAVkina1.idc" style={{color: 'black'}}>Таблицы авторских знаков</a>
      </div>
    );
  }

}
export default AuthorCreateUpdate;
