import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../../../core/services/sale.service';
import { MessageService } from 'primeng/api';
import { Sale } from '../../../../core/interfaces/sale.interface';

@Component({
  selector: 'app-informe-ventas',
  standalone: false,
  templateUrl: './informe-ventas.html',
  styleUrl: './informe-ventas.scss',
})
export class InformeVentas implements OnInit {
  public ventas: Sale[] = [];
  public loadingVentas: boolean = false;

  public modalDetalleVisible: boolean = false;
  public ventaSeleccionada: Sale | null = null;

  constructor(
    private saleService: SaleService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  private cargarVentas(): void {
    this.loadingVentas = true;

    this.saleService.getSalesByInformes().subscribe({
      next: (response) => {
        if (response.tipo === '1' && response.data) {
          this.ventas = response.data;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: response.mensajes?.[0] || 'No se encontraron ventas'
          });
        }
        this.loadingVentas = false;
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el informe de ventas'
        });
        this.loadingVentas = false;
      }
    });
  }

  public verDetalle(venta: Sale): void {
    console.log('Venta seleccionada:', venta);
    console.log('Detalle de productos:', venta.detalle);
    if (venta.detalle && venta.detalle.length > 0) {
      console.log('Primer producto:', venta.detalle[0]);
    }
    this.ventaSeleccionada = venta;
    this.modalDetalleVisible = true;
  }

  public formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const anio = date.getFullYear();
    const hora = date.getHours().toString().padStart(2, '0');
    const minuto = date.getMinutes().toString().padStart(2, '0');
    
    return `${dia} ${mes}, ${anio} ${hora}:${minuto}`;
  }

  public formatearMonto(monto: string | null | undefined): string {
    if (!monto) return 'S/ 0.00';
    const valor = parseFloat(monto);
    if (isNaN(valor)) return 'S/ 0.00';
    return `S/ ${valor.toFixed(2)}`;
  }

  public formatearCantidad(cantidad: string | null | undefined): string {
    if (!cantidad) return '0';
    const valor = parseFloat(cantidad);
    if (isNaN(valor)) return '0';
    return Math.floor(valor).toString();
  }

  public getTotalPagado(venta: Sale): number {
    return venta.pagos.reduce((total, pago) => total + parseFloat(pago.salepayment_amount), 0);
  }

  public getMetodoPago(metodo: string): string {
    const metodos: any = {
      '1': 'Efectivo',
      '2': 'Tarjeta',
      '3': 'Transferencia',
      '4': 'Yape/Plin'
    };
    return metodos[metodo] || 'Desconocido';
  }
}
