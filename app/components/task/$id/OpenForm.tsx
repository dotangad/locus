import React from "react";
import { Form } from "remix";
import Button from "~/components/Button";

type OpenFormProps = { taskId: string; canOpen: boolean };
const OpenForm: React.FC<OpenFormProps> = ({ taskId, canOpen }) => {
  return canOpen ? (
    <div className="flex items-center justify-center w-full py-5">
      <Form method="post" action="/tasks/open">
        <input type="hidden" name="id" value={taskId} />
        <Button type="submit">Open</Button>
      </Form>
    </div>
  ) : (
    <div className="flex items-center justify-center w-full py-5">
      <Button disabled={true}>Open</Button>
    </div>
  );
};

export default OpenForm;
