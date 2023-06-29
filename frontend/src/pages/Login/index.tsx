import style from "./Login.module.css";
import logo from "../../assets/logo.webp";
import { Input } from "../../components/Input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../components/Button";
import { Link } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { TbPassword } from "react-icons/tb";
import { useAuth } from "../../hooks/auth";

interface IFormValues {
  email: string;
  password: string;
}

export function Login() {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Digite um e-mail válido")
      .required("Campo e-mail obrigatório"),
    password: yup.string().min(3).required("Campo senha obrigatório"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    resolver: yupResolver(schema),
  });

  const { signIn } = useAuth();
  const submit = handleSubmit(async ({ email, password }) => {
    try {
      signIn({ email, password });
    } catch (error) {
      console.log(error)
    }
  });

  return (
    <div className={style.background}>
      <div className={`container ${style.container}`}>
        <div className={`${style.wrapper}`}>
          <div>
            <img src={logo} />
          </div>
          <div className={style.card}>
            <h2>Olá, seja bem vindo.</h2>
            <form onSubmit={submit}>
              <Input
                type="text"
                placeholder="Email"
                {...register("email", { required: true })}
                error={errors.email && errors.email.message}
                icon={<AiOutlineMail size={20} />}
              />
              <Input
                placeholder="Senha"
                type="password"
                {...register("password", { required: true })}
                error={errors.password && errors.password.message}
                icon={<TbPassword size={20} />}
              />
              <Button text="Entrar" />
            </form>
            <div className={style.register}>
              <span>
                Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
