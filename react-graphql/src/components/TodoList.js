import React, { Component, Fragment } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class TodoList extends Component {
  state = {
    todoText: '',
  }

  addTodo = () => {
    this.props.addTodo({
      variables: { text: this.state.todoText },
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

  updateTodo = (idToUpdate) => {
    this.props.updateTodo({
      variables: { id: idToUpdate, text: this.state.todoText },
      update: (proxy, { data: { updateTodo } }) => {
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
          <input
            type="submit"
            value="Edit"
            style={{ color: 'blue' }}
            onClick={e => this.updateTodo(todo.id)}
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
        <div>
          <p>Aqui a usabilidade passou longe, mas é o que temos para hoje =/ </p>
          <p>Amanhã sai da versão alpha e vai para o beta :)</p>
          <p>Para editar alguma coisa, digite o novo valor na caixa de texto e depois clique no botão "edit" no item da lista que deseja alterar o valor. "Simples assim ;)"</p>
        </div>
        {todos.loading
          ? <p>Carregando...</p>
          : this.renderTodoList()}

        <br />

        <input
          type="text"
          value={this.state.todoText}
          onChange={e => this.setState({ todoText: e.target.value })}
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
    }
  }
`;

const TodoMutation = gql`
  mutation ($text: String!) {
    createTodo ( text: $text ) {
      id
      text
    }
  }
`;

const TodoDeleteMutation = gql`
  mutation ($id: ID!) {
    deleteTodo ( id: $id ) {
      id
      text
    }
  }
`;

const TodoUpdateMutation = gql`
  mutation ($id: ID!, $text: String!) {
    updateTodo ( id: $id, text: $text ) {
      id
      text
    }
  }
`;

export default compose(
  graphql(TodosQuery, { name: 'todos' }),
  graphql(TodoMutation, { name: 'addTodo' }),
  graphql(TodoDeleteMutation, { name: 'delTodo' }),
  graphql(TodoUpdateMutation, { name: 'updateTodo' }),
)(TodoList);