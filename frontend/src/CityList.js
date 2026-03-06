import React, {Component} from 'react';
import CityManager from './CityApi';

const cityManager = new CityManager();

class CityList extends Component {

  constructor(props){
    super(props);
    this.state = {
      cities:[],
    };
    this.handleDelete = this.handleDelete.bind(this);
  };

  componentDidMount() {
    var self = this;
    cityManager.getCities().then(function(result) {
      self.setState({cities: result});
    });
  }

  handleDelete(city) {
    var self = this;
    cityManager.deleteCity(city).then(() => {
      var newArr = self.state.cities.filter(function(obj){
        return obj.id !== city.id;
      });
      self.setState({authors: newArr})
    });
  }

  render() {
    var self = this;
    return (
      <>
        <div className="app-list-header">
          <h1 className="app-list-title">Города</h1>
          <a className="btn btn-primary btn-sm" href="/cities/manage/">Создать город</a>
        </div>
        <div className="app-card cities--list">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Город</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.cities.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>Нет записей</td>
                </tr>
              ) : (
                this.state.cities.map(function(c) {
                  return (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>
                        <a href={"/cities/manage/" + c.id} className="btn btn-sm btn-outline-light">Изменить</a>
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
export default CityList;
