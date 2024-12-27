import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShiftPopupComponent } from '../shift-popup/shift-popup.component';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../../../../Services/employee.service';
import { bufferCount } from 'rxjs';
import { TitleStrategy } from '@angular/router';

@Component({
  selector: 'app-employee-shift',
  templateUrl: './employee-shift.component.html',
  styleUrl: './employee-shift.component.css',
})
export class EmployeeShiftComponent implements OnInit {
  @Input() employee: any;
  @Output() changePage = new EventEmitter();

  boxTag: any;
  text: number = 0;

  today: Date = new Date();

  employeeDays: any[] = [];
  monthNames: String[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  dayNames: String[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  dayInCurrentMonth = 0;
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();
  currentStartDay = this.getStartDayOfMonth(
    this.currentYear,
    this.currentMonth
  );

  shiftDate = {
    date: this.datePipe.transform(this.today, 'yyyy-MM-dd'),
    startTime: this.datePipe.transform(this.today, 'HH:mm'),
    endTime: this.datePipe.transform(this.today, 'HH:mm'),
  };

  constructor(
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    if (this.employee) {
      this.initCalendar(this.employee._id);
    }
  }

  initCalendar(employeeId: String) {
    console.log(this.employee);
    this.employeeService
      .getOneEmployeeShift(employeeId)
      .subscribe(async (response) => {
        console.log(response);
        this.employeeDays = await response.shift;

        this.calendar(this.currentYear, this.currentMonth);
      });
  }

  onChangePage(
    page: String = 'add-page',
    employeeData: any = {},
    clickBtn: String = 'create'
  ) {
    this.changePage.emit({
      page: page,
      data: employeeData,
      clickBtn: 'create',
    });
  }

  calendar(year: number, month: number) {
    this.dayInCurrentMonth = this.getDaysInMonth(year, month);

    console.log(this.currentMonth);

    const containerTag = document.querySelector('.grid-container');

    containerTag!.innerHTML = '';

    let count = 0;

    if (
      this.dayInCurrentMonth + this.currentStartDay > 28 &&
      this.dayInCurrentMonth + this.currentStartDay < 35
    ) {
      count = 35 - (this.dayInCurrentMonth + this.currentStartDay);
    } else if (this.dayInCurrentMonth + this.currentStartDay > 35) {
      count = 42 - (this.dayInCurrentMonth + this.currentStartDay);
    }

    let day: number = 1;
    for (
      let i = 0;
      i < this.dayInCurrentMonth + this.currentStartDay + count;
      i++
    ) {
      const boxTag = document.createElement('div');
      boxTag.classList.add('box');

      if (i < this.dayInCurrentMonth + this.currentStartDay) {
        if (i < this.currentStartDay) {
          boxTag.textContent = '';
        } else {
          if (i == this.currentStartDay) {
            if (this.currentStartDay == 0) {
              boxTag.classList.add('c12');
              boxTag.textContent = `${day++}`;
            } else if (this.currentStartDay == 1) {
              boxTag.classList.add('c23');
              boxTag.textContent = `${day++}`;
            } else if (this.currentStartDay == 2) {
              boxTag.classList.add('c34');
              boxTag.textContent = `${day++}`;
            } else if (this.currentStartDay == 3) {
              boxTag.classList.add('c45');
              boxTag.textContent = `${day++}`;
            } else if (this.currentStartDay == 4) {
              boxTag.classList.add('c56');
              boxTag.textContent = `${day++}`;
            } else if (this.currentStartDay == 5) {
              boxTag.classList.add('c67');
              boxTag.textContent = `${day++}`;
            } else if (this.currentStartDay == 6) {
              boxTag.classList.add('c78');
              boxTag.textContent = `${day++}`;
            }
          } else {
            boxTag.textContent = `${day++}`;
          }
        }
      } else {
        boxTag.textContent = '';
      }

      // if (this.employeeDays.includes(day)) {
      //   boxTag.classList.add('bg-primary');
      // }
      let historyDate;
      let historyStarttime;
      let historyEndtime;
      let shiftId;

      console.log(this.employeeDays);

      this.employeeDays.forEach((doc) => {
        // console.log(parseInt(doc.shift_date.slice(8)), day);
        const sliceMonth =
          doc.shift_date.length < 10
            ? doc.shift_date.slice(5, 6)
            : doc.shift_date.slice(5, 7);

        console.log(sliceMonth);
        if (
          parseInt(doc.shift_date.slice(8)) == parseInt(boxTag.textContent!) &&
          parseInt(doc.shift_date.slice(0, 4)) == this.currentYear &&
          parseInt(sliceMonth) == this.currentMonth + 1
        ) {
          boxTag.classList.add('bg-primary');

          const preDate = boxTag.textContent;

          boxTag.addEventListener('pointerenter', () => {
            shiftId = doc._id;
            historyDate = boxTag.textContent;
            historyStarttime = doc.start_time;
            historyEndtime = doc.end_time;
            boxTag.innerHTML = `
          
          <div class="mt-2 d-flex shiftCard">
          <span>
            <div>
              <img
                src="../../../../../assets/images/placeholder.png"
                style="width: 30px"
                alt=""
              />
            </div>
          </span>
          <span class="ml-2">
            <div style="font-size: 12px">${
              parseInt(doc.start_time.slice(0, 2)) < 12
                ? doc.start_time + ' AM'
                : doc.start_time + ' PM'
            }</div>
            <div style="font-size: 12px">${
              parseInt(doc.end_time.slice(0, 2)) < 12
                ? doc.end_time + ' AM'
                : doc.end_time + ' PM'
            }</div>
          </span>
        </div>

          `;
          });

          boxTag.addEventListener('pointerleave', () => {
            boxTag.innerHTML = `${preDate}`;
          });
        }
      });

      boxTag.addEventListener('click', () => {
        if (boxTag.textContent != '') {
          const clickedDate = `${this.currentYear}-${this.currentMonth + 1}-${
            parseInt(historyDate!) < 10 ? '0' + historyDate! : historyDate!
          }`;

          const filterDate = this.employeeDays.filter((date) => {
            console.log(clickedDate);
            return date.shift_date == clickedDate;
          });

          console.log(filterDate);
          if (filterDate.length == 0) {
            this.openPopup('Created Shift', {
              date: `${this.currentYear}-${this.currentMonth + 1}-${
                parseInt(boxTag.textContent!) < 10
                  ? '0' + boxTag.textContent
                  : boxTag.textContent
              }`,
              startTime: this.datePipe.transform(this.today, 'HH:mm'),
              endTime: this.datePipe.transform(this.today, 'HH:mm'),
            });
          } else {
            this.openPopup('Updated Shift', {
              date: `${this.currentYear}-${
                this.currentMonth + 1 < 10
                  ? '0' + (this.currentMonth + 1)
                  : this.currentMonth + 1
              }-${
                parseInt(historyDate!) < 10 ? '0' + historyDate! : historyDate!
              }`,
              startTime: historyStarttime!,
              endTime: historyEndtime!,
              shift_id: shiftId!,
            });
          }
        }
      });

      containerTag?.append(boxTag);
    }
  }

  getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  getStartDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay(); // Returns the day of the week (0-6)
  }

  preMonth() {
    this.currentMonth = this.currentMonth - 1;
    this.currentStartDay = this.getStartDayOfMonth(
      this.currentYear,
      this.currentMonth
    );

    if (this.currentMonth < 0) {
      this.currentYear--;
      this.currentMonth = 11;
    }

    this.calendar(this.currentYear, this.currentMonth);
  }

  nextMonth() {
    this.currentMonth = this.currentMonth + 1;
    this.currentStartDay = this.getStartDayOfMonth(
      this.currentYear,
      this.currentMonth
    );

    if (this.currentMonth > 11) {
      this.currentYear++;
      this.currentMonth = 0;
    }

    this.calendar(this.currentYear, this.currentMonth);
  }

  openPopup(title: String, date: any) {
    const _popup = this.dialog.open(ShiftPopupComponent, {
      width: '420px',

      data: {
        title: title,
        shiftDate: date,
        currentEmployeeId: this.employee._id,
      },
    });

    _popup.afterClosed().subscribe((item) => {
      this.initCalendar(this.employee._id);
    });

    console.log(this.today);
  }
}
