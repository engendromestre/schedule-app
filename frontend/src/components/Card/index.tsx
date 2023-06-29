import style from "./Card.module.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";
import { getHours, isAfter } from "date-fns";
import { Modal } from "../Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { api } from "../../server";

interface ISchedule {
  name: string;
  phone: string;
  date: Date;
  id: string;
}
export const Card = ({ name, date, phone, id }: ISchedule) => {
  const isAfterDate = isAfter(new Date(date), new Date());
  const [openModal, setOpenModal] = useState<boolean>(true);
  const handleChangeModal = () => {
    setOpenModal(!openModal);
  };
  const handleDelete = async () => {
    try {
      const result = await api.delete(`/schedules/${id}`);
      console.log(result);
      toast.success("Registro deletado com sucesso");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };
  const dateFormatted = new Date(date);
  const hour = getHours(dateFormatted);
  const phoneFormatted = phone
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");

  return (
    <>
      <div className={style.background}>
        <div>
          <span className={`${!isAfterDate && style.disabled}`}>{hour}h</span>
          <p>
            {name} - {phoneFormatted}
          </p>
        </div>
        <div className={style.icons}>
          <AiOutlineEdit
            color="#5f68b1"
            size={17}
            onClick={() => isAfterDate && handleChangeModal()}
          />
          <RiDeleteBin5Line
            color="#eb2e2e"
            size={17}
            onClick={() => isAfterDate && handleDelete()}
          />
        </div>
      </div>
      <Modal
        isOpen={openModal}
        handleChangeModal={handleChangeModal}
        hour={String(hour)}
        name={name}
        id={id}
      />
    </>
  );
};
