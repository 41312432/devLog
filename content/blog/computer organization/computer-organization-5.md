---
title: Computer Organization & Design 5
date: 2022-03-23 13:03:04
category: computer organization
thumbnail: { thumbnailSrc }
draft: false
---

> _Memory_

_⌜Computer Organization and Design⌟의 5장 **Memory**에 대해 정리한 글입니다._

<!-- thumbnail -->

<details>
   <summary>💡RoadMap</summary>

1. Computer Abstraction
2. ISA
3. Arithmetic for Computer
4. Proccessor
5. `Memory`

   </details>

<br>

---

# Memory

이번 챕터에서는 `Memory`에 대해서 설명한다.

## principle of locality

컴퓨터 메모리의 구현에 대해 생각해보기 위해, 실생활에서의 예를 들어보자.

어떤 특정한 분야에 관해 조사하기 위해 도서관에 방문했다.  
도서관의 분류 시스템에 따라 그 주제와 관련된 책이 있을만한 책장에 가서 몇가지의 책을 꺼내어 책상으로 돌아와 쌓아놓는다고 생각해보자.  
만약 쌓아놓은 책 무더기에서 한 권을 골라 읽었는데 관련 내용을 찾을 수 없었다면, 책장에 다시 돌아가 새로운 책을 찾는 것 보다는 이미 책상에 쌓아놓은 책 중 한 권을 새로 골라 읽는 것이 더 효과적이라는 것을 쉽게 생각할 수 있다.  
일단 책상에 책을 잘 갖추게 된다면, 필요로 하는 많은 주제들이 그 책들에서 발견될 가능성이 높고, 책장으로 돌아가는 비효율적인 행동 대신 책상의 책들만을 살펴보면서 시간을 활용할 수 있다.

이와 같은 원리를 적용해 아주 작은 메모리만큼의 속도로 메모리에 접근할 수 있는 큰 메모리의 환상을 만들 수 있다.

도서관의 모든 책들에 대해 같은 확률로 접근할 필요가 없었던 것 처럼 프로그램이 모든 코드나 데이터에 같은 확률로 접근하지 않는다.

만약 그렇지 않으면 대부분의 메모리 접근을 빠르게 할 수 없고 메모리의 용량도 커져야 한다.

`principle of locality`(지역성의 원칙)은 도서관의 일부분의 책들만 찾아본 것 처럼 프로그램이 항상 address space의 비교적 작은 부분에 access한다는 것을 말한다.

다음의 두 가지 유형이 있다.

- `Temporal locality`(locality in time)  
  만약 아이템이 참조되면 그 아이템은 곧 다시 참조되는 경향이 있다.

  > ex) instruction in a loop, induction variable..

  <br>

* `Spatial locality`(locality in space)  
  만약 아이템이 참조되면 가까운 주소의 아이템이 곧 참조되는 경향이 있다.
  > ex) sequential instruction access, array data..

## Memory Hierarchy

프로그램의 지역성은 간단하고 자연스러운 프로그램의 구조에서 발생한다.

예를 들어, 대부분의 프로그램에는 루프를 포함하기 때문에 temporal locality가 많이 발생한다. 또한, 명령어들은 보통 순차적으로 엑세스 하기 때문에 높은 spatial locality를 가진다.

`Memory hierarchy`를 구현하여 이러한 principle of locality를 활용할 수 있다.

![>Memory Hierarchy](picture/mem-hierarchy.png)

Memory hierarchy는 속도와 크기가 다른 여러 수준의 메모리로 구성된다.

속도가 빠른 메모리는 프로세서에 가깝지만 비트당 비용이 비싸기 떄문에 크기가 작고,
속도가 느린 메모리는 그 밑에 위치하며 밑으로 갈 수록 비트당 비용이 싸 크기가 크다.

목표는 사용자에게 가장 싼 기술로 사용할 수 있는 만큼의 메모리를 제공함과 동시에 가장 빠른 메모리의 속도의 접근을 제공하는 것이다.

<br>

![>Data Hierarchy](picture/data-hierarchy.png)

데이터도 마찬가지로 계층화된다.

모든 데이터는 가장 낮은 레벨에 저장된다.  
프로세서에 가까운 레벨은 일반적으로 더 낮은 레벨에 저장된 데이터의 서브셋이다.  
프로세서에서 멀어질수록 그 레벨에 접근하는 시간이 길어진다.

메모리 계층은 여러 레벨로 구성될 수 있지만, 데이터의 복사는 한번에 인접한 두 레벨 사이에서만 일어나므로 두 레벨에만 집중할 수 있다.
