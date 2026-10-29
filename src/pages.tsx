import type { FC } from "hono/jsx";
import type { Context, Hono } from "hono";

const Layout: FC = (props) => (
  <html>
    <body>{props.children}</body>
  </html>
);

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

const renderPage = async (c: Context, app: Hono) => {
  const response = await app.request(new URL("/api/todos", c.req.url));
  const todos: Todo[] = await response.json();

  return c.html(
    <Layout>
      <form action="/api/todos" method="post">
        <input name="title" type="text" placeholder="タイトル" required />
        <button type="submit">追加</button>
      </form>
      {todos.map((todo) => (
        <div key={todo.id}>
          <span>{todo.title}</span>
          <form action={`/api/todos/${todo.id}`} method="post">
            <input type="hidden" name="action" value="toggle" />
            <input
              type="hidden"
              name="completed"
              value={String(todo.completed)}
            />
            <button type="submit">
              {todo.completed ? "未完了に戻す" : "完了にする"}
            </button>
          </form>
          <form action={`/api/todos/${todo.id}`} method="post">
            <input type="hidden" name="action" value="delete" />
            <button type="submit">削除</button>
          </form>
        </div>
      ))}
    </Layout>,
  );
};

export const registerPages = (app: Hono) => {
  app.get("/", (c) => renderPage(c, app));
};
