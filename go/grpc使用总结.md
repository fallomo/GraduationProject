####  1、介绍

grpc，远程过程调用框架的一种，其通过本地函数调用，封装跨网络，跨平台，跨语言的服务访问，简化服务访问，使远程调用就如同本地调用。函数的入参是请求，返回值是响应。

#### 2、安装

- 最好先解决go get 被墙问题，（使用梯子进行代理，有时候直接复制终端代理命令运行就可以）
- `go get -u  google.org/grpc`
- 安装插件，使用`go install github.com/golang/protobuf/proto`以及`go install github.com/golang/protobuf/protoc-gen-go`，测试是否安装成功，使用`which protoc`
- 插件实在安装不上，就找源码下载到相应目录

#### 3、编写protobuf文件

```protobuf
syntax="proto3";
package pb;

service Exampleservice {
	rpc Examplemethod1(ExampleRequest)returns (ExampleResponse){}
	rpc Examplemethod2(ExampleRequest)returns (ExampleResponse){}
}
//service,rpc,returns都是关键字
message ExampleRequest{
	string Params1=1;
	string Params2=2;
}

message ExampleResponse{
	string Result=1;
	string Err=2;
}

//在字段前会有限定词，
//required 发送方和接收方都必须要处理该字段
//optional 可选字段，protobuf给此字段另加了一个bool，来标识是否已选择设置
//repeted 可重复字段，被标识的字段可以重复出现，实际是给了count计数重复了多少个
```

- 定义的消息结构体，存放的是传输的数据，比如传输参数，传输结果，消息内字段等于的数字代表字段名的编码权重，1-16之间只用1字节，17-2027使用2字节，依次往上，动态节省编码空间。
- 编码的顺序是 字段名，字段类型，字段值
- 会使用字段默认值，当字段被设置为默认值或者没有设置，则protobuf在编码的时候会直接略过这个字段并且使用默认值，因此在**使用的时候无法区分传来的默认值是真的设置还是没有设置**。需要开发者进行**必须设置的限制**
- 使用枚举也可以大量节省空间，枚举中选择一个，并且枚举使用了数字代替预设定的值。
- protobuf只是可以对http请求体的内容进行编码，因此还是需要http2.0的头部压缩，可复用等优点。
- 使用protobuf表示二维数组，使用repeted字段，重复表示即可

```protobuf
message TwoDimention{
	message InnerType{
		repeted string arr=1;
	}
	repeted InnerType arr2=1;
}
```

#### 4、编译文件

`protoc xxx.proto --go_out=plugin=grpc:.`

不同语言有不同的编译方式，.proto文件在服务端和客户端都要编译出一分，因为两个端都要用到。

#### 5、服务端使用grpc

- grpc结合go kit使用时，service层不需要更改，只需要更改transport层

- endpoint层主要是进行生成 endpoint函数（handler函数），即接受request返回response。该层还会自定义符合服务的request 和response两个结构体存放 来自 transport层编解码得到的数据。

  

- 更改 transport层，transport主要是设置了 编解码函数，得到endpoint层的request，以及编码来自endpoint层的response。 http路由 在此处设置，根据请求路径 路由到不同的 endpoint

  grpc更改：定义grpcserver结构体，里边定义了各种服务的grpc handler函数。定义一个函数，传入具体的handler，decode.encode函数，生成grpc server实体。给 grpc定义几个具体的函数，用于接受来自客户端的参数，调用grpcserver里的handler，并返回结果。