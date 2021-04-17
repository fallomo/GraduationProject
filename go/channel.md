#### 1、通道channel

1. 线程之间用于通信的工具。

2. 声明一个int型的通道

   ```go
   var ch1 chan int   //这个通道只能同时放（取）一个数据，否则就会阻塞
   ch2 :=make(chan int,5) //5表示通道放5个数据就满了
   ```

3. ch1< - sss 写入数据

4. sss< - ch2 读取数据

5. 单向通道

   ```go
   var ch3 chan <- int //只写通道
   var ch4 <- chan int  //只读通道
   //使用方式，往双向通道中写入数据，这个双向通道赋给单向通道，这个双向通道就相当于单向通道的引用，再将单向通道暴露给用户，这样用户只能进行读或者只能写。
   var ch5 chan int
   sh :=23
   ch5<-sh
   ch4=ch5
   
   ```

6. 通道的读写

   1. 创建单个长度的通道（每次通道中只能存在一个长度的数据，直到被读出才能写，或者写入才能读）

      var ch2 chan int

      ch3:= make(chan int)

   2. 创建有长度的通道。

      ch4 : =make(chan int , 8)

   3. 当通道满后，只能读出后才能写入，同理当通道空了，读出操作会被阻塞。

   4. 当不希望读取操作被阻塞，可以使用  Value,ok :=<- ch4  进行尝试读取，如果读取到有效的数据则返回true否则返回false

   5. 通道不用时应该关闭 close(ch)

   6. 当读取一个 已经关闭的通道时，会返回一个0值。当读进程被阻塞时，通道关闭了，读进程会结束阻塞。 

   7. 当试图向一个已经关闭的通道进行写入时，会出错。

   8. 可以使用 for:range循环读取通道数据，当通道没数据，for:range会阻塞，直到通道有数据。

   

   

#### 下面是使用两个线程，对通道进行读写操作

nature和calcula两个本来是双向通道，但是传入函数中，就会本身就会变成单向通道（强转），因为函数参数就是单向通道。并且不可逆，因为通道传入是作为引用传入的。所以函数内对通道的操作，会影响到实际参数。

单向通道的用途基本也在这。

```go
package MPG_test

import (
	"testing"
)

func product(ch chan<- int, begin int) {
	for i := begin; i < begin+10; i++ {
		ch <- i
	}
	close(ch)
	//关闭写入通道
}

func doublenum(ch1 <-chan int, ch2 chan<- int) {
	for v := range ch1 {
		ch2 <- v * 2 //for:range 一但ch1中有数据，就会被循环拿出来，然后写进ch2中，读不到会阻塞
		//只有当读取的ch1关闭后，会返回，然后阻塞结束
	}
	close(ch2) //关闭这个写入通道
}

func TestCh(t *testing.T) {
	nature := make(chan int, 10)
	calcula := make(chan int, 10)

	go product(nature, 1)
	go doublenum(nature, calcula)
	//waitGroup.Wait()

	for v := range calcula {
		t.Log(v)
	}
	//当doublenum线程中关闭 calcula后，这个for循环也结束了。

}

//输出结果基本上是2 4 6 8 10 12 14 16 18 20
//按理说顺序不一定
```



#### 2、channel的底层原理

1、channel实际上是指针类型，因此可以直接作为传入参数

2、声明channel的三个形式

```go
chan T
chan <- T
<- chan T
```

3、channel在用var声明出来后，初始值是nil，没有初始化不能使用，需要被赋值或者使用make初始化才能使用

可以使用make()对其初始化，同时可以传递一个int值，作为缓冲区大小

4、带缓冲区的chan可以称为“同步模式”，带缓冲区的chan称为“异步模式”

5、chan底层的buf存着缓冲区的首地址，如果无缓冲区，则buf为nil

6、底层缓冲区实际上是一个循环数组，还有两个指针指向当前可以发送的元素的索引，以及当前可以接收的索引。

7、还有两个双向链表，存放请求读取和请求写入的gorutine请求。![14791608716693_.pic_hd](/Users/jundongchen/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9/aa2d8db1e9ee0f684694555a3f836ffe/Message/MessageTemp/9e20f478899dc29eb19741386f9343c8/Image/14791608716693_.pic_hd.jpg)

8、新建的chan是在堆上分配内存，堆是从地地址往高地址扩充，栈则相反

9、接收channel的值有两种方法

带ok的，可以通过ok判断channel是否关闭了。

不带ok的，如果读取的是0值，无法判断是通道里的还是通道已经关闭。

如果不想阻塞，使用select

10、当尝试关闭值为nil的channel或者尝试关闭已经关闭的channel时会panic，尝试向值为nil的channel写时会panic

11、channel读写数据的本质是，值的拷贝。无非是将chan buf里的数据与 gorutine里的数据相互拷贝或者直接就是 gorutine的数据相互拷贝（拷贝到对应协程的栈）

12、channel用不好很容易发生死锁。使用时最好检查一下是否会出现所有线程同时因为channel阻塞而发生相互等待的情形。

13、在不改变channel的状态下，无法知道channel是否关闭。

14、协程运行完成之后，无法将结果return，就算return了外面也接收不到，只能内部使用channel传输。

15、使用select的好处，select可以设置多种case,读取channel的值，还可以设置默认处理方法。当一个case被channel阻塞时，会立即轮询其他case，当所用case都被阻塞，select也会被阻塞。因此default应该设置为默认处理。

16、当一个无缓冲区的channel，放入一个值时，如果没有其他的协程来读取这个channel，程序就会阻塞在这里直到有人读取，如果编译器运行完发现channel里没有等待读取的协程，程序会一直阻塞，则会panic。

除非有 使用 select或者range防止阻塞直接返回。

没有人用的channel，就算不关闭也没事，gc会慢慢将它回收。



17、如何优雅地关闭channel

问题：接收方不能贸然关闭channel，当出现多个发送方的时候，发送方不能贸然关闭channel

答案：

当有n个sender，1个receiver时

增加一个传递关闭信号的channel，当reveiver需要关闭时，发送信号给第三方让第三方退出发送数据的协程，这样sender就发送不了数据了。原来的channel可以由gc处理

当有n个sender，m个reciever时，

还是使用一个中间channel，但是这个channel设置为缓冲型，一旦有一个revceiver要关闭时，就发送信号，一旦中间channel收到一个关闭信号就关闭。



18、通道关闭后，缓冲型的还可以读出数据。ok依旧返回true，只有通道关闭了并且没有数据了，ok才返回false

非缓冲性的channel也可以读出数据。

也就是说channel要读完里边的数据才知道有没有关闭。

**那么怎样才能知道是否已经关闭？**

在chan结构里有一个closed字段，当关闭后，closed字段为1，可以通过反射，获取closed字段的值来判断。



19、channel用途

控制 停止

配合time.After定时执行任务

```go
select {   
  case <-time.After(100 * time.Millisecond):    
	case <-s.stopc:       
  return false
}
```

等待 100 ms 后，如果 s.stopc 还没有读出数据或者被关闭，就直接结束。这是来自 etcd 源码里的一个例子，这样的写法随处可见。

```
func worker() {    ticker := time.Tick(1 * time.Second)    for {        select {        case <- ticker:            // 执行定时任务            fmt.Println("执行 1s 定时任务")        }    }}
```

每隔 1 秒种，执行一次定时任务。



解耦生产者和消费者

控制并发数量，缓冲型channel，大小为并发上限数量