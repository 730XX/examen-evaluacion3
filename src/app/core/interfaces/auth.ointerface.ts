export interface LoginRequest {
  user_email: string;
  user_password: string;
}

export interface UserData {
  user_id: string;
  user_uid: string;
  user_email: string;
  user_password: string;
  user_emailverified: string | null;
  user_phone: string | null;
  user_photo: string | null;
  user_name: string;
  user_address: string | null;
  user_birthdate: string | null;
  user_country: string | null;
  user_state: string;
  user_rol: string;
  user_registrationdate: string;
  token: string;
}

export interface LoginResponse {
  data: UserData;
  mensajes: string[];
  tipo: string;
  logs: string[];
}