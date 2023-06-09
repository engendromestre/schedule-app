import { useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { Header } from "../../components/Header";
import { useAuth } from "../../hooks/auth";
import style from "./Dashboard.module.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { format, isToday } from "date-fns";
import { api } from "../../server";

interface ISchedule {
  name: string;
  phone: string;
  date: Date;
  id: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Array<ISchedule>>([]);
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  const isWeekDay = (date: Date) => {
    const day = date.getDate();
    return day !== 0 && day !== 6;
  };
  const handleDataChange = (date: Date) => {
    setDate(date);
  };
  useEffect(() => {
    api
      .get("/schedules", {
        params: {
          date: date,
        },
      })
      .then((response) => {
        setSchedules(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [date]);
  return (
    <div className="container">
      <Header />
      <div className={style.dataTitle}>
        <h2>Bem vindo, {user.name}</h2>
        <p>
          Esta é a sua lista de horários
          {isToday(date) && <span>de hoje, dia </span>}
          {!isToday(date) && <span> do dia </span>}
          {format(date, "dd/MM/yyyy")}
        </p>
      </div>
      <h2 className={style.nextSchedule}>Próximos horários</h2>
      <div className={style.schedule}>
        <div className={style.cardWrapper}>
          {schedules.map((schedule, index) => {
            return (
              <Card 
                key={index} 
                date={schedule.date} 
                name={schedule.name} 
                id={schedule.id}
                phone={schedule.phone}
              />
            );
          })}
        </div>
        <div className={style.picker}>
          <DayPicker
            className={style.calendar}
            classNames={{
              day: style.day,
            }}
            selected={date}
            modifiers={{
              available: isWeekDay,
            }}
            modifiersClassNames={{
              selected: style.selected,
            }}
            mode="single"
            fromMonth={new Date()}
            locale={ptBR}
            disabled={isWeekend}
            onDayClick={handleDataChange}
          />
        </div>
      </div>
    </div>
  );
}
