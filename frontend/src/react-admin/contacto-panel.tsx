// src/resources/cursos.tsx
import {
  List,
  Datagrid,
  Edit,
  TextField,
  SimpleForm,
  TextInput,
  Create,
  DeleteButton,
  EditButton,
  required,
} from 'react-admin';



export const ContactoList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="nombre" />
      <TextField source="email" />
      <TextField source="mensaje"  />
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
);

export const ContactoCreate = () => (
  
  <Create>
    <SimpleForm>
      <TextInput source="nombre" />
      <TextInput source="email" />   
      <TextInput source="mensaje" />
    </SimpleForm>
  </Create>
);

export const ContactoEdit = () => (
    <Edit component={'div'} mutationMode="pessimistic">
        <SimpleForm>
            <TextInput disabled label="Id" source="id" />
            <TextInput source="nombre" validate={required()} />
            <TextInput source="email" validate={required()} />
            <TextInput source="mensaje" validate={required()} />
            
        </SimpleForm>
    </Edit>
);
