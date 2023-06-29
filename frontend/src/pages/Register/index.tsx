import style from "./Register.module.css";
import logo from "../../assets/logo.webp";
import { Input } from "../../components/Input";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { BsPerson } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { TbPassword } from "react-icons/tb";
import { api } from "../../server";

interface IFormValues {
  name: string;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Campo nome obrigatório"),
  email: yup
    .string()
    .required("Campo e-mail obrigatório")
    .email("Digite um e-mail válido"),
  password: yup
    .string()
    .required("Campo senha obrigatório")
    .min(6, "Mínimo de 6 caracteres"),
});

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({ resolver: yupResolver(schema) });

  const submit = handleSubmit(async (data) => {
    const result = await api.post("/users", {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    console.log(result);
  });

  return (
    <div className={style.background}>
      <div className="container">
        <p className={style.navigate}>
          <Link to={"/"}>Home</Link>
          {">"}
          <Link to={"/register"}>Área de Cadastro</Link>
        </p>
      </div>
      <div className={`container ${style.container}`}>
        <div className={`${style.wrapper}`}>
          <div className={style.imageContainer}>
            <img src={logo} />
          </div>
          <div className={style.card}>
            <h2>Área de Cadastro</h2>
            <form onSubmit={submit}>
              <Input
                type="text"
                placeholder="Nome"
                {...register("name", { required: true })}
                error={errors.name && errors.name.message}
                icon={<BsPerson size={20} />}
              />
              <Input
                type="text"
                placeholder="Email"
                {...register("email", { required: true })}
                error={errors.email && errors.email.message}
                icon={<AiOutlineMail size={20} />}
              />
              <Input
                type="password"
                placeholder="Senha"
                {...register("password", { required: true })}
                error={errors.password && errors.password.message}
                icon={<TbPassword size={20} />}
              />
              <Button text="Cadastrar" />
            </form>
            <div className={style.register}>
              <span>
                <Link to="/">Voltar para a Home</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
