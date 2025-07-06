import { ReactNode } from 'react';

type BotonProps = {
  id?: string;
  onClick?: (e: any) => void;
  children: ReactNode;
  className?: string;
};

export default function Boton({id, onClick, children, className=''}: BotonProps) {

    return <button id={id} type="button" onClick={onClick} className="bg-blue-800 text-white p-2 w-fit m-auto h-10 cursor-pointer hover:bg-blue-600 active:scale-95 transition-transform ">{children}</button>
}