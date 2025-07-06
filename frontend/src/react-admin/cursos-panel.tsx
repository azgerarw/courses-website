// src/resources/cursos.tsx
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  EditButton,
  FileField,
  FileInput,
  ImageField,
} from 'react-admin';

import { FC } from 'react';
import { FieldProps } from 'react-admin';

const ImagenCustomField: FC<FieldProps> = ({ record, source }) => {
  if (!record || !source || !record[source]) return null;
  const imageUrl = `http://localhost:3000/uploads/${record[source]}`;
  return <img src={imageUrl} alt={record[source]} style={{ maxHeight: 100 }} />;
};



export const CursoList = () => (
  

  <List  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="titulo" />
      <TextField source="descripcion" />
      
      <TextField source="categoria" />
      <ImagenCustomField source="imagen" />

    </Datagrid>
  </List>
);

