;if distance == 0 do nothing (may be waiting to start, may be done, may even be crashing)
;if distance < 100 & speed > 0 decelerate at -1
;if distance < 100 & speed < 0 accelerate at 1
;if distance <= 10000 & speed > 11 decelerate at -10
;if distance <= 10000 & speed < 1 accelerate at 1
;if distance > 10000 & speed < 500ish accelerate at 100
;if distance > 10000 & speed > 500ish decelerate at -100

; I wanted to define these as labels, but I think the assembler doesn't support that.
; accelerator   = 0x1000
; speedometer   = 0x1001
; distanceMeter = 0x1002

; Here are some negative values used here
; 0xFF38 = -200
; 0xFF9C = -100
; 0xFFEC = -20
; 0xFFF6 = -10
; 0xFFFF = -1

:loop

IFE [0x1002], 0
SET PC, loop

IFL [0x1002], 100
SET PC, dlt100

IFG [0x1002], 10000
SET PC, dgt10000
SET PC, dlt10000

:dlt100
IFA [0x1001], 0
SET PC, dlt100sgt0
IFU [0x1001], 0
SET PC, dlt100slt0
SET PC, loop

:dlt100sgt0
SET [0x1000], 0xFFFF
SET PC, loop

:dlt100slt0
SET [0x1000], 1
SET PC, loop

:dgt10000
IFA [0x1001], 515
SET PC, dgt10000sgt500
IFU [0x1001], 485
SET PC, dgt10000slt500
SET [0x1000], 0 ; steady on
SET PC, loop

:dgt10000sgt500
SET [0x1000], 0xFF9C
SET PC, loop

:dgt10000slt500
SET [0x1000], 100
SET PC, loop

:dlt10000
IFA [0x1001], 11
SET PC, dlt10000sgt10
IFU [0x1001], 1
SET PC, dlt10000slt1
SET [0x1000], 0 ; steady on
SET PC, loop

:dlt10000sgt10
SET [0x1000], 0xFFEC
SET PC, loop

:dlt10000slt1
SET [0x1000], 10
SET PC, loop
