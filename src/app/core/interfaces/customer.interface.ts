export interface Customer {
  customer_id: string | number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_country: string | null;
  customer_typedocument: string;
  customer_numberdocument: string;
  customer_birthdate: string | null;
  customer_registrationdate: string | null;
  customer_state: string | number;
  user_id: string | number | null;
}
