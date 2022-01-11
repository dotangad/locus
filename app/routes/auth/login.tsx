import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  useActionData,
  useSearchParams,
  useTransition,
} from "remix";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";
import Layout from "~/components/Layout";
import { createUserSession, ensureGuest, login } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await ensureGuest(request, "/auth/check");
  return {};
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    email: string | undefined;
    password: string | undefined;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  await ensureGuest(request, "/auth/check");
  const { email, password } = Object.fromEntries(await request.formData());

  const user = await login({
    email: email as string,
    password: password as string,
  });

  if (!user) {
    return badRequest({
      fields: { email: email as string, password: "" },
      formError: `Username/Password combination is incorrect`,
    });
  }

  return createUserSession(user.id, "/", request);
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const transition = useTransition();
  const actionData = useActionData<ActionData | undefined>();

  return (
    <Layout mainClassName="flex items-center justify-center">
      <div>
        <h1 className="my-5 text-4xl font-bold text-gray-400">Login</h1>
        <Form
          method="post"
          aria-describedby={
            actionData?.formError ? "form-error-message" : undefined
          }
        >
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />

          <TextInput
            id="email"
            name="email"
            label="email"
            type="email"
            placeholder="school@school.com"
            containerClassName="my-5 min-w-[300px]"
            disabled={transition.state === "submitting"}
            error={actionData?.fieldErrors?.email}
            defaultValue={actionData?.fields?.email}
            aria-invalid={Boolean(actionData?.fieldErrors?.email)}
            aria-describedby={
              actionData?.fieldErrors?.email ? "email-error" : undefined
            }
          />

          <TextInput
            id="password"
            name="password"
            label="password"
            type="password"
            placeholder="s0m3thing s3cure"
            containerClassName="my-5 min-w-[300px]"
            disabled={transition.state === "submitting"}
            error={actionData?.fieldErrors?.password}
            defaultValue={actionData?.fields?.password}
            aria-invalid={Boolean(actionData?.fieldErrors?.password)}
            aria-describedby={
              actionData?.fieldErrors?.password ? "password-error" : undefined
            }
          />

          {actionData?.formError && (
            <div className="my-5 text-sm text-center text-red-500">
              {actionData?.formError}
            </div>
          )}

          <div className="w-full flex justify-center">
            <Button type="submit" disabled={transition.state === "submitting"}>
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
