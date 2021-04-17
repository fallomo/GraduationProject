[接口的总结，超详细](https://www.cnblogs.com/qcrao-2018/p/10766091.html)

[这个重点介绍interface的底层原理](https://www.cnblogs.com/weiweng/p/13589441.html)

注意：类型T实现了接口的所有方法后，当方法的接收者是值类型的时候， 调用者是值类型或者指针类型都可以调用该方法；但是 方法的接收者是指针类型的时候，只能由指针形式的调用者来调用该方法。

也就是说，实现了接收者为值类型的方法，就相当于也实现了接收者为指针类型的方法。

T能够调用*T的方法，是语法糖。



使用interface实现多态，实现了接口的类型，构造函数封装接口方法，参数是接口类型，函数内调用接口方法，即实现了多态。

解析：实现了接口的类型，传入封装接口的方法，即会调用这个类型的方法。

```go
type person interface{
  Sayhello()
  Growup()
}

type student struct{
  name string
  age int
}

type lawyer struct{
  name string
  age int
}

func (s strudent)Sayhello(){
  fmt.Println("Hello,%s",s.name)
}

func (l lawyer)Sayhello(){
   fmt.Println("Hello,%s",l.name)
}

func (s strudent)Growup(){
	s.age+=1
}

func (l lawyer)Growup(){
  l.age+=1
}
//封装了接口person的Sayhell方法，根据传入的具体类型不同，得到的结果也不同,由此实现多态
func Personsayhello(p person){
  p.Sayhello()
}
//封装了接口person的Growup方法
func PersonGrowup(p person){
  p.Growup()
}

func main(){
  
}
```



