import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { todosTable } from "./db/schema.js";
import { eq } from "drizzle-orm";
import { registerPages } from "./pages.js";

const db = drizzle(process.env.DATABASE_URL!);

export const app = new Hono();

// app.use(
//   "/*",
//   cors({
//     origin: "http://localhost:5173",
//     allowMethods: ["GET", "POST", "DELETE", "OPTIONS", "PATCH"],
//     allowHeaders: ["Content-Type"],
//   }),
// );
registerPages(app);

app.get("/api/todos", async (c) => {
  try {
    const todos = await db.select().from(todosTable);
    return c.json(todos);
  } catch {
    return c.json({ error: "Failed to fetch todos" }, 500);
  }
});

app.post("/api/todos", async (c) => {
  try {
    const isForm = c.req
      .header("content-type")
      ?.includes("application/x-www-form-urlencoded");
    const { title } = isForm
      ? await c.req.parseBody<{ title?: string }>()
      : await c.req.json<{ title?: string }>();
    if (!title || !title.trim()) {
      return c.json({ error: "Title is required" }, 400);
    }
    const newTodo = {
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };
    const [inserted] = await db
      .insert(todosTable)
      .values(newTodo)
      .$returningId();
    const created = {
      id: inserted.id,
      ...newTodo,
    };
    if (isForm) {
      return c.redirect("/");
    }
    return c.json(created, 201);
  } catch {
    return c.json({ error: "Failed to add todo" }, 500);
  }
});

app.post("/api/todos/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.parseBody<{
      action?: string;
      completed?: string;
    }>();

    if (body.action === "delete") {
      await db.delete(todosTable).where(eq(todosTable.id, id));
    } else if (body.action === "toggle") {
      await db
        .update(todosTable)
        .set({ completed: body.completed !== "true" })
        .where(eq(todosTable.id, id));
    }

    return c.redirect("/");
  } catch {
    return c.json({ error: "Failed to update todo" }, 500);
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
