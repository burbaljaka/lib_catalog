import React from 'react';
import { render, screen, wait, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CityManager from './CityApi';
import CityList from './CityList';

jest.mock('./CityApi', () => {
  const mocks = { getCities: jest.fn(), deleteCity: jest.fn() };
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => mocks),
  };
});

const mockGetCities = CityManager().getCities;
const mockDeleteCity = CityManager().deleteCity;

let intersectionCallback;

beforeEach(() => {
  mockGetCities.mockReset();
  mockDeleteCity.mockReset().mockResolvedValue(undefined);
  intersectionCallback = null;
  window.IntersectionObserver = jest.fn().mockImplementation((cb) => {
    intersectionCallback = cb;
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
      takeRecords: jest.fn(() => []),
    };
  });
});

test('initial load shows first page of cities', async () => {
  mockGetCities.mockResolvedValue({
    count: 2,
    next: null,
    results: [
      { id: 1, name: 'Москва' },
      { id: 2, name: 'Санкт-Петербург' },
    ],
  });
  render(<CityList />);

  await wait(() => {
    expect(mockGetCities).toHaveBeenCalledWith({ page: 1, pageSize: 20, ordering: 'name' });
  });
  expect(screen.getByText('Москва')).toBeInTheDocument();
  expect(screen.getByText('Санкт-Петербург')).toBeInTheDocument();
});

test('scroll-to-bottom triggers load more', async () => {
  mockGetCities
    .mockResolvedValueOnce({
      count: 3,
      next: 'http://localhost:8000/api/v1/lib/issue_city/?page=2',
      results: [{ id: 1, name: 'А' }],
    })
    .mockResolvedValueOnce({
      count: 3,
      next: null,
      results: [
        { id: 2, name: 'Б' },
        { id: 3, name: 'В' },
      ],
    });
  render(<CityList />);

  await wait(() => expect(screen.getByText('А')).toBeInTheDocument());
  expect(mockGetCities).toHaveBeenCalledTimes(1);

  act(() => {
    intersectionCallback([{ isIntersecting: true }]);
  });

  await wait(() => {
    expect(mockGetCities).toHaveBeenCalledTimes(2);
    expect(mockGetCities).toHaveBeenLastCalledWith({ page: 2, pageSize: 20, ordering: 'name' });
  });
  expect(screen.getByText('Б')).toBeInTheDocument();
  expect(screen.getByText('В')).toBeInTheDocument();
});

test('click column header changes sort and reloads', async () => {
  mockGetCities.mockResolvedValue({
    count: 1,
    next: null,
    results: [{ id: 1, name: 'Москва' }],
  });
  render(<CityList />);

  await wait(() => expect(screen.getByText('Москва')).toBeInTheDocument());
  expect(mockGetCities).toHaveBeenCalledWith(
    expect.objectContaining({ ordering: 'name' })
  );

  const cityHeader = screen.getByRole('columnheader', { name: /Город/ });
  await userEvent.click(cityHeader);

  await wait(() => {
    expect(mockGetCities).toHaveBeenLastCalledWith(
      expect.objectContaining({ ordering: '-name', page: 1 })
    );
  });
});

test('delete uses city.id for API URL', async () => {
  mockGetCities.mockResolvedValue({
    count: 1,
    next: null,
    results: [{ id: 42, name: 'Москва' }],
  });
  render(<CityList />);

  await wait(() => expect(screen.getByText('Москва')).toBeInTheDocument());

  const deleteBtn = screen.getByRole('button', { name: /Удалить/i });
  await userEvent.click(deleteBtn);

  await wait(() => {
    expect(mockDeleteCity).toHaveBeenCalledWith({ id: 42, name: 'Москва' });
  });
});
