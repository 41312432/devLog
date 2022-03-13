---
title: Computer Organization & Design 4-(2)
date: 2022-03-12 02:20:09
category: computer organization
thumbnail: { thumbnailSrc }
draft: false
---

> _Datapath_

_⌜Computer Organization and Design⌟의 4장 **Processor**에 대해 정리한 글입니다._

<!-- thumbnail -->

<details>
   <summary>💡RoadMap</summary>

1. Computer Abstraction and Technology
2. Instruction Set Architecture
3. Arithmetic for Computer
4. `Proccessor`

   </details>

<br>

---

# Pipeline

이번 글에서는 single datapath의 비효율적인 성능을 개선하기 위한 방법 중 하나인 `파이프라인`에 대해 설명한다.

## Pipeline

`Pipeline(파이프라인)`이란 여러 명령어를 실행할 때 중복해서(overlap) 실행하는 구현 기법을 말한다.

다음의 빨래 과정을 보면 파이프라인이 무엇인지 알 수 있다.

![>Laundry analogy](picture/laundry.png)

빨래 과정을 4가지의 단계(stage)로 나눌 수 있다고 생각해보자.

세탁기를 돌리고, 건조기를 돌리고, 옷을 개키고, 옷장에 넣는다.  
각 단계는 1시간을 소요한다.  
세탁물의 양이 많아서, 빨래를 4번의 걸쳐서 한다.

<br>

파이프라인(위 그림에서 밑의 방법)에서는 **병렬적**으로 각 과정을 수행하여 훨씬 적은 시간이 소요되는 것을 볼 수 있다.  
각 과정(단계, `stage`)는 모두 병렬적으로 동시에 작동한다.

위처럼, 각 단계별로 별도의 자원이 있는 한 파이프라인을 적용할 수 있다.

<br>

역설적인점은, 각 과정의 길이(위 그림의 빨래의 예에서는, 세탁기->건조기->개키기->옷장에 넣기)는 똑같다는 것이다.

파이프라인은 각 라인을 병렬적으로 실행해 많은 작업(위 예에서는 총 세탁물의 양)에 대해 같은 시간당 많은 작업을 시행할 수 있게 한다.  
따라서 파이프라인은 처리해야 할 작업이 많을 때, 한 작업을 실행하는 속도는 향상시켜주지 않지만 작업을 완료하는데 총 걸리는 시간을 줄여준다.

즉, 빨래가 한번에 세탁기에 돌아갈 양이라면 파이프라인으로는 이 세탁 과정을 줄일 수 없다는 말이다.(세탁기가 빨래 양에 상관없이 돌아가는 속도가 같다면)

### pipeline in MIPS

동일한 원칙을 파이프라인 명령어 수행(pipeline instruction-execution)을 하는 프로세서에 적용시킬 수 있다.

MIPS insturction은 일반적으로 다음과 같은 5가지 단계(stage)로 이루어져 있다.

1. `IF(Intruction Fetch)`  
   \$PC의 주소값으로 메모리에서 명령을 가져온다.
2. `ID(Instruction Decode)`  
   명령을 디코딩하는 동안 레지스터를 읽는다.  
   MIPS 명령어의 regular format을 사용하면 디코딩과 레지스터를 읽는 두 과정을 동시에 진행할 수 있다.
3. `EX(Execution)`  
   명령을 실행하거나 주소를 계산한다.
4. `MEM(Memory)`  
   메모리에 접근한다.
5. `WB(Write Back)`  
   결과를 레지스터에 저장한다.

따라서 MIPS pipeline에는 5가지의 단계가 있다.

다음 예제는 pipeline으로 명령어 실행 속도가 빨라지는 것을 보여준다.

![>non-pipeline vs pipeline](picture/nonpipeline-vs-pipeline.png)

### ISA for pipeline

다음과 같은 몇가지 특징을 살펴보면, MIPS 아키텍쳐는 파이프라인을 위해 설계되었음을 알 수 있다.

1. **모든 MIPS 명령어는 32비트 길이이다.(고정길이)**  
   이러한 특징은 첫번째 단계에서 명령어를 가져오고(IF) 두번쨰 단계에서 명령어를 decoding하는것(ID)을 매우 쉽게 만든다.  
   X86과 같이 명령어의 길이가 다양한 ISA에서 파이프라인을 구현하는 것은 더 어렵다.

2. **소스 레지스터 필드가 명령어에서 같은 위치에 존재하는 몇개의 명령어 형식만 가지고 있다.**  
   이러한 구성은 IF 단계에서 에서 명령어를 가져와 foramt을 판단함과 동시에 ID 단계가 레지스터 파일을 읽기 시작할 수 있음을 의미한다.

3. **메모리 operand는 lw나 sw에서만 나타난다.**  
   이렇게 구성하면 EXE 단계에서 메모리 주소를 계산하고 다음 MEM 단계에서 메모리에 접근할 수 있음을 말한다.  
   X86과 같은 메모리에서 operand를 계산할 수 있는 ISA는 단계 3, 4는 address stage, memory stage로 확장되고 나서야 실행 단계로 갈 수 있을 것이다.

4. **operand는 메모리에서 정렬(aligned)되어 있어야 한다.**  
   따라서 우리는 두 개의 데이터 메모리가 필요한 단일 데이터 전송 명령에 대해 걱정 할 필요가 없게 된다.  
   요청된 데이터는 단일 파이프라인 단계(one-cycle)에서 프로세서와 메모리 간에 전송될 수 있다.

---

### Pipelined datapath

![>MIPS Pipelined datapath](picture/pipeline.png)

위 그림은 MIPS에서의 single-datapath를 파이프라인의 5가지 단계로 구분해놓은 그림이다.

명령어와 데이터는 대체적으로 왼쪽에서 오른쪽으로 이동하며 각 단계를 수행한다.  
하지만, 오른쪽에서 다시 왼쪽으로 이동하는 두 가지의 예외적인 경우가 있다.(그림에서 파란색으로 표시):

- **WB(Write Back)**  
  datapath의 마지막 단계에서 DM 의 값을 datapath의 중간에 있는 register file에 전달한다.
- **\$PC의 다음 주소값을 선택**  
  MEM 단계와 자동적으로 4 증가한 \$PC의 주소값 중 하나를 선택해 다시 \$PC에 전달한다.

<br>

오른쪽에서 왼쪽으로 이동하는 두 가지의 경우는 현재 명령어에 영향을 끼치지 않는다.  
두 데이터의 이동은 나중 명령어에만 영향을 끼친다.

첫번째 경우인 WB는 **data hazard**를,  
두번째 경우인 \$PC값의 설정은 **control hazard**를 일으킬 수 있다.  
이 부분은 Hazards 부분에서 자세히 다룰 것이다.

<br>

파이프라인의 동작을 이해할 수 있게 시각적으로 보는 방법은, 각 명령어들이 그들 고유의 datapath를 가지고 사용한다고 가정하는 것이다.

![>Instruction being excuted using each single-cycle datapath](picture/4-34.png)

위 그림처럼 각 명령어가 한 datapath를 사용한다고 가정하면  
한 clock cycle(CC)에서 겹치는 유닛이 없음을 알 수 있고  
따라서 한 datapath에서 여러개의 명령어를 각 단계별로 사용하는 파이프라인이 가능하다는 것을 볼 수 있다.

<br>

하지만 문제가 있다.  
예를 들어 위 그림에서 첫번째 명령어 datapath에서 IM 유닛이 IF 단계에서 명령어를 제공하면, 그 명령어의 내용을 나머지 네 단계에서 사용해야 한다.  
하지만 바로 다음 명령어는 첫번째 명령어가 ID 단계일때 IF 단계를 실행하게 되어 IM에 접근하게 된다.

<br>

이같은 문제를 해결하기 위해 한 명령어에 대해 단계마다 그 단계에서 얻는 값을 다음 단계에서 기억할 수 있도록 파이프라인 단계 사이에 값을 담아놓는 `pipeline register`가 필요하다.

![>pipelined single-datapath](picture/pipelined-datapath.png)

위 그림은 파이프라인 레지스터가 각 단계를 담당하는 유닛 사이에 구현되있는 pipeline-datapth이다.

모든 명령어들은 각 clock cycle마다 한 파이프라인 레지스터에서 다음 파이프라인 레지스터로 실행된다.

<br>

---

<br>

이제 실제로 파이프라인을 실행해보자.

lw 명령어는 파이프라인의 5가지 단계를 모두 사용하기 때문에 과정을 살펴보기 좋은 예이다.  
따라서 lw 명령어가 실행됨을 예를 들어 datapath의 각 유닛들이 어떤 작업을 하는지 단계별로 나누어 그림과 함께 설명한다.

<br>

1. `Instruction Fetch`  
    ![>Instruction Fetch](picture/lw-IF.png)
   \$PC의 주소값을 활용해서 메모리로부터 명령어를 읽어와 IF/ID 레지스터에 저장한다.  
    \$PC의 주소값은 자동적으로 4만큼 증가해 다시 \$PC에 저장되어 다음 clock cycle을 기다린다.  
    이 증가된 주소값은 IF/ID 레지스터에도 저장된다. (beq등의 명령어에서 쓰일 수도 있기 때문이다.)

   <br>

2. `Instruction Decoding & register file read`  
   ![>Instruction Decoding](picture/lw-ID.png)
   IF/ID 레지스터의 값으로부터 16비트 immediate 값, 두 개의 레지스터 번호를 얻는다.  
   16비트 immediate값은 sign-extend 유닛을 통해 32비트의 값으로 변환되고,  
   두 레지스터 번호를 통해 레지스터의 값을 읽는다.  
   3개의 값은 ID/EX 레지스터에 저장된다.  
   또한 IF/ID에 저장했던 4만큼 증가한 \$PC의 주소값도 ID/EX 레지스터로 이동되어 저장된다.

<br>

3. `Execute or Address calculation`  
   ![>Execute](picture/lw-exe.png)
   ID/EX 레지스터로부터 레지스터1의 값과 sign-extended immeidate 값을 가져와 ALU로 두 값을 더한다.  
   더한 값을 EX/MEM 레지스터에 저장한다.

<br>

4. `Memory Access`  
   ![>Memory](picture/lw-MEM.png)  
   EX/MEM 레지스터로부터 주소값을 얻어서 data memory에서 그 주소값에 해당하는 값을 읽는다.  
   읽어온 값을 MEM/WB 레지스터에 저장한다.

<br>

1. `Write Back`  
   ![>Write Back](picture/lw-WB.png)

   MEM/WB 레지스터에서 값을 읽어 register file에 저장한다.

<br>

---

<br>

마지막 단계가 조금 이상하다는 것을 느낄 수 있는가?  
lw명령에서 불러온 word를 저장할 레지스터는 어떤 단계에서 계산되는가?

IF/ID 레지스터가 그 레지스터 번호를 제공한다.  
하지만 이 레지스터 번호는 ID 단계가 아닌 lw 명령어가 끝난 뒤 저장할(Write Back 할) 레지스터의 주소를 찾을때, 즉 WB단계에서 필요하다.

따라서, 우리는 lw의 destination register의 번호를 저장해놓을(preserve) 필요가 있다.

IF/ID에서 desitnation register 번호를 읽어오면, 그 번호를 ID/EX, EX/MEM를 거쳐 저장해가며 MEM/WB 레지스터까지 전달한다.

![>correctd pipeline datapath](picture/4-41.png)

<br>

---

<br>

이제 pipelined datapath의 한 명령어가 단계별로 실행되는 과정을 살펴봤으니, 여러 명령어가 파이프라인에 맞게 동시에(stimulus) 실행되는 과정을 보자.

![>Multiple-clock-cycle pipeline](picture/multiple-clockcycle-datapath.png)

위 그림은 5개의 명령어가 파이프라인에 따라 실행되는 모습을 나타낸 multiple-clock-cylcle pipeline diagram이다.

맨 마지막 add 명령어가 실행될 때(Clock Cylce 5), datapath의 모습은 다음과 같을 것이다.

![>Single-clock-cycle diagram](picture/slice.png)

### Pipeline Control

single-datapath에 컨트롤 유닛을 추가한 것처럼, pipeline-datapath에도 컨트롤 유닛을 추가해 보자.

먼저 datapath의 컨트롤 라인에 이름(label)을 다는 것으로 시작하자.

![>label pipeline control line](picture/label-pipeline.png)

파이프라인 컨트롤을 구체화하기 위해서, 각 파이프라인 단계마다 컨트롤 값을 지정해주기만 하면 된다.  
각 컨트롤 라인은 오직 하나의 파이프라인 단계에 활성화되는 유닛에만 관련되어 있기 때문에, 우리는 컨트롤 라인을 5개의 단계에 각각 한개씩 총 5개로 나눌 수 있다.

1. `instruction fetch`  
   instruction memory를 읽고 \$PC에 새로운 주소값을 부여하는 일은 매 명령마다 항상 진행되므로, 이 단계에서는 특별히 컨트롤 할 일이 없다.

2. `instruction decode`  
   이 단계 역시 매 명령어마다 항상 일어나므로 특별히 제어할 것이 없다.

3. `Execution`  
   이 단계에서 설정된 신호는 **RegDst**, **ALUOp**, **ALUSrc**이다.  
   이 신호들은 result register, ALU operation, read data 2 또는 ALU를 위한 sign-extended immediate 를 선택한다.

4. `Memory access`  
   이 단계에서 설정된 신호는 **Branch**, **MemRead**, **MemWrite**이다.  
   beq, lw, sw는 이 신호들을 설정한다.

5. `Write Back`  
   이 단계의 신호는 **MemtoReg**, **RegWrite**이다.  
   MemtoReg는 ALU의 결과나 메모리 값을 register file로 보내는 것을 결정한다.  
   RegWrite은 선택한 값을 기록한다

![>control signals from instruction](picture/control-lines-for-pipeline.png)

아리 그림은 파이프라인 레지스터와 각 stage에 맞게 적절한 제어 신호가 연결된 full data path이다.

![>full datapath with extended pipeline registers and with the control lines connected to the proper stage.](picture/pipelined-datapath-with-control-signal.png)

## Hazards

`Hazard`란 다음 clock cycle에 다음 명령어가 실행되는 것을 막는 상황을 뜻한다.

다음과 같이 세가지의 종류가 있다.

- **Structure hazards**  
  요구되는 자원이 사용중(busy)일 때

- **Data hazards**  
  이전 명령이 data를 읽고 쓰는것을 기다려야 할 때

- **Control hazard**s  
  이전 명령에 따라 컨트롤 행동이 달라질 때

### Structure hazard

`Structure hazard`란 명령어들이 한 clock cycle 내에서 같은 유닛을 사용할 때 발생하는 문제를 말한다.

예를 들어, MIPS의 파이프라인에서 memory가 Instruction memory(IM)와 Data memory(DM)로 분리되어 있지 않고 단일 메모리를 사용했다면, IF 단계와 MEM 단계에서 동시에 한 메모리에 접근하기 때문에 파이프라인에서 여러 명령어가 각기 다른 단계(IF와 MEM)를 수행하고 있을 때 같은 메모리, 즉 같은 유닛에 접근하게 되는 문제가 발생할 수 있다.

이러한 문제는 같은 유닛을 사용하게 되는 명령어가 발생한다면 `Bubble(지연)`을 주어 뒤의 명령어를 몇 cycle 늦게 사용하는 방식으로 해결할 수 있다.  
즉, 나중의 명령어가 IF단계로 인해 메모리를 사용하고 싶을 때 어떤 이전 명령어가 DM단계를 수행하고 있어 그 메모리를 사용하고 있다면 나중 명령어는 그 메모리를 사용할 수 있을 때까지 `stall`된다는 뜻이다.

Stall이 일어난다는 말은 성능에 문제를 일으킨다는 말이다.

이러한 구조적인 문제는 설계자가 **파이프라인을 설계할 때** 위험을 피할 수 있다.

이미 앞서 말했다시피, MIPS에서는 메모리를 Instriction Memory와 Data Memory로 나누어 이를 해결한다.

### Data Hazard

다음으로 살펴볼 pipeline hazard는 `Data Hazard`이다.

다음과 같은 순차적인 MIPS 명령어들에 대해 생각해보자.

```txt
sub   $2, $1,$3     # Register $2 written by sub
and   $12,$2,$5     # 1st operand($2) depends on sub
or    $13,$6,$2     # 2nd operand($2) depends on sub
add   $14,$2,$2     # 1st($2) & 2nd($2) depend on sub
sw    $15,100($2)   # Base ($2) depends on sub
```

첫번째 줄의 명령어에서 \$2 레지스터의 값이 결정되고, 뒤에 네 줄에 걸친 명령어들은 그 \$2의 값에 **의존한다**.  
따라서 위 순차적인 명령어들은 파이프라인으로 실행할 수 없다.

왜냐하면 뒤의 명령어들은 첫번째 명령어의 WB단계에서 \$2의 값이 정해지기 전에 ID명령을 실행하고 그 때 아직 WB에 의해 새로운 값이 저장되지 않은 register file을 사용하기 때문이다.

![>Pipelined dependencies](picture/4-52.png)

어떻게 하면 파이프라인으로 위와 같은 경우를 처리할 수 있을까?

#### Stalling

첫번째로 생각해 볼 수 있는 방법은, Structure Hazard의 경우와 같이 파이프라인을 `stall` 시키는 것이다.

예를 들어, 위 경우에서 첫번째 명령어와 두번째 명령어만을 생각해 보자.

두번째 명령어의 ID단계에서 첫번째 명령어의 결과를 사용하므로, 두번째 명령어의 ID단계는 첫번째 명령어의 WB단계가 끝날때까지 stall 시키는 것이다.

실제로 stalling은 ID/EX 레지스터가 아무 일도 하지 않도록 제어값(control value) 조정해서 구현한다.  
EXE, MEM, WB는 nop, noop이라고 불리는 **'no-operation'**을 실행한다.(아무 일도 하지 않는다.)

또한, PC와 IF/ID 레지스터의 업데이트도 막는다.  
다음 Cycle에서는 이미 fetch된 명령어를 **다시 fetch**하고, decode된 명령어를 **다시 decode**한다.

즉, 첫번째 명령어가 WB단계를 완료하여 레지스터의 값을 업데이트 할 때까지, 다른 단계들은 no-operation하거나 ID/IF를 다시 수행하며 stall한다.

하지만 역시 stall은 성능에 문제를 일으킨다. 여러 단계를 동시에 병렬적으로 실행하고자 하는 파이프라인의 목적에 맞지 않는다.

#### Forwarding

다음 방법으로 `forwarding(bypassing)`이라는 방법을 설명한다.

만약

```txt
add $s0, $t0, $t1
sub $t2, $s0, $t3
```

와 같은 순차적인 명령어가 있다고 가정하자.

stalling 방법에 따르면 두번째 sub 명령어는 첫번째 add 명령어의 WB단계까지 끝나야 register file에 값이 저장되어 ID단계에서 올바른 값을 가져와 실행할 수 있기 때문에 첫번째 명령어가 WB단계가 실행될 때 까지 stall 되어야 한다.

하지만 잘 생각해보면 \$s0의 값은 MEM, WB 단계를 가기 전 **EX단계에서 이미 EX/MEM 레지스터에 저장된다.**

따라서 뒤의 명령어들을 실행할 때 이전의 명령어가 메모리에 기록되고 다시 레지스터에 기록된는 것을 기다릴 필요 없이, EXE 단계에서 얻은 값을 뒤의 명령어에서 사용할 수 있도록 datapath에 경로를 만들어 즉시 사용한다면 stall을 피하고 바로 사용할 수 있다.

이를 `forwarding`이라고 한다.

![>forwarding](picture/forwarding.png)

<br>

forwarding은 어떻게 작동할까?

먼저 pipeline register에 field notation을 사용해 종속성을 더 정확하게 나타내자.

예를 들어, "ID/EX.RegisterRs"는 한 레지스터의 값이 ID/EX 레지스터에서 발견되는 레지스터 1개의 번호이다.  
즉, register file의 첫번째 read port에서 나온 번호를 말한다.

위 노테이션의 왼쪽 부분(.을 기준으로)은 파이프라인 레지스터의 이름이고, 오른쪽 부분은 레지스터의 필드 이름이다.

이 노테이션을 사용하여 나타내는 hazard condition의 쌍들은 다음과 같다.

- EX/MEM.RegisterRd = ID/EX.RegisterRs
- EX/MEM.RegisterRd = ID/EX.RegisterRt
- MEM/WB.RegisterRd = ID/EX.RegisterRs
- MEM/WB.RegisterRd = ID/EX.RegisterRt

다시 맨 첫번째 예시의 순차적인 명령어들을 살펴보자.

```txt
sub   $2, $1,$3     # Register $2 written by sub
and   $12,$2,$5     # 1st operand($2) depends on sub
or    $13,$6,$2     # 2nd operand($2) depends on sub
add   $14,$2,$2     # 1st($2) & 2nd($2) depend on sub
sw    $15,100($2)   # Base ($2) depends on sub
```

첫번째 sub 명령어와 두번째 and 명령어 사이의 hazard는  
두번째 and 명령어가 EX 단계일 때,  
첫번째 sub 명령어가 MEM 단계일 때 나타날 것이다.

즉, 이 hazard는 다음과 같은 노테이션으로 나타낼 수 있다.

EX/MEM.RegisterRd = ID/EX.RegisterRs = \$2

반면 첫번째 sub명령어와 4번째 add 명령어 사이에는 hazard가 없다.

왜냐하면 첫번째 sub 명령어가 WB단계에서 레지스터 파일의 왼쪽 절반(write)를 사용하고 add의 ID단계에서 레지스터 파일의 오른쪽 절반(read)을 사용해 맞는 \$2를 읽기 때문이다.

<br>

이제 hazard를 탐지할 수 있고 이를 적절한 노테이션으로 나타낼 수도 있다.

이제 그 hazard에 맞게 데이터를 forwarding 시켜야 한다.

![>forwarding](picture/forwarding-instructions.png)

첫번째 명령어의 WB단계가 register file에 데이터를 기록하는것을 기다리지 않고 뒤의 명령어들이 ALU Input에 대한 종속성(파란색 선)에 따라 파이프라인 레지스터에서 값을 전달받아 사용하는 것을 볼 수 있다.

만약 모든 파이프라인 레지스터에서 ALU로 입력을 전달할 수 있다면, ALU 입력에 대해 MUX와 Control signal등을 추가해 데이터 종속성 노테이션에 따라 적절하게 제어한다면 파이프라인을 최대 속도로 실행할 수 있다.

![>forwarding unit](picture/forwarding-unit.png)
![>forwarding control](picture/forwarding-control.png)

위 두 그림은 forwarding control에 관련된 유닛과 제어신호를 보여준다.

다음과 같이 forwarding control unit을 추가해 전체적인 forwarding을 구현한 pipeline datapath를 나타낼 수 있다.

![>datapath with forwarding](picture/forwarding-control-datapath.png)

<br>

---

<br>

forwarding으로 항상 stall을 피할 수 있는것은 아니다.

다음과 같은 경우를 보자.

![>lw dependencies](picture/4-58.png)

위 그림에서 첫번째 명령어 lw의 결과값은 EX스테이지의 ALU가 아닌 MEM단계에서 이루어져 MEM/WB 레지스터에 저장된다.

따라서 바로 다음 명령인 and 명령어는 첫번째 명령의 결과인 \$2레지스터를 EX/MEM 레지스터에서 forward해서 사용할 수 없다.

and 명령어는 EX 단계에서 ALU의 입력값으로 \$2값이 필요한데, 이는 전 명령어의 MEM단계가 끝나 MEM/WB 레지스터에서 forward 할 수 있다.

따라서 and 명령어는 이전 명령어의 MEM단계가 끝날 때 까지 한 cycle을 stall해야한다.

![>stalling](picture/4-59.png)

따라서 stall을 해야할지 말아야할지 결정하는 hazard 를 감지하는 유닛이 있어야 한다.

![>two mux for forwarding, the hazard detection unit and forwarding unit](picture/4-60.png)

### Control Hazard

마지막으로 살펴볼 pipeline hazard는 `Control Hazard`이다.

다음과 같은 순차적인 명령어들을 살펴보자.

```txt
40 beq $1 $3 28
44 and $12 $2 $5
48 or $13, $6, $2
52 add $14, $2, $2
...
72 lw $4, 50($7)
```

첫번째 명령어 beq는 분기 조건이 만족하면 72 lw 명령어로 분기(branch) 하게된다.

하지만 beq 명령어에서 어디로 분기할지 결정하는 것은 MEM단계에서 이루어진다.  
(\$PC의 값은 \$PC+4와 MEM stage의 주소값 중 하나로 선택된다.)

![>pipeline of branch instruction](picture/4-61.png)

즉, 위와 같은 그림에서 만약 첫번째 명령어의 beq에서 마지막 명령어로 분기가 이루어진다면, 그 사이에 있는 명령어들은 진행되지 않았어야 하는 명령어들이지만 pipeline에 의해 각각 자신의 파이프라인 단계들을 수행하고(유닛들을 이용하고) 있을 것이다.

따라서 그들이 단계를 수행하면서 이용한 각각의 유닛들에 있는 값을 flush해주어야 한다.(분기하기로 결정된다면)

<br>

첫번째 beq명령어가 분기 할지 안할지 결정하는 MEM stage까지 진행되어야 flush의 실행 여부가 결정되므로, 3개의 clock cycle동안(첫번째 명령어가 MEM단계를 수행하기까지) 그 다음 명령어들은 일단 순차적으로 파이프라인을 진행중일 것이다.  
만약 branch가 결정되어 그 3개의 3 clock cycle동안 진행중인 명령어들이 flush되어야 한다면, **penalty**가 3 cylce 발생했다고 한다.

다행히도 3개의 clock cycle동안에는 첫번째 branch 명령어 이후에 어떤 명령어도 명령을 완료해 레지스터나 데이터에 값을 쓰는등의 행위를 못하므로, 단순히 datapath unit들만 flush해주면 된다.

control hazard를 해결하기 위한 두가지 방법과 한가지의 최적화 방법을 알아보자.

<br>

##### Reducing delay of branches

Branch의 성능을 향상시키는 한가지 방법은 분기가 행해지는(taken)데 들이는 비용을 줄이는 것이다.

지금까지 다음 \$PC는 MEM 단계에서 \$PC+4와 메모리의 값 중 하나를 선택한다고 가정했지만, 하드웨어를 추가해 그 선택을 MEM단계보다 전 단계에서 할 수 있도록 조정한다면, penatly는 3보다 줄어들 것이다. (flush해야하는 명령이 줄어든다.)

![>ID determines branch taken or not taken](picture/4-62.png)

위 그림은 MIPS pipeline에 ID stage에 유닛을 추가해 branch가 taken되는지 그렇지 않은지 결정함을 보여준다.

Cycle3에서 beq가 ID 단계에서 banch taken되었기 때문에 cycle4에서 bubble(nop)이 발생하였고, 다음 IF는 lw가 fetch되었음을 볼 수 있다.

<br>

이제 ID 단계에서 분기를 할지 말지 결정할 수 있기 때문에, penalty는 1로 줄었다.

![>only one stall](picture/4-31.png)

즉, 매 branch마다 위와 같이 1 cycle만 무조건 stall 하는 방법으로 control hazard를 해결할 수 있다.

##### Assume Branch Not Taken

두번째 방법은 앞서 행한 방법처럼 branch가 되지 않을것처럼 가정하고 그냥 다음 순차적인 명령어들을 파이프라인에 따라 실행하는 것이다.

만약 branch 명령어가 실행되어 분기해야 한다면, 그동안 진행된 명령어에 의해 유닛에 쓰여진 값들은 모두 폐기된다.(flush)

이렇게 branch가 될지 안될지에 상관 없이 일단 명령어를 진행시키는 방법은 control hazard를 절반으로 줄여준다.

![>Assume branch not taken](picture/4-32.png)

그림에서 위의 방법은 1cycle stall하는 밑의 방법에 비해 branch가 실행되지 않는다면 그 다음 명령어에 대해 1cycle 만큼 pipeline 단계를 진행하기 때문에 빠르다.

유닛을 flush하는 방법은 load-use data hazard의 예시처럼 단순히 control value를 0으로 변경해주기만 하면 된다.

##### Dynamic branch prediction

branch not taken 방법은 branch prediction의 한가지 간단한 형태이다.  
이러한 방법은 MIPS와 같이 단순한 5단계 파이프라인의 경우에는 적합하다.

하지만 단계가 더 깊은 파이프라인에서는, clock cycle로 측정할 경우 penalty가 증가한다.  
마찬가지로, multiple issue에서 instruction lost의 관점에서 penalty가 증가한다.

이는 aggressive 파이프라인에서 이러한 단순한 정적 예측(static prediction)이 많은 성능 낭비를 일으킬 수 있음을 의미한다.

따라서 우리는 다른 branch prediction에 대해 생각해 보아야 한다.

<br>

datapath에 하드웨어를 더 추가해 프로그램의 실행 가운데서 branch prediction을 행할 수 있다.

예를들어, 명령어의 주소를 통해 이 명령이 마지막으로 실행되었을 때 branch가 실행되었는지를 확인하고, 만약 branch가 사용되었을 경우 마지막과 동일한 위치에서 새 명령을 가져오기 시작한다.  
이를 `dynamic branch prediction`(동적 분기 예측)이라고 한다.

이를 구현하기 위한 방법 중 하나는 **branch prediction buffer(branch history table, BHT)**를 구현하는 것이다.

이 1비트짜리 버퍼는 branch 명령어의 주소의 lower 부분에 index된 작은 메모리이다.

이 메모리에는 가장 최근에 branch 되었는지 아닌지 알려주는 비트가 들어있다.

이것은 가장 간단한 형태의 buffer다.

만약 이 branch 연산이 가장 최근에 브랜치 되었다면(버퍼가 1이라면), branch가 taken 되었을 것이라고 가정한다.  
그렇지 않다면 taken되지 않았다고 가정하고 행동한다.

<br>

예를 들어 반복문을 MIPS Assembly언어로 구현한다면, 그 순차적인 명령어들의 가장 마지막 부분에는 그 반복문의 처음으로 돌아가는 분기 명령어가 있을 것이다.  
그 분기 명령어는 반복문의 횟수만큼 taken 될 것이다.

따라서 위 방법과 같이 buffer를 이용해 가장 최근에 taken 되었다면 taken 될 것이라고 예측하는게 도움을 준다.

하지만 다음과 같은 반복문에 대해 생각해보자.

```py
for i in range(1, 10):
      #loop
```

반복문의 맨 마지막 loop는 필연적으로 mispredict이다.  
따라서 위 반복문의 분기문은 맨 처음 branch는 buffer가 0인데 분기하므로 1번 mispredict, 그리고 마지막 10번째 분기문은 분기하지 않아야하는데 그 전 반복에서 분기했으므로 buffer가 1이기 때문에 mispredict이다.

따라서 80%의 정확도를 가진 branch prediction이라고 할 수 있다.

이는 괜찮은 수율이라고 생각할 수 있을지도 모르지만, 다음과 같은 경우를 생각해보자.

```py
for i in range(1, 100):
   for j in range(1, 3):
      #loop
```

위와 같은 중첩된 반복문을 생각해보자.

안쪽의 반복문을 도는 과정에서는 안쪽의 명령어로 분기하기 때문에 바로 prdiction을 하지만 마지막 반복에서 misprediction이 1회 발생한다.

또한 바깥쪽의 반복문 과정에서는 안쪽 반복문의 branch를 다시 실행시키게 되는데 그 branch는 바깥의 반복문으로 갈 때 misprediction이 발생해서 not taken을 예상하고 있는 상태이다.

따라서 이 때 misprediction이 또 발생한다!

이와 같은 문제점을 보완하기 위해, 2비트 BHT가 종종 고려된다.

![>2bit-BHT](picture/2bit-bht.png)

Buffer로 2비트를 활용한다.

그림에서 왼쪽에 있는 2가지 상태(색이 진한 Predict taken과 Predict not taken)는 한번 예측이 틀려도 그들 오른쪽의 색이 연한 2가지 상태로 전환된다.

즉, 예측이 바뀌려면 두번 연속 misprediction이 발생해야 한다.

<br>

이러한 방법으로 아까의 반복문을 진행한다고 생각해보자.

안쪽의 반복문을 반복하는 마지막 branch 명령어는 misprediction이지만 계속 taken을 예측하기 때문에 바깥의 반복문으로 나갔다가 다시 안쪽의 반복문으로 들어와도 taken을 예측하고 있으므로 misprediction이 발생하지 않는다.

<br>

---

<br>

branch prediction을 통해 분기를 할지 말지를 효율적으로 계산할 수 있었다.  
하지만 여전히 분기 명령어에서는 어디로 분기할지 **target address**를 계산해야 한다.

5단계 파이프라인에서 이는 1단계를 소모하게 되며, 이는 branch가 taken된다면 1penalty가 발생한다는 것을 의미한다.

이를 해결하기 위해, 몇가지 방법들을 생각해 볼 수 있다.

<br>

`Branch delay`에서는 branch 명령어 다음의 명령어를 항상 실행시킨다.  
하지만 그 다음 명령어, 즉 2번째 명령어부터는 브랜치의 분기여부에 따라 실행여부가 결정된다.(분기 명령어의 ID 단계에서 여부가 결정되기 때문이다.)

그 항상 실행되는 명령어가 문제였고, prediction을 통해 이를 해결하려 했으나 100% 예측에 성공할 수는 없어서 1penalty가 발생할 수 있었다.

그 항상 실행되는 명령어 자리를 **delayed slot**이라고 하고, **컴파일러**와 **어셈블러**가 delayed slot에 분기 여부에 상관없이 항상 실행되어야 하는 명령어를 채우는 방법을 고려한다.

![>scheduling branch delay slot](picture/delay-slot.png)

위 그림은 delay slot을 스케쥴링하는 3가지 방법을 소개한다.

이 방법에 대한 한계점은 delay slot에 들어갈 수 있는 명령어의 제한과 분기가 taken될지 taken되지 않을지 컴파일 시간 안에 예측할 수 있는 능력이다.

분기 주소를 예측할 방법으로 고려되는 또 하나의 방법은 `branch prediction buffer`를 이용하는 것이다.

## datapath summary

이번 장에서 언급한 모든 프로세스를 적용한 datapath를 나타내었다.

![>full datapath](picture/pipeline-summary.png)
