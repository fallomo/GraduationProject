#### 1、空slice和 nil slice不一样

![image-20201217182805810](/Users/jundongchen/Library/Application Support/typora-user-images/image-20201217182805810.png)

#### 2、可使用:来简化定义

```go
s1 := []int{0, 1, 2, 3, 8: 100}
//这里的8指的是从3往后到第7个都是0，第8个是100
//len和cap都是9
```

#### 3、slice截取数组

```go
s3 := [8]int{1, 2, 3, 4, 5, 6, 7, 8}
s4 := s3[1:4:5]
fmt.Println(len(s4), cap(s4))
//s3[low:high;max]
//切片截取的是下标 low----high-1区间的数组，并且cap是max-1
//并且还需要满足：max>high>low 		否则编译器不给过
```

共享底层数组

#### 4、append函数可以同时插入多个数据

- 该函数返回一个slice类型

- func append(slice []Type, elems ...Type) []Type

- 还可以用 `...` 传入 slice，直接追加一个切片。

- ⚠️当一次append多个数据，会判断插入的数据量如果超过了cap，则会直接开辟新的内存，而**不会**先对原来的底层数组造成影响，再进行转移

- nil slice和empty slice能够append的原因是，使用了

- mallocgc 来向go的内存管理器申请到一块内存

- **当slice作为参数传入函数，以下情况操作会改变外层的slice**

  1、传入slice指针

  2、传入slice值，在for range循环slice的时候，使用s[i]来修改slices

  3、传入slice值，修改后返回此slice，在函数外接收即可

![image-20201218160414481](/Users/jundongchen/Library/Application Support/typora-user-images/image-20201218160414481.png)

- slice只能与nil进行 == 比较，如果想要比较两个slice，可以用reflect.DeepEqual()bool
- slice本质上是一个struct，维护了三个字段。