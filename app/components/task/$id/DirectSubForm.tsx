import { useEffect, useRef } from "react";
import { Form, useTransition } from "remix";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";

type DirectSubFormProps = { error?: string };
const DirectSubForm: React.FC<DirectSubFormProps> = ({ error }) => {
  const answerInputRef = useRef<HTMLInputElement>(null);
  const transition = useTransition();

  useEffect(() => {
    if (answerInputRef.current) answerInputRef.current.value = "";
  }, []);

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
          ref={answerInputRef}
        />
        <Button type="submit" disabled={transition.state === "submitting"}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default DirectSubForm;
