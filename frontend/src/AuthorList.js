import React, { Component } from 'react';
import AuthorManager from './AuthorApi';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

const authorManager = new AuthorManager();

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

class AuthorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      page: 1,
      hasMore: true,
      loading: false,
      ordering: 'lname',
      requestId: 0,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.loadAuthors = this.loadAuthors.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.loadAuthors(1, 'lname', true);
  }

  loadAuthors(page, ordering, replace) {
    if (this.state.loading) return;
    const requestId = this.state.requestId + 1;
    this.setState({ loading: true, requestId });
    authorManager
      .getAuthors({ page, pageSize: 20, ordering })
      .then((data) => {
        if (this.state.requestId !== requestId) return;
        const results = data.results || [];
        this.setState((prev) => ({
          authors: replace ? results : [...prev.authors, ...results],
          hasMore: !!data.next,
          loading: false,
          page,
        }));
      })
      .catch(() => this.setState({ loading: false }));
  }

  handleSort(ordering) {
    this.setState({ ordering, page: 1 }, () => this.loadAuthors(1, ordering, true));
  }

  handleDelete(author) {
    const self = this;
    authorManager.deleteAuthor(author).then(() => {
      const newArr = self.state.authors.filter((obj) => obj.id !== author.id);
      self.setState({ authors: newArr });
    });
  }

  render() {
    const { authors, hasMore, loading, ordering } = this.state;
    return (
      <AuthorListInner
        authors={authors}
        hasMore={hasMore}
        loading={loading}
        ordering={ordering}
        onSort={this.handleSort}
        onDelete={this.handleDelete}
        loadMore={() => this.loadAuthors(this.state.page + 1, ordering, false)}
      />
    );
  }
}

function AuthorListInner({ authors, hasMore, loading, ordering, onSort, onDelete, loadMore }) {
  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loading);

  return (
    <>
      <div className="app-list-header">
        <h1 className="app-list-title">Авторы</h1>
        <a className="btn btn-primary btn-sm" href="/authors/manage/">Создать автора</a>
      </div>
      <div className="app-card authors--list">
        <table className="table">
          <thead>
            <tr>
              <SortableTh label="#" orderingField="id" currentOrdering={ordering} onSort={onSort} />
              <SortableTh label="Имя" orderingField="lname" currentOrdering={ordering} onSort={onSort} />
              <SortableTh label="Авторский знак" orderingField="author_code" currentOrdering={ordering} onSort={onSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {authors.length === 0 && !loading ? (
              <tr>
                <td colSpan="4" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>
                  Нет записей
                </td>
              </tr>
            ) : (
              authors.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>
                    {a.lname} {a.fname}
                  </td>
                  <td>{a.authorCode}</td>
                  <td>
                    <a href={'/authors/manage/' + a.id} className="btn btn-sm btn-outline-light">
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

export default AuthorList;
