import React, { Component } from 'react';
import BBKManager from './BBKApi';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

const bbkManager = new BBKManager();

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

class BBKList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bbks: [],
      page: 1,
      hasMore: true,
      loading: false,
      ordering: 'code',
      requestId: 0,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.loadBBKs = this.loadBBKs.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.loadBBKs(1, 'code', true);
  }

  loadBBKs(page, ordering, replace) {
    if (this.state.loading) return;
    const requestId = this.state.requestId + 1;
    this.setState({ loading: true, requestId });
    bbkManager
      .getBBKs({ page, pageSize: 20, ordering })
      .then((data) => {
        if (this.state.requestId !== requestId) return;
        const results = data.results || [];
        this.setState((prev) => ({
          bbks: replace ? results : [...prev.bbks, ...results],
          hasMore: !!data.next,
          loading: false,
          page,
        }));
      })
      .catch(() => this.setState({ loading: false }));
  }

  handleSort(ordering) {
    this.setState({ ordering, page: 1 }, () => this.loadBBKs(1, ordering, true));
  }

  handleDelete(bbk) {
    const self = this;
    bbkManager.deleteBBK(bbk.id).then(() => {
      const newArr = self.state.bbks.filter((obj) => obj.id !== bbk.id);
      self.setState({ bbks: newArr });
    });
  }

  render() {
    const { bbks, hasMore, loading, ordering } = this.state;
    return (
      <BBKListInner
        bbks={bbks}
        hasMore={hasMore}
        loading={loading}
        ordering={ordering}
        onSort={this.handleSort}
        onDelete={this.handleDelete}
        loadMore={() => this.loadBBKs(this.state.page + 1, ordering, false)}
      />
    );
  }
}

function BBKListInner({ bbks, hasMore, loading, ordering, onSort, onDelete, loadMore }) {
  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loading);

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
              <SortableTh label="#" orderingField="id" currentOrdering={ordering} onSort={onSort} />
              <SortableTh label="Код" orderingField="code" currentOrdering={ordering} onSort={onSort} />
              <SortableTh label="Описание" orderingField="description" currentOrdering={ordering} onSort={onSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bbks.length === 0 && !loading ? (
              <tr>
                <td colSpan="4" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>
                  Нет записей
                </td>
              </tr>
            ) : (
              bbks.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.code}</td>
                  <td>{a.description}</td>
                  <td>
                    <a href={'/bbks/manage/' + a.id} className="btn btn-sm btn-outline-light">
                      Изменить
                    </a>
                    <button type="button" onClick={() => onDelete(a)} className="btn btn-sm btn-outline-light">
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

export default BBKList;
