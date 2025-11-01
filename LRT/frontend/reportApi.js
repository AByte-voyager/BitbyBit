// src/api/reportApi.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // <-- change to your backend URL

export const listReports = async () => {
  const res = await axios.get(`${API_BASE}/reports`);
  return res.data; // assuming your API returns an array of reports
};

export const getReport = async (id) => {
  const res = await axios.get(`${API_BASE}/reports/${id}`);
  return res.data; // a single report object
};

export const updateReport = async (id, payload) => {
  const res = await axios.put(`${API_BASE}/reports/${id}`, payload);
  return res.data;
};
