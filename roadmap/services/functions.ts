import { ITimePeriod } from '../interfaces'

export const getFirstandLastDays = (
  inputDate: Date,
  weekView: boolean
): ITimePeriod => {
  const date = new Date(inputDate)
  let output: ITimePeriod
  if (weekView) {
    var first = date.getDate() - date.getDay() + 1
    const start = new Date(date.getTime())
    const end = new Date(date.getTime())
    start.setDate(first)
    start.setHours(0, 0, 0, 0)
    end.setDate(first + 21)
    end.setHours(0, 0, 0, 0)
    output = {
      startDate: start,
      endDate: end
    }
  } else {
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 3, 0)
    output = {
      startDate: firstDay,
      endDate: lastDay
    }
  }
  return output
}

export const getBoardDays = (): Date[] => {
  const days = []
  const date = new Date('1/1/2023')
  var first = date.getDate() - date.getDay() + 1
  for (let i = 0; i < 28; i++) {
    var next = new Date(date.getTime())
    next.setDate(first + i)
    days.push(next)
  }
  return days
}

export const getDaysDifference = (date1: Date, date2: Date): number => {
  if (date2 <= date1) return 0
  var Difference_In_Time = date2.getTime() - date1.getTime()
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24)
  return Difference_In_Days
}

export const getWeekNumber = (date: Date): number => {
  const startDate = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor(
    (date.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000)
  )
  var weekNumber = Math.ceil(days / 7)
  return weekNumber
}
