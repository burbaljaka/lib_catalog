import React, { Component } from 'react';
import { toast } from 'react-toastify';
import AuthorManager from './AuthorApi';

const authorManager = new AuthorManager();

class AuthorCreateUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id:null,
        fname:'',
        lname:'',
        author_code:'',
        addition: '',
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
          lname:a.lname,
          author_code: a.author_code,
          addition: a.addition,
        })
      })
    }
  }

  handleUpdate(pk){
    authorManager.updateAuthor({
      "pk": pk,
      "fname": this.state.fname,
      "lname": this.state.lname,
      "author_code": this.state.author_code,
      "addition": this.state.addition,
    }).then((result)=>{
        toast.success("Автор отредактирован!");
      }).catch(()=>{
        toast.error("Ошибка! Проверь форму!");
      });
  }

  handleCreate(){
    authorManager.createAuthor({
      "fname": this.state.fname,
      "lname": this.state.lname,
      "author_code": this.state.author_code,
      "addition": this.state.addition,
    }).then((result)=>{
        toast.success("Автор создан!");
      }).catch(()=>{
        toast.error("Ошибка! Проверь форму!");
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
      <div className="app-form-card">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Фамилия</label>
            <input onChange={this.handleChange} id="lname" className="form-control" type="text" value={this.state.lname} />

            <label>Имя</label>
            <input className="form-control" id="fname" type="text" value={this.state.fname} onChange={this.handleChange} />

            <label>Авторский знак</label>
            <input className="form-control" id="author_code" type="text" value={this.state.author_code} onChange={this.handleChange} />

            <label>Справочная информация</label>
            <textarea className="form-control" id="addition" rows="4" value={this.state.addition} onChange={this.handleChange} />

            <input className="btn btn-primary" type="submit" value="Сохранить" />
          </div>
        </form>
        <a href="http://lib.sportedu.ru/HAVkina1.idc" style={{ color: 'var(--app-accent)', fontSize: '13px' }}>Таблицы авторских знаков</a>
      </div>
    );
  }

}
export default AuthorCreateUpdate;
