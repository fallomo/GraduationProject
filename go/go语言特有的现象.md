1、函数是一等公民。和其他变量一样，也是一种类型

可以创建一个特有的函数变量

```go
func fire(s string) {
	fmt.Println("i am fire", s)
}

var testfun func ( a string , b int ) {
  fmt.Println("i am",a,b)
}
test1 :=testfun   //作为值传递
test1("sdfsd", 3 )    //使用函数

//或者以下面这种形式
var ffs func(s string)
	ffs = fire //ffs和fire的类型一样，fire的内容赋给ffs
	ffs("chan")
	//ffs还可以继续接受同样类型的函数
//比如：
func water(s string) {
	fmt.Println("i am water", s)
}
ffs("wang")
```

-  将 特定参数形式的函数看作是一种函数类型。

  比如：func (a string) 和 func (a string , b int) 可以看成是 类似 int , string等类型

- 声明变量

  var examplefunc  func (a string)  这样就声明了一个 func (a string) 类型的变量

  但是 不允许在声明变量的时候同时初始化。

  比如：var examplefunc  func (a string) { fmt.Println(s) }

  这是不对的

- 函数变量可以赋值和传递，赋值时需要同类型的函数变量才能成功。

- 函数变量可以直接使用

  但是 需要变量被赋值后才能使用，就 跟 普通变量还没赋值就输出一样，会出错。

  如下：

  var examplefunc (s string) 或者 var examplefunc (string) 

  func fire (s string ) { fat.Println("i am",s,"fire") }

  examplefunc=fire 	//同样的函数形式才能赋值成功

  examplefunc("chan")		//	可直接使用

  

  也可以

   fhdn := func (s string){ fmt.Println(s)  }

  fhdn("sdfdsf")

- 将函数作为变量有什么过人的优点呢？

  可以作为参数传入别的函数，然后实现回调函数的功能。

  一般情况是：传入一个函数变量和函数变量所需的参数，然后在这个函数内，调用函数变量，并使用传入的参数作为函数变量的参数。

  ```go
  Ssff :=func (s tring){fmt.Println(s)}
  
  func tes (s string , f func (s tring)) { f (s) }
  ```

  这也相当于做了封装吧。更重要的 好处是 这样做使函数调用的灵活性很强。

  因为 tes函数可以传入不同的内容，相同类型的函数，实现一个函数 能够完成多个功能的特点。

2、使用函数类型来实现接口

```go
使用 type将函数定义为一个类型
然后使用这个类型去实现接口函数

接口内的实现 一般是 使用接口函数传进来的参数，放进 函数类型里调用
这样做实现了伪函数替代的功能。

比如：
存在接口：type ServeMux interface {
  ServeHTTP(w,s)
}

定义一个函数类型去实现这个接口，调用自己
type funchand func(w,s)

func (f funchand)ServeHTTP(w,s){
  f(w,s)  //此处调用了自己
}

应用：
func hhhh(w,s){
  fmt.Println("我是具体实现",w,s)
}
funchand(hhhh)	//将具体实现函数赋给funchand
这样下来，当ServeHTTP接口被调用时，就调相当于调用了这个具体实现
由ServeHTTP()这个函数调用时传入具体的 w和s ,funchand传入hhhh中。

http的服务注册过程就是这样实现的，够灵活。

//总是喜欢将一个函数定义作为参数传入另一个函数，然后在另一个函数里调用
```

[示例](https://blog.csdn.net/az44yao/article/details/103483422)

案例：

使用函数类型做一个适配器

往这个适配器传入 形式一样的函数，即可通过适配器实现的接口调用这个传入的函数

```go
type Mux interface{
  ServeHTTP(s,w)
}

type FuncHandler func (s ,w)

func (f FuncHandler)ServeHTTP(s,w){
  f(s,w)
}//实现接口函数

func handle(s,w){
  fmt.Println("我是具体的handle实现",s,w)
}
//使用时，直接传入。
var M Mux
M=FuncHandler(handle)	//⚠️这里给函数类型赋予函数实体的方式，与给函数变量赋值不一样
//当调用接口函数时
M.ServeHTTP(ssss,wwww)
//相当于将参数 ssss,wwww传入函数handle中，调用。
```

[具体例子（这是HTTP注册服务的实现）](https://www.jianshu.com/p/be3d9cdc680b)

