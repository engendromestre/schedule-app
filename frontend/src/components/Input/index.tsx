import { ForwardRefRenderFunction, ReactNode, forwardRef } from "react";
import style from "./Input.module.css";

interface IInput {
  placeholder: string;
  type: "password" | "text" | "date" | "number";
  error?: string;
  icon?: ReactNode;
}
const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  { placeholder, error, icon, ...rest },
  ref
) => {
  return (
    <div className={style.container}>
      <label htmlFor="">
        <i aria-hidden="true">
          { icon }
        </i>
        <input placeholder={placeholder} ref={ref} {...rest} />
      </label>
      {error && <span>{error}</span>}
    </div>
  );
};

export const Input = forwardRef(InputBase);
