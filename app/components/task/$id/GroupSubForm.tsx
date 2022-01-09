import { Task, UserTask } from "@prisma/client";
import { Form, useTransition } from "remix";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";

type GroupSubFormProps = { userTask: UserTask; task: Task; error?: string };
const GroupSubForm: React.FC<GroupSubFormProps> = ({
  userTask,
  task,
  error,
}) => {
  const transition = useTransition();

  return (
    <div>
      <Form method="post">
        {Array(task.groupQuestions)
          .fill(1)
          .map((_, i) => (
            <TextInput
              id={`sub${i + 1}`}
              name={`sub${i + 1}`}
              label={`Submission ${i + 1}`}
              type="text"
              placeholder="locuspocus"
              containerClassName="mb-5 w-full"
              disabled={transition.state === "submitting"}
              error={error ?? ""}
            />
          ))}
        <Button type="submit" disabled={transition.state === "submitting"}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default GroupSubForm;
