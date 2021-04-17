1. 客户端请求，服务器响应流程

   ```go
   Clinet -> Requests ->  [Multiplexer(router) -> handler  -> Response -> Clinet
   ```

   Multiplexer是一个路由处理器，作用是 根据请求的url找到相应的处理函数handler。

2. handler函数

    具有`func(w http.ResponseWriter, r *http.Requests)`签名的函数

3. handler处理器

   本质是一个函数，使用handlerFunc将handler函数进行包装，具有serveHTTP的方法

4. handler对象（接口）

   定义了serveHTTP方法的签名

   ```go
   type Handler interface {
       ServeHTTP(ResponseWriter, *Request)
   }
   //任何实现了Handler这个接口里的方法，都可以被称做handler对象
   ```

   

