import React, { Component } from 'react';
import BBKManager from './BBKApi';

const bbkManager = new BBKManager();

class BBKList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bbks:[],
    };
    this.handleDelete = this.handleDelete.bind(this);
  };

  componentDidMount() {
    var self = this;
    bbkManager.getBBKs().then(function(result) {
      self.setState({bbks: result});
    });
  }

  handleDelete(bbk) {
    var self = this;
    bbkManager.deleteBBK(bbk.id).then(()=>{
      var newArr = self.state.bbks.filter(function(obj){
        return obj.id !== bbk.id;
      });
      self.setState({bbks: newArr})
    });
  }

  render() {
    var self = this;
    return (
      <>
        <div className="app-list-header">
          <h1 className="app-list-title">Коды ББК</h1>
          <a className="btn btn-primary btn-sm" href="/bbks/manage/">Создать код ББК</a>
        </div>
        <div className="app-card bbks--list">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Код</th>
                <th>Описание</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.bbks.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>Нет записей</td>
                </tr>
              ) : (
                this.state.bbks.map(function(a) {
                  return (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.code}</td>
                      <td>{a.description}</td>
                      <td>
                        <a href={"/bbks/manage/" + a.id} className="btn btn-sm btn-outline-light">Изменить</a>
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
export default BBKList;
