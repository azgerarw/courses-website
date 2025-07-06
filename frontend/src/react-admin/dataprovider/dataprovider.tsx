// src/react-admin/dataprovider/usuarios-dataprovider.tsx
import { DataProvider } from 'react-admin';
import axios from 'axios';

const apiUrl = 'http://localhost:3000/api';

const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const range = params.pagination;
    
    const response = await axios.get(`${apiUrl}/${resource}`)
    
    return {
      data: response.data,
      total: response.data.length,
    };
    
  },

  getOne: async (resource, { id }) => {
    const response = await axios.get(`${apiUrl}/${resource}/${id}`);
    return { data: response.data.data };
  },

  getMany: async (resource, { ids }) => {
    const { data } = await axios.get(`${apiUrl}/${resource}?ids=${ids.join(',')}`);
    return { data };
  },

  getManyReference: async () => {
    return Promise.reject('getManyReference not implemented');
  },

  create: async (resource, { data }) => {
    const response = await axios.post(`${apiUrl}/${resource}`, data);
    return { data: response.data.data };
  },

  update: async (resource, { id, data }) => {
    const response = await axios.put(`${apiUrl}/${resource}/${id}`, data);
    return { data: response.data.data };
  },

  updateMany: async () => {
    return Promise.reject('updateMany not implemented');
  },

  delete: async (resource, { id }) => {
    const response = await axios.delete(`${apiUrl}/${resource}/${id}`);
    return { data: response.data.data };
  },

  deleteMany: async () => {
    return Promise.reject('deleteMany not implemented');
  },
};

export default dataProvider;
