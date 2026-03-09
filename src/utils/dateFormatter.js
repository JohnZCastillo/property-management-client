import {format} from "date-fns"
import { TZDate } from '@date-fns/tz'

export default function dateFormatter(value, pattern = "yyyy-MM-dd hh:MM a", timezone = "Asia/Manila"){
    return format(new TZDate(value, timezone), pattern);
}