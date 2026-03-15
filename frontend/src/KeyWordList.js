import React, { Component } from 'react';
import KeyWordManager from './KeyWordAPI';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

const key_wordManager = new KeyWordManager();

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

class KeyWordList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key_words: [],
      page: 1,
      hasMore: true,
      loading: false,
      ordering: 'name',
      requestId: 0,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.loadKeyWords = this.loadKeyWords.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.loadKeyWords(1, 'name', true);
  }

  loadKeyWords(page, ordering, replace) {
    if (this.state.loading) return;
    const requestId = this.state.requestId + 1;
    this.setState({ loading: true, requestId });
    key_wordManager
      .getKeyWords({ page, pageSize: 20, ordering })
      .then((data) => {
        if (this.state.requestId !== requestId) return;
        const results = data.results || [];
        this.setState((prev) => ({
          key_words: replace ? results : [...prev.key_words, ...results],
          hasMore: !!data.next,
          loading: false,
          page,
        }));
      })
      .catch(() => this.setState({ loading: false }));
  }

  handleSort(ordering) {
    this.setState({ ordering, page: 1 }, () => this.loadKeyWords(1, ordering, true));
  }

  handleDelete(key_word) {
    const self = this;
    key_wordManager.deleteKeyWord(key_word.id).then(() => {
      const newArr = self.state.key_words.filter((obj) => obj.id !== key_word.id);
      self.setState({ key_words: newArr });
    });
  }

  render() {
    const { key_words, hasMore, loading, ordering } = this.state;
    return (
      <KeyWordListInner
        key_words={key_words}
        hasMore={hasMore}
        loading={loading}
        ordering={ordering}
        onSort={this.handleSort}
        onDelete={this.handleDelete}
        loadMore={() => this.loadKeyWords(this.state.page + 1, ordering, false)}
      />
    );
  }
}

function KeyWordListInner({ key_words, hasMore, loading, ordering, onSort, onDelete, loadMore }) {
  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loading);

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
              <SortableTh label="#" orderingField="id" currentOrdering={ordering} onSort={onSort} />
              <SortableTh label="Ключевое слово" orderingField="name" currentOrdering={ordering} onSort={onSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {key_words.length === 0 && !loading ? (
              <tr>
                <td colSpan="3" style={{ color: 'var(--app-text-muted)', padding: '24px', textAlign: 'center' }}>
                  Нет записей
                </td>
              </tr>
            ) : (
              key_words.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.name}</td>
                  <td>
                    <a href={'/key_words/manage/' + a.id} className="btn btn-sm btn-outline-light">
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

export default KeyWordList;
