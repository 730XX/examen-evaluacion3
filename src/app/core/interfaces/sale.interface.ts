export interface Sale {
  sale_id: string;
  store_id: string;
  customer_id: string;
  store_mosoid: string;
  tablee_id: string;
  sale_total: string;
  sale_discount: string;
  sale_note: string | null;
  sale_datecreation: string;
  
  // Datos del cliente
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_country: string;
  customer_typedocument: string;
  customer_numberdocument: string;
  customer_birthdate: string;
  customer_registrationdate: string;
  customer_state: string;
  
  // Datos del mesero (puede ser null si no hay mesero asignado)
  mesero: {
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
  } | null;
  
  // Datos de la mesa (puede ser null si no hay mesa asignada)
  mesa: {
    tablee_id: string;
    customer_id: string;
    lounge_id: string;
    tablee_mozoid: string;
    tablee_mozo: string;
    tablee_name: string;
    tablee_state: string;
    tablee_numberorders: string;
    tablee_comment: string | null;
    tablee_datefilled: string;
  } | null;
  
  // Pagos
  pagos: Array<{
    salepayment_id: string;
    sale_id: string;
    salepayment_method: string;
    salepayment_amount: string;
    salepayment_date: string;
  }>;
  
  // Detalle de productos
  detalle: Array<{
    saledetail_id: string;
    sale_id: string;
    tablee_id: string;
    saledetail_productid: string;
    saledetail_price: string;
    saledetail_quantity: string;
    saledetail_discount: string;
    saledetail_amount: string;
    saledetail_note: string | null;
    saledetail_datecreation: string;
    product_name: string;
  }>;
}
