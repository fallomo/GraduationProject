1、使用http.NewRequest 生成http.client -> 再生成 http.request -> 之后提交请求：client.Do(request) -> 处理返回结果，每一步的过程都可以设置一些具体的参数.

```go
func main() {
    //生成client 参数为默认
	client := &http.Client{}
	
	//生成要访问的url
	url := "http://www.baidu.com"
	    
	//提交请求
	reqest, err := http.NewRequest("GET", url, nil)
	
	if err != nil {
		panic(err)
	}
	
	//处理返回结果
	resp, _ := client.Do(reqest)
  
}
```

在使用完返回结果resp后，记得使用resp.Body.Close()来关闭响应体。因为，开启一个请求后，会开启两个线程循环等待 写入请求和读取响应 ，两个线程会在select的channle阻塞。需要手动通过channel来关闭两个线程。 否则会导致内存泄漏，创建的两个协程无法结束。

2、生成client，之后用client.get/post.. client结构自己也有一些发送api的方法，比如client.get,client.post,client.postform..等等。



3、生成一个默认的client，之后调用http.Newrequest方法。再进行详细配置