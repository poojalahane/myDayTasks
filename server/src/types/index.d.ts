import { Request } from "express";

interface ApiRequest extends Request {
  user?: {
    id: string;
    username: string;
    roles: string[];
  };
}
