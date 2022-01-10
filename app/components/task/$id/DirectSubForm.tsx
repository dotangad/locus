import { Form, useTransition } from "remix";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";

type DirectSubFormProps = { error?: string };
const DirectSubForm: React.FC<DirectSubFormProps> = ({ error }) => {
  const transition = useTransition();

  return (
    <div>
      <Form method="post">
        <TextInput
          id="answer"
          name="answer"
          label="submission"
          type="text"
          placeholder="locuspocus"
          containerClassName="mb-5 w-full"
          disabled={transition.state === "submitting"}
          error={error ?? ""}
        />
        <Button type="submit" disabled={transition.state === "submitting"}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default DirectSubForm;
