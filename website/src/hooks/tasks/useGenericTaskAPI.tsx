import { useState } from "react";
import fetcher from "src/lib/fetcher";
import poster from "src/lib/poster";
import { BaseTask, TaskResponse } from "src/types/Task";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from "swr/mutation";

export const useGenericTaskAPI = <TaskType extends BaseTask>(taskApiEndpoint: string) => {
  type ConcreteTaskResponse = TaskResponse<TaskType>;

  const [tasks, setTasks] = useState<ConcreteTaskResponse[]>([]);

  const { isLoading, mutate, error } = useSWRImmutable<ConcreteTaskResponse>(
    "/api/new_task/" + taskApiEndpoint,
    fetcher,
    {
      onSuccess: (data) => setTasks([data]),
      revalidateOnMount: true,
      dedupingInterval: 500,
    }
  );

  const { trigger } = useSWRMutation("/api/update_task", poster, {
    onSuccess: async (response) => {
      const newTask: ConcreteTaskResponse = await response.json();
      setTasks((oldTasks) => [...oldTasks, newTask]);
      mutate();
    },
  });

  return { tasks, isLoading, trigger, error, reset: mutate };
};
