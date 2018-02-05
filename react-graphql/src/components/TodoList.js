import React, { Component, Fragment } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class TodoList extends Component {
  state = {
    newTodoText: '',
  }

  addTodo = () => {
    const { newTodoText } = this.state;

    this.props.addTodo({
      variables: { text: newTodoText },
      update: (proxy, { data: { createTodo } }) => {
        this.props.todos.refetch();
      },
    })
  };

  delTodo = (idToDel) => {
    this.props.delTodo({
      variables: { id: idToDel },
      update: (proxy, { data: { deleteTodo } }) => {
        this.props.todos.refetch();
      },
    })
  };

  renderTodoList = () => (
    <ul>
      {this.props.todos.allTodoes.map(todo =>
        <li key={todo.id} style={{ margin: 3 }}>
          <input
            type="submit"
            value="x"
            style={{ color: 'red' }}
            onClick={e => this.delTodo(todo.id)}
          />
          <span>&nbsp;</span>
          {todo.text}
        </li>
      )}
    </ul>
  )

  render() {
    console.log(this.props);
    const { todos } = this.props;

    return (
      <Fragment>
        {todos.loading
          ? <p>Carregando...</p>
          : this.renderTodoList()}

        <br />

        <input
          type="text"
          value={this.state.newTodoText}
          onChange={e => this.setState({ newTodoText: e.target.value })}
        />
        <span>&nbsp;</span>
        <input type="submit" value="Criar" onClick={this.addTodo} />
      </Fragment>
    );
  }
}

const TodosQuery = gql`
  query {
    allTodoes {
      id
      text
     # completed
    }
  }
`;

const TodoMutation = gql`
  mutation ($text: String!) {
    createTodo ( text: $text ) {
      id
      text
      # completed
    }
  }
`;

const TodoDeleteMutation = gql`
  mutation ($id: ID!) {
    deleteTodo ( id: $id ) {
      id
      text
      # completed
    }
  }
`;

export default compose(
  graphql(TodosQuery, { name: 'todos' }),
  graphql(TodoMutation, { name: 'addTodo' }),
  graphql(TodoDeleteMutation, { name: 'delTodo' }),
)(TodoList);