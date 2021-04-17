context的出现，是为了解决协程之间的数据共享，退出通知，截止时间，等等。

当一个请求传来，服务器会开启一个协程来处理，协程之下又会开启更多的协程，每个协程做不同的事，他们通常需要共享原始数据，当这个请求超时了或者被取消了，就要有通知到各个相关的协程，告诉他们，工作已经无效。

context就是这样出现了。采用 channel和select的方式效果不好不够强大。context能够及时通知服务，避免服务堆积，引发雪崩。还可以给下游的 协程定义新的超时时间。



```go
type Context interface {
    Deadline() (deadline time.Time, ok bool)		//返回是否可取消以及截止时间
    Done() <-chan struct{}		//返回一个通道，当通道被关闭时，说明协程已取消
    Err() error		//返回取消协程的原因
    Value(key interface{}) interface{}	//传入key值，寻找对应的value值，并返回
}
```

- `Deadline`会返回一个超时时间，Goroutine获得了超时时间后，例如可以对某些io操作设定超时时间。
- `Done`方法返回一个信道（channel），当`Context`被撤销或过期时，该信道是关闭的，即它是一个表示Context是否已关闭的信号。
- 当`Done`信道关闭后，`Err`方法表明`Contex`t被撤的原因。
- `Value`可以让Goroutine共享一些数据，当然获得数据是协程安全的。但使用这些数据的时候要注意同步，比如返回了一个map，而这个map的读写则要加锁。



#### context包的构成

接口：

- context
- canceler

```go
type Context interface {
    Deadline() (deadline time.Time, ok bool)		//返回是否可取消以及截止时间
    Done() <-chan struct{}		//返回一个通道，当通道被关闭时，说明协程已取消
    Err() error			//返回取消协程的原因
    Value(key interface{}) interface{}	//传入key值，寻找对应的value值，并返回
}

type canceler interface {
	cancel(removeFromParent bool, err error)	//取消函数，布尔值表示
	Done() <-chan struct{}			//返回一个通道，当通道被关闭时，说明协程已取消
}
//实现这个接口的type，可以直接取消
```



结构体：

- emptyCtx		空context，background()和TODU()返回的都是这个结构体，不可取消
- valueCtx		  可以存储k-v的context，不可取消
- *cancelCtx		可以直接取消的context，指针类型实现了canceler接口
- *timerCtx		  超时或者上游取消则取消，指针类型实现了canceler

```go
type emptyCtx int
//其实现了context接口，所有方法都是返回nil
//还实现了String函数,用于输出emptyCtx时，描述当前是哪种类型
func (e *emptyCtx) String() string {
	switch e {
	case background:
		return "context.Background"
	case todo:
		return "context.TODO"
	}
	return "unknown empty Context"
}

//通过将Context作为匿名对象，来实现context接口
type valueCtx struct{
  Context
  key,value interface{}  
}
//还实现了自己的函数String(),重写了Value()
func (c *valueCtx) String() string {
	return contextName(c.Context) + ".WithValue(type " +
		reflectlite.TypeOf(c.key).String() +
		", val " + stringify(c.val) + ")"
}
func (c *valueCtx) Value(key interface{}) interface{} {
	if c.key == key {
		return c.val
	}
	return c.Context.Value(key)
}

//通过将Context作为匿名字段，实现context接口，并重写了context接口的所有方法
//
type cancelCtx struct{
  Context

	mu       sync.Mutex            // protects following fields
	done     chan struct{}         // created lazily, closed by first cancel call
	children map[canceler]struct{} // set to nil by the first cancel call
	err      error                 // set to non-nil by the first cancel call
}
//还有自己的函数
func (c *cancelCtx) String() string {
	return contextName(c.Context) + ".WithCancel"
}
//还实现了canceler接口的函数
func (c *cancelCtx) Done() <-chan struct{} {
	c.mu.Lock()
	if c.done == nil {
		c.done = make(chan struct{})
	}
	d := c.done
	c.mu.Unlock()
	return d
}
//重点在cancel函数
func (c *cancelCtx) cancel(removeFromParent bool, err error) {
	if err == nil {
		panic("context: internal error: missing cancel error")
	}
	c.mu.Lock()
	if c.err != nil {
		c.mu.Unlock()
		return // already canceled
	}
	c.err = err
	if c.done == nil {
		c.done = closedchan
	} else {
		close(c.done)
	}
	for child := range c.children {
		// NOTE: acquiring the child's lock while holding parent's lock.
		child.cancel(false, err)
	}
	c.children = nil
	c.mu.Unlock()

	if removeFromParent {		
		removeChild(c.Context, c)		//将自己从父亲节点移除
	}
}

//直接将cancelCtx作为自己的匿名字段，cancelCtx是可以直接取消的，timerCtx需要在此基础上加时间的控制
//也相当于实现了canceler接口
//timerCtx实际上就是一个cancelCtx加timer的控制
type timerCtx struct{
  cancelCtx
	timer *time.Timer // Under cancelCtx.mu.

	deadline time.Time		//截止时间
}
//自己也实现了String函数
//重写了Deadline和Cancel函数
func (c *timerCtx) Deadline() (deadline time.Time, ok bool) {
	return c.deadline, true
}
func (c *timerCtx) cancel(removeFromParent bool, err error) {
	c.cancelCtx.cancel(false, err)
	if removeFromParent {
		// Remove this timerCtx from its parent cancelCtx's children.
		removeChild(c.cancelCtx.Context, c)
	}
	c.mu.Lock()
	if c.timer != nil {
		c.timer.Stop()
		c.timer = nil
	}
	c.mu.Unlock()
}


```

⚠️valueCtx和emptyCtx都是不可取消的

为什么context和canceler都有自己的Done()通道函数？

答：*cancelCtx和 *timerCtx相当于都实现了context和canceler接口，而通过这两个接口的Done()函数，都可以获取到对象的done通道，从而知道这个对象是否取消了或者到期了，来进行下面的逻辑。

Done在context里是不必要的，只是需要获取信息，但是在canceler里却又是必要的。

为什么不将cancel方法放到context接口里？

答：因为取消这个动作是建议性的而不是强制性的。context重点在于传递取消这个信息，调用者不应该去干涉被调用者的取消进程。至于要不要取消，由被调用者来决定。所以调用者没必要拿到这个取消函数。



函数：

- Background()		返回一个空的context，一般用于创建一个初始的context
- TODO()		           返回一个空的context，用于不知道创建什么样的context时，和上一个函数一样
- WithCancel()		  传入父级context，返回一个cancleCtx，以及返回一个取消函数
- newCancelCtx()	 返回一个可取消的 context，也是传入一个context
- propagateCancelCtx()		  向下传递节点间的取消关系，也就是往上寻找第一个可取消的父节点然后挂靠上去
- parentCancelCtx()		  找到第一个可取消的父节点
- removeChild()		  去掉父节点的孩子节点
- init()		     包初始化
- WithDeadline()		  返回一个有Deadline的context以及取消函数，会将自己也取消
- WithTimeout()		   创建一个有Timeout的context，函数内：如果父节点的截止时间早于自己的截止时间，则直接返回一个可以取消的context，以及返回一个取消函数
- WithValue()		       创建一个valueCtx并返回它

实际上，Deadline指的是绝对时间，Timeout指的是相对时间

*Deadline意指截止时间，一般截止时间都是具体某个时间，Timeout则是将要用完的时间，一般是倒计时，所以指的是相对时间*

在实现过程中，WithTimeout()函数用到了WithDeadline()函数来实现。将相对时间转换为绝对时间，传入WithDeadline()



⚠️一个valueCtx只存一个键值对，并且如果使用Value函数寻找键对应的值时，是往上寻找的，一直找到根context。而且键值可以重复，相当于是链表**。建议使用valueCtx存公用的共享的键值，只用于查询方便，不要存一些结果或者临时变量**，因为键值可重复，且是以类似链表的结构存储，效率不高。

<img src="/Users/jundongchen/Library/Application Support/typora-user-images/image-20201223163204103.png" alt="image-20201223163204103" style="zoom:50%;" />

官方建议：

1. 不要将 Context 塞到结构体里。直接将 Context 类型作为函数的第一参数，而且一般都命名为 ctx。
2. 不要向函数传入一个 nil 的 context，如果你实在不知道传什么，标准库给你准备好了一个 context：todo。
3. 不要把本应该作为函数参数的类型塞到 context 中，context 存储的应该是一些共同的数据。例如：登陆的 session、cookie 等。
4. 同一个 context 可能会被传递到多个 goroutine，别担心，context 是并发安全的。



使用歧义：

像 `WithCancel`、 `WithDeadline`、 `WithTimeout`、 `WithValue` 这些创建函数，实际上是创建了一个个的链表结点而已。我们知道，对链表的操作，通常都是 `O(n)` 复杂度的，效率不高。并且总是出现在函数的第一个参数。

那么，context 包到底解决了什么问题呢？答案是：`cancelation`。仅管它并不完美，但它确实很简洁地解决了问题。

[详细参考](https://www.cnblogs.com/qcrao-2018/archive/2019/06/12/11007503.html)

