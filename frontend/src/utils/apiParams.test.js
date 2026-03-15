import { toSnakeParams, toCamelResponse } from './apiParams';

describe('toSnakeParams', () => {
  it('converts camelCase keys to snake_case', () => {
    expect(toSnakeParams({ pageSize: 20 })).toEqual({ page_size: 20 });
    expect(toSnakeParams({ page: 1, pageSize: 20, ordering: 'name' })).toEqual({
      page: 1,
      page_size: 20,
      ordering: 'name',
    });
  });

  it('returns empty object for null or undefined', () => {
    expect(toSnakeParams(null)).toEqual({});
    expect(toSnakeParams(undefined)).toEqual({});
  });
});

describe('toCamelResponse', () => {
  it('converts snake_case keys to camelCase', () => {
    expect(toCamelResponse({ issue_year: 2020 })).toEqual({ issueYear: 2020 });
    expect(toCamelResponse({ author_sign: 'A123' })).toEqual({ authorSign: 'A123' });
  });

  it('recursively converts nested objects', () => {
    const input = { results: [{ short_name: 'Ivanov I.' }] };
    expect(toCamelResponse(input)).toEqual({ results: [{ shortName: 'Ivanov I.' }] });
  });

  it('handles arrays of objects', () => {
    const input = [{ issue_year: 2020 }, { issue_year: 2021 }];
    expect(toCamelResponse(input)).toEqual([{ issueYear: 2020 }, { issueYear: 2021 }]);
  });

  it('returns primitives unchanged', () => {
    expect(toCamelResponse(null)).toBe(null);
    expect(toCamelResponse(42)).toBe(42);
    expect(toCamelResponse('hello')).toBe('hello');
  });
});
