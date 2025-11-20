export interface User {
  user_id: string | number;
  user_uid: string | number;
  user_email: string;
  user_password?: string;
  user_emailverified?: string | null;
  user_phone?: string | null;
  user_photo?: string | null;
  user_name: string;
  user_address?: string | null;
  user_birthdate?: string | null;
  user_country?: string | null;
  user_state: string | number;
  user_rol: string | number; // Sin 'e', como viene de la API
  user_registrationdate?: string | null;
}
