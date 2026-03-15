import React, { Component } from 'react';
import CityManager from './CityApi';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

const cityManager = new CityManager();

function SortableTh({ label, orderingField, currentOrdering, onSort }) {
  const isActive = currentOrdering === orderingField || currentOrdering === `-${orderingField}`;
  const isDesc = currentOrdering && currentOrdering.startsWith('-');
  const handleClick = () => {
    if (currentOrdering === orderingField) {
      onSort(`-${orderingField}`);
    } else {
      onSort(orderingField);
    }
  };
  return (
    <th onClick={handleClick} style={{ cursor: 'pointer' }}>
      {label} {isActive && (isDesc ? ' ↓' : ' ↑')}
    </th>
  );
}

class CityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
      page: 1,
      hasMore: true,
      loading: false,
      ordering: 'name',
      requestId: 0,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.loadCities = this.loadCities.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.loadCities(1, 'name', true);
  }

  loadCities(page, ordering, replace) {
    if (this.state.loading) return;
    const requestId = this.state.requestId + 1;
    this.setState({ loading: true, requestId });
    cityManager
      .getCities({ page, pageSize: 20, ordering })
      .then((data) => {
        if (this.state.requestId !== requestId) return;
        const results = data.results || [];
        this.setState((prev) => ({
          cities: replace ? results : [...prev.cities, ...results],
          hasMore: !!data.next,
          loading: false,
          page,
        }));
      })
      .catch(() => this.setState({ loading: false }));
  }

  handleSort(ordering) {
    this.setState({ ordering, page: 1 }, () => this.loadCities(1, ordering, true));
  }

  handleDelete(city) {
    const self = this;
    cityManager.deleteCity(city).then(() => {
      const newArr = self.state.cities.filter((obj) => obj.id !== city.id);
      self.setState({ cities: newArr });
    });
  }

  render() {
    const { cities, hasMore, loading, ordering } = this.state;
    return (
      <CityListInner
        cities={cities}
        hasMore={hasMore}
        loading={loading}
        ordering={ordering}
        onSort={this.handleSort}
        onDelete={this.handleDelete}
        loadMore={() => this.loadCities(this.state.page + 1, ordering, false)}
      />
    );
  }
}

function CityListInner({ cities, hasMore, loading, ordering, onSort, onDelete, loadMore }) {
  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loading);

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
              <SortableTh label="#" orderingField="id" currentOrdering={ordering} onSort={onSort} />
              <SortableTh label="Город" orderingField="name" currentOrdering={ordering} onSort={onSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cities.length === 0 && !loading ? (
              <tr>
                <td colSpan="3" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>
                  Нет записей
                </td>
              </tr>
            ) : (
              cities.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>
                    <a href={'/cities/manage/' + c.id} className="btn btn-sm btn-outline-light">
                      Изменить
                    </a>
                    <button type="button" onClick={() => onDelete(c)} className="btn btn-sm btn-outline-light">
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div ref={loadMoreRef} style={{ height: 20 }} />
        {loading && (
          <div style={{ padding: '12px', textAlign: 'center', color: 'var(--app-text-muted)' }}>
            Загрузка...
          </div>
        )}
      </div>
    </>
  );
}

export default CityList;
