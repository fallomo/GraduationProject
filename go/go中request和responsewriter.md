- 为什么handler函数 的参数总是 func xxx(w http.ResponseWriter,r **http.Request)

  一个是指针一个是值？

​	最大原因是：

​	http.ResponseWriter是一个接口

​	http.Request  是一个结构体，结构体传指针的原因应该是结构体的内存太大，传指针节		省内存。避免参数传递产生中间变量。

​	传入实体参数的时候是在 使用协程调用serve里。



