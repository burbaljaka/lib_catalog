import React, { Component } from 'react';
import PubManager from './PubApi';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

const pubManager = new PubManager();

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

class PubList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pubs: [],
      page: 1,
      hasMore: true,
      loading: false,
      ordering: 'name',
      requestId: 0,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.loadPubs = this.loadPubs.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.loadPubs(1, 'name', true);
  }

  loadPubs(page, ordering, replace) {
    if (this.state.loading) return;
    const requestId = this.state.requestId + 1;
    this.setState({ loading: true, requestId });
    pubManager
      .getPubs({ page, pageSize: 20, ordering })
      .then((data) => {
        if (this.state.requestId !== requestId) return;
        const results = data.results || [];
        this.setState((prev) => ({
          pubs: replace ? results : [...prev.pubs, ...results],
          hasMore: !!data.next,
          loading: false,
          page,
        }));
      })
      .catch(() => this.setState({ loading: false }));
  }

  handleSort(ordering) {
    this.setState({ ordering, page: 1 }, () => this.loadPubs(1, ordering, true));
  }

  handleDelete(pub) {
    const self = this;
    pubManager.deletePub(pub).then(() => {
      const newArr = self.state.pubs.filter((obj) => obj.id !== pub.id);
      self.setState({ pubs: newArr });
    });
  }

  render() {
    const { pubs, hasMore, loading, ordering } = this.state;
    return (
      <PubListInner
        pubs={pubs}
        hasMore={hasMore}
        loading={loading}
        ordering={ordering}
        onSort={this.handleSort}
        onDelete={this.handleDelete}
        loadMore={() => this.loadPubs(this.state.page + 1, ordering, false)}
      />
    );
  }
}

function PubListInner({ pubs, hasMore, loading, ordering, onSort, onDelete, loadMore }) {
  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loading);

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
              <SortableTh label="#" orderingField="id" currentOrdering={ordering} onSort={onSort} />
              <SortableTh label="Издательство" orderingField="name" currentOrdering={ordering} onSort={onSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pubs.length === 0 && !loading ? (
              <tr>
                <td colSpan="3" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>
                  Нет записей
                </td>
              </tr>
            ) : (
              pubs.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>
                    <a href={'/pubs/manage/' + c.id} className="btn btn-sm btn-outline-light">
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

export default PubList;
