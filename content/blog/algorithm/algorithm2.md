---
title: 'Foundation of Algorithms Ch2.'
date: 2021-12-27 20:40:31
category: 'algorithm'
thumbnail: { thumbnailSrc }
draft: false
---

> _Divide-and-Conquer_

_⌜Foundations of Algorithms⌟의 2장 Divide-and-Conquer 알고리즘에 관해 정리하고자 한 글입니다._

<!-- thumbnail -->

<br>

<details>
   <summary>💡RoadMap</summary>

1. Algorithms; Efficiency, Analysis, and Order
2. `Divide-and-Conquer`
3. Dynamic Programming
4. Greedy
5. Backtracking
6. Branch-and-Bound
7. Sorting
8. Searching
9. NP

   </details>

<br>

---

# Ch2. Divide-and-Conquer

본 장에서는 Divide-and-Conquer(분할정복) 알고리즘에 대해 소개한다.

## Divide-and-Conquer

> _...Napoleon drove against their center and split their forces in two. Because the two smaller armies were individually no match for Napoleon, they each suffered heavy loses and were compelled to retreat. By `dividing` the large army into two smaller armies and individuarlly conquering these two smaller armies, Napoleon was able to `conquer` the large army...._

Divide-and-Conquer 알고리즘은 말 그대로 problem의 optimal solution을 찾기 위해 instance를 둘 이상의 instance들로 `나누어(divide)`서 `해결하는(Conquer)` 알고리즘이다.

<br>

1. problem의 instance를 두개나 그 이상의 더 작은 instance들로 `나눈다`(**divide**)
   > 나누어진 instance들은 각각이 원래의 problem들의 instance이기 때문에, 나누어진 instance들로 얻을 수 있는 각각의 solution은 역시 원래의 problem의 solution을 구성한다.

2) soultion을 구할 수 있을때 까지 instance를 나누어 각 instance들을 `해결한다`(**conquer**)

3. 필요하다면, 원래의 instance의 solution을 구하기 위해 작은 instance들의 solution들을 `합친다`(combine)

<br>

이 과정을 PseudoCode로 표현하면 다음과 같다.

```js
function F(x):
  if F(x) can be solved:
    return sol(F(x))   //Conquer
  else:
    divide x into y1, y2  //Divide
    F(y1), F(y2)
    return sol(F(x)) using F(y1), F(y2) //Combine
```

<br>
<br>

Divide-and-Conquer 알고리즘은 `top-down` approach (하향식 접근법)이다.  
즉, top-level의 solution은 밑으로 `내려가`면서 bottom-level instance들의 solution을 가지고 얻을 수 있다.

이는 자연스럽게 Recursive procedure으로 생각할 수 있다.  
즉, 주로 `Recursion`을 활용하여 divide-and-conquer 알고리즘을 설계한다.

<br>
<br>

하지만 **iterative**하게 알고리즘을 설계할 수도 있다. 즉 stack이나 queue, priority queue등의 자료구조에 하위 problem을 저장하며 분할하는 알고리즘을 설계할 수도 있으며, 때때로 iterative routine이 더 효율적일 수도 있다.  
이러한 접근방식은 다음에 해결할 하위 problem을 선택하는데 조금 더 자유로워질 수 있는데, 이는 일부 프로그램에 중요하게 작용한다.  
이는 `branch-and-bound`를 다루는 장에서 자세하게 다시 살펴본다.

<br>

본격적으로 몇개의 대표적인 알고리즘을 예시로 들어 살펴본다.

## Binary Search, Decrease-and-Conquer

1장에서 Iterative하게 구현한 Binary Search 알고리즘을 소개했다.  
여기서는 **Recursive**하게 구현한 Binary Search를 소개한다. (top-down approach)

0. key x가 배열의 중간값과 같으면, 종료한다.

1) list를 절반으로 `나눈다`(**divide**).

   > Binary Search는 정렬된 배열에서 동작함을 항상 기억해야 한다.

   key x가 중간값보다 작으면, 왼쪽 sub list를 선택한다.  
    key x가 중간값보다 크면, 오른쪽 sub list를 선택한다.

2. key x가 선택한 sub list에 있는지 확인하여 `푼다`(**conquer**)  
   sub list가 solution을 얻기에 충분히 작지 않다면 이를 반복한다.

3) soulltion을 `얻는다`(**obtain**)

<br>

```py
def binary_search(s: list, x: int):#Recursive
    if low > high:
      return False
    else:
      mid = (low+high)//2
      if  x == S[mid]:  //conquer
        return mid
      elif x < S[mid]:
        return binary_search(low, mid-1)  //divide
      else:
        return binary_search(mid+1, low)  //divide
```

### recursive vs iterative

Recursive 버전의 binary search는 [tail-recursion](https://en.wikipedia.org/wiki/Tail_call)(recursive call 이후 operation이 수행되지 않음)을 사용하기 떄문에, 1장에서 구현한 것 처럼 iterive하게 구현할 수 있다.

이처럼 `tail-recursion`을 사용하는 알고리즘은 일반적인 divide-and-conquer 알고리즘보다 더 효율적으로 구현할 수 있다. 특히 간단하게 **loop**문으로 구현할 수 있다.

Iteraive하게 구현하는게 더 효율적인 점은, recursion으로 구현한 알고리즘보다 **memory를 절약**할 수 있다는 것이다.  
Recursive하게 구현한 알고리즘에서는 각 recursive call마다의 결과를 stack에 저장해야 한다. 마지막 call stack이 불려 control이 다시 결과들이 저장된 stack으로 돌아가 계산을 완료할 때 까지, 각 recursive call의 결과들은 stack에 pending되어 있어야 한다.  
Recursive routine에서 stack에 저장되는 결과값들은 recursive call에 도달한 깊이에 따라 결정된다.  
예를들어, 이 Binary Search 알고리즘에서 stack은 최악에 경우 depth $$\lg n$$ 까지 도달한다.

Iteration이 tail-recursion을 대체하는게 효율적인 또 다른 이유는, 대체로 i**teration 알고리즘이 더 빠르게 수행**되기 때문이다.(단, 단지 constant 곱셈 인자 만큼의 수준에 의해서만 )  
왜냐하면 iterative 버전에서는 stack이 유지되어야 할 필요성이 없기 때문이다.

대부분의 modern LISP 언어에서 tail-recursion은 iterative하게 컴파일 되기 때문에 iterative한 알고리즘을 tail-recursion으로 대체할 필요성이 없다.

### decrease-and-conquer

Recursive하게 구현한 binary search 알고리즘을 살펴보면, problem을 **오직 한개**의 하위 problem으로만 줄인다.  
그리고 solution을 combine하지도 않는다. 원래 problem의 solution은 단지 하위 problem의 solution 일 뿐이다.

어떤 사람들은 divide-and-conquer이라는 이름은 문제를 두개 또는 그 이상의 sub problem으로 나누는 알고리즘에만 쓰여야 하고, 위 같이 **단지 하나의 하위 problem**으로 줄여지는 알고리즘은 `decrease-and-conquer`이라는 이름을 사용해야 한다고 말한다.

왜냐하면 위 같이 tail-recursion을 사용하는, 심지어는 tail-recursion을 loop로 간단하게 구현할 수 있기 때문에, 광범위하고 모호한 정의하에서는 모든 recursion이나 loop를 사용하는 알고리즘이 divide-and-conquer 알고리즘으로 간주되어질 수 있기 때문이다.  
[출처](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm#Divide_and_conquer)

### efficiency

Recursion으로 구현한 Binary Search의 worst-case time compliexty를 살펴보자.  
일단 $$n$$이 2의 제곱일때만을 살펴보자.

```txt
Basic Operation : 중앙값과 key x 의 비교
Input Size      : list의 길이 n
```

1장에서 살펴본 것처럼 worst case는 **key x가 input에 없을때**이다.

다음과 같은 점화식이 성립한다.

$$
  \begin{aligned}
    &W(n) = \overbrace{W(\frac{n}{2})}^{\text{recursive call 안의 비교}} + \overbrace{1}^{\text{top level의 비교}}\\
    &W(1) = 1
  \end{aligned}
$$

위 점화식에서 다음과같은 결과를 도출할 수 있다.

$$
  W(n) = \lg n + 1
$$

증명

$$
  \begin{aligned}
    &W(1) = 1\\
    &W(2) = W(1) + 1 = 2\\
    &W(2^2) = W(2) + 1 = 3\\
    &W(2^3) = W(2^2) + 1 = 4\\
    &...\\
    &W(2^k) = W(2^{k-1}) + 1 = k + 1 = \lg(2^k) + 1
  \end{aligned}
$$

만약 $$n$$이 2의 제곱이 아니라면,

$$
  W(n) = \lfloor \lg n \rfloor + 1 \in \theta(\lg n)
$$

<br>

## Quick Sort

이제 본격적으로 decrease-and-conquer 알고리즘이 아닌, 두 개(이상)의 instance로 나누어지는 알고리즘에 대해 살펴보자.

다음은 QuickSort 알고리즘이다.

<br>

1. list에서 pivot(기준원소)를 설정한다.

2. list를 pivot을 기준으로 절반으로 `나눈다`(**divide**).  
   item이 pivot보다 작으면, 왼쪽 sub list로 나눈다.  
   item이 pivot보다 크면, 오른쪽 sub list로 나눈다.

3. 나누어진 각 list를 `정렬한다`(**conquer**)  
   list의 길이가 1이 될 때까지 QuickSort를 recursive하게 호출한다.

<br>

```py
def quick_sort(s: list, low: int, high: int):#Recursive
    if low < high:
      pivot = partition(s, low, high)

      quicksort(s, low, pivot-1)
      quicksort(s, pivot+1, high)
```

### partition

알고리즘에서도 살펴볼 수 있듯이, QuickSort는 **partitioning** routine에 기반하여 구현되는 알고리즘이다.  
당연히 partition을 어떻게 구현하느냐에 따라(pivot을 어떻게 선택하는지를 포함해서) 알고리즘의 퍼포먼스가 달리지게 된다.  
대표적으로 **Lomuto partition**, **Hoare partition**등이 있는데, 이에 대한 내용은 Sorting에 대해 다룰 때 더 자세히 알아보도록 한다.

<br>

다음은 책에서 소개된 in-place partition이다.

list의 맨 왼쪽값을 pivot으로 지정해 index를 기억하고,  
그 다음 index부터 모든 list를 돌면서 pivot index를 갱신하고 pivot보다 작은값을 pivot보다 왼쪽으로 스왑하여 보낸다.  
list를 전부 돈 후 갱신된 pivot index와 처음에 기억한 pivot을 스왑하여 pivot을 적절한 위치로 지정한다.  
list S는 in-place partition(제자리 분할)되었고, 그 pivot index를 반환한다.

```py
def partition(s: list, low: int, high: int):#in-place sort
    pivot = list[low]   //pivot
    pivot_index = low   //partition 후 pivot을 위치시킬 index 기억

    //pivot보다 작은 값을 pivot왼쪽으로 스왑하며 정렬
    for i in range(low+1, high+1):
      if s[i] < pivot:
        pivot_index += 1
        s[i], s[pivot_index] = s[pivot_index], s[i]

    //pivot을 중간으로 위치
    s[low], s[pivot_point] = s[pivot_index], s[low]

    return pivot_index
```

### efficiency

#### partition

먼저 partition 알고리즘의 time-complexity부터 분석해보자.

```txt
Basic Operation : pivot과 s[i] 의 비교
Input Size      : n == high - low + 1, 즉 sublist의 item 개수
```

항상 pivot을 제외한 input list의 모든 원소와 비교를 수행하기 때문에, 다음과 같은 every-case time complexity 가 성립한다.

$$
  T(n) = n + 1
$$

<br>

#### QuickSort

다음은 QuickSort의 time-complexity 분석이다.

QuickSort는 every-case complexity가 존재하지 않기 때문에, Worst Case와 Average Case에 대해 살펴보자.

##### Worst Case

QuickSort에서의 worst-case는 특이하게도 list가 이미 정렬되어 있을때 나타난다.

> (여기서 구현한 알고리즘은 pivot을 list의 첫번째 원소로 규정하고, 정렬을 오름차순으로 정렬함을 기준으로 한다.)

왜냐하면 partition이 top-level에서 불려질 때, 모든 아이템이 pivot보다 크기 때문에 왼쪽 list로는 아무런 아이템도 이동하지 않는다.(하지만 여전히 partition은 T(n) = n+1의 every time-complexty를 가지고 실행된다.)  
그리고 오른쪽 list는 pivot item만이 빠진, n-1의 길이를 가지는 list가 남게되고, 이것이 반복된다.

따라서 다음과 같은 time-complexity를 가진다.

```txt
Basic Operation : partition의 pivot과 s[i]의 비교
Input Size      : list의 길이 n
```

$$
  \begin{aligned}
    &T(n) = \overbrace{T(0)}^{\text{왼쪽 list의 정렬}} + \overbrace{T(n-1)}^{\text{오른쪽 list의 정렬}} + \overbrace{(n-1)}^{\text{partition의 every-time complexity}}\\
  \end{aligned}
$$

정리하면,

$$
  \begin{aligned}
    &T(n) = T(n-1) + n - 1\\
    &T(0) = 0
  \end{aligned}
$$

위 점화식에서 다음과같은 결과를 도출할 수 있다

$$
  T(n) = \frac{n(n-1)}{2}
$$

증명

$$
  \begin{aligned}
    &T(n)\\
    &= T(n-1) + (n-1)\\
    &=T(n-2) + (n-2) + (n-1)\\
    &= ...\\
    &= T(0) + 0 + 1 + 2 + ... + (n-1)\\
    &= \frac{n(n-1)}{2}
  \end{aligned}
$$

귀납법을 활용해, $$W(n) \leq \frac{n(n-1)}{2}$$를 증명할 수 있다.

따라서,

$$
  W(n) = \frac{n(n-1)}{2} \in \Theta (n^2)
$$

##### Average Case

다음은 QuickSort의 average-case time complexity이다.

worst-case의 경우와는 다르게 list내의 아이템들은 어떤 특정한 순서(오름차순이던, 내림차순이던)을 가지고 정렬되어있지 않고, 무작위로 정렬(분포)되어있다고 가정한다.

```txt
Basic Operation : partition의 pivot과 s[i]의 비교
Input Size      : list의 길이 n

p = pivot index (아이템이 무작위로 분포되어있다 = pivot index p가 0부터 n-1 중 임의의 값을 가진다. )
```

$$
  \begin{aligned}
    &A(n) =
    \displaystyle\sum_{p=1}^{n} \overbrace{\frac{1}{n}}^{\text{pivot index가 p 일 확률}} +
    \overbrace{[A(p-1) + A(n-p)]}^{\text{pivot index가 p 일때 sublist를 정렬하는 시간}} +
    \overbrace{(n-1)}^{\text{partition의 every-time complexity}}\\
  \end{aligned}
$$

정리하면,

$$
  \begin{aligned}
    A(n)
    &= \frac{1}{n} [A(0) + A(n-1)] + \frac{1}{n} [A(1) + A(n-2)] + ... + \frac{1}{n}[A(n-1) + A(0)] \\
    &= \frac{2}{n} [A(0) + A(1) + ... + A(n-1)]\\
    \\
    & \Rarr \\
    \\
    nA(n) &= 2[A(0) + A(1) + ... + A(n-2) + A(n-1)] + n(n - 1)\\
    (n-1)A(n-1) &= 2[A(0) + A(1) + ... + A(n-2)] + (n-1)(n-2)\\
    \\
     &\text{연립}\\
    \\
    nA(n) - (n-1)A(n-1) &= 2A(n-1) + 2(n-1)\\
    nA(n) &= (n+1)A(n-1) + 2(n-1)\\
    \frac{A(n)}{(n+1)} &= \frac{A(n-1)}{n} + \frac{2(n-1)}{n(n+1)}
    \\
    \\
    &a_n = \frac{A(n)}{n+1} 라고 하면,\\
    \\
    & \Rarr \\
    \\
    a_n &= a_{n-1} + \frac{2(n-1)}{n(n-1)}\\
    a_0 &= 0\\
    \\
    & \Rarr \text{(Appendix B.22)}\\
    \\
    a_n &\approx 2\ln n \\
    \\
    & \Rarr \\
    \\
    A(n) &\approx (n+1)2\ln n \in \Theta(n \lg n)

  \end{aligned}
$$

따라서 average-case의 경우, $$\theta(n \lg n)$$의 준수한 time-complexity를 가지는 정렬 알고리즘임을 알 수 있다.

partition, pivot, input 등을 포함한 보다 자세한 QuickSort에 대한 내용과 다른 Sorting Algorithm에 대해서는 다른장에서 다시 다루도록 한다.

## When Not to Use divide-and-conquer

divide-and-conquer의 사용을 피해야하는 경우가 있다.

1. 사이즈 $$n$$의 instance가 둘 이상의 instance로 divide되고  
    나누어진 instance들 각각이 거의 $$n$$만큼 큰 사이즈를 가지는 경우

   > ex) recursion으로 구현한 피보나치 수열 fib(K) = fib(k-2) + fib(k-1)

   이 경우 exponential time-complexity를 가진다.

<br>

2. 사이즈 $$n$$의 instance가 거의 $$n$$개의 instance로 divide되고  
   나누어진 instance들 각각이 거의 $$n/c$$의 사이즈를 가지는 경우

   > ex) T(n) = nT(n/c)

   이 경우 $$n^{\Theta(\lg n)}$$의 time-complexity를 가진다.

## more...

> 추가예정

MergeSort  
Strassen's Matrix Multiplication  
Karatsuba large integer Multiplication  
FFT(Fast Fourier Transform)

Parallelism  
Memory, Stack  
Recursion  
base cases

...
