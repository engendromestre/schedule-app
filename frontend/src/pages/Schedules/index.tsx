import { useForm } from "react-hook-form";
import { Header } from "../../components/Header";
import { InputSchedule } from "../../components/InputSchedule";
import style from "./Schedules.module.css";

import { useAuth } from "../../hooks/auth";
import { formatISO, getHours, parseISO, setHours } from "date-fns";
import { api } from "../../server";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormValues {
  date: string;
  name: string;
  phone: string;
  hour: string;
}

export function Schedules() {
  const schema = yup.object().shape({
    name: yup.string().required("Campo Nome obrigatório"),
    phone: yup.string().required("Campo telefone obrigatório"),
    date: yup.string().required("Campo Data obrigatório"),
    hour: yup.string().required("Campo Hora obrigatório"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    resolver: yupResolver(schema),
  });
  const { availableSchedules, schedules, date, handleSetDate } = useAuth();
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split("T")[0];

  const filteredDate = availableSchedules.filter((hour) => {
    const isScheduleAvailable = !schedules.find((sheduleItem) => {
      const scheduleDate = new Date(sheduleItem.date);
      const scheduleHour = getHours(scheduleDate);
      return scheduleHour === Number(hour);
    });
    return isScheduleAvailable;
  });

  const submit = handleSubmit(async ({ name, phone, date, hour }) => {
    try {
      const formattedDate = formatISO(setHours(parseISO(date), parseInt(hour)));
      await api.post(`/schedules/`, {
        name,
        phone,
        date: formattedDate,
      });
      toast.success("Criado com sucesso");
      navigate("/");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  });

  return (
    <div className={`${style.container} container`}>
      <Header />
      <h2>Agendamento de horário</h2>
      <div className={style.formDiv}>
        <form onSubmit={submit}>
          <InputSchedule
            placeholder={"Nome"}
            type={"text"}
            {...register("name", { required: true })}
            error={errors.name && errors.name.message}
          />
          <InputSchedule
            placeholder={"Celular"}
            type={"text"}
            {...register("phone", { required: true })}
            error={errors.phone && errors.phone.message}
          />
          <div className={style.date}>
            <InputSchedule
              placeholder={"Dia"}
              type={"date"}
              {...register("date", {
                required: true,
                value: currentDate,
                onChange: (e) => handleSetDate(e.target.value),
              })}
              error={errors.date && errors.date.message}
            />
            <div className={style.select}>
              <label>Hora</label>
              <select
                {...register("hour", {
                  required: true,
                })}
              >
                {filteredDate.map((hour, index) => {
                  return (
                    <option value={hour} key={index}>
                      {hour}:00 h
                    </option>
                  );
                })}
              </select>
              {errors.hour && <span>{errors.hour.message}</span>}
            </div>
          </div>

          <div className={style.footer}>
            <button>Cancelar</button>
            <button>Agendar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
