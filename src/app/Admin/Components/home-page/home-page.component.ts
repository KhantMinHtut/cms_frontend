import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { OrderService } from '../../../Services/order.service';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../../../Services/employee.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CustomerService } from '../../../Services/customer.service';
import { PaymentService } from '../../../Services/payment.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  // lineChartData = {
  //   labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  //   datasets: [
  //     {
  //       data: [89, 34, 43, 54, 28, 74, 93],
  //       label: 'Sales Percent',
  //     },
  //   ],
  // };

  totalOrder: number = 0;
  totalCustomer: number = 0;
  totalEmployee: number = 0;
  totalAmount: number = 0;

  manager: number = 0;
  barista: number = 0;
  cashier: number = 0;
  waiter: number = 0;

  label: any[] = [];
  dataset: any[] = [];

  orderData: any;
  paymentData: any;
  pieChart: any;

  monthsLocalized = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'short' })
  );

  monthsDatas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  paymentDatas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  pieChartLabels: any;

  pieChartData: any[] = [];
  startDate: Date | null | undefined = null;
  endDate: Date | null | undefined = null;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private datePipe: DatePipe,
    private employeeService: EmployeeService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.onChartPage(new Date('2024-1-1'), Date.now());

    this.employeeService.getAllEmployees().subscribe(async (response) => {
      const employees = await response.employees;

      employees.forEach((employee: any) => {
        if (employee.position == 'Manager') {
          this.manager += 1;
        } else if (employee.position == 'Barista') {
          this.barista += 1;
        } else if (employee.position == 'Cashier') {
          this.cashier += 1;
        } else if (employee.position == 'Waiter') {
          this.waiter += 1;
        }
      });
    });
  }

  onChartPage(startdate: any, enddate: any) {
    this.monthsDatas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.pieChartData = [];

    // this.orderService.getOrders().subscribe((response) => {
    //   this.totalOrder = response.count;
    // });

    this.customerService
      .getCustomersByDate(startdate, enddate)
      .subscribe(async (response) => {
        console.log(response);
        const customers = await response.customers;
        this.totalCustomer = customers.length;
      });

    this.employeeService
      .getEmployeesByDate(startdate, enddate)
      .subscribe(async (response) => {
        const employees = await response.employees;
        this.totalEmployee = employees.length;
      });

    this.paymentService
      .getPaymentByDate(startdate, enddate)
      .subscribe(async (response) => {
        const payment = await response.payment;

        payment.forEach((payment: any) => {
          this.totalAmount += payment.amount;
        });
      });

    this.orderService
      .getOrdersByDate(startdate, enddate)
      .subscribe(async (response) => {
        const ordersByDate = await response.orders;
        this.totalOrder = ordersByDate.length;
        const isequalDatas: string | any[] = [];

        console.log(ordersByDate);

        ordersByDate.forEach((doc: any) => {
          // this.datePipe.transform(doc.orderDate, 'MM/dd/yyyy');
          console.log(new Date(doc.orderDate).getMonth());
          this.monthsDatas[new Date(doc.orderDate).getMonth()] += 1;
          console.log(this.monthsDatas);
        });

        this.orderData = {
          labels: this.monthsLocalized,
          datasets: [
            {
              label: 'Monthly Orders',
              fill: true,
              data: this.monthsDatas,
              borderWidth: 1,
            },
          ],
        };
      });

    this.orderService
      .getOrderDetails(startdate, enddate)
      .subscribe(async (response) => {
        console.log(response);
        const orderDetails = await response.orderDetails;
        const isEqualName: any[] = [];

        orderDetails.forEach((doc: any) => {
          doc.product_id.forEach((product: any) => {
            if (isEqualName.includes(product.name)) {
              const filterProduct = this.pieChartData.filter((data: any) => {
                return data.label == product.name;
              });
              filterProduct[0].data += 1;
            } else {
              isEqualName.push(product.name);
              this.pieChartData.push({ label: product.name, data: 1 });
            }
          });
        });

        console.log(this.pieChartData);

        this.pieChart = {
          // labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          labels: this.pieChartData.map((item: any) => {
            return item.label;
          }),
          datasets: [
            {
              label: 'Monthly sell products',
              fill: true,
              data: this.pieChartData.map((item: any) => {
                return item.data;
              }),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)',
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
              ],
              borderWidth: 1,
            },
          ],
        };
      });

    // Payment
    this.paymentService
      .getPaymentByDate(startdate, enddate)
      .subscribe(async (response) => {
        const payment = await response.payment;

        const isequalDatas: string | any[] = [];

        console.log(payment);

        payment.forEach((doc: any) => {
          // this.datePipe.transform(doc.orderDate, 'MM/dd/yyyy');
          console.log(new Date(doc.createdAt).getMonth());
          this.paymentDatas[new Date(doc.createdAt).getMonth()] += doc.amount;
          console.log(this.paymentDatas);
        });

        this.paymentData = {
          labels: this.monthsLocalized,
          datasets: [
            {
              label: 'Monthly Payment',
              fill: true,
              data: this.paymentDatas,
              borderWidth: 1,
            },
          ],
        };
      });
  }

  labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // data = {
  //   labels: this.label,
  //   datasets: [
  //     {
  //       label: 'My First Dataset',
  //       fill: true,
  //       data: [1, 2, 1],

  //       borderWidth: 1,
  //     },
  //   ],
  // };

  chartOption: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        stacked: true,
        grid: {
          display: true,
          color: 'rgba(255,99,132,0.2)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  //===================PieChart===========================
  // pieChart = {
  //   // labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  //   labels: this.pieChartData.map((item: any) => {
  //     return item.label;
  //   }),
  //   datasets: [
  //     {
  //       label: 'My First Dataset',
  //       fill: true,
  //       data: this.pieChartData.map((item: any) => {
  //         return item.data;
  //       }),
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(255, 159, 64, 0.2)',
  //         'rgba(255, 205, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(201, 203, 207, 0.2)',
  //       ],
  //       borderColor: [
  //         'rgb(255, 99, 132)',
  //         'rgb(255, 159, 64)',
  //         'rgb(255, 205, 86)',
  //         'rgb(75, 192, 192)',
  //         'rgb(54, 162, 235)',
  //         'rgb(153, 102, 255)',
  //         'rgb(201, 203, 207)',
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  pieChartOption: ChartOptions = {
    // responsive: true,
    // plugins: {
    //   legend: {
    //     display: true, // Hides legend labels
    //     position: 'right',
    //   },
    // },

    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          // This will change the label color and font style
          color: 'rgba(54, 162, 235, 1)',
          font: {
            size: 10,
            family: 'Arial',
          },
          boxWidth: 15,
          boxHeight: 15,
          usePointStyle: true,
        },
      },
    },
  };

  // Material Date picker range
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  onDateRangeChange(event: MatDatepickerInputEvent<Date>) {
    if (event.targetElement?.getAttribute('matStartDate') !== null) {
      this.startDate = event.value;
    } else if (event.targetElement?.getAttribute('matEndDate') !== null) {
      this.endDate = event.value;
    }

    if (
      this.startDate !== null &&
      this.startDate !== undefined &&
      this.endDate !== null &&
      this.endDate !== undefined
    ) {
      console.log('Date Range Changed: ', {
        startDate: this.startDate,
        endDate: this.endDate,
      });

      console.log(this.startDate.toLocaleDateString());

      this.onChartPage(this.startDate, this.endDate);
    }

    // Add additional logic here that needs to run when either date changes
  }
}
