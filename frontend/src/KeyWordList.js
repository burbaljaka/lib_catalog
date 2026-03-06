import React, { Component } from 'react';
import KeyWordManager from './KeyWordAPI';

const key_wordManager = new KeyWordManager();

class KeyWordList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key_words:[],
    };
    this.handleDelete = this.handleDelete.bind(this);
  };

  componentDidMount() {
    var self = this;
    key_wordManager.getKeyWords().then(function(result) {
      self.setState({key_words: result});
    });
  }

  handleDelete(key_word) {
    var self = this;
    key_wordManager.deleteKeyWord(key_word.id).then(()=>{
      var newArr = self.state.key_words.filter(function(obj){
        return obj.id !== key_word.id;
      });
      self.setState({key_words: newArr})
    });
  }

  render() {
    var self = this;
    return (
      <>
        <div className="app-list-header">
          <h1 className="app-list-title">Ключевые слова</h1>
          <a className="btn btn-primary btn-sm" href="/key_words/manage/">Создать ключевое слово</a>
        </div>
        <div className="app-card key-words--list">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ключевое слово</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.key_words.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>Нет записей</td>
                </tr>
              ) : (
                this.state.key_words.map(function(a) {
                  return (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.name}</td>
                      <td>
                        <a href={"/key_words/manage/" + a.id} className="btn btn-sm btn-outline-light">Изменить</a>
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
export default KeyWordList;
