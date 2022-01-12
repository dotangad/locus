import React from "react";
import TextInput from "~/components/TextInput";

export const Title: React.FC = ({
  title,
  setTitle,
  actionData,
  transition,
}) => {
  return (
    <TextInput
      id="title"
      name="title"
      label="title"
      type="text"
      placeholder="Task Title"
      containerClassName="my-5 min-w-[300px]"
      disabled={transition.state === "submitting"}
      error={actionData?.fieldErrors?.title}
      defaultValue={actionData?.fields?.title}
      aria-invalid={Boolean(actionData?.fieldErrors?.title)}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
};

export const Points: React.FC = ({
  points,
  setPoints,
  actionData,
  transition,
}) => {
  return (
    <TextInput
      id="points"
      name="points"
      label="points"
      type="number"
      placeholder="1000"
      containerClassName="my-5 min-w-[300px]"
      disabled={transition.state === "submitting"}
      error={actionData?.fieldErrors?.points}
      defaultValue={actionData?.fields?.points}
      aria-invalid={Boolean(actionData?.fieldErrors?.points)}
      value={points}
      onChange={(e) => setPoints(e.target.value)}
    />
  );
};

export const TaskType: React.FC = ({
  type,
  setType,
  actionData,
  transition,
}) => {
  return (
    <div className={`input-group text-gray-400 focus-within:text-exun my-5`}>
      <label className="text-xs font-bold uppercase mb-3 transition">
        Type
      </label>
      <select
        disabled={transition.state === "submitting"}
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border-2 border-gray-bg focus:border-exun focus:outline-none rounded-lg p-3 w-full transition text-gray-800"
      >
        <option value="DIRECT">DIRECT</option>
        <option value="SUBMISSION">SUBMISSION</option>
        <option value="GROUP">GROUP</option>
      </select>

      {actionData?.fieldErrors?.type && (
        <div className="text-xs text-red-500 mt-1">
          {actionData.fieldErrors.type}
        </div>
      )}
    </div>
  );
};

export const Retry: React.FC = ({
  retry,
  setRetry,
  actionData,
  transition,
}) => {
  return (
    <div className={`input-group text-gray-400 focus-within:text-exun my-5`}>
      <label className="text-xs font-bold uppercase mb-3 transition">
        Retries allowed
      </label>
      <select
        disabled={transition.state === "submitting"}
        value={retry}
        onChange={(e) => setRetry(Boolean(e.target.value))}
        className="border-2 border-gray-bg focus:border-exun focus:outline-none rounded-lg p-3 w-full transition text-gray-800"
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>

      {actionData?.fieldErrors?.retry && (
        <div className="text-xs text-red-500 mt-1">
          {actionData.fieldErrors.retry}
        </div>
      )}
    </div>
  );
};

export const Open: React.FC = ({ open, setOpen, actionData, transition }) => {
  return (
    <div className={`input-group text-gray-400 focus-within:text-exun my-5`}>
      <label className="text-xs font-bold uppercase mb-3 transition">
        Open
      </label>
      <select
        disabled={transition.state === "submitting"}
        value={open}
        onChange={(e) => setOpen(Boolean(e.target.value))}
        className="border-2 border-gray-bg focus:border-exun focus:outline-none rounded-lg p-3 w-full transition text-gray-800"
      >
        <option value="true">Open</option>
        <option value="false">Closed</option>
      </select>

      {actionData?.fieldErrors?.open && (
        <div className="text-xs text-red-500 mt-1">
          {actionData.fieldErrors.open}
        </div>
      )}
    </div>
  );
};

export const Tags: React.FC = ({ tags, setTags, actionData, transition }) => {
  return (
    <TextInput
      id="tags"
      name="tags"
      label="tags"
      type="text"
      placeholder="Tags (comma separated)"
      containerClassName="my-5 min-w-[300px]"
      disabled={transition.state === "submitting"}
      error={actionData?.fieldErrors?.tags}
      defaultValue={actionData?.fields?.tags}
      aria-invalid={Boolean(actionData?.fieldErrors?.tags)}
      value={tags.join(", ")}
      onChange={(e) => setTags(e.target.value.split(",").map((x) => x.trim()))}
    />
  );
};
