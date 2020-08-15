# dialogflow time matching behavior

asked on 15 Aug 2020 (Sat)

## reasonable cases
Things to note: Different interpretation of 'next', 'midnight', and 'sunday' from case to case
input | extracted date-time
------|---------------------
today | "2020-08-15T12:00:00+08:00"
today at 7pm | { "date_time": "2020-08-15T19:00:00+08:00" }
tonight | { "startDateTime": "2020-08-15T17:00:00+08:00", "endDateTime": "2020-08-15T23:59:59+08:00" }
tomorrow | "2020-08-16T12:00:00+08:00"
tomorrow from 1pm to 8pm | { "endDateTime": "2020-08-16T20:00:00+08:00", "startDateTime": "2020-08-16T13:00:00+08:00" }
tomorrow morning | { "startDateTime": "2020-08-16T05:00:00+08:00", "endDateTime": "2020-08-16T11:59:59+08:00" }
tomorrow afternoon | { "startDateTime": "2020-08-16T12:00:00+08:00", "endDateTime": "2020-08-16T17:59:59+08:00" }
tomorrow evening | { "endDateTime": "2020-08-16T23:59:59+08:00", "startDateTime": "2020-08-16T17:00:00+08:00" }
tomorrow night |  { "startDateTime": "2020-08-16T17:00:00+08:00", "endDateTime": "2020-08-16T23:59:59+08:00" }
from tomorrow noon to midnight | { "endDateTime": "2020-08-16T23:59:59+08:00", "startDateTime": "2020-08-16T17:00:00+08:00" }
wednesday | "2020-08-19T12:00:00+08:00"
wednesday midnight | 	{ "date_time": "2020-08-19T00:00:00+08:00" }
this wednesday | 	"2020-08-19T12:00:00+08:00"
next wednesday | "2020-08-19T12:00:00+08:00"
sunday | "2020-08-16T12:00:00+08:00"
next sunday | "2020-08-16T12:00:00+08:00"
this weekend |  { "startDate": "2020-08-15T00:00:00+08:00", "endDate": "2020-08-16T23:59:59+08:00" }
next weekend | { "endDate": "2020-08-23T23:59:59+08:00", "startDate": "2020-08-22T00:00:00+08:00" }
from today to tomorrow |  { "startDate": "2020-08-15T00:00:00+08:00", "endDate": "2020-08-16T23:59:59+08:00" }
between today and tomorrow | { "endDate": "2020-08-16T23:59:59+08:00", "startDate": "2020-08-15T00:00:00+08:00" }
from wednesday to saturday | { "startDate": "2020-08-19T00:00:00+08:00", "endDate": "2020-08-22T23:59:59+08:00" }
between wednesday and saturday | { "endDate": "2020-08-22T23:59:59+08:00", "startDate": "2020-08-19T00:00:00+08:00" }
the evening of 23 aug | { "endDateTime": "2020-08-23T23:59:59+08:00", "startDateTime": "2020-08-23T17:00:00+08:00" }
22 - 26 aug | { "startDate": "2020-08-22T00:00:00+08:00", "endDate": "2020-08-26T23:59:59+08:00" }


## failed cases
input | extracted date-time
------|---------------------
wednesday and thursday | "2020-08-20T12:00:00+08:00"
wednesday and thursday evening | { "startDateTime": "2020-08-20T17:00:00+08:00", "endDateTime": "2020-08-20T23:59:59+08:00" }
this weekend evening | { "endDateTime": "2020-08-15T23:59:59+08:00", "startDateTime": "2020-08-15T17:00:00+08:00" }
today and tomorrow | fallback
either today or tomorrow | fallback
between wednesday and sunday | { "endDate": "2020-08-16T23:59:59+08:00", "startDate": "2020-08-12T00:00:00+08:00" }
from today to 23 aug | fallback