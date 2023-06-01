import dayjs from 'dayjs';

const disabledSorts = ['event', 'offer' ];
const isDisabled = (sortType) => (disabledSorts.includes(sortType) ? 'disabled' : '');

const sortPointsByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
const sortPointsByDate = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

export { isDisabled, sortPointsByDate, sortPointsByPrice };
