import Todo from '../Todos/Todo'
import { render, screen, fireEvent } from '@testing-library/react';

describe('Testing!', () => {
  it('testing, clicking delete button', () => {
    const mockDelete = jest.fn(); // mock-funktio'
    const mockComplete = jest.fn(); // mock-funktio
    const mockTodo = {
      "text": "test",
      "done": true
    }

    render(<Todo todo={mockTodo} deleteTodo={mockDelete} completeTodo={mockComplete} />);

    fireEvent.click(screen.getByText('Delete'))
    expect(mockDelete).toHaveBeenCalledTimes(1)
  });

  it('todo done renders correctly?', () => {
    const mockDelete = jest.fn(); // mock-funktio'
    const mockComplete = jest.fn(); // mock-funktio
    const mockTodo = {
      "text": "test",
      "done": true
    }

    render(<Todo todo={mockTodo} deleteTodo={mockDelete} completeTodo={mockComplete} />);

    const element = screen.getByText('This todo is done')

    expect(element).toBeDefined()
  });
});