import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import localeZh from 'dayjs/locale/zh'
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(relativeTime)
// dayjs.locale(localeZh)

export function formatDate(value?: string | number | Date | dayjs.Dayjs): string {
  if (!value) {
    return ''
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

export function formatRelativeDate(value?: string | number | Date | dayjs.Dayjs): string {
  if (!value) {
    return ''
  }
  return dayjs(value).fromNow()
}

export default dayjs
