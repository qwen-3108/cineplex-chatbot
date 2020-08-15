*not most updated, most updated see test case file*

sessionStartedAt new Date('2020-08-10T09:37:59+08:00'); Monday

detect whether need time correctly
{start: new Date(//sun 2pm)), end: new Date(//sun 2pm)}, { includeTimeRange = false}
{start: new Date(//sun 2pm)), end: new Date(//sun 2pm)}
new Date(//sun 2pm), { includeTimeRange = false }
new Date(//sun 2pm)

time parsed correctly
{ start: new Date(//mon noon), end: new Date(//mon midnight)} on monday from noon to midnight
{ start: new Date(//tes noon), end new Date(//tues 4pm)} on tuesday from noon to 4pm
{start: new Date(//wed 8pm), end: new Date(//wed midnight)} on wednesday from 8pm to midnight
{start: new Date(//thu 11am), end: new Date(//thu 3pm)} on thursday from 11am to 3pm
{start: new Date(//fri 5am), end: new Date(//fri 11:59am)} on friday morning
{start: new Date(//fri 12pm), end: new Date(//fri 05:59pm)} on friday afternoon
{start: new Date(//fri 5pm), end: new Date(//fri 11:59pm)} on friday evening
{start: new Date(//fri 7pm), end: new Date(//sat 05:59am)} on friday night
{start: new Date(//fri 5pm), end: new Date(//fri 11pm)}; on friday from 5pm to 11pm
{start: new Date(/sat 4pm), end: new Date(//sat 4pm)}; on saturday at 4pm
new Date(//sat noon) on saturday noon
new Date(//sat midnight) on saturday at midnight
new Date(//sat 4pm) on saturday at 4pm

date parsed correctly
{ start: new Date(//today), end: new Date(//today)}
{ start: new Date(//tomorrow), end: new Date(//tomorrow)}
{ start: new Date(//saturday), end: new Date(//saturday)} on saturday
{ start: new Date(//sunday), end: new Date(//sunday)} on sunday
{ start: new Date(//next tue)} on next tuesday
{ start: new Date(//next sat)} on next saturday
{ start: new Date(//next sun), end: new Date(next sun)} on aug 23
{ start: new Date(//mon), end: new Date(//fri)} from monday to friday
{ start: new Date(//fri), end: new Date(//mon)} from friday to next monday
{ start: new Date(//sat), end: new Date(//sun)} this weekend
{ start: new Date(//next sat), end: new Date(//next sun)} next weekend
{ start: new Date(//wed), end: new Date(//next thu)} on wed and thursday
*sessionStartedAt sun
{ start: new Date(//next sun), end: new Date(next Sun)} on next Sunday

date combine with time properly
this morning
today at noon
this afternoon
this evening
tonight
today at midnight? <-- not tested due to weird midnight parsing by dialogflow

tomorrow - next sat dun need to test

on the morning of aug 23
on the afternoon of aug 24
on the evening of aug 23
on the night of aug 23
on aug 23 at 7am
on aug 23 from 2pm to 4pm




