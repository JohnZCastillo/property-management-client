import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createContext, useContext, useEffect, useState } from "react";

const ReactHookFormContext = createContext();
const FieldLabelContext = createContext();

function isFieldRequired(schema, field) {
  return (
    schema
      ?.describe() 
      ?.fields?.[field]?.tests?.findIndex(({ name }) => name === "required") >= 0 
      || schema?.describe()?.fields?.[field]?.optional == false
  );
}

export function InputField({
  name,
  type,
  className,
  placeHolder,
  value,
  defaultValue,
  onChange,
  style,
  readOnly,
  icon,
  iconStyle,
  accept
}) {
  const { errors, register } = useContext(ReactHookFormContext);

  const fieldContext = useContext(FieldLabelContext);

  useEffect(() => {
    if (fieldContext?.setName) {
      fieldContext.setName(name);
    }
  }, [name]);

  return (
    <>
      <div className="relative">
        <input
          readOnly={readOnly}
          className={className}
          name={name}
          type={type}
          placeholder={placeHolder}
          value={value}
          
          defaultValue={defaultValue}
          style={style}
          accept={accept}
          {...register(name, {onChange: onChange})}
        />
        {icon && 
          <div className={`absolute ${iconStyle}`}>
            {icon}
          </div>
        }
        <p className="text-red-500">{errors?.[name]?.message}</p>
      </div>
    </>
  );
}

export function FieldLabel({ fieldName, label, children, className }) {
  const [name, setName] = useState(fieldName);

  const { schema } = useContext(ReactHookFormContext);
  const required = isFieldRequired(schema, name) ?? false;

  const handleSetName = (name) => {
    setName(name);
  };

  return (
    <>
      <FieldLabelContext
        value={{
          setName: handleSetName,
        }}
      >
        <fieldset className={`fieldset relative ${className}`}>
          <legend className="fieldset-legend text-black flex gap-1 mb-1">
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
          </legend>
          {children}
        </fieldset>
      </FieldLabelContext>
    </>
  );
}

export function SelectionField({
  name,
  type,
  className,
  placeHolder,
  value,
  defaultValue,
  onChange,
  children,
}) {
  const { errors, register } = useContext(ReactHookFormContext);
  const fieldContext = useContext(FieldLabelContext);

  useEffect(() => {
    if (fieldContext?.setName) {
      fieldContext.setName(name);
    }
  }, [name]);

  return (
    <>
      <div>
        <select
          className={className}
          name={name}
          type={type}
          placeholder={placeHolder}
          value={value}
          defaultValue={defaultValue}
          {...register(name, {onChange: onChange})}
        >
          {children}
        </select>
        <p className="text-red-500">{errors?.[name]?.message}</p>
      </div>
    </>
  );
}

export function TextAreaField({
  name,
  type,
  className,
  placeHolder,
  value,
  defaultValue,
  onChange,
  cols,
  rows,
}) {
  const { errors, register } = useContext(ReactHookFormContext);

  const fieldContext = useContext(FieldLabelContext);

  useEffect(() => {
    if (fieldContext?.setName) {
      fieldContext.setName(name);
    }
  }, [name]);

  return (
    <>
      <div>
        <textarea
          cols={cols}
          rows={rows}
          className={className}
          name={name}
          type={type}
          placeholder={placeHolder}
          value={value}
          defaultValue={defaultValue}
          {...register(name, {onChange: onChange})}
        ></textarea>
        <p className="text-red-500">{errors?.[name]?.message}</p>
      </div>
    </>
  );
}

export default function ReactHookForm({
  onSubmit,
  children,
  schema,
  defaultValues,
  className,
  shouldClear
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const handleOnSubmit = (formData) => {
    onSubmit(formData, reset);
  };

    console.log(defaultValues);

  useEffect(()=>{
      reset(defaultValues);
  },[defaultValues] )

  useEffect(() => {
    if (shouldClear) {
      reset();
    }
  }, [reset, shouldClear]);

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className={className}>
      <ReactHookFormContext
        value={{
          register: register,
          errors: errors,
          schema: schema,
        }}
      >
        {children}
      </ReactHookFormContext>
    </form>
  );
}