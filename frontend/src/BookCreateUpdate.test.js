import React from 'react';
import { render, screen, wait, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';

jest.mock('./BBKApi', () => {
  const mocks = { createBBK: jest.fn(), getBBKsForDropdown: jest.fn() };
  return { __esModule: true, default: jest.fn(() => mocks) };
});
jest.mock('./AuthorApi', () => {
  const mocks = { createAuthor: jest.fn(), getAuthorsForDropdown: jest.fn() };
  return { __esModule: true, default: jest.fn(() => mocks) };
});
jest.mock('./CitiesApi', () => {
  const mocks = { createCity: jest.fn(), getCitiesForDropdown: jest.fn() };
  return { __esModule: true, default: jest.fn(() => mocks) };
});
jest.mock('./PubApi', () => {
  const mocks = { createPub: jest.fn(), getPubsForDropdown: jest.fn() };
  return { __esModule: true, default: jest.fn(() => mocks) };
});
jest.mock('./KeyWordAPI', () => {
  const mocks = { createKeyWord: jest.fn(), getKeyWordsForDropdown: jest.fn() };
  return { __esModule: true, default: jest.fn(() => mocks) };
});
jest.mock('./BookApi', () => {
  const mocks = {
    getBook: jest.fn(),
    createBook: jest.fn().mockResolvedValue({}),
    updateBook: jest.fn().mockResolvedValue({}),
  };
  return { __esModule: true, default: jest.fn(() => mocks) };
});
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import BookCreateUpdate from './BookCreateUpdate';
import BBKManager from './BBKApi';
import AuthorManager from './AuthorApi';
import CityManager from './CitiesApi';
import PubManager from './PubApi';
import KeyWordManager from './KeyWordAPI';

const mockBbkMocks = BBKManager();

beforeEach(() => {
  jest.clearAllMocks();
  BBKManager().getBBKsForDropdown.mockResolvedValue([]);
  AuthorManager().getAuthorsForDropdown.mockResolvedValue([]);
  CityManager().getCitiesForDropdown.mockResolvedValue([]);
  PubManager().getPubsForDropdown.mockResolvedValue([]);
  KeyWordManager().getKeyWordsForDropdown.mockResolvedValue([]);
});

test('renders book form with modal triggers', async () => {
  render(<BookCreateUpdate match={{ params: {} }} />);

  await wait(() => {
    expect(screen.getByText(/Создать ББК/i)).toBeInTheDocument();
  });
  expect(screen.getByText(/Создать автора/i)).toBeInTheDocument();
  expect(screen.getByText(/Создать город/i)).toBeInTheDocument();
  expect(screen.getByText(/Создать издательство/i)).toBeInTheDocument();
  expect(screen.getByText(/Создать слово/i)).toBeInTheDocument();
});

test('BBK modal: on successful save shows toast and closes modal', async () => {
  mockBbkMocks.createBBK.mockResolvedValue({});
  mockBbkMocks.getBBKsForDropdown.mockResolvedValue([{ id: 1, code: '84', description: 'Русская литература' }]);

  render(<BookCreateUpdate match={{ params: {} }} />);

  await wait(() => expect(screen.getByText(/Создать ББК/i)).toBeInTheDocument());

  const bbkTrigger = screen.getByDisplayValue('Создать ББК');
  await userEvent.click(bbkTrigger);

  const codeLabel = await screen.findByText('Код');
  const formGroup = codeLabel.closest('.form-group');
  const inputs = formGroup.querySelectorAll('input[type="text"]');
  const codeInput = inputs[0];
  const descInput = inputs[1];
  await userEvent.type(codeInput, '84');
  await userEvent.type(descInput, 'Русская литература');

  const saveBtn = within(formGroup).getByDisplayValue('Сохранить');
  await userEvent.click(saveBtn);

  await wait(() => {
    expect(mockBbkMocks.createBBK).toHaveBeenCalledWith({ code: '84', description: 'Русская литература' });
  });
  await wait(() => {
    expect(toast.success).toHaveBeenCalledWith('Код создан');
  });
});

test('BBK modal: on error shows toast.error and modal stays open', async () => {
  mockBbkMocks.createBBK.mockRejectedValue(new Error('Network error'));

  render(<BookCreateUpdate match={{ params: {} }} />);

  await wait(() => expect(screen.getByText(/Создать ББК/i)).toBeInTheDocument());

  const bbkTrigger = screen.getByDisplayValue('Создать ББК');
  await userEvent.click(bbkTrigger);

  const codeLabel = await screen.findByText('Код');
  const formGroup = codeLabel.closest('.form-group');
  const codeInput = formGroup.querySelectorAll('input[type="text"]')[0];
  await userEvent.type(codeInput, '84');

  const saveBtn = within(formGroup).getByDisplayValue('Сохранить');
  await userEvent.click(saveBtn);

  await wait(() => {
    expect(toast.error).toHaveBeenCalled();
  });
});

test('book create: on successful save shows toast.success', async () => {
  const BookManager = require('./BookApi').default;
  BookManager().createBook.mockResolvedValue({});

  render(<BookCreateUpdate match={{ params: {} }} />);

  await wait(() => expect(screen.getByText(/Название/i)).toBeInTheDocument());

  const nameRow = screen.getByText('Название').closest('.row');
  const nameInput = within(nameRow).getByRole('textbox');
  await userEvent.type(nameInput, 'Test Book');

  const saveBtn = screen.getByDisplayValue('Сохранить');
  await userEvent.click(saveBtn);

  await wait(() => {
    expect(toast.success).toHaveBeenCalledWith('Книга создана!');
  });
});

test('book create: on error shows toast.error', async () => {
  const BookManager = require('./BookApi').default;
  BookManager().createBook.mockRejectedValue({ response: { data: { detail: 'Validation error' } } });

  render(<BookCreateUpdate match={{ params: {} }} />);

  await wait(() => expect(screen.getByText(/Название/i)).toBeInTheDocument());

  const saveBtn = screen.getByDisplayValue('Сохранить');
  await userEvent.click(saveBtn);

  await wait(() => {
    expect(toast.error).toHaveBeenCalledWith('Validation error');
  });
});

test('book update: on successful save shows toast.success', async () => {
  const BookManager = require('./BookApi').default;
  BookManager().getBook.mockResolvedValue({
    name: 'Existing',
    author: [],
    description: '',
    authorSign: '',
    issueYear: '',
    issueCity: null,
    publishingHouse: null,
    bbk: [],
    keywords: [],
    place: '',
    pages: '',
    additionalData: '',
    series: '',
  });
  BookManager().updateBook.mockResolvedValue({});

  render(<BookCreateUpdate match={{ params: { pk: '1' } }} />);

  await wait(() => expect(BookManager().getBook).toHaveBeenCalledWith('1'));
  await wait(() => expect(screen.getByDisplayValue('Existing')).toBeInTheDocument());

  const saveBtn = screen.getByDisplayValue('Сохранить');
  await userEvent.click(saveBtn);

  await wait(() => {
    expect(toast.success).toHaveBeenCalledWith('Книга отредактирована!');
  });
});

test('book update: on error shows toast.error', async () => {
  const BookManager = require('./BookApi').default;
  BookManager().getBook.mockResolvedValue({
    name: 'Existing',
    author: [],
    description: '',
    authorSign: '',
    issueYear: '',
    issueCity: null,
    publishingHouse: null,
    bbk: [],
    keywords: [],
    place: '',
    pages: '',
    additionalData: '',
    series: '',
  });
  BookManager().updateBook.mockRejectedValue(new Error('Server error'));

  render(<BookCreateUpdate match={{ params: { pk: '1' } }} />);

  await wait(() => expect(screen.getByDisplayValue('Existing')).toBeInTheDocument());

  const saveBtn = screen.getByDisplayValue('Сохранить');
  await userEvent.click(saveBtn);

  await wait(() => {
    expect(toast.error).toHaveBeenCalledWith('Ошибка! Проверь форму!');
  });
});
