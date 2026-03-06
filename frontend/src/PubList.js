import React, {Component} from 'react';
import PubManager from './PubApi';

const pubManager = new PubManager();

class PubList extends Component {

  constructor(props){
    super(props);
    this.state = {
      pubs:[],
    };
    this.handleDelete = this.handleDelete.bind(this);
  };

  componentDidMount() {
    var self = this;
    pubManager.getPubs().then(function(result) {
      self.setState({pubs: result});
    });
  }

  handleDelete(pub) {
    var self = this;
    pubManager.deletePub(pub).then(() => {
      var newArr = self.state.pubs.filter(function(obj){
        return obj.id !== pub.id;
      });
      self.setState({pubs: newArr})
    });
  }

  render() {
    var self = this;
    return (
      <>
        <div className="app-list-header">
          <h1 className="app-list-title">Издательства</h1>
          <a className="btn btn-primary btn-sm" href="/pubs/manage/">Создать издательство</a>
        </div>
        <div className="app-card pubs--list">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Издательство</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.pubs.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>Нет записей</td>
                </tr>
              ) : (
                this.state.pubs.map(function(c) {
                  return (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>
                        <a href={"/pubs/manage/" + c.id} className="btn btn-sm btn-outline-light">Изменить</a>
                        <button type="button" onClick={() => self.handleDelete(c)} className="btn btn-sm btn-outline-light">Удалить</button>
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
export default PubList;
