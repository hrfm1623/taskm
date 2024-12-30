type TaskService = ReturnType<
  typeof import("../services/taskService").createTaskService
>;
type TagService = ReturnType<
  typeof import("../services/tagService").createTagService
>;
type TaskStatusService = ReturnType<
  typeof import("../services/taskStatusService").createTaskStatusService
>;

export type Bindings = {
  DATABASE_URL: string;
};

export type Variables = {
  taskService: TaskService;
  tagService: TagService;
  taskStatusService: TaskStatusService;
};

export type Env = {
  Bindings: Bindings;
  Variables: Variables;
};
