import { get, post } from "../util/http";
import { token } from "@/atoms/kuepa"; 

const api = "/lead";

interface LeadData {
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  interestProgram: string;
  status?: "active" | "inactive";
  trackings?: Array<{
    tracking: string;
    description: string;
    new: boolean;
    name: string;
  }>;
}

export const leadService = {
  api,
  get: async ({ _id }: { _id: string }): Promise<LeadData> => {
    return await get({ api: `${api}/get/${_id}` });
  },
  create: async (leadData: LeadData): Promise<LeadData> => {
    const authToken = token.get(); 
    return await post({
      api: `${api}/upsert`,
      options: {
        data: leadData
      },
    });
  },
};
