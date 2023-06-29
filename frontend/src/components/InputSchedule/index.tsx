import { ForwardRefRenderFunction, forwardRef } from "react";
import style from "./InputSchedule.module.css";

interface IInput {
  placeholder: string;
  type: "password" | "text" | "date" | "number";
  error?: string;
}
const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  { placeholder, error, ...rest },
  ref
) => {
  return (
    <div className={style.container}>
      <label htmlFor="">{placeholder}</label>
      <input  ref={ref} {...rest} />
      {error && <span>{error}</span>}
    </div>
  );
};

export const InputSchedule = forwardRef(InputBase);
