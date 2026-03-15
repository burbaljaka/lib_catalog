import React, { Component } from 'react';
import BookManager from './BookApi';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

const bookManager = new BookManager();

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

class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      page: 1,
      hasMore: true,
      loading: false,
      ordering: 'name',
      requestId: 0,
    };
    this.loadBooks = this.loadBooks.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.loadBooks(1, 'name', true);
  }

  loadBooks(page, ordering, replace) {
    if (this.state.loading) return;
    const requestId = this.state.requestId + 1;
    this.setState({ loading: true, requestId });
    bookManager
      .getBooks({ page, pageSize: 20, ordering })
      .then((data) => {
        if (this.state.requestId !== requestId) return;
        const results = data.results || [];
        this.setState((prev) => ({
          books: replace ? results : [...prev.books, ...results],
          hasMore: !!data.next,
          loading: false,
          page,
        }));
      })
      .catch(() => this.setState({ loading: false }));
  }

  handleSort(ordering) {
    this.setState({ ordering, page: 1 }, () => this.loadBooks(1, ordering, true));
  }

  render() {
    const { books, hasMore, loading, ordering } = this.state;
    return (
      <BookListInner
        books={books}
        hasMore={hasMore}
        loading={loading}
        ordering={ordering}
        onSort={this.handleSort}
        loadMore={() => this.loadBooks(this.state.page + 1, ordering, false)}
      />
    );
  }
}

function BookListInner({ books, hasMore, loading, ordering, onSort, loadMore }) {
  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loading);

  return (
    <>
      <div className="app-list-header">
        <h1 className="app-list-title">Книги</h1>
        <a className="btn btn-primary btn-sm" href="/books/manage/">Создать книгу</a>
      </div>
      <div className="app-card books--list">
        <table className="table">
          <thead key="thead">
            <tr>
              <SortableTh label="#" orderingField="id" currentOrdering={ordering} onSort={onSort} />
              <SortableTh label="Автор" orderingField="author_sign" currentOrdering={ordering} onSort={onSort} />
              <SortableTh label="Название" orderingField="name" currentOrdering={ordering} onSort={onSort} />
              <SortableTh label="Год" orderingField="issue_year" currentOrdering={ordering} onSort={onSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 && !loading ? (
              <tr>
                <td colSpan="5" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>
                  Нет книг. <a href="/books/manage/">Добавить книгу</a>
                </td>
              </tr>
            ) : (
              books.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>
                    {(b.author || []).map((a, index) => (
                      <span key={a.id}>
                        {index === 0 ? '' : ', '}
                        {a.shortName}
                      </span>
                    ))}
                  </td>
                  <td>{b.name}</td>
                  <td>{b.issueYear}</td>
                  <td>
                    <a href={'/books/card/' + b.id} className="btn btn-sm btn-outline-light">
                      Карточка
                    </a>
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

export default BookList;
