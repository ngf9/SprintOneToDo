import { i } from '@instantdb/react';

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    todos: i.entity({
      title: i.string(),
      completed: i.boolean(),
      order: i.number(),
      createdAt: i.number(),
    }),
  },
  links: {
    userTodos: {
      forward: { on: 'todos', has: 'one', label: 'user' },
      reverse: { on: '$users', has: 'many', label: 'todos' },
    },
  },
});

// This helps Typescript display nicer intellisense
type AppSchema = typeof _schema;
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;