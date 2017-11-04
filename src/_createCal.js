export default (options) => {
  const today = new Date();

  const getCurrentDay = today.getDate();

  const getCurrentMonth = today.getMonth() + 1;

  const getCurrentYear = today.getFullYear();

  const getNextYear = today.getFullYear() + 1;

  const getMonth = (month, year) => {
    // need to set month to 0 based index
    const date = new Date(year, month - 1, 1);
    const result = [];

    while (date.getMonth() === month - 1) {
      result.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }
    return result;
  };

  const addListItem = (className, curMonth = false) => {
    const createDay = (day) => {
      const listItem = document.createElement('li');
      const listText = document.createElement('span');

      if (className) {
        listItem.classList.add(className);
      } else if (curMonth && day === getCurrentDay) {
        listItem.classList.add('today');
      }

      listText.innerText = day;
      listItem.appendChild(listText);

      return listItem;
    };

    return createDay;
  };

  const getCalMonth = (month, year, curMonth) => {
    const firstMonthEvaluated = month === 1 ? 12 : month - 1;
    const lastMonthEvaluated = month === 12 ? 1 : month + 1;

    const firstMonthInYearEvaluated = month === 1 ? year - 1 : year;
    const lastMonthInYearEvaluated = month === 12 ? year + 1 : year;

    const firstDayOfTheMonth = new Date(year, month - 1, 1);
    const lastDayOfTheMonth = new Date(year, month, 0);

    const firstDayOfTheWeek = firstDayOfTheMonth.getDay();
    // last day of the week is 0 base index so we need to add 1 to get correct count
    const lastDayOfTheWeek = 7 - (lastDayOfTheMonth.getDay() + 1);

    const daysOfTheCurrentMonth = getMonth(month, year);
    // year/month evaluated if at the end of the year to go back to 12 and not -1 in months
    const daysOfThePrevMonth = getMonth(firstMonthEvaluated, firstMonthInYearEvaluated);
    const daysOfTheNextMonth = getMonth(lastMonthEvaluated, lastMonthInYearEvaluated);

    const allMonths = daysOfThePrevMonth
      .slice(daysOfThePrevMonth.length - firstDayOfTheWeek)
      .map(addListItem('prev-month'))
      .concat(daysOfTheCurrentMonth.map(addListItem('', curMonth)))
      .concat(daysOfTheNextMonth.slice(0, lastDayOfTheWeek).map(addListItem('next-month')));

    return allMonths;
  };

  const createDays = (month, year) => {
    const listContainer = document.createElement('div');
    const list = document.createElement('ul');
    const days = getCalMonth(month, year, month === getCurrentMonth);

    if (options.dayClass) {
      listContainer.classList.add(options.dayClass);
    }

    listContainer.appendChild(list);

    days.forEach(date => list.append(date));

    return listContainer;
  };

  const createHeader = (month, year) => {
    const headerEl = document.createElement('div');
    const prevArrow = document.createElement('i');
    const nextArrow = document.createElement('i');
    const textEl = document.createElement('span');
    const monthEl = document.createElement('span');
    const yearEl = document.createElement('span');
    // next line expects 0 index value of month
    const date = new Date(year, month - 1);
    const monthName = date.toLocaleString('en-us', { month: 'long' });

    prevArrow.classList.add('arrow', 'arrow--prev');
    nextArrow.classList.add('arrow', 'arrow--next');

    if (options.headerClass) {
      headerEl.classList.add(options.headerClass);
    }

    monthEl.innerText = monthName;
    yearEl.innerText = year;

    // the order of appending things here is important
    headerEl.appendChild(prevArrow);
    textEl.appendChild(monthEl);
    textEl.appendChild(yearEl);
    headerEl.appendChild(textEl);
    headerEl.appendChild(nextArrow);

    return headerEl;
  };

  const createLegend = () => {
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const legendContainer = document.createElement('div');
    const legend = document.createElement('ul');

    if (options.legendClass) {
      legendContainer.classList.add(options.legendClass);
    }

    legendContainer.appendChild(legend);

    weekDays.forEach((day) => {
      const listItem = document.createElement('li');

      listItem.innerText = day;
      legend.append(listItem);
    });

    return legendContainer;
  };

  const createCalMonth = (month, year) => {
    const wrapper = document.createElement('div');
    const header = createHeader(month, year);
    const legend = createLegend();
    const days = createDays(month, year);

    if (options.monthClass) {
      wrapper.classList.add(options.monthClass);
    }

    wrapper.appendChild(header);
    wrapper.appendChild(legend);
    wrapper.appendChild(days);

    if (options.target) {
      options.target.appendChild(wrapper);
    } else {
      return wrapper;
    }
  };

  for (let i = 0; i <= options.monthsDisplayed - 1; i += 1) {
    const month = getCurrentMonth + i;

    if (month === 13) {
      createCalMonth(1, getNextYear);
    } else {
      createCalMonth(month, getCurrentYear);
    }
  }
};
