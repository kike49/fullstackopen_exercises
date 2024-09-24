import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "./type";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllDiaries = () => {
  return axios.get<DiaryEntry[]>(baseUrl).then((res) => res.data);
};

export const createDiary = (object: NewDiaryEntry) => {
  try {
    const responseData = axios.post<DiaryEntry>(baseUrl, object).then((res) => res.data);
    return responseData
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create diary entry"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
