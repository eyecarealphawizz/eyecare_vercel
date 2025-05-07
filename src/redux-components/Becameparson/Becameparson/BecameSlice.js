import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BecameService from "./BecameService";

const initialState = {
  becameAll :[],
  isLoding : false,
  isError:false,
  isSuccess:false, 
  message:""
};

const BecameSlice = createSlice({
  name: "became",
  initialState, 
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase("someAction", (state, action) => {
    });
  },
});

export const doctorshomevisit =createAsyncThunk("/becameAll",async(data)=>{
  console.log(data);
  
    try {
        return await BecameService.doctorshomevisit(data)
       } catch (error) { 
        console.error('Error fetching all categories:', error);
      }
})

export const HomeVisit =createAsyncThunk("/becameAll",async(data)=>{
  console.log(data);
  
    try {
        return await BecameService.HomeVisit(data)
       } catch (error) { 
        console.error('Error fetching all categories:', error);
      }
})
export default BecameSlice.reducer;
