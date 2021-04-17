```go
 http.HandleFunc("/hello", HelloServer)	//服务注册
 http.ListenAndServe(":12345", nil)			//开启监听并且开始服务
```



1、先对自定义的服务进行注册

每个服务函数的定义都形如：(函数名可以不一样)

func examplefunc (w http.ResponseWriter, r *http.Request){

​	//自定义响应函数主体

}

```go
http.HandleFunc("/example",examplefunc)
//使用这个函数进行注册，参数1是指url的mapping,指定客户端请求的访问路径，与参数2的响应函数绑定

//其内部：
func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	DefaultServeMux.HandleFunc(pattern, handler)
}
//使用默认的ServeMux来调用注册函数HandleFunc
//HandleFunc其内部：
func (mux *ServeMux) HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	if handler == nil {
		panic("http: nil handler")
	}
	mux.Handle(pattern, HandlerFunc(handler))
}
//重点在Handle(pattern, HandlerFunc(handler))
参数2是一个适配器，将传入的examplefunc()函数与ServeHTTP()函数绑定，当调用服务时，就调用ServeHTTP()，然后转到对应的examplefunc()
Handle()函数将 "/example",examplefunc这两个作为键值对保存起来，通过/example可以找到对应的处理函数
//Handle这个函数就相当于完成了路由注册。
//参数2 HandlerFunc()作用是将 传入的examplefunc()函数与 统一的接口函数 ServeHTTP()绑起来，到时调用统一接口就能调用到指定函数。
```



2、开启监听

（1）最主要的函数func ListenAndServe (addr string, handler Handler) error{}

​	定义如下：

```go
func ListenAndServe(addr string, handler Handler) error {
	server := &Server{Addr: addr, Handler: handler}
	return server.ListenAndServe()
}
//传入监听端口和默认处理函数Handler，以此构造出一个服务器对象server
//然后调用server的ListenAndServe()函数
//展开 server.ListenAndServe()
func (srv *Server) ListenAndServe() error {
	if srv.shuttingDown() {   //如果服务处于关闭状态则立即返回错误
		return ErrServerClosed
	}
	addr := srv.Addr
	if addr == "" {
		addr = ":http"
	}
	ln, err := net.Listen("tcp", addr)  //获取一个监听这个端口的监听器
	if err != nil {
		return err
	}
	return srv.Serve(ln)  //进行监听，连接，响应请求
}
//ListenAndServe() 创建了对应端口的监听器，并使用server的serve函数去使用这个监听器去监听，连接，接收和响应请求

//展开srv.Serve(ln)
//摘取重要的一段
...
for {
  			rw, err := l.Accept()   //等待并接受一个请求，然后返回一个连接对象
        ...
        tempDelay = 0
  			c := srv.newConn(rw)		//返回一个新的连接来处理 Accept()创建的连接
        c.setState(c.rwc, StateNew) // before Serve can return
        go c.serve(connCtx)		//连接c 开启新线程，使用serve,负责这次连接的后续工作
    }
...

//展开c.serve(connCtx)
//最重要的就一句，这句负责对请求的url进行 正确的路由，调用相应的响应函数
func (c *conn) serve(ctx context.Context) {
...
serverHandler{c.server}.ServeHTTP(w, w.req)
...
}

//展开serverHandler{c.server}.ServeHTTP(w, w.req)
//这里传入c.server作为 sh.srv，这里的server就是一开始 ListenAndServe()函数中创建的server
type serverHandler struct {
	srv *Server
}

func (sh serverHandler) ServeHTTP(rw ResponseWriter, req *Request) {
	handler := sh.srv.Handler	 
  //sh.srv是最开始的server，则Handler就是一开始传入的nil
	if handler == nil {
		handler = DefaultServeMux		//如果传入的Handler是nil,则使用默认的Handler
    //系统允许我们自定义自己的Handler（ServeMux处理器,管理路由和负责路由转发等）,不过会很麻烦
	}
	if req.RequestURI == "*" && req.Method == "OPTIONS" {
		handler = globalOptionsHandler{}
	}
	handler.ServeHTTP(rw, req)		//这是默认的ServeMux，因为它也实现了ServeHTTP接口，所以可以赋值给handler,让handler调用。可以说ServeMux是handler类型
}

//展开ServeMux实现的ServeHTTP()
func (mux *ServeMux) ServeHTTP(w ResponseWriter, r *Request) {
	if r.RequestURI == "*" {
		if r.ProtoAtLeast(1, 1) {
			w.Header().Set("Connection", "close")
		}
		w.WriteHeader(StatusBadRequest)
		return
	}
	h, _ := mux.Handler(r)	//根据请求的url,在注册表中找到对应的响应函数，并返回
	h.ServeHTTP(w, r)		//h是Handler类型，因为注册服务的时候，使用了HandleFunc这个函数类型进行转换，因为自定义的服务函数参数形式和HandleFunc的参数形式一样，所以可以强转，如下：
  func sayhello(w http.ResponseWriter, r *http.Request)
  type HandlerFunc func(ResponseWriter, *Request)
  //又由于HandlerFunc函数类型实现了ServeHTTP接口，所以它可以被Handler类型接收
  //就相当于，自定义的服务函数，被HandlerFunc转成Handler类型然后存在路由表里。
  //现在根据r的url找到这个自定义函数，返回的是一个Handler,调用h.ServeHTTP时，就相当于调用了 自定义的服务函数，因为：
  func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
	f(w, r)
}
  //f就是传入的自定义函数，它在转成HandlerFunc，进入了ServeHTTP。
  
}
```



#### 一些变量类型

1、ServeMux---是一个路由结构，存储着 url以及对应的处理函数，同时它自身也实现了 Handler接口的	ServeHTTP方法，但是ServeMux实现的这个方法是用来寻找 已经注册的handler函数（服务）。

2、DefaultServeMux就是一个ServeMux的实体，如果用户不自己定义（传入参数为nil），就会使用默认的。

如果想要自己定义ServeMux，则可以像下面这样：

```go
mux := http.NewServeMux()   
mux.HandleFunc("/hello", HelloServer)   
http.ListenAndServe(":12345", mux)
//这里参数2的类型时Handler，为什么mux可以传进去，是因为ServeMux这个类型也实现了ServeHTTP()接口。
```

3、正常的Handler的ServeHTTP方法是用来实现请求的响应函数。 一般利用 一个函数类型HandlerFunc（适配器）来实现接口，然后接收自定义的响应函数，然后 通过Handler就可以找到自定义的响应函数了。

如下：

```go
h, _ := mux.Handler(r)	//根据请求的url,在注册表中找到对应的响应函数，并返回
h.ServeHTTP(w, r)	
//HandlerFunc就相当于上面的h,同时也是Handler类型
func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
	f(w, r)
}
//f就是自定义的服务函数，是以HandlerFunc(handler)方式赋给函数类型HandlerFunc的

```

##### 感悟：函数类型的用处，它本身可以接受同形式的函数，它又可以作为类型去实现一个接口，就相当于 将一个类型相同的普通函数 与 一个接口类型联系起来，函数类型作为中间的桥梁。

```
同类型函数1--->(接收)同类型的函数类型-2---->(实现)接口3
这样看，原来1与3并没有关系，1也没有实现3的接口，但是通过将1赋值给2，1就相当于3这个类型了。
```

4、ServeMux存的是一个map[string]entry , entry里边又有一个map[string]handler

而这个handler就是我们自定义的服务函数，string就是对应的url。

ServeMux类型有一个Handle函数，传入url，以及经过HandlerFunc转换的自定义服务函数就可以进行注册。



[参考链接](https://blog.csdn.net/xz_studying/article/details/88582580)

