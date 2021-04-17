响应函数handler形如：

func sayhello(w http.ResponseWriter, r *http.Request){}

响应函数通过ResponseWriter这个接口将要返回的数据配置好并由它进行响应。



```go
type ResponseWriter interface{
  Header() Header
  Write([]byte) (int,error)
  WriteHeader(statusCose int)
}
```

1、通过Hearder方法可以获得一个由首部组成的映射，修改这个映射就可以修改首部，也可以自定义首部，修改后的首部将被包含在HTTP里随着响应一同发给客户端.

2、Write方法，将接受的字节数组写入响应主体中，如果在写入之前，没有为首部设置相应的内容类型，则默认 字节数组的前512个字节为响应的内容类型

3、WriteHeader接收一个状态码，作为HTTP返回响应的状态码。使用这个方法后，可以使用Write，但是不能对响应的首部再做写入操作，如果用户在使用Write方法前没有使用过WriteHeader，则默认返回的状态码为200

因此，使用顺序应该是Header-->WriteHeader-->Write

